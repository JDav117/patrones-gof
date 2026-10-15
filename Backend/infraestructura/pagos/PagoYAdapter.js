// ============================================================
//  INFRAESTRUCTURA · PagoYAdapter
//
//  Patrón GoF aplicado aquí: ADAPTER
//  Mismo puerto (PagoPort), otra pasarela. El caso de uso
//  PagarPedido no nota la diferencia.
//
//    Nuestra app:  autorizar({ total: 25, moneda: "USD" })
//    PasarelaY:    makePayment("25.00")
// ============================================================

const PagoPort = require("../../aplicacion/puertos/PagoPort");

class PagoYAdapter extends PagoPort {
  constructor(pasarela) {
    super();
    this.pasarela = pasarela;
  }

  autorizar({ total, moneda }) {
    // 1. Traducir la PETICIÓN: número → texto con 2 decimales (25 → "25.00")
    //    (PasarelaY no recibe moneda: solo trabaja en dólares)
    const respuesta = this.pasarela.makePayment(total.toFixed(2));

    this.ultimaRespuesta = respuesta; // solo para mostrarla en el panel

    // 2. Traducir la RESPUESTA: "OK" / "DECLINED" → nuestro formato
    return respuesta === "OK" ? "APROBADO" : "RECHAZADO";
  }
}

module.exports = PagoYAdapter;
