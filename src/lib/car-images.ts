// Maps DB-stored asset paths/filenames to bundled imports.
// Falls back to the raw URL (Supabase storage public URL) if no match.
import hero from "@/assets/hero-car.jpg";
import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import car5 from "@/assets/car-5.jpg";
import car6 from "@/assets/car-6.jpg";

const MAP: Record<string, string> = {
  "hero-car.jpg": hero,
  "car-1.jpg": car1,
  "car-2.jpg": car2,
  "car-3.jpg": car3,
  "car-4.jpg": car4,
  "car-5.jpg": car5,
  "car-6.jpg": car6,
};

export function resolveCarImage(path?: string | null): string {
  if (!path) return hero;
  // base64 data URLs are valid — use directly
  if (path.startsWith('data:')) return path;
  if (path.includes('localhost')) return hero;
  const filename = path.replace(/^.*\//, "");
  return MAP[filename] ?? path;
}

export function resolveBlogImage(path?: string | null): string {
  if (!path) return hero;
  if (path.startsWith('data:')) return path;
  if (path.includes('localhost')) return hero;
  return path;
}

export const FALLBACK_HERO = hero;
