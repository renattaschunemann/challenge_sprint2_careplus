function switchTab(tabId) {
  const contents = document.querySelectorAll(".tab-content-section");
  contents.forEach((content) => {
    content.classList.add("d-none");
  });
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
    btn.classList.add("tab-btn-outline");
  });
  document.getElementById(`content-${tabId}`).classList.remove("d-none");
  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add("active");
    activeBtn.classList.remove("tab-btn-outline");
  }
}
function remarcarExame() {
  alert(
    "Iniciando processo de remarcação. Você será redirecionado para a agenda.",
  );
  window.location.href = "agenda.html";
}
function agendarExame() {
  window.location.href = "agenda.html";
}
let exameEmFoco = "";
let idEmFoco = null;
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get("tab");
  if (tabParam) {
    switchTab(tabParam);
  }
  renderizarAgendados();
  renderizarHistorico(historicoExames);
});
function renderizarAgendados() {
  const lista = document.getElementById("listaAgendados");
  if (!lista) return;
  let agendamentos = JSON.parse(
    localStorage.getItem("agendamentosExames") || "[]",
  );

  const def = document.getElementById("exame-default");
  if (def) {
    agendamentos.length > 0
      ? def.classList.add("d-none")
      : def.classList.remove("d-none");
  }

  const dynamicItems = document.querySelectorAll(".dynamic-agendado");
  dynamicItems.forEach((item) => item.remove());
  agendamentos.forEach((agendamento, index) => {
    const div = document.createElement("div");
    div.className = "border rounded-4 p-4 mb-3 item-agendado dynamic-agendado";
    div.innerHTML = `
            <h5 class="fw-bold mb-3 text-navy">${agendamento.nome}</h5>
            <div class="d-flex flex-wrap gap-4 text-secondary mb-4">
                <span class="d-flex align-items-center font-md">
                    <i class="bi bi-calendar3 me-2"></i> ${agendamento.data}
                </span>
                <span class="d-flex align-items-center font-md">
                    <i class="bi bi-clock me-2"></i> às ${agendamento.hora}
                </span>
            </div>
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <span class="d-flex align-items-center text-secondary font-md">
                    <i class="bi bi-geo-alt me-2"></i> Care Plus Clinic
                </span>
                <div class="d-flex flex-column flex-md-row gap-2">
                    <button class="btn btn-brand-primary px-4 rounded-3" onclick="solicitarRemarcacaoFuturoID(${index}, '${agendamento.nome}')">Remarcar</button>
                    <button class="btn btn-outline-danger px-4 rounded-3 fw-medium text-brand-danger border-brand-danger" onclick="cancelarAgendamentoFuturoID('${index}')">Desmarcar</button>
                </div>
            </div>
        `;
    lista.appendChild(div);
  });
}
function filtrarExames() {
  const input = document.getElementById("buscaExames");
  const filter = input.value.toLowerCase();
  const exames = document.querySelectorAll(".item-exame");
  exames.forEach((exame) => {
    const texto = exame.innerText.toLowerCase();
    if (texto.includes(filter)) {
      exame.classList.remove("d-none");
    } else {
      exame.classList.add("d-none");
    }
  });
}
function filtrarCategoria(categoria) {
  const exames = document.querySelectorAll(".item-exame");
  exames.forEach((exame) => {
    if (categoria === "Todos") {
      exame.classList.remove("d-none");
    } else {
      const cats = exame.getAttribute("data-cat") || "";
      if (cats.includes(categoria)) {
        exame.classList.remove("d-none");
      } else {
        exame.classList.add("d-none");
      }
    }
  });
}
function abrirModalHorario(nomeExame) {
  exameEmFoco = nomeExame;
  idEmFoco = null;
  document.getElementById("spanNomeExameHorario").innerText = nomeExame;
  document.getElementById("inputDataExame").value = "";
  document.getElementById("selectHoraExame").value = "";
  var modal = new bootstrap.Modal(
    document.getElementById("modalEscolherHorario"),
  );
  modal.show();
}
function confirmarAgendamentoComHorario() {
  const data = document.getElementById("inputDataExame").value;
  const hora = document.getElementById("selectHoraExame").value;
  if (!data || !hora) {
    alert("Por favor, selecione uma data e um horário.");
    return;
  }
  var modalHorarioEl = document.getElementById("modalEscolherHorario");
  var modalHorario = bootstrap.Modal.getInstance(modalHorarioEl);
  if (modalHorario) {
    modalHorario.hide();
  }
  const partesData = data.split("-");
  const dataFormatada =
    partesData.length === 3
      ? `${partesData[2]}/${partesData[1]}/${partesData[0]}`
      : data;
  let agendamentos = JSON.parse(
    localStorage.getItem("agendamentosExames") || "[]",
  );
  if (idEmFoco !== null && idEmFoco !== "default") {
    agendamentos[idEmFoco].data = dataFormatada;
    agendamentos[idEmFoco].hora = hora;
    agendamentos[idEmFoco].nome = exameEmFoco;
  } else if (idEmFoco === "default") {
    agendamentos.unshift({
      nome: exameEmFoco,
      data: dataFormatada,
      hora: hora,
    });
  } else {
    agendamentos.push({
      nome: exameEmFoco,
      data: dataFormatada,
      hora: hora,
    });
  }
  localStorage.setItem("agendamentosExames", JSON.stringify(agendamentos));
  idEmFoco = null;
  renderizarAgendados();
  document.getElementById("modalNomeExameAgendado").innerText = exameEmFoco;
  var modalSucesso = new bootstrap.Modal(
    document.getElementById("modalAgendamento"),
  );
  modalSucesso.show();
}
function solicitarRemarcacaoFuturoID(id, nomeExame) {
  idEmFoco = id;
  exameEmFoco = nomeExame;
  document.getElementById("nomeExameRemarcacao").innerText = exameEmFoco;
  var modal = new bootstrap.Modal(
    document.getElementById("modalConfirmarRemarcacao"),
  );
  modal.show();
}
function confirmarRemarcacao() {
  var modalConf = bootstrap.Modal.getInstance(
    document.getElementById("modalConfirmarRemarcacao"),
  );
  if (modalConf) modalConf.hide();
  document.getElementById("spanNomeExameHorario").innerText = exameEmFoco;
  document.getElementById("inputDataExame").value = "";
  document.getElementById("selectHoraExame").value = "";
  var modal = new bootstrap.Modal(
    document.getElementById("modalEscolherHorario"),
  );
  modal.show();
}
function cancelarAgendamentoFuturoID(id) {
  if (confirm("Tem certeza que deseja desmarcar este exame?")) {
    if (id === "default") {
      document.getElementById("exame-default").remove();
    } else {
      let agendamentos = JSON.parse(
        localStorage.getItem("agendamentosExames") || "[]",
      );
      agendamentos.splice(id, 1);
      localStorage.setItem("agendamentosExames", JSON.stringify(agendamentos));
      renderizarAgendados();
    }
  }
}
const historicoExames = [
  {
    nome: "Hemoglobina Completa",
    data: "05/10/2025",
    local: "Laboratório Central",
  },
  {
    nome: "Eletrocardiograma (ECG)",
    data: "02/02/2026",
    local: "Clínica Cardiológica",
  },
  {
    nome: "Colesterol Total e Frações",
    data: "12/08/2025",
    local: "Laboratório Central",
  },
  {
    nome: "Ultrassom de Abdome Total",
    data: "24/05/2025",
    local: "Clínica Itaim Bibi",
  },
  {
    nome: "Glicemia de Jejum",
    data: "15/03/2025",
    local: "Laboratório Central",
  },
  { nome: "Mamografia", data: "10/11/2024", local: "Clínica Mulher & Vida" },
  { nome: "Papanicolau", data: "10/11/2024", local: "Clínica Mulher & Vida" },
  { nome: "Papanicolau", data: "12/10/2025", local: "Clínica Mulher & Vida" },
  { nome: "Papanicolau", data: "08/04/2026", local: "Clínica Mulher & Vida" },
  { nome: "Raio-X de Tórax", data: "18/07/2024", local: "Laboratório Central" },
  {
    nome: "Exame de Urina (EAS)",
    data: "22/01/2024",
    local: "Laboratório Central",
  },
  {
    nome: "Ressonância Magnética de Joelho",
    data: "05/09/2024",
    local: "Clínica Itaim Bibi",
  },
  {
    nome: "Exame de Sangue (Hemograma)",
    data: "14/05/2026",
    local: "Laboratório Central",
  },
  {
    nome: "Ultrassom Transvaginal",
    data: "15/09/2025",
    local: "Clínica Mulher & Vida",
  },
  {
    nome: "Exame de Vista (Oftalmologia)",
    data: "12/03/2024",
    local: "Clínica de Olhos Paulista",
  },
  {
    nome: "Hemoglobina Completa",
    data: "05/01/2026",
    local: "Laboratório Central",
  },
  {
    nome: "Mamografia Bilateral",
    data: "03/05/2026",
    local: "Clínica Mulher & Vida",
  },
  {
    nome: "Ultrassom Pélvico Transvaginal",
    data: "18/06/2026",
    local: "Clínica Mulher & Vida",
  },
  {
    nome: "Teste Ergométrico Cardiovascular",
    data: "10/02/2025",
    local: "Clínica Cardiológica",
  },
  {
    nome: "Radiografia de Tórax (Raio-X)",
    data: "22/11/2025",
    local: "Laboratório Central",
  },
  {
    nome: "Endoscopia Digestiva Alta",
    data: "14/09/2024",
    local: "Clínica Gastro Sul",
  },
  {
    nome: "Exame de PSA (Próstata)",
    data: "05/07/2025",
    local: "Laboratório Central",
  },
  {
    nome: "Densitometria Óssea",
    data: "19/04/2024",
    local: "Clínica Itaim Bibi",
  },
  {
    nome: "Exame de Audiometria",
    data: "30/08/2024",
    local: "Clínica Ouvir Bem",
  },
  {
    nome: "Ressonância Magnética da Coluna",
    data: "27/12/2025",
    local: "Clínica Itaim Bibi",
  },
];

function parseDataBR(dataStr) {
  const partes = dataStr.split("/");
  if (partes.length === 3) {
    return new Date(partes[2], partes[1] - 1, partes[0]);
  }
  return new Date(dataStr);
}

function parseDataISO(dataStr) {
  const partes = dataStr.split("-");
  if (partes.length === 3) {
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }
  return new Date(dataStr);
}

function renderizarHistorico(itens) {
  const lista = document.getElementById("listaHistorico");
  if (!lista) return;
  lista.innerHTML = "";

  if (itens.length === 0) {
    lista.innerHTML = `
            <div class="text-center py-5 text-secondary">
                <i class="bi bi-search fs-3 mb-2 d-block text-muted"></i>
                Nenhum exame encontrado para os critérios de busca.
            </div>
        `;
    return;
  }

  const itensOrdenados = [...itens].sort((a, b) => {
    return parseDataBR(b.data) - parseDataBR(a.data);
  });

  itensOrdenados.forEach((exame) => {
    const partes = exame.data.split("/");
    let dataFormatada = exame.data;
    if (partes.length === 3) {
      const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      const mesIndex = parseInt(partes[1], 10) - 1;
      dataFormatada = `${partes[0]} de ${meses[mesIndex]} ${partes[2]}`;
    }

    const div = document.createElement("div");
    div.className = "border rounded-4 p-3 mb-3";
    div.innerHTML = `
            <h6 class="fw-bold mb-2 text-navy">${exame.nome}</h6>
            <div class="d-flex justify-content-between align-items-end flex-wrap gap-2">
                <div class="d-flex gap-4 text-secondary font-sm">
                    <span class="d-flex align-items-center">
                        <i class="bi bi-calendar3 me-1"></i> ${dataFormatada}
                    </span>
                    <span class="d-flex align-items-center">
                        <i class="bi bi-geo-alt me-1"></i> ${exame.local}
                    </span>
                </div>
                <a href="#" class="text-decoration-none fw-medium text-navy font-sm" onclick="alert('Download do laudo de ${exame.nome} iniciado...'); return false;">
                    <i class="bi bi-arrow-down me-1"></i> Ver Resultado e Laudo
                </a>
            </div>
        `;
    lista.appendChild(div);
  });
}

function filtrarHistorico() {
  const query = document
    .getElementById("historicoBuscaTipo")
    .value.toLowerCase();
  const dataInicioStr = document.getElementById("historicoDataInicio").value;
  const dataFimStr = document.getElementById("historicoDataFim").value;

  const dataInicio = dataInicioStr ? parseDataISO(dataInicioStr) : null;
  const dataFim = dataFimStr ? parseDataISO(dataFimStr) : null;

  const filtrados = historicoExames.filter((exame) => {

    const bateNome = exame.nome.toLowerCase().includes(query);
    if (!bateNome) return false;

    if (dataInicio || dataFim) {
      const dataExame = parseDataBR(exame.data);
      if (dataInicio && dataExame < dataInicio) return false;
      if (dataFim && dataExame > dataFim) return false;
    }

    return true;
  });

  renderizarHistorico(filtrados);
}
