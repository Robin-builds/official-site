/**
 * PARA TU NEGOCIO (`/para-tu-negocio`, `/en/for-your-business`; FR-009).
 *
 * Cada rubro: resumen (heredado de los casos de uso de la landing, corregido por R8: "con su
 * fecha", nunca "con quién"), problemas típicos (los de la landing según el rubro) y
 * soluciones que SOLO nombran funcionalidades de funcionalidades.ts (Principio I).
 */
import { ui } from "./site";
import type { Business, Cta, Localized } from "./types";

const es = {
  intro: {
    title: "StoreFlow para tu negocio",
    subtitle: "Si mueves mercadería física, StoreFlow te sirve. Mira cómo ayuda en cada rubro.",
  },
  indexLabel: "Rubros",
  problemsTitle: "Lo que pasa",
  solutionsTitle: "Cómo te ayuda StoreFlow",
  businesses: [
    {
      key: "minimarket",
      id: "minimarket",
      icon: "store",
      title: "Minimarket",
      summary: "Muchos productos y reposición diaria. Controla vencimientos por lote y ve qué está por acabarse.",
      problems: [
        "Lo que llegó primero queda al fondo y se vence antes de venderse.",
        "Te enteras del quiebre recién cuando el cliente pide.",
        "Planillas desactualizadas, un cuaderno y el clásico «creo que quedan».",
      ],
      solutions: [
        "Registras lotes y fechas de vencimiento, y sacas primero lo que vence primero.",
        "Una alerta te avisa cuando un producto queda bajo su stock mínimo.",
        "El stock se calcula con cada entrada y salida, y lo ves al día en tu celular.",
      ],
    },
    {
      key: "hardware",
      id: "ferreteria",
      icon: "tool",
      title: "Ferretería",
      summary:
        "Cientos de códigos parecidos. Escanea en vez de buscar en la lista y ten claro qué hay en bodega y qué en el local.",
      problems: [
        "Cientos de productos con nombres y códigos parecidos.",
        "No sabes si algo está en el local o en la bodega.",
        "Falta mercadería y nadie sabe explicar cuándo salió.",
      ],
      solutions: [
        "Escaneas el código de barras con la cámara del celular.",
        "Una bodega para el local y otra para la reserva, cada una con su stock.",
        "Buscas por nombre y la lista se filtra mientras escribes.",
        "Configuras características propias, como medida, material o voltaje.",
      ],
    },
    {
      key: "distributor",
      id: "distribuidora",
      icon: "truck",
      title: "Distribuidora",
      summary: "Mercadería que entra y sale todo el día. Cada despacho queda registrado con su fecha.",
      problems: [
        "Mercadería que entra y sale todo el día.",
        "Despachos que se anotan a mano o quedan «para después».",
        "Falta mercadería y no hay cómo saber cuándo salió.",
      ],
      solutions: [
        "Cada ENTRADA y SALIDA queda en el historial con su fecha, y no se edita ni se borra.",
        "Registras aunque no haya señal: se respalda solo cuando vuelve la conexión.",
        "Revisas el stock desde la oficina en el panel web de solo lectura.",
        "El Administrador exporta los reportes a Excel.",
      ],
    },
    {
      key: "warehouse",
      id: "bodega",
      icon: "warehouse",
      title: "Bodega",
      summary:
        "Varias personas moviendo stock en distintos turnos. Cada movimiento queda con su fecha, aunque no haya señal.",
      problems: [
        "Todo depende de una persona: si el encargado no está, nadie sabe qué hay ni dónde.",
        "La señal no llega al fondo de la bodega y el registro queda «para después».",
        "El conteo físico no cuadra con lo anotado.",
      ],
      solutions: [
        "Usuarios con rol Operador para registrar y Administrador para gestionar.",
        "Funciona sin internet.",
        "Un AJUSTE corrige las diferencias sin borrar el historial.",
        "Una alerta te avisa si un producto pasa 7 días sin movimientos.",
      ],
    },
  ] as Business[],
  finalCta: {
    title: "Empieza hoy en tu negocio",
    subtitle: "Descarga StoreFlow en tu celular Android y crea tu primera bodega hoy mismo.",
    cta: ui.es.ctaPrincipal as Cta,
    note: "Gratis para empezar · Disponible en Google Play",
  },
};

export type NegociosContent = typeof es;

export const negocios: Localized<NegociosContent> = {
  es,
  en: {
    intro: {
      title: "StoreFlow for your business",
      subtitle: "If you move physical goods, StoreFlow works for you. See how it helps in each type of business.",
    },
    indexLabel: "Types of business",
    problemsTitle: "What happens",
    solutionsTitle: "How StoreFlow helps",
    businesses: [
      {
        key: "minimarket",
        id: "minimarket",
        icon: "store",
        title: "Convenience store",
        summary: "Lots of products and daily restocking. Track expiry by batch and see what's running low.",
        problems: [
          "What arrived first ends up at the back and expires before it's sold.",
          "You only find out you're out of stock when a customer asks.",
          "Outdated spreadsheets, a notebook and the classic “I think there's some left”.",
        ],
        solutions: [
          "You record batches and expiry dates, and sell first what expires first.",
          "An alert tells you when a product drops below its minimum stock.",
          "Stock is calculated from every stock in and out, and you see it up to date on your phone.",
        ],
      },
      {
        key: "hardware",
        id: "hardware-store",
        icon: "tool",
        title: "Hardware store",
        summary:
          "Hundreds of similar codes. Scan instead of searching the list and know what's in the warehouse and what's in the shop.",
        problems: [
          "Hundreds of products with similar names and codes.",
          "You don't know whether something is in the shop or in the warehouse.",
          "Stock goes missing and nobody can tell when it left.",
        ],
        solutions: [
          "You scan the barcode with your phone camera.",
          "One warehouse for the shop and another for the back room, each with its own stock.",
          "You search by name and the list filters as you type.",
          "You set up your own attributes, such as size, material or voltage.",
        ],
      },
      {
        key: "distributor",
        id: "distributor",
        icon: "truck",
        title: "Distributor",
        summary: "Goods coming in and going out all day. Every dispatch is recorded with its date.",
        problems: [
          "Goods coming in and going out all day.",
          "Dispatches written down by hand or left “for later”.",
          "Stock goes missing and there's no way to know when it left.",
        ],
        solutions: [
          "Every stock in and stock out stays in the history with its date, and can't be edited or deleted.",
          "You record even with no signal: it's backed up automatically when the connection comes back.",
          "You check stock from the office in the read-only web panel.",
          "The Administrator exports reports to Excel.",
        ],
      },
      {
        key: "warehouse",
        id: "warehouse",
        icon: "warehouse",
        title: "Warehouse",
        summary:
          "Several people moving stock across different shifts. Every movement is saved with its date, even with no signal.",
        problems: [
          "Everything depends on one person: if they're away, nobody knows what's there or where.",
          "The signal doesn't reach the back of the warehouse and records are left “for later”.",
          "The physical count doesn't match what was written down.",
        ],
        solutions: [
          "Users with the Operator role to record and the Administrator role to manage.",
          "Works without internet.",
          "An adjustment corrects differences without deleting the history.",
          "An alert tells you if a product goes 7 days without movements.",
        ],
      },
    ],
    finalCta: {
      title: "Start today in your business",
      subtitle: "Download StoreFlow on your Android phone and create your first warehouse today.",
      cta: ui.en.ctaPrincipal,
      note: "Free to start · Available on Google Play",
    },
  },
};
