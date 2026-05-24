import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — SWAG Car Rental" }] }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(100),
});

function AuthPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  if (isAdmin) {
    navigate({ to: "/admin" });
    return null;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5005"}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: parsed.data.email,
            password: parsed.data.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Store token and email
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmail", parsed.data.email);

      // Dispatch custom event to notify auth context
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Welcome back!");
      navigate({ to: "/admin" });
    } catch (err) {
      console.error(err);
      toast.error("Connection error. Make sure backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="relative text-center px-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary grid place-items-center mx-auto mb-6 shadow-[var(--shadow-neon)]">
            <Zap className="h-8 w-8 text-background" strokeWidth={3} />
          </div>
          <h2 className="font-display text-4xl font-black mb-3">
            <span className="text-gradient-brand">SWAG</span> Admin
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Manage cars, blogs, bookings, and the entire SWAG experience from one dashboard.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="text-xs label-display text-muted-foreground hover:text-primary">← Back to site</Link>
          <h1 className="font-display text-3xl font-black mt-4 mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">Sign in to your admin account</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field name="email" label="Email" type="email" required />
            <Field name="password" label="Password" type="password" required />
            <button type="submit" disabled={loading} className="btn-neon w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </button>
          </form>

          {/* <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-xs text-muted-foreground">
              <strong>Demo Credentials:</strong><br />
              Email: admin@swagwheels.com<br />
              Password: admin123456
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs label-display text-foreground/70 mb-1.5 block">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={255}
        className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
