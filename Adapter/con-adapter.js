// ============================================================
//  ADAPTER — CON el patrón ✅
//
//    PagarPedido  →  PagoPort  →  PagoXAdapter  →  PasarelaX
//    (caso de uso)   (puerto)     (traductor)      (externa)
//
//  Nuestra app siempre habla SU idioma: autorizar({ total, moneda }).
//  Cada adapter traduce ese idioma al de su pasarela.
//
//  En la demo organizada: Backend/aplicacion/puertos/PagoPort.js
//                         Backend/infraestructura/pagos/PagoXAdapter.js
//  Ejecutar:  node Adapter/con-adapter.js
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

// ----- PUERTO: el contrato que necesita NUESTRA app -----
// JavaScript no tiene "interface"; usamos una clase base.
// Todo adapter debe tener autorizar({ total, moneda }) → "APROBADO" | "RECHAZADO"
class PagoPort {
  autorizar({ total, moneda }) {
    throw new Error("autorizar() debe implementarlo un adapter");
  }
}

// ----- ADAPTERS: un traductor por cada pasarela -----

// "extends PagoPort" = este adapter cumple el contrato del puerto
class PagoXAdapter extends PagoPort {
  autorizar({ total, moneda }) {
    // 1. Traducir la petición: nuestro formato → formato de X
    const respuesta = new PasarelaX().charge({
      amountCents: Math.round(total * 100), // dólares → centavos (25 → 2500)
      currency: moneda,                     // "moneda" → "currency"
    });
    // 2. Traducir la respuesta: formato de X → nuestro formato
    return respuesta === "succeeded" ? "APROBADO" : "RECHAZADO";
  }
}

class PagoYAdapter extends PagoPort {
  autorizar({ total, moneda }) {
    // 1. Traducir la petición: número → texto con 2 decimales (25 → "25.00")
    const respuesta = new PasarelaY().makePayment(total.toFixed(2));
    // 2. Traducir la respuesta: "OK" / "DECLINED" → nuestro formato
    return respuesta === "OK" ? "APROBADO" : "RECHAZADO";
  }
}

// ----- Nuestro caso de uso -----

// ✅ No sabe qué pasarela hay detrás: solo usa el puerto
class PagarPedido {
  constructor(pagoPort) {
    this.pago = pagoPort; // se le INYECTA cualquier adapter
  }

  ejecutar(total) {
    return this.pago.autorizar({ total, moneda: "USD" });
  }
}

console.log("\n=== ADAPTER · CON el patrón ===\n");

console.log("1) Cobramos $25 con   new PagarPedido(new PagoXAdapter())");
console.log("   Nuestra app envía: { total: 25, moneda: \"USD\" }");
console.log("   → Resultado:", new PagarPedido(new PagoXAdapter()).ejecutar(25));

console.log("\n2) Cobramos $25 con   new PagarPedido(new PagoYAdapter())");
console.log("   Nuestra app envía: { total: 25, moneda: \"USD\" }");
console.log("   → Resultado:", new PagarPedido(new PagoYAdapter()).ejecutar(25));

console.log("\n3) Cobramos $150 con la pasarela X (supera el límite de $100):");
console.log("   → Resultado:", new PagarPedido(new PagoXAdapter()).ejecutar(150));

console.log("\n✅ ¿Qué ganamos?");
console.log("   · PagarPedido es el mismo en los 3 casos: solo cambió el adapter que recibe.");
console.log("   · Cada pasarela recibió su propio formato, pero nuestra app siempre recibió");
console.log("     \"APROBADO\" o \"RECHAZADO\" (respuesta normalizada).");
console.log("   · ¿Llega la pasarela Z? Se crea PagoZAdapter. PagarPedido NO se toca.\n");
