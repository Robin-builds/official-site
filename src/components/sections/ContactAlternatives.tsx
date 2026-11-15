import Image from "next/image";
import type { ContactContent } from "@/content/contacto";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";

/**
 * Alternativas al formulario de Contacto (spec 006, US2): botón directo a WhatsApp y QR.
 * Ambos son enlaces/imágenes normales: funcionan sin JavaScript (FR-013).
 * Visualmente subordinados al envío del formulario (Principio II): botón secundario y QR
 * a 200 px, más liviano que el botón primario.
 */
export function ContactAlternatives({
  content,
  locale,
}: {
  content: ContactContent["alternatives"];
  locale: Locale;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-fg">{content.title}</h2>
      <p className="mt-2 text-fg-2">{content.body}</p>
      <div className="mt-5">
        <Button href={content.direct.href} locale={locale} variant="secondary" size="md">
          {content.direct.label}
        </Button>
      </div>

      {/* QR solo desde 768 px: en el celular se escanearía con el mismo celular (aclaración 2026-11-15) */}
      <div className="mt-8 hidden flex-col items-start gap-3 md:flex">
        {/* Fondo siempre blanco (token qr-bg) con margen silencioso: las cámaras no leen QR invertidos */}
        <div className="rounded-card border border-line bg-qr-bg p-3">
          {/* SVG: next/image lo sirve sin optimizar de forma automática */}
          <Image src={content.qr.src} alt={content.qr.alt} width={200} height={200} />
        </div>
        {/* Fuera de la tarjeta, sobre el fondo de la página: AA en ambos temas */}
        <p className="text-sm text-fg-2">{content.qr.caption}</p>
      </div>
    </div>
  );
}
