import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — SWAG Car Rental" },
      { name: "description", content: "Terms and conditions for renting with SWAG Car Rental." },
    ],
  }),
  component: () => (
    <PublicLayout>
      <LegalPage
        eyebrow="Legal"
        title="Terms & Conditions"
        sections={[
          { h: "1. Acceptance", p: "By renting from SWAG Car Rental you agree to these terms in full. If you do not agree, do not proceed with a booking." },
          { h: "2. Eligibility", p: "Renters must be 21+ (25+ for luxury and supercar categories), hold a valid driver's license, and provide a credit card in their name. International renters must present a passport and international driving permit." },
          { h: "3. Use of Vehicle", p: "Vehicles must be used lawfully and not for racing, off-roading, towing, transporting hazardous materials, or any commercial ride-share unless explicitly authorized." },
          { h: "4. Insurance & Liability", p: "Comprehensive insurance is included. The renter is responsible for any deductible, traffic violations, fines, and tolls incurred during the rental period." },
          { h: "5. Damage & Loss", p: "Renter is responsible for all damage caused by negligence, misuse, or violation of these terms. Pre-existing damage is documented at pickup." },
          { h: "6. Fuel & Mileage", p: "Vehicles are delivered with a full tank and must be returned full. 250km/day is included unless an unlimited package is purchased." },
          { h: "7. Modifications", p: "SWAG may update these terms at any time. The current version is always available on our website." },
        ]}
      />
    </PublicLayout>
  ),
});

export function LegalPage({ eyebrow, title, sections }: { eyebrow: string; title: string; sections: { h: string; p: string }[] }) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="label-display text-primary mb-3">{eyebrow}</div>
          <h1 className="font-display text-4xl lg:text-5xl font-black">{title}</h1>
          <p className="text-xs text-muted-foreground mt-3">Last updated: {new Date().getFullYear()}</p>
        </div>
        <div className="glass rounded-2xl p-8 space-y-6">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-xl font-bold mb-2 text-primary">{s.h}</h2>
              <p className="text-foreground/80 leading-relaxed text-sm">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
