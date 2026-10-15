// ============================================================
//  INFRAESTRUCTURA · PasarelaX (proveedor externo SIMULADO)
//
//  Imagina que esto es la librería de una empresa de pagos:
//  NO la podemos modificar. Su contrato es distinto al nuestro:
//    · recibe el monto en CENTAVOS (2500 = $25.00)
//    · responde "succeeded" o "failed" (en inglés)
// ============================================================

class PasarelaX {
  charge({ amountCents, currency }) {
    // Guardamos lo que llegó solo para mostrarlo en el panel
    this.ultimaPeticion = { amountCents, currency };

    // Regla simulada: aprueba hasta $100.00 (10000 centavos)
    return amountCents <= 10000 ? "succeeded" : "failed";
  }
}

module.exports = PasarelaX;
