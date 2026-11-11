import type { Metadata } from "next";
import Link from "next/link";
import { RootDocument } from "@/components/layout/RootDocument";
import { NotFoundContent } from "@/components/pages/NotFoundContent";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { languages, ui } from "@/content/site";

/*
 * 404 global y bilingüe (FR-006, research R12) para direcciones que no calzan con ninguna ruta,
 * en cualquier idioma. Con un layout raíz por idioma no hay layout común: este archivo arma su
 * propio documento (RootDocument trae estilos, tipografía y script de tema, así respeta el
 * tema elegido). Español primero; el bloque en inglés solo si el inglés está publicado
 * (FR-031), marcado con lang="en".
 */
export const metadata: Metadata = {
  title: languages.en.published
    ? `${ui.es.notFound.metaTitle} · ${ui.en.notFound.metaTitle} · StoreFlow`
    : `${ui.es.notFound.metaTitle} · StoreFlow`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <RootDocument lang="es-CL">
      <header className="header-glass border-b border-line">
        <Container className="flex h-16 items-center">
          <Link href="/" aria-label={ui.es.a11y.home} className="rounded-md">
            <Logo size="header" />
          </Link>
        </Container>
      </header>
      <main id={ui.es.contentId} className="py-section">
        <Container className="flex flex-col gap-16">
          <NotFoundContent locale="es" />
          {languages.en.published && (
            <div className="border-t border-line pt-16">
              <NotFoundContent locale="en" headingLevel={2} withLang />
            </div>
          )}
        </Container>
      </main>
    </RootDocument>
  );
}
