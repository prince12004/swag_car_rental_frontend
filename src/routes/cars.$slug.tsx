import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Star, Fuel, Gauge, Users, Zap, Calendar, ArrowLeft, Share2, Cog, Phone } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { CarCard } from "@/components/cars/CarCard";
import { BookingForm } from "@/components/forms/BookingForm";
import { resolveCarImage } from "@/lib/car-images";
import { money } from "@/lib/format";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";

export const Route = createFileRoute("/cars/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — SWAG Car Rental` },
      { name: "description", content: "Premium car rental at SWAG. Book now with full insurance and concierge delivery." },
    ],
  }),
  component: CarDetailsPage,
});

function normalizeCar(c: any) {
  if (!c) return null;
  return {
    ...c,
    id: c._id || c.id,
    slug: c._id || c.slug || c.id,
    title: c.name || c.title,
    category: c.type || c.category,
    cover_image: c.image || c.cover_image,
    available: c.availability ?? c.available,
    fuel: c.fuelType || c.fuel,
    price_per_day: c.pricePerDay ?? c.price_per_day,
  };
}

function CarDetailsPage() {
  const { slug } = Route.useParams();

  const { data: car, isLoading } = useQuery({
    queryKey: ["car", slug],
    queryFn: async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/cars`);
        if (!res.ok) return null;
        const data = await res.json();
        const cars = Array.isArray(data) ? data : (data.cars || []);
        const found = cars.find((c: any) => c._id === slug || c.slug === slug || c.id === slug);
        return normalizeCar(found || null);
      } catch (err) {
        console.error(err);
        return null;
      }
    },
  });

  const { data: related } = useQuery({
    queryKey: ["related", car?.category],
    enabled: !!car,
    queryFn: async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/cars`);
        if (!res.ok) return [];
        const data = await res.json();
        const cars = Array.isArray(data) ? data : (data.cars || []);
        return cars
          .filter((c: any) => (c.type || c.category) === car!.category && (c._id || c.id) !== car!.id)
          .slice(0, 3)
          .map(normalizeCar);
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  });

  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="aspect-[16/9] rounded-3xl glass animate-pulse" />
        </div>
      </PublicLayout>
    );
  }
  if (!car) throw notFound();

  const gallery = (car.gallery && car.gallery.length > 0 ? car.gallery : [car.cover_image]).filter(Boolean) as string[];
  const mainImg = resolveCarImage(gallery[activeImg]);

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: car.title, url: window.location.href }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <PublicLayout>
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/cars" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to fleet
          </Link>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
            {/* Gallery */}
            <div>
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden glass">
                <img src={mainImg} alt={car.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs label-display font-bold">
                    {car.category}
                  </span>
                  <span className={`px-3 py-1.5 rounded-md text-xs label-display font-bold ${car.available ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground"}`}>
                    {car.available ? "Available" : "Booked"}
                  </span>
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {gallery.map((g: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? "border-primary shadow-[0_0_16px_oklch(0.88_0.32_142/0.4)]" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      <img src={resolveCarImage(g)} alt={`${car.title} ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {/* Specs */}
              <div className="mt-8">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="text-xs label-display text-muted-foreground">
                      {car.brand}{car.year ? ` · ${car.year}` : ""}
                    </div>
                    <h1 className="font-display text-4xl lg:text-5xl font-black leading-tight">{car.title}</h1>
                  </div>
                  {car.rating && (
                    <div className="flex items-center gap-1 glass px-3 py-1.5 rounded-lg">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="font-bold">{car.rating}</span>
                    </div>
                  )}
                </div>

                {(car.description || car.short_description) && (
                  <p className="text-muted-foreground mt-4 leading-relaxed">{car.description ?? car.short_description}</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                  {car.seats && <SpecCard Icon={Users} value={`${car.seats}`} label="Seats" />}
                  {car.transmission && <SpecCard Icon={Cog} value={car.transmission} label="Transmission" />}
                  {car.fuel && <SpecCard Icon={Fuel} value={car.fuel} label="Fuel" />}
                  {car.year && <SpecCard Icon={Calendar} value={`${car.year}`} label="Year" />}
                  {car.top_speed_kmh && <SpecCard Icon={Gauge} value={`${car.top_speed_kmh} km/h`} label="Top Speed" />}
                  {car.horsepower && <SpecCard Icon={Zap} value={`${car.horsepower} hp`} label="Horsepower" />}
                  {car.zero_to_hundred && <SpecCard Icon={Gauge} value={`${car.zero_to_hundred}s`} label="0-100 km/h" />}
                  {car.doors && <SpecCard Icon={Users} value={`${car.doors}`} label="Doors" />}
                </div>

                {car.features && car.features.length > 0 && (
                  <div className="mt-10">
                    <h2 className="font-display text-xl font-bold mb-4">Features</h2>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {car.features.map((f: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.88_0.32_142)]" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-10">
                  <button onClick={share} className="btn-ghost-neon">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                  <a href="tel:++919289084361" className="btn-ghost-neon">
                    <Phone className="h-4 w-4" /> Call: +91 9289084361
                  </a>
                </div>
              </div>
            </div>

            {/* Booking sidebar */}
            <aside className="lg:sticky lg:top-28 self-start">
              <div className="glass-strong rounded-2xl p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs label-display text-muted-foreground">From</span>
                  <span>
                    <span className="font-display text-3xl font-black text-gradient-brand">{money(car.price_per_day)}</span>
                    <span className="text-muted-foreground text-sm"> /day</span>
                  </span>
                </div>
                <div className="h-px bg-border my-4" />
                <h3 className="font-display text-lg font-bold mb-4">Reserve this car</h3>
                <BookingForm carId={car.id} carTitle={car.title} />
              </div>
            </aside>
          </div>

          {related && related.length > 0 && (
            <div className="mt-24">
              <h2 className="font-display text-3xl font-black mb-8">You might also like</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((c: any) => c && <CarCard key={c.id} car={c} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

function SpecCard({ Icon, value, label }: { Icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <Icon className="h-5 w-5 text-primary mb-2" />
      <div className="font-display font-bold text-lg capitalize truncate">{value}</div>
      <div className="text-[10px] label-display text-muted-foreground">{label}</div>
    </div>
  );
}
