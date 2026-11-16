/*
 * Verificador de contraste del tema claro (spec 008-tema-claro-contraste).
 *
 * Uso (desde la raíz del repo):  node specs/008-tema-claro-contraste/contrast-check.mjs
 *
 * Qué verifica, leyendo src/app/globals.css (sin dependencias):
 *  1. Que los dos bloques del tema claro, [data-theme="light"] y
 *     :root:not([data-theme]) (tema del sistema sin JavaScript), declaren exactamente las mismas
 *     variables con los mismos valores (FR-011, data-model V2).
 *  2. Los "Pares obligatorios" de contracts/theme-tokens.md con la razón de contraste WCAG 2.x
 *     (luminancia relativa sRGB): textos ≥ 4.5:1, acento de tarjeta ≥ 3:1, borde de tarjeta
 *     ≥ 1.5:1 y separación entre superficies (FR-004, FR-007, SC-001, SC-003).
 *  3. Las "Secciones vecinas reales" del contrato: PASS si contraste ≥ 1.08:1 o diferencia de color
 *     ΔE (CIE76, CIELAB, D65) ≥ 10, porque el contraste WCAG solo mide luminosidad y algunas
 *     vecindades se separan por tono (SC-002, research R7).
 *
 * Termina con código 1 si hay algún FAIL o si los bloques claros difieren.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const cssPath = resolve(here, "../../src/app/globals.css");
const css = readFileSync(cssPath, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** Devuelve el cuerpo del bloque que abre `selector {`, respetando llaves anidadas. */
function blockBody(selector) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No se encontró el bloque ${selector}`);
  let i = css.indexOf("{", start) + 1;
  const from = i;
  for (let depth = 1; depth > 0; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") depth--;
  }
  return css.slice(from, i - 1);
}

/** Mapa nombre → valor (normalizado: espacios colapsados, minúsculas) de las variables. */
function declarations(body) {
  const map = new Map();
  for (const raw of body.split(";")) {
    const m = raw.trim().match(/^(--[\w-]+)\s*:\s*([\s\S]+)$/);
    if (m) map.set(m[1], m[2].replace(/\s+/g, " ").trim().toLowerCase());
  }
  return map;
}

const manual = declarations(blockBody('[data-theme="light"]'));
const system = declarations(blockBody(":root:not([data-theme])"));

let failures = 0;

// 1. Bloques idénticos
const diffs = [];
for (const name of new Set([...manual.keys(), ...system.keys()])) {
  if (manual.get(name) !== system.get(name)) {
    diffs.push(`  ${name}: [data-theme="light"] = ${manual.get(name) ?? "(falta)"} | sistema = ${system.get(name) ?? "(falta)"}`);
  }
}
if (diffs.length === 0) {
  console.log("bloques claros idénticos: OK");
} else {
  failures += diffs.length;
  console.log("bloques claros DIFIEREN:");
  console.log(diffs.join("\n"));
}

// Color
function hex(name) {
  const v = manual.get(name);
  if (!v || !/^#[0-9a-f]{6}$/.test(v)) return null;
  return [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
}
const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function luminance(rgb) {
  const [r, g, b] = rgb.map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
function lab(rgb) {
  const [r, g, b] = rgb.map(linear);
  const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const [fx, fy, fz] = [f(x), f(y), f(z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
function deltaE(a, b) {
  const [l1, a1, b1] = lab(a);
  const [l2, a2, b2] = lab(b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

function report(ok, text) {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${text}`);
}

function checkPair(fg, bg, min) {
  const a = hex(fg);
  const b = hex(bg);
  if (!a || !b) {
    report(false, `${fg} / ${bg}: sin valor hex en el tema claro`);
    return;
  }
  const r = contrast(a, b);
  report(r >= min, `${fg} / ${bg}: ${r.toFixed(2)}:1 (mín ${min})`);
}

// 2. Pares obligatorios
console.log("\nPares obligatorios (contracts/theme-tokens.md):");
const F = ["--bg-top", "--bg-mid", "--bg-bottom", "--surface", "--surface-2"];
for (const fg of ["--text-1", "--text-2", "--text-3", "--primary", "--link", "--accent-text", "--danger", "--ok"]) {
  for (const bg of F) checkPair(fg, bg, 4.5);
}
checkPair("--on-primary", "--primary", 4.5);
checkPair("--on-ok", "--ok", 4.5);
for (const bg of F) checkPair("--card-accent", bg, 3);
for (const bg of ["--bg-top", "--surface", "--surface-2"]) checkPair("--card-border", bg, 1.5);
checkPair("--surface", "--bg-top", 1.15);
checkPair("--surface", "--surface-2", 1.1);
checkPair("--bg-bottom", "--bg-top", 1.08);
checkPair("--surface-2", "--bg-top", 1.1);

// 3. Secciones vecinas reales (SC-002)
console.log("\nSecciones vecinas reales (contraste ≥ 1.08 o ΔE ≥ 10):");
const neighbours = [
  ["Hero → Credibilidad", "--bg-bottom", "--surface-2"],
  ["Credibilidad → Problemas", "--surface-2", "--bg-top"],
  ["Encabezado → sección canvas", "--bg-bottom", "--bg-top"],
  ["Encabezado → sección surface", "--bg-bottom", "--surface"],
  ["Secciones alternas", "--bg-top", "--surface"],
  ["Última sección canvas → pie", "--bg-top", "--bg-bottom"],
];
for (const [label, a, b] of neighbours) {
  const x = hex(a);
  const y = hex(b);
  if (!x || !y) {
    report(false, `${label} (${a} → ${b}): sin valor hex`);
    continue;
  }
  const r = contrast(x, y);
  const d = deltaE(x, y);
  report(r >= 1.08 || d >= 10, `${label} (${a} → ${b}): ${r.toFixed(2)}:1, ΔE ${d.toFixed(1)}`);
}

console.log(failures === 0 ? "\nTodo OK" : `\n${failures} fallo(s)`);
process.exit(failures === 0 ? 0 : 1);
