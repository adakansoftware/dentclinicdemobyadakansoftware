import { getOptionalEnv } from "@/lib/env";
import { safeQuery } from "@/lib/safe-query";
import type { PublicReviewsData, ReviewData } from "@/types";

interface LocalizedText {
  text?: string;
}

interface AuthorAttribution {
  displayName?: string;
  uri?: string;
  photoUri?: string;
}

interface GooglePlaceReview {
  name?: string;
  text?: LocalizedText;
  originalText?: LocalizedText;
  rating?: number;
  authorAttribution?: AuthorAttribution;
  publishTime?: string;
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
}

interface GooglePlaceDetails {
  displayName?: { text?: string };
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  reviews?: GooglePlaceReview[];
}

const GOOGLE_FIELD_MASK = "displayName,googleMapsUri,rating,userRatingCount,reviews";

function getReviewKey(review: GooglePlaceReview) {
  return review.name ?? `${review.authorAttribution?.displayName ?? "author"}-${review.publishTime ?? "time"}`;
}

async function fetchPlaceDetails(languageCode: "tr" | "en"): Promise<GooglePlaceDetails | null> {
  const env = getOptionalEnv();
  const apiKey = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return null;
  }

  const url = new URL(`https://places.googleapis.com/v1/places/${placeId}`);
  url.searchParams.set("languageCode", languageCode);

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": GOOGLE_FIELD_MASK,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Google Places request failed: ${response.status}`);
  }

  return (await response.json()) as GooglePlaceDetails;
}

function mergeReviews(trReviews: GooglePlaceReview[] = [], enReviews: GooglePlaceReview[] = [], limit: number): ReviewData[] {
  const enById = new Map(enReviews.map((review) => [getReviewKey(review), review]));

  return trReviews.slice(0, limit).map((review) => {
    const enReview = enById.get(getReviewKey(review));
    const createdAt = review.publishTime ?? enReview?.publishTime ?? new Date().toISOString();

    return {
      id: getReviewKey(review),
      patientName: review.authorAttribution?.displayName ?? enReview?.authorAttribution?.displayName ?? "Google User",
      ratingStars: Math.max(1, Math.min(5, Math.round(review.rating ?? enReview?.rating ?? 5))),
      contentTr: review.text?.text ?? review.originalText?.text ?? enReview?.text?.text ?? "",
      contentEn: enReview?.text?.text ?? enReview?.originalText?.text ?? review.text?.text ?? review.originalText?.text ?? "",
      isApproved: true,
      isVisible: true,
      createdAt,
      authorUrl: review.authorAttribution?.uri ?? enReview?.authorAttribution?.uri,
      authorPhotoUrl: review.authorAttribution?.photoUri ?? enReview?.authorAttribution?.photoUri,
      sourceUrl: review.googleMapsUri ?? enReview?.googleMapsUri,
      sourceLabel: "Google",
      relativeDateTr: review.relativePublishTimeDescription,
      relativeDateEn: enReview?.relativePublishTimeDescription,
    };
  });
}

export async function getPublicReviews(limit = 6): Promise<PublicReviewsData> {
  const googleReviews = await safeQuery(
    "google reviews",
    async () => {
      const [trPlace, enPlace] = await Promise.all([fetchPlaceDetails("tr"), fetchPlaceDetails("en")]);

      if (!trPlace?.reviews?.length) {
        return null;
      }

      return {
        reviews: mergeReviews(trPlace.reviews, enPlace?.reviews, limit),
        source: "google" as const,
        placeName: trPlace.displayName?.text ?? enPlace?.displayName?.text,
        placeUrl: trPlace.googleMapsUri ?? enPlace?.googleMapsUri,
        averageRating: trPlace.rating ?? enPlace?.rating,
        totalReviews: trPlace.userRatingCount ?? enPlace?.userRatingCount,
      };
    },
    null,
    { timeoutMs: 5000 }
  );

  if (googleReviews) {
    return googleReviews;
  }

  return {
    reviews: [],
    source: "internal",
  };
}
