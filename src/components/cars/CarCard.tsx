import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fuel, Gauge, Users, Zap, Star, CalendarDays } from "lucide-react";
import { resolveCarImage } from "@/lib/car-images";
import { money } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookingForm } from "@/components/forms/BookingForm";

type Car = {
  id?: string;
  _id?: string;
  title?: string;
  name?: string;
  slug?: string;
  category?: string;
  type?: string;
  cover_image?: string;
  image?: string;
  available?: boolean;
  availability?: boolean;
  price_per_day?: number;
  pricePerDay?: number;
  rating?: number;
  seats?: number;
  fuel?: string;
  fuelType?: string;
  transmission?: string;
  brand?: string;
  horsepower?: number;
  year?: number;
};

export function CarCard({ car }: { car: Car }) {
  const [bookingOpen, setBookingOpen] = useState(false);

  const carId = car._id || car.id || "";
  const carTitle = car.name || car.title || "";
  const carSlug = car.slug || carId;
  const category = car.type || car.category || "";
  const img = resolveCarImage(car.cover_image || car.image);
  const isAvailable = car.availability ?? car.available ?? true;
  const pricePerDay = car.pricePerDay ?? car.price_per_day ?? 0;
  const fuel = car.fuelType || car.fuel || "";

  return (
    <>
      <div className="car-card group flex flex-col">
        <Link to="/cars/$slug" params={{ slug: carSlug }} className="block flex-1">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={img}
              alt={carTitle}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              {category && (
                <span className="px-2.5 py-1 rounded-md bg-primary/90 text-primary-foreground text-[10px] font-display uppercase tracking-wider font-bold">
                  {category}
                </span>
              )}
              {!isAvailable && (
                <span className="px-2.5 py-1 rounded-md bg-destructive/90 text-destructive-foreground text-[10px] font-display uppercase tracking-wider font-bold">
                  Booked
                </span>
              )}
            </div>
            {car.rating && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md glass text-xs flex items-center gap-1">
                <Star className="h-3 w-3 fill-secondary text-secondary" />
                <span className="font-bold">{car.rating}</span>
              </div>
            )}
          </div>

          <div className="p-5 relative">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                {car.brand && <p className="text-xs text-muted-foreground label-display">{car.brand}</p>}
                <h3 className="font-display font-bold text-lg leading-tight">{carTitle}</h3>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">/day</p>
                <p className="font-display font-black text-xl text-gradient-brand">{money(pricePerDay)}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border/50 text-xs">
              <Spec icon={Users} label={car.seats ? `${car.seats}` : "—"} />
              <Spec icon={Gauge} label={car.transmission === "automatic" ? "Auto" : "Manual"} />
              <Spec icon={Fuel} label={fuel || "—"} />
              <Spec icon={Zap} label={car.horsepower ? `${car.horsepower}hp` : car.year ? `${car.year}` : "—"} />
            </div>
          </div>
        </Link>

        <div className="px-5 pb-5">
          <button
            onClick={(e) => { e.preventDefault(); setBookingOpen(true); }}
            disabled={!isAvailable}
            className="btn-neon w-full text-sm gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CalendarDays className="h-4 w-4" />
            {isAvailable ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-lg bg-surface border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground font-display text-xl">
              Book: {carTitle}
            </DialogTitle>
          </DialogHeader>
          <BookingForm carTitle={carTitle} carId={carId} onClose={() => setBookingOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function Spec({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-muted-foreground">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-[10px] uppercase tracking-wide truncate">{label}</span>
    </div>
  );
}
