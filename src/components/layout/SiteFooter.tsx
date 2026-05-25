import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import logoImg from "@/assets/logo.png";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed!", { description: "You'll hear from us soon." });
    setEmail("");
  };

  return (
    <footer className="relative mt-32 border-t border-border/50">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-4 md:grid-cols-2 gap-10">
        <div>
          <Link to="/" className="inline-flex items-center mb-4">
            <img src={logoImg} alt="SWAG Car Rental" className="h-16 w-auto object-contain drop-shadow-[0_0_22px_oklch(0.88_0.32_142/0.4)]" />
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium supercars, luxury sedans, and electric SUVs delivered to your door.
            Drive the future.
          </p>
          <div className="flex gap-3 mt-5">
            {[
              { Icon: Instagram, href: "https://www.instagram.com/swag.carrental?igsh=dXJ6Znp4ZjV3dGIy" },
              // { Icon: Twitter, href: "https://twitter.com/swagrental" },
              { Icon: Facebook, href: "https://www.facebook.com/people/Aakash-Singh/pfbid0255SujFdo2UCvervrnSd5r6spwxzausevE6dMwmyqUFBQDvByhd8UELQFfPMfXLBRl/?rdid=onHgpZaTF8RkvbYG&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18EoZtdRCH%2F" },
              // { Icon: Youtube, href: "https://youtube.com/@swagrental" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-lg glass grid place-items-center text-foreground/70 hover:text-primary hover:border-primary/50 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="label-display text-primary mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/cars", label: "Our Fleet" },
              { to: "/about", label: "About Us" },
              { to: "/blog", label: "Blog" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="label-display text-primary mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-primary" />
              <a href="https://wa.me/919289084361?text=Hi%20SWAG%20CAR%20RENTAL%2C%20I'd%20like%20to%20book%20a%20car" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">+91 9289084361</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 text-primary" />
              <span>info@swagrental.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-primary" />
              <span>1 Neon Drive, Los Angeles, CA 90012</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="label-display text-primary mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Get drops on new cars, exclusive offers, and weekend deals.
          </p>
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <button type="submit" className="btn-neon !px-4 !py-2 !text-xs">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SWAG Car Rental. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-primary">Terms</Link>
            <Link to="/privacy" className="hover:text-primary">Privacy</Link>
            <Link to="/refund-policy" className="hover:text-primary">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
