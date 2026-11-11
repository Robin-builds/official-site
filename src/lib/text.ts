/**
 * Reemplaza marcadores {nombre} en un texto del contenido: "{n} de {total}" → "2 de 6".
 * Así los textos con datos variables siguen viviendo en src/content/ como strings, y pueden
 * pasar de un Server Component a uno de cliente (las funciones no se pueden pasar).
 */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
