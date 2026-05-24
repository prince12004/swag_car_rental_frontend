import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, User, Tag, ArrowLeft, Share2, Clock, Eye, Facebook, Twitter, Link2, ChevronRight } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { formatDate } from "@/lib/format";
import heroImg from "@/assets/hero-car.jpg";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — SWAG Blog` },
      { name: "description", content: "Read the latest from SWAG Car Rental." },
    ],
  }),
  component: BlogDetailsPage,
});

function readingTime(text: string) {
  const words = (text || "").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function BlogDetailsPage() {
  const { slug } = Route.useParams();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/blogs/slug/${slug}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to load blog (${res.status})`);
      return await res.json();
    },
    retry: 1,
  });

  const { data: related } = useQuery({
    queryKey: ["blog-related", post?._id],
    enabled: !!post,
    queryFn: async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/blogs?published=true&limit=20`);
        if (!res.ok) return [];
        const data = await res.json();
        const blogs = Array.isArray(data) ? data : (data.blogs || []);
        return blogs.filter((b: any) => b._id !== post!._id).slice(0, 3);
      } catch {
        return [];
      }
    },
  });

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="animate-pulse">
          <div className="h-[55vh] bg-muted w-full" />
          <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
            <div className="h-3 w-32 bg-muted rounded" />
            <div className="h-10 w-4/5 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
            <div className="space-y-3 pt-6">
              {[1,2,3,4].map(i => <div key={i} className="h-4 bg-muted rounded" style={{ width: `${85 + (i % 3) * 5}%` }} />)}
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  /* ── Error / Not found ── */
  if (isError || post === null) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="label-display text-primary mb-3">Oops</div>
          <h1 className="font-display text-4xl font-black mb-3">Article not found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            {isError
              ? "Could not load this article. Please check your internet connection or try again."
              : "This article doesn't exist or may have been removed."}
          </p>
          <Link to="/blog" className="btn-neon">Browse All Articles</Link>
        </div>
      </PublicLayout>
    );
  }

  const coverImg = post.image || post.cover_image || heroImg;
  const mins = readingTime(post.content || "");

  const share = (platform: string) => {
    const url = window.location.href;
    const title = encodeURIComponent(post.title);
    if (platform === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    else if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}`);
    else navigator.clipboard?.writeText(url).then(() => alert("Link copied!"));
  };

  return (
    <PublicLayout>

      {/* ── Hero Image ── */}
      <div className="relative w-full h-[55vh] min-h-[340px] overflow-hidden -mt-24">
        <img src={coverImg} alt={post.title} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).src = heroImg; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />

        {/* Breadcrumb inside hero */}
        <div className="absolute top-28 left-0 right-0 max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-white/60">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/40 truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>

        {/* Category + Title over image */}
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 pb-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold label-display mb-4 capitalize">
            {post.category}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] text-white drop-shadow-lg">
            {post.title}
          </h1>
        </div>
      </div>

      {/* ── Article Body ── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border/60 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-black text-background text-sm">
              {post.author?.[0]?.toUpperCase() || "S"}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{post.author || "SWAG Team"}</p>
              <p className="text-xs text-muted-foreground">Author</p>
            </div>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {formatDate(post.published_at || post.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {mins} min read
          </span>
          {post.views > 0 && (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="h-3.5 w-3.5 text-primary" />
              {post.views.toLocaleString()} views
            </span>
          )}
        </div>

        {/* Excerpt / Lead paragraph */}
        {post.excerpt && (
          <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-medium mb-8 pl-4 border-l-2 border-primary">
            {post.excerpt}
          </p>
        )}

        {/* Main content */}
        <div className="text-foreground/85 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-border">
            <Tag className="h-4 w-4 text-primary shrink-0" />
            {post.tags.map((t: string) => (
              <span key={t} className="px-3 py-1 rounded-full glass text-xs label-display border border-primary/20 text-primary">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-sm font-semibold text-muted-foreground mb-3 label-display">Share this article</p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => share("facebook")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-border hover:border-primary/40 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <Facebook className="h-4 w-4" /> Facebook
            </button>
            <button onClick={() => share("twitter")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-border hover:border-primary/40 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <Twitter className="h-4 w-4" /> Twitter
            </button>
            <button onClick={() => share("copy")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-border hover:border-primary/40 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <Link2 className="h-4 w-4" /> Copy Link
            </button>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to all articles
          </Link>
        </div>
      </div>

      {/* ── Related Posts ── */}
      {related && related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="border-t border-border pt-12 mb-8">
            <div className="label-display text-primary mb-2">Keep Reading</div>
            <h2 className="font-display text-2xl sm:text-3xl font-black">More from the garage</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((b: any) => (
              <Link key={b._id || b.id} to="/blog/$slug" params={{ slug: b.slug }} className="car-card group block">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={b.image || b.cover_image || heroImg}
                    alt={b.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = heroImg; }}
                  />
                </div>
                <div className="p-5">
                  <div className="text-xs label-display text-primary mb-2 capitalize">{b.category}</div>
                  <h3 className="font-display font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors">{b.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{b.excerpt}</p>
                  <div className="inline-flex items-center gap-1 mt-3 text-xs text-primary label-display">
                    Read More <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </PublicLayout>
  );
}
