/**
 * Capturas REALES de la app en /public/screens/ (Principio I, FR-017), con su texto
 * alternativo por idioma. Las usan Inicio, Funcionalidades y las guías.
 *
 * El alt describe solo lo que se ve. La app no muestra quién hizo cada movimiento: nada
 * asociado a historial.png puede decir "quién movió qué". La tarjeta "próximos a vencer" de
 * inicio.png tiene datos de prueba: no se menciona en el alt.
 * Las capturas muestran la app en español; en inglés se avisa (research R19).
 */
import type { Localized, Screenshot } from "./types";

export type CapturaKey = "inicio" | "bodega" | "escanear" | "movimiento" | "alertaStock" | "historial";

// Todas las capturas reales miden 1080×2340 (proporción 9:19,5)
const size = { width: 1080, height: 2340 };

export const capturas: Localized<Record<CapturaKey, Screenshot>> = {
  es: {
    inicio: {
      src: "/screens/inicio.png",
      alt: "Pantalla de inicio de StoreFlow de la Bodega Principal, con productos bajo stock mínimo, productos, bodegas, historial y usuarios",
      ...size,
    },
    bodega: {
      src: "/screens/bodega.png",
      alt: "Lista de bodegas de una empresa en StoreFlow, con su ciudad y la bodega activa marcada",
      ...size,
    },
    escanear: {
      src: "/screens/escanear.png",
      alt: "Escáner de StoreFlow leyendo con la cámara del celular el código de barras de una caja de producto",
      ...size,
    },
    movimiento: {
      src: "/screens/movimiento.png",
      alt: "Diálogo de StoreFlow para registrar la salida de 12 unidades de un producto, con 151 disponibles y razón «Despacho a local»",
      ...size,
    },
    alertaStock: {
      src: "/screens/alerta-stock.png",
      alt: "Alertas de StoreFlow con productos bajo stock mínimo, su stock actual y su mínimo",
      ...size,
    },
    historial: {
      src: "/screens/historial.png",
      alt: "Historial de movimientos de StoreFlow con entradas, SKU, cantidad, motivo y fecha",
      ...size,
    },
  },
  en: {
    inicio: {
      src: "/screens/inicio.png",
      alt: "StoreFlow home screen for the main warehouse, showing products below minimum stock, products, warehouses, history and users (app in Spanish)",
      ...size,
    },
    bodega: {
      src: "/screens/bodega.png",
      alt: "List of a company's warehouses in StoreFlow, with their city and the active warehouse marked (app in Spanish)",
      ...size,
    },
    escanear: {
      src: "/screens/escanear.png",
      alt: "StoreFlow scanner reading the barcode on a product box with the phone camera",
      ...size,
    },
    movimiento: {
      src: "/screens/movimiento.png",
      alt: "StoreFlow dialog to record a stock out of 12 units of a product, with 151 available and the reason “Despacho a local” (app in Spanish)",
      ...size,
    },
    alertaStock: {
      src: "/screens/alerta-stock.png",
      alt: "StoreFlow alerts listing products below minimum stock, with their current stock and minimum (app in Spanish)",
      ...size,
    },
    historial: {
      src: "/screens/historial.png",
      alt: "StoreFlow movement history with stock ins, SKU, quantity, reason and date (app in Spanish)",
      ...size,
    },
  },
};
