// ============================================================
//  INFRAESTRUCTURA · ConfigApp
//
//  Patrón GoF aplicado aquí: SINGLETON
//  Garantiza UNA sola instancia de la configuración y un punto
//  de acceso global a ella: ConfigApp.getInstance().
//
//  Dónde se usa (diapositiva 12): en main.js (composición) se
//  pide la instancia y se INYECTA a los casos de uso. El dominio
//  nunca llama a getInstance() directamente.
// ============================================================

class ConfigApp {
  // "static" = pertenece a la CLASE, no a cada objeto.
  // Aquí se guarda la única instancia; empieza vacía (null).
  static instancia = null;

  // Punto de acceso: todos piden la configuración por aquí, nunca con "new"
  static getInstance() {
    if (ConfigApp.instancia === null) {
      // Primera vez: todavía no existe, así que se crea
      ConfigApp.instancia = new ConfigApp();
    }
    // Siempre se devuelve el MISMO objeto
    return ConfigApp.instancia;
  }

  constructor() {
    // Simula una carga costosa (leer un archivo, variables de entorno...)
    console.log("   ⏳ Cargando configuración... (Singleton)");
    this.idioma = "es";
    this.impuesto = 0.19; // IVA del 19 %
    this.moneda = "USD";
    this.entorno = "desarrollo";
  }
}

module.exports = ConfigApp;
