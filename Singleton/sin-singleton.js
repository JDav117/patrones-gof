// ============================================================
//  SINGLETON — SIN el patrón ❌
//
//  Situación: varios servicios de la cafetería (pedidos, pagos)
//  necesitan la configuración: idioma, impuesto, moneda...
//  Sin el patrón, cada uno crea la suya con "new".
//
//  Ejecutar:  node Singleton/sin-singleton.js
// ============================================================

class ConfigApp {
  constructor() {
    // Simula una carga costosa (leer un archivo, la base de datos...)
    console.log("     ⏳ Cargando configuración...");
    this.idioma = "es";
    this.impuesto = 0.19; // IVA del 19 %
    this.moneda = "USD";
    this.entorno = "desarrollo";
  }
}

console.log("\n=== SINGLETON · SIN el patrón ===\n");

// ------------------------------------------------------------
// PASO 1: cada servicio crea su propia configuración con "new"
// "new" SIEMPRE crea un objeto nuevo
// ------------------------------------------------------------
console.log("1) El servicio de pedidos y el de pagos hacen   new ConfigApp()");
const configPedidos = new ConfigApp();
const configPagos = new ConfigApp();
console.log("   → La configuración se cargó 2 veces.");

// ------------------------------------------------------------
// PASO 2: ¿es la misma configuración?
// "===" pregunta: ¿las dos variables son EL MISMO objeto?
// ------------------------------------------------------------
console.log("\n2) ¿Comparten la misma configuración?");
console.log("     configPedidos === configPagos →", configPedidos === configPagos);

// ------------------------------------------------------------
// PASO 3: pagos cambia el impuesto en SU copia
// ------------------------------------------------------------
configPagos.impuesto = 0.05;

console.log("\n3) El servicio de pagos cambia el impuesto a 5 %:");
console.log("     Impuesto que ve pedidos: " + configPedidos.impuesto * 100 + " %");
console.log("     Impuesto que ve pagos:   " + configPagos.impuesto * 100 + " %");

console.log("\n😱 ¿Qué pasó?");
console.log("   · Hay DOS configuraciones distintas en la misma app.");
console.log("   · Pedidos cobra con 19 % y pagos con 5 %: el mismo pedido tendría dos totales.");
console.log("   · Además, la carga costosa se repitió por cada servicio.");
console.log("\n👉 Solución: una sola instancia compartida (con-singleton.js).\n");
