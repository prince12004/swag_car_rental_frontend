import { useState } from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "+919289084361";

const INPUT_CLS =
  "w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition";

export function BookingForm({
  carTitle,
  carId,
  onClose,
}: {
  carTitle?: string;
  carId?: string;
  onClose?: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    location: "",
    startDate: "",
    endDate: "",
    address: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fmt = (d: string) => {
      if (!d) return "—";
      return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    };

    const msg = [
      `🚗 *SWAG WHEELS — New Booking Request* 🚗`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📋 *Customer Details*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `👤 *Name:* ${form.name}`,
      `📱 *Mobile:* ${form.mobile}`,
      `🏠 *Address:* ${form.address}`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🚙 *Car Selected*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      carTitle ? `${carTitle}` : `Not specified`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📍 *Trip Details*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📌 *Pickup Location:* ${form.location}`,
      `🗓️ *Start Date:* ${fmt(form.startDate)}`,
      `🗓️ *End Date:* ${fmt(form.endDate)}`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━`,
      `_Thank you for choosing SWAG Wheels!_`,
      `_Our team will confirm your booking shortly._`,
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {carTitle && (
        <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 text-sm">
          Booking: <span className="font-bold text-primary">{carTitle}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name">
          <input
            type="text"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Your full name"
            className={INPUT_CLS}
          />
        </Field>
        <Field label="Mobile Number">
          <input
            type="tel"
            required
            value={form.mobile}
            onChange={set("mobile")}
            placeholder="+91 XXXXX XXXXX"
            className={INPUT_CLS}
          />
        </Field>
      </div>

      <Field label="Pickup Location">
        <select
          required
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          className={INPUT_CLS}
        >
          <option value="">Select pickup location</option>
          <option value="Delhi"> Delhi</option>
          <option value="Noida">Noida</option>
          <option value="Gurgaon">Gurgaon</option>
        </select>
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Start Date">
          <input
            type="date"
            required
            value={form.startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={set("startDate")}
            className={INPUT_CLS}
          />
        </Field>
        <Field label="End Date">
          <input
            type="date"
            required
            value={form.endDate}
            min={form.startDate || new Date().toISOString().split("T")[0]}
            onChange={set("endDate")}
            className={INPUT_CLS}
          />
        </Field>
      </div>

      <Field label="Full Address">
        <textarea
          required
          rows={2}
          value={form.address}
          onChange={set("address")}
          placeholder="Your complete delivery address"
          className={INPUT_CLS + " resize-none"}
        />
      </Field>

      <button type="submit" className="btn-neon w-full gap-2">
        <MessageCircle className="h-4 w-4" />
        Send Booking via WhatsApp
      </button>

      <p className="text-center text-xs text-muted-foreground">
        WhatsApp will open with your booking details pre-filled.
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs label-display text-foreground/70 mb-1.5 block">{label} <span className="text-primary">*</span></span>
      {children}
    </label>
  );
}
