import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { CarCard } from "@/components/cars/CarCard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

const searchSchema = z.object({
  category: z.string().optional(),
  transmission: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/cars")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Our Fleet — SWAG Car Rental" },
      { name: "description", content: "Browse premium supercars, SUVs, sedans, and luxury cars. Filter by category, transmission, and budget." },
    ],
  }),
  component: CarsPage,
});

const CATEGORIES = ["all", "luxury", "sports", "suv", "sedan", "budget"] as const;

function CarsPage() {
  const sp = Route.useSearch();
  const [category, setCategory] = useState<string>(sp.category ?? "all");
  const [transmission, setTransmission] = useState<string>(sp.transmission ?? "all");
  const [sort, setSort] = useState<string>("featured");
  const [q, setQ] = useState<string>(sp.q ?? "");

  const { data, isLoading } = useQuery({
    queryKey: ["cars-list"],
    queryFn: async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/cars`);
        if (!res.ok) return [];
        const data = await res.json();
        // Handle both direct array and object with cars property
        const cars = Array.isArray(data) ? data : (data.cars || []);
        return cars.filter((c: any) => c.availability)
          .sort((a: any, b: any) => {
            return Number(b.pricePerDay) - Number(a.pricePerDay);
          });
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  });

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (category !== "all") list = list.filter((c: any) => c.type === category);
    if (transmission !== "all") list = list.filter((c: any) => c.transmission === transmission);
    if (q) {
      const ql = q.toLowerCase();
      list = list.filter((c: any) => c.name.toLowerCase().includes(ql) || c.brand.toLowerCase().includes(ql));
    }
    if (sort === "price-asc") list = [...list].sort((a: any, b: any) => Number(a.pricePerDay) - Number(b.pricePerDay));
    if (sort === "price-desc") list = [...list].sort((a: any, b: any) => Number(b.pricePerDay) - Number(a.pricePerDay));
    if (sort === "rating") list = [...list].sort((a: any, b: any) => Number(b.rating) - Number(a.rating));
    return list;
  }, [data, category, transmission, q, sort]);

  return (
    <PublicLayout>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="label-display text-primary mb-3">Fleet</div>
            <h1 className="font-display text-4xl lg:text-6xl font-black leading-tight">
              Pick your <span className="text-gradient-brand">weapon</span>.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Every car insured, detailed, and delivered to your door.
            </p>
          </div>

          {/* Filters */}
          <div className="glass-strong rounded-2xl p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name or brand"
                  className="w-full bg-input border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              >
                <option value="all">All Transmissions</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs label-display transition-all ${category === c
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-neon)]"
                    : "glass text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[16/14] rounded-2xl glass animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No cars match your filters. Try widening the search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((car: any) => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
