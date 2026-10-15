// ============================================================
//  APLICACIÓN · Puerto de salida: PagoPort
//
//  Un PUERTO es un contrato: dice QUÉ necesita la aplicación,
//  sin decir CÓMO se hace. Aquí: "necesito autorizar un pago".
//
//  Los adapters de infraestructura (PagoXAdapter, PagoYAdapter)
//  implementan este contrato, cada uno con su pasarela.
//
//  JavaScript no tiene "interface" como Java o C#. Por eso usamos
//  una clase base: si un adapter olvida implementar autorizar(),
//  se lanza este error.
// ============================================================

class PagoPort {
  /**
   * @param {{ total: number, moneda: string }} solicitud  Ej: { total: 25, moneda: "USD" }
   * @returns {"APROBADO" | "RECHAZADO"}                    Respuesta en NUESTRO formato
   */
  autorizar({ total, moneda }) {
    throw new Error("autorizar() debe implementarlo un adapter");
  }
}

module.exports = PagoPort;
