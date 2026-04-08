Clinic-facing premium frontend revision

What changed
- Repositioned the public-facing frontend from a sales-style landing page to a calm, premium clinic website.
- Removed the mobile conversion dock from the public layout.
- Reworked the navbar into a quieter clinical header with direct contact access.
- Rebuilt the homepage hero and key sections around clinic identity, treatments, team and patient reviews.
- Rewrote services and specialist listing/detail pages with calmer editorial structure and fewer aggressive CTA patterns.
- Updated the global visual system to a more refined palette: graphite, sage, bronze and warm ivory.

Main files revised
- src/app/globals.css
- src/app/(public)/layout.tsx
- src/components/public/PublicNavbar.tsx
- src/components/public/PublicFooter.tsx
- src/components/shared/PageHero.tsx
- src/components/public/HomeClient.tsx
- src/components/public/ServicesClient.tsx
- src/components/public/ServiceDetailClient.tsx
- src/components/public/SpecialistsClient.tsx
- src/components/public/SpecialistDetailClient.tsx
- src/components/public/ConversionDock.tsx

Notes
- No Prisma logic or server actions were changed in this pass.
- The intent was to keep the working structure intact while making the public site suitable for a real clinic presentation.
