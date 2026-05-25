import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowRight } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { formatDate } from "@/lib/format";
import { resolveBlogImage, FALLBACK_HERO } from "@/lib/car-images";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — SWAG Car Rental" },
      { name: "description", content: "Reviews, road trip guides, and the latest from the world of premium car rental." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["blogs-list"],
    queryFn: async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/blogs`);
        if (!res.ok) return [];
        const blogs = await res.json();
        // Handle both direct array and object with blogs property
        const blogsList = Array.isArray(blogs) ? blogs : (blogs.blogs || []);
        return blogsList.filter((b: any) => b.published).sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  });

  return (
    <PublicLayout>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="label-display text-primary mb-3">Journal</div>
            <h1 className="font-display text-4xl lg:text-6xl font-black">
              From the <span className="text-gradient-brand">Garage</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Reviews, guides, and stories from the SWAG team and community.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[16/14] rounded-2xl glass animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.map((b: any) => (
                <Link key={b._id} to="/blog/$slug" params={{ slug: b.slug }} className="car-card group block">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={resolveBlogImage(b.image)} alt={b.title} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_HERO; }} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="label-display text-primary">{b.category}</span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(b.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{b.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{b.excerpt}</p>
                    <div className="text-xs label-display text-primary inline-flex items-center gap-1">
                      Read More <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
