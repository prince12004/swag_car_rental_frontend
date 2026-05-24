import { createFileRoute } from "@tanstack/react-router";
import { Award, Target, Eye, Users, Trophy, Zap } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import heroImg from "@/assets/hero-car.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SWAG Car Rental — Our Story & Mission" },
      { name: "description", content: "SWAG Car Rental is reimagining premium mobility with a curated fleet, white-glove service, and a passion for performance." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="max-w-5xl mx-auto px-4 text-center relative">
          <div className="label-display text-primary mb-3">Our Story</div>
          <h1 className="font-display text-5xl lg:text-7xl font-black leading-tight">
            Built for those who<br />
            <span className="text-gradient-brand">refuse ordinary</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            SWAG Car Rental is reimagining premium mobility. Curated fleet, white-glove service,
            and an obsession with performance — that's our DNA.
          </p>
        </div>
      </section>

      {/* Image band */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden aspect-[16/6] relative">
          <img src={heroImg} alt="SWAG showroom" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          {[
            { Icon: Target, title: "Our Mission", body: "Make premium mobility effortless. Every rental should feel like an upgrade — to your day, your trip, your story." },
            { Icon: Eye, title: "Our Vision", body: "A world where renting a supercar is as easy as ordering a coffee. Faster, smarter, more thrilling than ownership." },
          ].map(({ Icon, title, body }, i) => (
            <div key={i} className="glass rounded-2xl p-8 hover:border-primary/40 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary grid place-items-center mb-5 shadow-[var(--shadow-neon)]">
                <Icon className="h-6 w-6 text-background" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { v: "10K+", l: "Happy Drivers" },
            { v: "50+", l: "Premium Cars" },
            { v: "8", l: "Years Driving" },
            { v: "4.9★", l: "Avg Rating" },
          ].map(({ v, l }, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center">
              <div className="font-display text-4xl lg:text-5xl font-black text-gradient-brand">{v}</div>
              <div className="text-xs label-display text-muted-foreground mt-2">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="py-16 bg-gradient-to-b from-background via-surface to-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="label-display text-primary mb-3">Why SWAG</div>
            <h2 className="font-display text-4xl lg:text-5xl font-black">More than a rental.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: Award, title: "Curated, not cataloged", body: "Every car is hand-picked for performance, presence, and reliability." },
              { Icon: Users, title: "People-first service", body: "Real concierge, real time, real solutions. Always." },
              { Icon: Zap, title: "Tech-powered ease", body: "Book in 60 seconds, manage everything in-app, keys delivered." },
            ].map(({ Icon, title, body }, i) => (
              <div key={i} className="glass rounded-2xl p-7">
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="label-display text-primary mb-3">The Crew</div>
            <h2 className="font-display text-4xl lg:text-5xl font-black">Drivers running the garage.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Alex Rios", role: "Founder & CEO" },
              { name: "Mira Tanaka", role: "Head of Fleet" },
              { name: "Jordan Lee", role: "Concierge Lead" },
              { name: "Sasha Volkov", role: "Engineering" },
            ].map((p, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center hover:border-primary/40 transition-colors">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center font-display font-black text-3xl text-background mb-4 shadow-[var(--shadow-neon)]">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="font-display font-bold">{p.name}</div>
                <div className="text-xs label-display text-muted-foreground mt-1">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Trophy className="h-12 w-12 text-secondary mx-auto mb-4" />
          <h2 className="font-display text-3xl lg:text-4xl font-black mb-4">Trust earned, mile by mile.</h2>
          <p className="text-muted-foreground">
            8 years in business. 10,000+ rentals delivered. Featured in major publications
            and trusted by celebrities, executives, and weekend thrill-seekers alike.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
