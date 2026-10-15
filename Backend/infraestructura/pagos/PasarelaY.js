// ============================================================
//  INFRAESTRUCTURA · PasarelaY (otro proveedor externo SIMULADO)
//
//  Otra empresa, otro contrato:
//    · recibe el monto como TEXTO ("25.00")
//    · responde "OK" o "DECLINED"
// ============================================================

class PasarelaY {
  makePayment(amount) {
    // Guardamos lo que llegó solo para mostrarlo en el panel
    this.ultimaPeticion = { amount };

    // Regla simulada: aprueba hasta 100
    return Number(amount) <= 100 ? "OK" : "DECLINED";
  }
}

module.exports = PasarelaY;
