export function getServiceImage(slug: string): string {
  const map: Record<string, string> = {
    implant: "/images/services/implant.jpg",
    ortodonti: "/images/services/ortodonti.jpg",
    "dis-beyazlatma": "/images/services/whitening.jpg",
    "kanal-tedavisi": "/images/services/root-canal.jpg",
    protez: "/images/services/prosthetic.jpg",
    "cocuk-dis-hekimligi": "/images/services/pediatric.jpg",
  };

  return map[slug] ?? "/images/services/implant.jpg";
}
