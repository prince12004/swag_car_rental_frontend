import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { LegalPage } from "./terms";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SWAG Car Rental" },
      { name: "description", content: "How SWAG Car Rental handles your personal data." },
    ],
  }),
  component: () => (
    <PublicLayout>
      <LegalPage
        eyebrow="Legal"
        title="Privacy Policy"
        sections={[
          { h: "Information We Collect", p: "We collect your name, contact details, driver's license, payment information, and usage data necessary to process bookings and provide our services." },
          { h: "How We Use Your Data", p: "Your data is used to confirm bookings, deliver vehicles, process payments, prevent fraud, comply with legal requirements, and (with consent) send marketing communications." },
          { h: "Data Sharing", p: "We never sell your data. We share information only with service providers (insurance, payment processors, identity verification) bound by strict confidentiality." },
          { h: "Cookies", p: "We use essential cookies to operate the site and analytics cookies (anonymized) to improve the experience. Marketing cookies are only set with your consent." },
          { h: "Your Rights", p: "You can request access, correction, or deletion of your data at any time by emailing privacy@swagrental.com. We respond within 30 days." },
          { h: "Security", p: "Data is encrypted in transit and at rest. We follow industry best practices and undergo regular security audits." },
          { h: "Contact", p: "For privacy questions, email privacy@swagrental.com or write to 1 Neon Drive, Los Angeles, CA 90012." },
        ]}
      />
    </PublicLayout>
  ),
});
