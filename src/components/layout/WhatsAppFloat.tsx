import { MessageCircle } from "lucide-react";
import whatsapp from "../../assets/whatsapp.png";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/++919289084361?text=Hi%20SWAG CAR RENTAL %2C%20I'd%20like%20to%20book%20a%20car"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-[#16a34a] grid place-items-center shadow-[0_0_30px_oklch(0.88_0.32_142/0.6)] hover:scale-110 transition-transform"
    >
      <img src={whatsapp} alt="WhatsApp" className="h-11 w-11" />
      <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
    </a>
  );
}
