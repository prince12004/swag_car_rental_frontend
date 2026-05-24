import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Star, Shield, Zap, Award, Clock, Headset, Search, Calendar, MapPin, Car as CarIcon, Quote } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { CarCard } from "@/components/cars/CarCard";
import heroImg from "@/assets/hero-car.jpg";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SWAG Car Rental — Drive the Future" },
      { name: "description", content: "Premium supercars, luxury sedans, and electric SUVs delivered to your door. Book your dream car in 60 seconds." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <PublicLayout>
      <Hero />
      <FeaturedCars />
      <WhyChooseUs />
      <LuxuryExperience />
      <Testimonials />
      <BlogPreview />
      <FAQSection />
      <CTABanner />
    </PublicLayout>
  );
}

function Hero() {
  return (
    <section className="relative -mt-24 min-h-[100vh] overflow-hidden grid-bg">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Neon supercar in cyberpunk garage" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Neon orbs */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 pt-32 lg:pt-40 pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center min-h-[100vh]">
        <div className="space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/30">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs label-display text-primary">Now Booking 2025 Models</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
            Drive Your<br />
            <span className="text-gradient-brand">SWAG</span>
            <span className="text-foreground">.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Premium supercars, luxury sedans, and electric SUVs — delivered to your door
            with concierge service and full insurance included.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/cars" className="btn-neon">
              Book Your Ride <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/cars" className="btn-ghost-neon">Explore Cars</Link>
          </div>
          <div className="grid grid-cols-3 gap-6 pt-8 max-w-md">
            <Stat value="50+" label="Premium Cars" />
            <Stat value="24/7" label="Support" />
            <Stat value="4.9★" label="Rating" />
          </div>
        </div>

        {/* Search panel on the right */}
        <div className="relative lg:justify-self-end w-full max-w-md animate-fade-in-up" style={{ animationDelay: "120ms" }}>
          <SearchPanel />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground">
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-black text-gradient-brand">{value}</div>
      <div className="text-xs label-display text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function SearchPanel() {
  const [category, setCategory] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (category) params.category = category;
    if (searchQuery) params.q = searchQuery;
    navigate({ to: "/cars", search: Object.keys(params).length ? params : undefined });
  };

  return (
    <div className="relative">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/40 via-accent/30 to-secondary/40 blur-md opacity-70" />
      <form onSubmit={onSubmit} className="relative glass-strong rounded-2xl macccc p-6 space-y-4 border border-white/10">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
            <Search className="h-4 w-4 text-background" strokeWidth={3} />
          </div>
          <div>
            <div className="font-display font-black text-lg leading-tight">Find Your Ride</div>
            <div className="text-[11px] label-display text-muted-foreground">Book in 60 seconds</div>
          </div>
        </div>

        <PanelField icon={MapPin} label="Pickup Location">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="panel-input"
          >
            <option value="">Select location</option>
            <option value="Office Delhi">Office Delhi</option>
            <option value="Noida">Noida</option>
            <option value="Gurgaon">Gurgaon</option>
          </select>
        </PanelField>

        <div className="grid grid-cols-2 gap-3">
          <PanelField icon={Calendar} label="Pickup">
            <input type="date" value={pickupDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setPickupDate(e.target.value)} className="panel-input" />
          </PanelField>
          <PanelField icon={Calendar} label="Return">
            <input type="date" value={returnDate} min={pickupDate || new Date().toISOString().split("T")[0]} onChange={(e) => setReturnDate(e.target.value)} className="panel-input" />
          </PanelField>
        </div>

        <PanelField icon={Search} label="Search Car">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. BMW, Fortuner..."
            className="panel-input"
          />
        </PanelField>

        <PanelField icon={CarIcon} label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="panel-input">
            <option value="">Any category</option>
            <option value="luxury">Luxury</option>
            <option value="sports">Sports</option>
            <option value="suv">SUV</option>
            <option value="sedan">Sedan</option>
            <option value="budget">Budget</option>
          </select>
        </PanelField>

        <button type="submit" className="btn-neon w-full mt-2">
          <Search className="h-4 w-4" /> Search Cars
        </button>

        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] label-display text-muted-foreground">
          <span className="flex items-center gap-1.5 nnmui"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Free Cancellation</span>
          <span className="flex items-center gap-1.5 nnmui"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Full Insurance</span>
        </div>
      </form>
    </div>
  );
}

function PanelField({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-[10px] label-display text-foreground/70 mb-1.5">
        <Icon className="h-3 w-3 text-primary" /> {label}
      </span>
      {children}
    </label>
  );
}

function FeaturedCars() {
  const { data: cars } = useQuery({
    queryKey: ["featured-cars"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5005"}/api/cars`
        );
        if (!res.ok) return [];
        const data = await res.json();
        const cars = Array.isArray(data) ? data : (data.cars || []);
        return cars.filter((c: any) => c.availability !== false).slice(0, 6);
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  });

  return (
    <section className="py-14 relative">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          eyebrow="Featured Fleet"
          title="The cars everyone's renting"
          subtitle="Hand-picked premium vehicles, ready to roll."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {cars?.map((car: any) => <CarCard key={car.id} car={car} />)}
        </div>
        <div className="text-center mt-12">
          <Link to="/cars" className="btn-ghost-neon">
            View Full Fleet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    { Icon: Shield, title: "Full Insurance", desc: "Comprehensive coverage and 24/7 roadside assistance on every rental." },
    { Icon: Zap, title: "60-Second Booking", desc: "From browse to confirmation in under a minute. No paperwork." },
    { Icon: Headset, title: "Concierge Delivery", desc: "We bring the car to you — hotel, home, or airport." },
    { Icon: Award, title: "Premium Fleet Only", desc: "Latest models, professionally detailed, mechanically perfect." },
    { Icon: Clock, title: "Flexible Cancellation", desc: "Free cancellation up to 48 hours before pickup." },
    { Icon: Star, title: "4.9★ Rated", desc: "Trusted by 10,000+ drivers across the city." },
  ];
  return (
    <section className="py-16 relative bg-gradient-to-b from-background via-surface to-background">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Why SWAG" title="The premium rental experience" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {items.map(({ Icon, title, desc }, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:border-primary/40 transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 grid place-items-center mb-4 border border-primary/30">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LuxuryExperience() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative">
        <div>
          <div className="label-display text-primary mb-3">The SWAG Experience</div>
          <h2 className="font-display text-4xl lg:text-5xl font-black leading-tight mb-6">
            Not just a car.<br />
            A <span className="text-gradient-brand">statement</span>.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            From the moment you book to the second you hand back the keys, every touchpoint
            is engineered to feel premium. Carbon-fiber finishes, signature scent, hand-detailed
            interiors, and a delivery experience worthy of the car itself.
          </p>
          <ul className="space-y-3">
            {[
              "Hand-detailed before every rental",
              "Choice of in-car ambient lighting",
              "Curated playlist preloaded",
              "White-glove concierge delivery",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.88_0.32_142)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass">
          <img src={heroImg} alt="Luxury supercar interior" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
            <div className="text-xs label-display text-primary mb-1">Now featured</div>
            <div className="font-display font-bold text-xl">Phantom GT Neon</div>
            <div className="text-sm text-muted-foreground">720hp · 2.9s 0-100</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FALLBACK_REVIEWS = [
  { _id: "r1", customer_name: "Rahul Sharma", role: "Business Traveler", rating: 5, content: "Absolutely fantastic experience! The car was spotless, delivery was on time, and the SWAG team was incredibly professional. Will book again for sure." },
  { _id: "r2", customer_name: "Priya Verma", role: "Weekend Rider", rating: 5, content: "Booked a luxury SUV for a hill trip. Process was super smooth, insurance was included, and the car performed beautifully on mountain roads." },
  { _id: "r3", customer_name: "Arjun Mehta", role: "Car Enthusiast", rating: 5, content: "Finally a car rental that actually cares about quality. The sports car I rented was perfectly maintained. Concierge delivery to my hotel was a 10/10 touch." },
  { _id: "r4", customer_name: "Sneha Kapoor", role: "Family Vacationer", rating: 5, content: "Hired an SUV for a family trip. Spacious, clean, and the kids loved the ambient lighting! Customer support was responsive throughout our journey." },
  { _id: "r5", customer_name: "Vikram Singh", role: "Corporate Client", rating: 5, content: "I use SWAG for all my client meetings. The cars are always pristine and arrive before time. Highly recommended for professionals who value image." },
  { _id: "r6", customer_name: "Anita Joshi", role: "Travel Blogger", rating: 5, content: "SWAG has completely changed how I think about car rentals. Premium cars, zero hassle, and the 60-second booking actually works! Covered 5 cities in one trip." },
];

function Testimonials() {
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials-home"],
    queryFn: async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/testimonials`);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data.slice(0, 12) : [];
      } catch (err) {
        return [];
      }
    },
  });

  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Use real data if available, otherwise show fallback
  const items = (testimonials && testimonials.length > 0) ? testimonials : FALLBACK_REVIEWS;
  const perPage = 3;
  const total = Math.ceil(items.length / perPage);

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = () => setCurrent(c => (c - 1 + total) % total);

  useEffect(() => {
    intervalRef.current = setInterval(next, 4500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next]);

  const pause = () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  const resume = () => { intervalRef.current = setInterval(next, 4500); };

  const slice = items.slice(current * perPage, current * perPage + perPage);

  return (
    <section className="py-16 bg-gradient-to-b from-background via-surface to-background">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Reviews" title="What our drivers say" />

        <div className="relative mt-12" onMouseEnter={pause} onMouseLeave={resume}>
          <div className="grid md:grid-cols-3 gap-6">
            {slice.map((t: any, i: number) => (
              <div key={t._id || i} className="glass rounded-2xl p-6 flex flex-col hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                <Quote className="h-7 w-7 text-primary/40 mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating || 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-4 italic flex-1">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center font-display font-black text-background text-sm shrink-0">
                    {t.customer_name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.customer_name}</div>
                    {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {total > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="h-9 w-9 rounded-full glass border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: total }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-primary" : "w-2 bg-primary/30"}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="h-9 w-9 rounded-full glass border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BlogPreview() {
  const { data } = useQuery({
    queryKey: ["blog-preview"],
    queryFn: async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/blogs?published=true`);
        if (!res.ok) return [];
        const data = await res.json();
        const blogs = Array.isArray(data) ? data : (data.blogs || []);
        return blogs.slice(0, 3);
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  });

  return (
    <section className="py-16 bg-gradient-to-b from-background via-surface to-background">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Journal" title="From the SWAG Garage" />
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {data?.map((b: any) => (
            <div key={b._id || b.id} className="car-card group flex flex-col">
              <Link to="/blog/$slug" params={{ slug: b.slug }} className="block">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={b.image || b.cover_image || heroImg}
                    alt={b.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = heroImg; }}
                  />
                </div>
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs label-display text-primary mb-2">{b.category}</div>
                <h3 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{b.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{b.excerpt}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: b.slug }}
                  className="inline-flex items-center gap-1.5 mt-4 text-xs label-display text-primary hover:underline"
                >
                  Read More <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FALLBACK_FAQS = [
  { _id: "f1", question: "How do I book a car?", answer: "Simply browse our fleet, select your car, fill in pickup/drop details, and confirm. The whole process takes under 60 seconds. You'll receive a confirmation instantly." },
  { _id: "f2", question: "Is insurance included in the rental price?", answer: "Yes! Every rental includes comprehensive insurance coverage and 24/7 roadside assistance. No hidden costs — what you see is what you pay." },
  { _id: "f3", question: "Can you deliver the car to my hotel or home?", answer: "Absolutely. Our concierge delivery service brings the car directly to your preferred location — hotel, home, or airport — at no extra charge within the city." },
  { _id: "f4", question: "What documents do I need?", answer: "You need a valid driving license, Aadhaar or PAN card for identity verification, and a security deposit (refundable). International licenses are also accepted." },
  { _id: "f5", question: "What is your cancellation policy?", answer: "Free cancellation up to 48 hours before pickup. Cancellations within 48 hours may incur a 10% fee. No-shows are charged one day's rental." },
  { _id: "f6", question: "Can I extend my rental period?", answer: "Yes! Contact our support team at least 6 hours before your scheduled return and we'll extend your booking subject to availability, billed at the daily rate." },
  { _id: "f7", question: "Are there any mileage limits?", answer: "We offer unlimited mileage on most plans. Premium packages include unlimited KMs. Any specific limits are clearly shown during the booking process." },
  { _id: "f8", question: "How is the security deposit refunded?", answer: "The security deposit is fully refunded within 24–48 hours of vehicle return, provided the car is returned in the same condition. Direct bank transfer or card reversal." },
];

function FAQSection() {
  const { data } = useQuery({
    queryKey: ["faqs-home"],
    queryFn: async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/faqs`);
        if (!res.ok) return [];
        const faqs = await res.json();
        return faqs.slice(0, 8);
      } catch (err) {
        return [];
      }
    },
  });

  const [open, setOpen] = useState<string | null>(null);
  const [faqPage, setFaqPage] = useState(0);

  // Use real data if available, otherwise fallback
  const faqs = (data && data.length > 0) ? data : FALLBACK_FAQS;
  const perPage = 4;
  const totalPages = Math.ceil(faqs.length / perPage);
  const slice = faqs.slice(faqPage * perPage, faqPage * perPage + perPage);

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        <SectionHeader eyebrow="FAQ" title="Questions? We've got you." />

        <div className="mt-12">
          <div className="grid md:grid-cols-1 gap-4">
            {slice.map((f: any) => {
              const isOpen = open === f._id;
              return (
                <div
                  key={f._id}
                  className={`glass rounded-xl overflow-hidden transition-all duration-200 border ${isOpen ? "border-primary/50 bg-primary/5" : "border-transparent"}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : f._id)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                  >
                    <span className="font-semibold text-sm text-foreground leading-snug">{f.question}</span>
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-primary text-background" : "bg-primary/10 text-primary"}`}>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-primary/10 pt-3">
                      {f.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => { setFaqPage(p => Math.max(0, p - 1)); setOpen(null); }}
                disabled={faqPage === 0}
                className="h-9 w-9 rounded-full glass border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2 items-center">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setFaqPage(i); setOpen(null); }}
                    className={`h-2 rounded-full transition-all ${i === faqPage ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/60"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => { setFaqPage(p => Math.min(totalPages - 1, p + 1)); setOpen(null); }}
                disabled={faqPage === totalPages - 1}
                className="h-9 w-9 rounded-full glass border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 lg:p-16">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="label-display text-primary mb-3">Ready to ride?</div>
              <h2 className="font-display text-3xl lg:text-5xl font-black leading-tight">
                Your <span className="text-gradient-brand">dream car</span><br />
                is one click away.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/cars" className="btn-neon">Browse Fleet</Link>
              <Link to="/contact" className="btn-ghost-neon">Talk to Us</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="label-display text-primary mb-3">{eyebrow}</div>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-4">{subtitle}</p>}
    </div>
  );
}
