import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth";
import logoImg from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/cars", label: "Fleet" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin } = useAuth();
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`flex items-center justify-between rounded-xl px-4 sm:px-6 py-3 transition-all ${scrolled ? "glass-strong" : "glass"
            }`}
        >
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src={logoImg}
              alt="SWAG Car Rental"
              className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_18px_oklch(0.88_0.32_142/0.35)]"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-4 py-2 text-sm font-display font-semibold uppercase tracking-wider transition-colors ${active ? "text-primary" : "text-foreground/70 hover:text-foreground"
                    }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a href="https://wa.me/919289084361?text=Hi%20SWAG%20CAR%20RENTAL%2C%20I'd%20like%20to%20book%20a%20car" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-display font-bold tracking-wider">+91 9289084361</span>
            </a>

            <Link to="/cars" className="btn-neon !py-2.5 !px-5 !text-xs">
              Book Ride
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-xl p-4 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-4 py-3 rounded-lg text-foreground/80 hover:text-primary hover:bg-primary/5 font-display uppercase tracking-wider text-sm"
              >
                {item.label}
              </Link>
            ))}

            <Link to="/cars" className="btn-neon w-full mt-2">
              Book Ride
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
