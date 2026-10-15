// ============================================================
//  INFRAESTRUCTURA · ConfigAppSinPatron
//
//  Versión SIN Singleton. Solo existe para que el panel pueda
//  comparar: cada "new" crea un objeto distinto.
//  La aplicación real usa ConfigApp.js.
// ============================================================

class ConfigAppSinPatron {
  constructor() {
    console.log("   ⏳ Cargando configuración... (sin patrón)");
    this.idioma = "es";
    this.impuesto = 0.19;
    this.moneda = "USD";
    this.entorno = "desarrollo";
  }
}

module.exports = ConfigAppSinPatron;
