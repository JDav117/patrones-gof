// ============================================================
//  SINGLETON — CON el patrón ✅
//
//  Garantiza UNA sola instancia de ConfigApp y un punto de
//  acceso global: ConfigApp.getInstance(). Nadie usa "new".
//
//  En la demo organizada: Backend/infraestructura/configuracion/ConfigApp.js
//  Ejecutar:  node Singleton/con-singleton.js
// ============================================================

class ConfigApp {
  // "static" = pertenece a la CLASE, no a cada objeto.
  // Aquí se guarda la ÚNICA instancia; empieza vacía (null).
  static instancia = null;

  // 🔑 Punto de acceso global: todos piden la configuración por aquí
  static getInstance() {
    if (ConfigApp.instancia === null) {
      // Primera llamada: todavía no existe → se crea
      ConfigApp.instancia = new ConfigApp();
    }
    // Todas las llamadas devuelven el MISMO objeto
    return ConfigApp.instancia;
  }

  constructor() {
    // Simula una carga costosa (leer un archivo, la base de datos...)
    console.log("     ⏳ Cargando configuración...");
    this.idioma = "es";
    this.impuesto = 0.19; // IVA del 19 %
    this.moneda = "USD";
    this.entorno = "desarrollo";
  }
}

console.log("\n=== SINGLETON · CON el patrón ===\n");

// ------------------------------------------------------------
// PASO 1: los servicios piden la configuración con getInstance()
// ------------------------------------------------------------
console.log("1) El servicio de pedidos llama a   ConfigApp.getInstance()");
const configPedidos = ConfigApp.getInstance(); // 1ra vez → la crea
console.log("   → No existía, así que se creó.");

console.log("\n2) El servicio de pagos llama a   ConfigApp.getInstance()");
const configPagos = ConfigApp.getInstance(); // 2da vez → devuelve la misma
console.log("   → Ya existía: se devolvió la misma, sin volver a cargarla.");

// ------------------------------------------------------------
// PASO 3: ¿es la misma configuración?
// "===" pregunta: ¿las dos variables son EL MISMO objeto?
// ------------------------------------------------------------
console.log("\n3) ¿Comparten la misma configuración?");
console.log("     configPedidos === configPagos →", configPedidos === configPagos);

// ------------------------------------------------------------
// PASO 4: pagos cambia el impuesto
// Como es el mismo objeto, el cambio lo ven TODOS
// ------------------------------------------------------------
configPagos.impuesto = 0.05;

console.log("\n4) El servicio de pagos cambia el impuesto a 5 %:");
console.log("     Impuesto que ve pedidos: " + configPedidos.impuesto * 100 + " %");
console.log("     Impuesto que ve pagos:   " + configPagos.impuesto * 100 + " %");

console.log("\n✅ ¿Qué ganamos?");
console.log("   · Toda la app usa UNA sola configuración: no hay valores contradictorios.");
console.log("   · La carga costosa ocurre una sola vez.");
console.log("\n⚠️  Cuidado (riesgo del patrón):");
console.log("   El paso 4 muestra que es estado GLOBAL: si alguien lo cambia, cambia para todos.");
console.log("   Por eso el Singleton conviene para datos que no cambian, como la configuración.\n");
