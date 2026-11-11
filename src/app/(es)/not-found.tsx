import { NotFoundContent } from "@/components/pages/NotFoundContent";
import { Container } from "@/components/ui/Container";
import { ui } from "@/content/site";

export const metadata = { title: ui.es.notFound.metaTitle };

/** "No encontrada" para los notFound() explícitos (guía inexistente, Privacidad sin texto). */
export default function NotFound() {
  return (
    <Container className="py-section">
      <NotFoundContent locale="es" />
    </Container>
  );
}
