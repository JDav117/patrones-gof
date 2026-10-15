// ============================================================
//  APLICACIÓN · Caso de uso: PagarPedido
//
//  Depende de dos cosas que le INYECTAN desde afuera (main.js):
//    · pagoPort → cualquier adapter que cumpla PagoPort (ADAPTER)
//    · config   → la instancia única de ConfigApp (SINGLETON)
//
//  No sabe qué pasarela hay detrás ni cómo se llama su API:
//  solo conoce el método autorizar() del puerto.
// ============================================================

class PagarPedido {
  constructor(pagoPort, config) {
    this.pago = pagoPort;
    this.config = config;
  }

  /**
   * @param {number} total Monto a cobrar. Ej: 25
   * @returns {"APROBADO" | "RECHAZADO"}
   */
  ejecutar(total) {
    // Regla de la aplicación: no se cobra un total vacío o negativo
    if (!(total > 0)) throw new Error("El total debe ser mayor que 0");

    // La moneda sale de la configuración compartida (Singleton)
    return this.pago.autorizar({ total, moneda: this.config.moneda });
  }
}

module.exports = PagarPedido;
