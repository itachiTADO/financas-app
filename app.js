// ====== NAVEGAÇÃO ENTRE TELAS ======
const screens = document.querySelectorAll(".screen");
const bottomNavItems = document.querySelectorAll(".bottom-nav-item");
const header = document.getElementById("appHeader");
const screenTitle = document.getElementById("screenTitle");

function setScreen(name) {
  screens.forEach((s) => {
    s.classList.toggle("screen--active", s.dataset.screen === name);
  });

  bottomNavItems.forEach((btn) => {
    btn.classList.toggle(
      "bottom-nav-item--active",
      btn.dataset.target === name
    );
  });

  // muda título e cor do header
  if (name === "dashboard") {
    screenTitle.textContent = "Dashboard";
    header.className = "app-header app-header--blue";
  } else if (name === "contas") {
    screenTitle.textContent = "Contas";
    header.className = "app-header app-header--blue";
  } else if (name === "cartoes") {
    screenTitle.textContent = "Cartões de crédito";
    header.className = "app-header app-header--blue";
  } else if (name === "orcamentos") {
    screenTitle.textContent = "Orçamentos";
    header.className = "app-header app-header--red";
  } else if (name === "graficos") {
    screenTitle.textContent = "Gráficos";
    header.className = "app-header app-header--red";
  } else if (name === "investimentos") {
    screenTitle.textContent = "Investimentos";
    header.className = "app-header app-header--teal";
  } else if (name === "objetivos") {
    screenTitle.textContent = "Objetivos";
    header.className = "app-header app-header--purple";
  }
}

bottomNavItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    setScreen(btn.dataset.target);
  });
});

// ====== TABS DASHBOARD ======
const dashTabs = document.querySelectorAll("[data-dashboard-tab]");
const dashPanels = document.querySelectorAll("[data-dashboard-panel]");
const tabIndicator = document.querySelector(".tab-indicator");

function setDashboardTab(tabName) {
  dashTabs.forEach((t, index) => {
    const isActive = t.dataset.dashboardTab === tabName;
    t.classList.toggle("tab--active", isActive);
    if (isActive) {
      const translate = index * 100;
      tabIndicator.style.transform = `translateX(${translate}%)`;
    }
  });

  dashPanels.forEach((p) => {
    p.classList.toggle(
      "tab-panel--active",
      p.dataset.dashboardPanel === tabName
    );
  });
}

dashTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setDashboardTab(tab.dataset.dashboardTab);
  });
});

setDashboardTab("despesas");

// ====== MODO ESCURO ======
const darkToggle = document.getElementById("darkModeToggle");
const darkIcon = document.getElementById("darkModeIcon");

function setTheme(mode) {
  if (mode === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    darkIcon.textContent = "light_mode";
  } else {
    document.documentElement.removeAttribute("data-theme");
    darkIcon.textContent = "dark_mode";
  }
}

let currentTheme = "light";
darkToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(currentTheme);
});

// ====== F.A.B. (apenas demonstração) ======
const fabButton = document.getElementById("fabButton");
fabButton.addEventListener("click", () => {
  alert("Aqui depois entra o fluxo de 'novo lançamento' 😉");
});

// ====== GRÁFICOS (Chart.js) ======

// Donut de despesas por categoria (dashboard)
const categorias = ["Alimentação", "Moradia", "Saúde", "Lazer", "Outros", "Demais"];
const valores = [15, 17, 16, 18, 15, 19];

const cores = [
  "#ffb300", // amarelo
  "#1976d2", // azul
  "#43a047", // verde
  "#ab47bc", // roxo
  "#ef5350", // vermelho
  "#9e9e9e", // cinza
];

const ctx1 = document.getElementById("chartDespesasCategorias");
if (ctx1) {
  const donut = new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: categorias,
      datasets: [
        {
          data: valores,
          backgroundColor: cores,
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      cutout: "65%",
    },
  });

// Pizza de investimentos (tela investimentos)
const ctxInv = document.getElementById("chartInvestimentos");
if (ctxInv) {
  const tiposInv = ["Renda fixa", "Renda variável", "Caixa / outros"];
  const valoresInv = [18000, 12500, 4920];
  const coresInv = ["#43a047", "#1976d2", "#ffb300"];

  new Chart(ctxInv, {
    type: "doughnut",
    data: {
      labels: tiposInv,
      datasets: [
        {
          data: valoresInv,
          backgroundColor: coresInv,
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      cutout: "60%",
    },
  });

  const legendInv = document.getElementById("legendInvestimentos");
  tiposInv.forEach((nome, i) => {
    const li = document.createElement("li");
    const dot = document.createElement("span");
    dot.className = "legend-color";
    dot.style.backgroundColor = coresInv[i];
    const text = document.createElement("span");
    text.textContent = `${nome} - R$ ${valoresInv[i].toLocaleString("pt-BR")}`;
    li.appendChild(dot);
    li.appendChild(text);
    legendInv.appendChild(li);
  });
}


  // valor total no meio do donut
  const total = valores.reduce((sum, v) => sum + v, 0);
  const legendEl = document.getElementById("legendCategorias");
  categorias.forEach((cat, i) => {
    const li = document.createElement("li");
    const colorDot = document.createElement("span");
    colorDot.className = "legend-color";
    colorDot.style.backgroundColor = cores[i];

    const text = document.createElement("span");
    text.textContent = `${cat} - ${valores[i]}%`;

    li.appendChild(colorDot);
    li.appendChild(text);
    legendEl.appendChild(li);
  });

  // hack para escrever o total no centro
  Chart.register({
    id: "centerTextPlugin",
    afterDraw(chart) {
      if (chart !== donut) return;
      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;
      ctx.save();
      ctx.font = "bold 16px Roboto";
      ctx.textBaseline = "middle";
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue(
        "--text-main"
      );
      const text = "R$ 8.054,60";
      const textX = Math.round(width / 2);
      const textY = Math.round(height / 2);
      ctx.textAlign = "center";
      ctx.fillText(text, textX, textY);
      ctx.restore();
    },
  });
  donut.update();
}

// Ranking categorias (gráficos)
const ctx2 = document.getElementById("chartRankingCategorias");
if (ctx2) {
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["Moradia", "Alimentação", "Família", "Lazer", "Pessoal"],
      datasets: [
        {
          data: [34.2, 31.3, 18.2, 8.6, 7.7],
          backgroundColor: [
            "#1976d2",
            "#ab47bc",
            "#ffb300",
            "#5c6bc0",
            "#26a69a",
          ],
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: "#888", callback: (v) => v + "%" },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#888" },
          grid: { display: false },
        },
      },
    },
  });
}

// Segundo donut (tela gráficos)
const ctx3 = document.getElementById("chartDespesasCategorias2");
if (ctx3) {
  new Chart(ctx3, {
    type: "doughnut",
    data: {
      labels: categorias,
      datasets: [
        {
          data: valores,
          backgroundColor: cores,
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#777", boxWidth: 10 },
        },
      },
      cutout: "60%",
    },
  });
}

// -------------------------
// Lógica de troca de mês
// -------------------------

let currentMonthIndex = new Date().getMonth(); // 0 = Janeiro
let currentYear = new Date().getFullYear();

function updateMonthDisplay() {
    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const monthDisplay = document.getElementById("current-month");
    if (monthDisplay) {
        monthDisplay.textContent = monthNames[currentMonthIndex];
    }
}

function nextMonth() {
    currentMonthIndex++;
    if (currentMonthIndex > 11) {
        currentMonthIndex = 0;
        currentYear++;
    }
    updateMonthDisplay();
}

function prevMonth() {
    currentMonthIndex--;
    if (currentMonthIndex < 0) {
        currentMonthIndex = 11;
        currentYear--;
    }
    updateMonthDisplay();
}

// chamar ao iniciar
updateMonthDisplay();

// Inicial
setScreen("dashboard");
setTheme("light");
