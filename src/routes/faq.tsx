import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, HelpCircle, ChevronDown } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

interface FAQ {
    _id: string;
    question: string;
    answer: string;
    display_order: number;
}

export const Route = createFileRoute("/faq")({
    head: () => ({ meta: [{ title: "FAQ — SWAG Wheels" }] }),
    component: FAQPage,
});

function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/faqs`);
            if (!response.ok) throw new Error('Failed to fetch FAQs');
            const data = await response.json();
            setFaqs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            setFaqs([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            {/* Header */}
            <section className="relative py-20 overflow-hidden grid-bg">
                <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/15 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent/15 blur-[100px] pointer-events-none" />
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/30 mb-6">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        <span className="text-xs label-display text-primary">Help Centre</span>
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl font-black leading-tight mb-4">
                        Frequently Asked <span className="text-gradient-brand">Questions</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Find answers to common questions about SWAG Wheels car rentals
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : faqs.length === 0 ? (
                        <div className="glass rounded-2xl p-10 text-center">
                            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No FAQs available yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {faqs.map((faq) => {
                                const isOpen = expandedId === faq._id;
                                return (
                                    <div
                                        key={faq._id}
                                        className={`glass rounded-xl overflow-hidden transition-all ${isOpen ? 'border border-primary/40' : 'border border-transparent'}`}
                                    >
                                        <button
                                            onClick={() => setExpandedId(isOpen ? null : faq._id)}
                                            className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                                        >
                                            <span className="font-semibold text-foreground">{faq.question}</span>
                                            <ChevronDown className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isOpen && (
                                            <div className="px-6 pb-5 text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
