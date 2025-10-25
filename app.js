// ===============================================================
// 📘 app.js — Lógica principal de "Cartera Inteligente"
// ===============================================================
// Objetivo: permitir registrar ingresos, gastos y ahorro automático (10% de cada ingreso)
// sin manejo de dinero real. Todo se guarda temporalmente en memoria (LocalStorage opcional).
// ===============================================================


// 🧠 VARIABLES GLOBALES
// ---------------------------------------------------------------

// Array donde se almacenan todas las transacciones del usuario
let transacciones = [];

// Variable para guardar la divisa seleccionada
let divisaActual = "EUR";


// 🧮 FUNCIONES PRINCIPALES
// ---------------------------------------------------------------

/**
 * Función para actualizar el resumen financiero (saldo, ingresos, gastos y ahorro)
 * Recorre todas las transacciones y suma según el tipo.
 */
function actualizarResumen() {
    let ingresos = 0;
    let gastos = 0;
    let ahorro = 0;

    transacciones.forEach(t => {
        if (t.tipo === "ingreso") ingresos += t.monto;
        if (t.tipo === "gasto") gastos += t.monto;
        if (t.tipo === "ahorro") ahorro += t.monto;
    });

    // Calcular saldo disponible (restando gastos y ahorro)
    const saldo = ingresos - gastos - ahorro;

    // Mostrar en pantalla los totales actualizados
    document.getElementById("ingresos-total").textContent = `${formatearMoneda(ingresos)}`;
    document.getElementById("gastos-total").textContent = `${formatearMoneda(gastos)}`;
    document.getElementById("ahorro-total").textContent = `${formatearMoneda(ahorro)}`;
    document.getElementById("saldo-total").textContent = `${formatearMoneda(saldo)}`;
}

/**
 * Función para renderizar la tabla de movimientos
 */
function renderizarTabla() {
    const tbody = document.getElementById("tabla-movimientos");
    tbody.innerHTML = "";

    if (transacciones.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-secondary fst-italic">Aún no hay movimientos registrados 🧾</td></tr>`;
        return;
    }

    transacciones.forEach((t, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${t.descripcion}</td>
            <td>${formatearMoneda(t.monto)}</td>
            <td>${formatearTipo(t.tipo)}</td>
            <td>${t.fecha}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarTransaccion(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

/**
 * Función para eliminar una transacción
 */
function eliminarTransaccion(index) {
    transacciones.splice(index, 1);
    actualizarResumen();
    renderizarTabla();
}

/**
 * Función para formatear números a la divisa actual seleccionada
 */
function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: divisaActual,
    }).format(valor);
}

/**
 * Devuelve el tipo con color o ícono según corresponda
 */
function formatearTipo(tipo) {
    if (tipo === "ingreso") return `<span class="text-success fw-semibold">Ingreso</span>`;
    if (tipo === "gasto") return `<span class="text-danger fw-semibold">Gasto</span>`;
    if (tipo === "ahorro") return `<span class="text-warning fw-semibold">Ahorro</span>`;
    return tipo;
}


// 💾 GUARDADO LOCAL (opcional)
// ---------------------------------------------------------------

function guardarLocal() {
    localStorage.setItem("transacciones", JSON.stringify(transacciones));
}

function cargarLocal() {
    const data = localStorage.getItem("transacciones");
    if (data) {
        transacciones = JSON.parse(data);
        actualizarResumen();
        renderizarTabla();
    }
}


// 📅 GENERAR FECHA FORMATEADA
// ---------------------------------------------------------------
function obtenerFechaActual() {
    const hoy = new Date();
    return hoy.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}


// 🧾 MANEJO DEL FORMULARIO
// ---------------------------------------------------------------

document.getElementById("form-transaccion").addEventListener("submit", e => {
    e.preventDefault();

    // Capturar datos del formulario
    const descripcion = document.getElementById("descripcion").value.trim();
    const monto = parseFloat(document.getElementById("monto").value);
    const tipo = document.getElementById("tipo").value;
    divisaActual = document.getElementById("divisa").value;

    // Validaciones básicas
    if (!descripcion || isNaN(monto) || monto <= 0 || !tipo) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    // Crear objeto de transacción
    const nuevaTransaccion = {
        descripcion,
        monto,
        tipo,
        fecha: obtenerFechaActual(),
    };

    // Si el tipo es ingreso ➕ crear automáticamente un ahorro del 10%
    if (tipo === "ingreso") {
        const ahorroAutomatico = parseFloat((monto * 0.10).toFixed(2));

        const transAhorro = {
            descripcion: "Ahorro automático (10%)",
            monto: ahorroAutomatico,
            tipo: "ahorro",
            fecha: obtenerFechaActual(),
        };

        // Añadir ambos movimientos
        transacciones.push(nuevaTransaccion);
        transacciones.push(transAhorro);
    } else {
        // Si es gasto o ahorro manual
        transacciones.push(nuevaTransaccion);
    }

    // Actualizar pantalla
    actualizarResumen();
    renderizarTabla();
    guardarLocal();

    // Limpiar formulario
    e.target.reset();
});


// 💬 FRASES MOTIVACIONALES ALEATORIAS
// ---------------------------------------------------------------
const frases = [
    "“Ahorra antes de gastar, no después.” 💡",
    "“Pequeños ahorros, grandes resultados.” 🌱",
    "“Tu dinero trabaja mejor cuando tú descansas.” 😎",
    "“Invertir en ti es el mejor negocio.” 💼",
    "“Cada euro ahorrado es libertad ganada.” 🚀"
];

function fraseAleatoria() {
    const frase = frases[Math.floor(Math.random() * frases.length)];
    document.getElementById("frase-motivacional").textContent = frase;
}


// 🏁 INICIALIZACIÓN DE LA APP
// ---------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    cargarLocal();          // Cargar datos guardados (si existen)
    actualizarResumen();    // Actualizar totales
    renderizarTabla();      // Renderizar movimientos
    fraseAleatoria();       // Mostrar una frase inspiradora al inicio
});
