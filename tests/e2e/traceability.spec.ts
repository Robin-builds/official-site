/**
 * Trazabilidad FR → SC de la spec 010 (contracts/verification.md, último párrafo).
 * No abre el navegador: lee spec.md y los archivos de test. Falla si un requisito no tiene
 * fila en la tabla de trazabilidad, o si un criterio automático no tiene un test que lo nombre.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const ROOT = process.cwd();
const SPEC = path.join(ROOT, "specs/010-refinamiento-conversion/spec.md");
const TESTS_DIR = path.join(ROOT, "tests/e2e");

/** Texto entre un encabezado "### <title>" y el siguiente encabezado de nivel 2 o 3. */
function section(md: string, title: string): string {
  const start = md.indexOf(`### ${title}`);
  if (start < 0) throw new Error(`No se encontró la sección "${title}" en spec.md`);
  const rest = md.slice(start + title.length + 4);
  const end = rest.search(/\n#{2,3} /);
  return end < 0 ? rest : rest.slice(0, end);
}

test("Trazabilidad FR → SC", () => {
  const spec = readFileSync(SPEC, "utf8");

  // FR definidos: líneas "- **FR-0NN**:" de la sección de requisitos
  const defined = [...section(spec, "Functional Requirements").matchAll(/- \*\*(FR-\d{3})\*\*/g)].map((m) => m[1]);
  expect(defined.length, "spec.md no define ningún FR").toBeGreaterThan(0);

  // Filas de la tabla: "| FR-0NN | SC-…, SC-… | tipo |"
  const rows = new Map<string, string[]>();
  for (const m of section(spec, "Trazabilidad requisito → criterio").matchAll(/^\| (FR-\d{3}) \| ([^|]+)\|/gm)) {
    rows.set(m[1], [...m[2].matchAll(/SC-\d{3}/g)].map((s) => s[0]));
  }
  const missingRows = defined.filter((fr) => !rows.has(fr));
  expect(missingRows, `FR sin fila en la tabla de trazabilidad: ${missingRows.join(", ")}`).toEqual([]);

  // SC automáticos: "- **SC-0NN**: … *(auto)*" (la descripción puede ocupar varias líneas)
  const outcomes = section(spec, "Measurable Outcomes");
  const autoSc = [...outcomes.matchAll(/- \*\*(SC-\d{3})\*\*:[\s\S]*?(?=\n- \*\*|$)/g)]
    .filter((m) => m[0].includes("*(auto)*"))
    .map((m) => m[1]);
  expect(autoSc.length, "spec.md no marca ningún SC como (auto)").toBeGreaterThan(0);

  // Títulos de test que empiezan con el id del SC: test("SC-005 …")
  const sources = readdirSync(TESTS_DIR)
    .filter((f) => f.endsWith(".spec.ts"))
    .map((f) => readFileSync(path.join(TESTS_DIR, f), "utf8"))
    .join("\n");
  const withoutTest = autoSc.filter((sc) => !new RegExp(`test\\(\\s*["'\`]${sc}[ "'\`]`).test(sources));
  expect(withoutTest, `SC automáticos sin test: ${withoutTest.join(", ")}`).toEqual([]);
});
