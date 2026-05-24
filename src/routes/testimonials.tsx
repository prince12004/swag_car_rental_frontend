import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Star, Award } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

interface Testimonial {
    _id: string;
    customer_name: string;
    role?: string;
    content: string;
    rating: number;
}

export const Route = createFileRoute("/testimonials")({
    head: () => ({ meta: [{ title: "Reviews — SWAG Wheels" }] }),
    component: TestimonialsPage,
});

function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/testimonials`);
            if (!response.ok) throw new Error('Failed to fetch testimonials');
            const data = await response.json();
            setTestimonials(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            setTestimonials([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            {/* Header */}
            <section className="relative py-20 overflow-hidden grid-bg">
                <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-secondary/15 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-primary/15 blur-[100px] pointer-events-none" />
                <div className="relative max-w-6xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-secondary/30 mb-6">
                        <Award className="h-4 w-4 text-secondary" />
                        <span className="text-xs label-display text-secondary">Customer Stories</span>
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl font-black leading-tight mb-4">
                        What Our <span className="text-gradient-brand">Drivers Say</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Authentic reviews from satisfied SWAG Wheels customers
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="glass rounded-2xl p-10 text-center">
                            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map((t) => (
                                <div
                                    key={t._id}
                                    className="glass rounded-2xl p-6 hover:border-primary/40 transition-all hover:-translate-y-1"
                                >
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < t.rating ? 'fill-secondary text-secondary' : 'text-muted-foreground'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-foreground/90 leading-relaxed mb-5 italic">"{t.content}"</p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center font-display font-black text-background flex-shrink-0">
                                            {t.customer_name?.[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{t.customer_name}</div>
                                            {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
