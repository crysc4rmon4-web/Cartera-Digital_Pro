document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // VARIABLES GLOBALES
  // ==============================
  let totalIngresos = 0;
  let totalGastos = 0;
  let totalAhorros = 0;

  const descripcionInput = document.getElementById("descripcion");
  const montoInput = document.getElementById("monto");
  const tipoInput = document.getElementById("tipo");
  const divisaInput = document.getElementById("divisa");
  const ahorroCalculado = document.getElementById("ahorro-calculado");
  const historial = document.getElementById("tabla-movimientos");
  const fraseMotivacional = document.getElementById("frase-motivacional");

  const saldoTotalDOM = document.getElementById("saldo-total");
  const ingresosTotalDOM = document.getElementById("ingresos-total");
  const gastosTotalDOM = document.getElementById("gastos-total");
  const ahorroTotalDOM = document.getElementById("ahorro-total");

  // ==============================
  // FRASES MOTIVACIONALES
  // ==============================
  const frases = [
    "Cada euro cuenta, pero la constancia vale más 💪",
    "Ahorra hoy para disfrutar mañana 🌅",
    "Tu futuro financiero empieza con un clic 🏦",
    "Controlar tus gastos es controlar tu libertad 💼",
    "El mejor momento para empezar fue ayer. El segundo mejor, hoy ⏰",
    "Tu cartera digital, tu tranquilidad 💖",
    "No ahorres lo que te queda después de gastar; gasta lo que te quede después de ahorrar 💡",
    "Pequeños pasos crean grandes logros 🚀",
    "Domina tu dinero, no dejes que él te domine 🔥",
    "Cada decisión cuenta. Haz que sume 📈"
  ];

  function mostrarFrase() {
    const indice = Math.floor(Math.random() * frases.length);
    fraseMotivacional.textContent = frases[indice];
  }
  mostrarFrase();

  // ==============================
  // GRÁFICOS CHART.JS MODERNOS
  // ==============================
  const ctxBalance = document.getElementById("graficoBalance").getContext("2d");
  const ctxAhorro = document.getElementById("graficoAhorro").getContext("2d");

  // 🔹 Balance general - barras horizontales con gradiente
  const gradientIngresos = ctxBalance.createLinearGradient(0, 0, 400, 0);
  gradientIngresos.addColorStop(0, "#00ff99");
  gradientIngresos.addColorStop(1, "#198754");

  const gradientGastos = ctxBalance.createLinearGradient(0, 0, 400, 0);
  gradientGastos.addColorStop(0, "#ff5c5c");
  gradientGastos.addColorStop(1, "#dc3545");

  const gradientAhorros = ctxBalance.createLinearGradient(0, 0, 400, 0);
  gradientAhorros.addColorStop(0, "#ffd54f");
  gradientAhorros.addColorStop(1, "#ffc107");

  const graficoBalance = new Chart(ctxBalance, {
    type: "bar",
    data: {
      labels: ["Ingresos", "Gastos", "Ahorros"],
      datasets: [{
        label: "Balance (€)",
        data: [0, 0, 0],
        backgroundColor: [gradientIngresos, gradientGastos, gradientAhorros],
        borderRadius: 6,
        barPercentage: 0.6,
        categoryPercentage: 0.5
      }]
    },
    options: {
      indexAxis: 'y', // barra horizontal
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Balance General",
          font: { size: 18 },
          color: "#00ff99"
        },
        tooltip: { enabled: true, callbacks: { label: (ctx) => `${ctx.dataset.label}: €${ctx.raw}` } }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.1)" }
        },
        y: {
          ticks: { color: "#fff" },
          grid: { display: false }
        }
      }
    }
  });

  // 🔹 Progreso de ahorro - doughnut con efecto moderno
  const graficoAhorro = new Chart(ctxAhorro, {
    type: "doughnut",
    data: {
      labels: ["Ahorro", "Restante"],
      datasets: [{
        label: "Progreso de Ahorro",
        data: [0, 100],
        backgroundColor: ["#0dcaf0", "rgba(13,202,240,0.2)"],
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      cutout: "70%",
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Progreso de Ahorro",
          font: { size: 16 },
          color: "#0dcaf0"
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.label === "Ahorro") return `Ahorro: €${totalAhorros.toFixed(2)}`;
              return "Restante";
            }
          }
        }
      }
    }
  });

  // ==============================
  // FUNCIONES PRINCIPALES
  // ==============================
  montoInput.addEventListener("input", () => {
    const monto = parseFloat(montoInput.value) || 0;
    ahorroCalculado.value = (monto * 0.1).toFixed(2);
  });

  document.getElementById("form-transaccion").addEventListener("submit", e => {
    e.preventDefault();

    const descripcion = descripcionInput.value.trim();
    const monto = parseFloat(montoInput.value);
    const tipo = tipoInput.value;
    const divisa = divisaInput.value;

    if (!descripcion || isNaN(monto) || monto <= 0 || !tipo) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    // Actualizar totales
    if (tipo === "ingreso") totalIngresos += monto;
    if (tipo === "gasto") totalGastos += monto;
    totalAhorros = totalIngresos * 0.1;

    // Crear fila historial
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${descripcion}</td>
      <td>${monto.toFixed(2)} ${divisa}</td>
      <td>${tipo}</td>
      <td>${new Date().toLocaleDateString()}</td>
      <td><button class="btn btn-sm btn-outline-danger">Eliminar</button></td>
    `;
    historial.prepend(fila);

    // Limpiar inputs
    descripcionInput.value = "";
    montoInput.value = "";
    tipoInput.value = "";
    ahorroCalculado.value = totalAhorros.toFixed(2);

    // Actualizar tarjetas y gráficos
    actualizarTotales();
    actualizarGraficos();
  });

  function actualizarTotales() {
    ingresosTotalDOM.textContent = totalIngresos.toFixed(2) + " €";
    gastosTotalDOM.textContent = totalGastos.toFixed(2) + " €";
    ahorroTotalDOM.textContent = totalAhorros.toFixed(2) + " €";
    saldoTotalDOM.textContent = (totalIngresos - totalGastos).toFixed(2) + " €";
  }

  function actualizarGraficos() {
    graficoBalance.data.datasets[0].data = [totalIngresos, totalGastos, totalAhorros];
    graficoBalance.update();

    const restante = Math.max(totalIngresos - totalAhorros, 0);
    graficoAhorro.data.datasets[0].data = [totalAhorros, restante];
    graficoAhorro.update();
  }

});

// Inicializar todos los tooltips de Bootstrap
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

// Modal de ahorro
const btnAhorro = document.getElementById("btnAhorro");
const modalAhorro = document.getElementById("modalAhorroConsejo");
const cerrarModal = document.getElementById("cerrarModal");

// Mostrar modal al hacer clic
btnAhorro.addEventListener("click", () => {
  modalAhorro.style.display = "flex";
});

// Cerrar modal al hacer clic en el botón
cerrarModal.addEventListener("click", () => {
  modalAhorro.style.display = "none";
});

// Opcional: cerrar modal si se hace clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modalAhorro) {
    modalAhorro.style.display = "none";
  }
});

// ==============================
// CONSEJOS ALEATORIOS EN EL RECUADRO EXISTENTE
// ==============================
const consejos = [
  "💸 Consejo: Reserva siempre al menos un 10% de tus ingresos antes de gastar en otras cosas.",
  "💸 Consejo: Lleva un registro sencillo de tus gastos diarios para tener control total.",
  "💸 Consejo: Revisa tus gastos recurrentes mensualmente y elimina lo innecesario.",
  "💸 Consejo: Prioriza pagar deudas con mayor interés para reducir carga financiera.",
  "💸 Consejo: Automatiza tus ahorros para que no dependan de tu fuerza de voluntad.",
  "💸 Consejo: Invierte tiempo en aprender sobre finanzas personales, no solo dinero.",
  "💸 Consejo: Divide tu dinero en categorías: ahorro, gasto, inversión y emergencias.",
  "💸 Consejo: Evita compras impulsivas y espera 24 horas antes de decidir.",
  "💸 Consejo: Establece metas financieras claras y realistas cada mes.",
  "💸 Consejo: Compara antes de gastar en productos grandes o servicios recurrentes.",
  "💸 Consejo: Aprovecha el interés compuesto reinvirtiendo de manera constante.",
  "💸 Consejo: Crea un fondo de emergencia equivalente a 3-6 meses de gastos.",
  "💸 Consejo: Usa presupuestos flexibles, ajustándolos según tus ingresos.",
  "💸 Consejo: No pongas todos tus ahorros en un solo lugar, diversifica.",
  "💸 Consejo: Aprende a leer y entender tus estados financieros personales.",
  "💸 Consejo: Piensa en compras grandes como inversión en calidad, no solo gasto.",
  "💸 Consejo: Revisa tus metas financieras trimestralmente y ajusta estrategias.",
  "💸 Consejo: Evita endeudarte por consumo innecesario, prioriza tu libertad.",
  "💸 Consejo: Pequeñas acciones diarias suman grandes resultados a largo plazo."
];

// Apuntar al recuadro de consejo ya existente
const collapseConsejo = document.querySelector("#tipsAhorro .alert");

// Cambiar consejo cada vez que se haga clic en el botón
const btnConsejos = document.querySelector('button[data-bs-toggle="collapse"][data-bs-target="#tipsAhorro"]');
btnConsejos.addEventListener("click", () => {
  const indice = Math.floor(Math.random() * consejos.length);
  collapseConsejo.textContent = consejos[indice];
});
