// ============================================================
//  ADAPTER — SIN el patrón ❌
//
//  Situación: la cafetería cobra con pasarelas de pago externas.
//  Cada pasarela tiene su propio "idioma" (nombres, unidades,
//  respuestas) y su código NO lo podemos modificar.
//
//  Ejecutar:  node Adapter/sin-adapter.js
// ============================================================

// ----- Código de los proveedores (simulado, NO se puede modificar) -----

class PasarelaX {
  // Pide el monto en CENTAVOS (2500 = $25.00) y responde "succeeded" o "failed"
  charge({ amountCents, currency }) {
    console.log("     [PasarelaX recibe]", { amountCents, currency });
    return amountCents <= 10000 ? "succeeded" : "failed"; // aprueba hasta $100
  }
}

class PasarelaY {
  // Pide el monto como TEXTO ("25.00") y responde "OK" o "DECLINED"
  makePayment(amount) {
    console.log("     [PasarelaY recibe]", { amount });
    return Number(amount) <= 100 ? "OK" : "DECLINED"; // aprueba hasta $100
  }
}

// ----- Nuestro caso de uso -----

// ❌ El caso de uso conoce los detalles de CADA pasarela
class PagarPedido {
  constructor(proveedor) {
    this.proveedor = proveedor; // "X" o "Y"
  }

  ejecutar(total) {
    if (this.proveedor === "X") {
      // Conversión metida en el caso de uso: dólares → centavos
      const respuesta = new PasarelaX().charge({ amountCents: Math.round(total * 100), currency: "USD" });
      // Interpretar la respuesta de X
      return respuesta === "succeeded" ? "APROBADO" : "RECHAZADO";
    }

    if (this.proveedor === "Y") {
      // Otra conversión distinta: número → texto con 2 decimales
      const respuesta = new PasarelaY().makePayment(total.toFixed(2));
      // Interpretar la respuesta de Y
      return respuesta === "OK" ? "APROBADO" : "RECHAZADO";
    }

    // ¿Y si mañana llega la pasarela Z? → otro "if" aquí dentro 😩
  }
}

console.log("\n=== ADAPTER · SIN el patrón ===\n");

console.log("1) Cobramos $25 con la pasarela X:");
console.log("   → Resultado:", new PagarPedido("X").ejecutar(25));

console.log("\n2) Cobramos $25 con la pasarela Y:");
console.log("   → Resultado:", new PagarPedido("Y").ejecutar(25));

console.log("\n😱 ¿Funciona? Sí. ¿Cuál es el problema?");
console.log("   · PagarPedido (el núcleo de la app) conoce la API de cada proveedor.");
console.log("   · Las conversiones (centavos, texto, \"succeeded\", \"OK\") ensucian la lógica del negocio.");
console.log("   · Cada pasarela nueva obliga a modificar PagarPedido con otro \"if\".");
console.log("\n👉 Solución: un traductor (adapter) por cada pasarela (con-adapter.js).\n");
