import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { LegalPage } from "./terms";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy — SWAG Car Rental" },
      { name: "description", content: "Cancellation and refund policy for SWAG Car Rental bookings." },
    ],
  }),
  component: () => (
    <PublicLayout>
      <LegalPage
        eyebrow="Legal"
        title="Cancellation & Refund Policy"
        sections={[
          { h: "Free Cancellation Window", p: "Cancel for free up to 48 hours before your scheduled pickup. A full refund is processed within 5–7 business days to the original payment method." },
          { h: "Late Cancellation", p: "Cancellations made within 48 hours of pickup are subject to a 25% cancellation fee. The remaining 75% is refunded to your original payment method." },
          { h: "No-Show", p: "If you do not pick up the vehicle and do not cancel, the full booking amount is non-refundable." },
          { h: "Modifications", p: "Booking dates, vehicle, or location can be modified free of charge up to 24 hours before pickup, subject to availability." },
          { h: "Refund Method", p: "Refunds are issued to the original payment method. Bank processing times vary (typically 5–7 business days)." },
          { h: "Vehicle Issues", p: "If a mechanical issue arises with the rented vehicle, we will provide a replacement at no cost or refund the unused portion of your rental." },
          { h: "Force Majeure", p: "In cases of severe weather, government action, or other events beyond control, we offer date changes or full refunds without penalty." },
          { h: "Contact", p: "For cancellation requests or refund questions, email refunds@swagrental.com or call our concierge line." },
        ]}
      />
    </PublicLayout>
  ),
});
