import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, MapPin, Send, Loader2, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SWAG Car Rental" },
      { name: "description", content: "Get in touch with the SWAG concierge team. Phone or email us anytime." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
  subject: z.string().max(150).optional(),
  message: z.string().min(5).max(1000),
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      toast.error("Please check the form", { description: parsed.error.issues[0]?.message });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: parsed.data.full_name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          subject: parsed.data.subject || null,
          message: parsed.data.message,
        }),
      });
      setLoading(false);
      if (!res.ok) {
        const data = await res.json();
        toast.error("Could not send", { description: data.message || "An error occurred" });
        return;
      }
      toast.success("Message sent!", { description: "We'll be in touch soon." });
      form.reset();
    } catch (err: any) {
      setLoading(false);
      toast.error("Could not send", { description: err.message });
    }
  };

  return (
    <PublicLayout>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="label-display text-primary mb-3">Contact</div>
            <h1 className="font-display text-4xl lg:text-6xl font-black">
              Let's <span className="text-gradient-brand">talk</span>.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Booking question? Custom rental request? Just want to chat about cars? We're here.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8">
            {/* Info */}
            <div className="space-y-4">
              <ContactCard Icon={Phone} title="Call us" value="+91 88278 14985" href="tel:+918827814985" />
              <ContactCard Icon={Mail} title="Email" value="info@swagrental.com" href="mailto:info@swagrental.com" />
              <ContactCard Icon={MapPin} title="Visit" value="1 Neon Drive, Los Angeles, CA 90012" />

              <div className="glass mainsss rounded-2xl p-6">
                <h3 className="label-display text-primary mb-3">Follow</h3>
                <div className="flex gap-3">
                  {[
                    { Icon: Instagram, href: "https://instagram.com/swagrental" },
                    { Icon: Twitter, href: "https://twitter.com/swagrental" },
                    { Icon: Facebook, href: "https://facebook.com/swagrental" },
                    { Icon: Youtube, href: "https://youtube.com/@swagrental" },
                  ].map(({ Icon, href }, i) => (
                    <a key={i} href={href} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-lg glass grid place-items-center text-foreground/70 hover:text-primary hover:border-primary/50 transition-colors">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="glass-strong rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold mb-6">Send us a message</h2>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field name="full_name" label="Full Name" required />
                  <Field name="email" label="Email" type="email" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field name="phone" label="Phone (optional)" type="tel" />
                  <Field name="subject" label="Subject" />
                </div>
                <Field name="message" label="Message" textarea required />
                <button type="submit" disabled={loading} className="btn-neon w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send Message</>}
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="mt-12 glass rounded-3xl overflow-hidden aspect-[16/7]">
            <iframe
              title="SWAG Car Rental location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423283.4546260443!2d-118.69192207421877!3d34.02016130653294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[0.4] opacity-90"
            />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function ContactCard({ Icon, title, value, href }: { Icon: React.ComponentType<{ className?: string }>; title: string; value: string; href?: string }) {
  const content = (
    <div className="glass mainsss rounded-2xl p-6 hover:border-primary/40 transition-colors">
      <Icon className="h-6 w-6 text-primary mb-3" />
      <div className="text-xs label-display text-muted-foreground mb-1">{title}</div>
      <div className="font-display font-bold">{value}</div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{content}</a> : content;
}

function Field({ name, label, type = "text", required, textarea }: { name: string; label: string; type?: string; required?: boolean; textarea?: boolean }) {
  const cls = "w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition";
  return (
    <label className="block">
      <span className="text-xs label-display text-foreground/70 mb-1.5 block">{label}</span>
      {textarea ? <textarea name={name} rows={5} required={required} className={cls} maxLength={1000} /> : <input name={name} type={type} required={required} className={cls} maxLength={255} />}
    </label>
  );
}
