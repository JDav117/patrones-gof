// ============================================================
//  INFRAESTRUCTURA · PagoXAdapter
//
//  Patrón GoF aplicado aquí: ADAPTER
//  Implementa NUESTRO puerto (PagoPort) y por dentro habla el
//  idioma de PasarelaX. Es el "traductor" entre los dos contratos.
//
//    Nuestra app:  autorizar({ total: 25, moneda: "USD" })
//    PasarelaX:    charge({ amountCents: 2500, currency: "USD" })
// ============================================================

const PagoPort = require("../../aplicacion/puertos/PagoPort");

// "extends PagoPort" = este adapter cumple el contrato del puerto
class PagoXAdapter extends PagoPort {
  constructor(pasarela) {
    super(); // obligatorio al heredar: inicializa la parte de PagoPort
    this.pasarela = pasarela; // la pasarela externa que vamos a "envolver"
  }

  autorizar({ total, moneda }) {
    // 1. Traducir la PETICIÓN: nuestro formato → formato de X
    const respuesta = this.pasarela.charge({
      amountCents: Math.round(total * 100), // dólares → centavos (25 → 2500)
      currency: moneda,                     // "moneda" → "currency"
    });

    this.ultimaRespuesta = respuesta; // solo para mostrarla en el panel

    // 2. Traducir la RESPUESTA: formato de X → nuestro formato
    return respuesta === "succeeded" ? "APROBADO" : "RECHAZADO";
  }
}

module.exports = PagoXAdapter;
