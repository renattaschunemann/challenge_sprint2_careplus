document.addEventListener("DOMContentLoaded", function () {
  const tabAgendar = document.getElementById("tab-agendar");
  const tabConsultas = document.getElementById("tab-consultas");
  const tabHistorico = document.getElementById("tab-historico");
  const contentAgendar = document.getElementById("content-agendar");
  const contentConsultas = document.getElementById("content-consultas");
  const contentHistorico = document.getElementById("content-historico");
  function hideAllTabs() {
    tabAgendar.classList.remove("active");
    tabConsultas.classList.remove("active");
    if (tabHistorico) tabHistorico.classList.remove("active");
    contentAgendar.classList.add("d-none");
    contentConsultas.classList.add("d-none");
    if (contentHistorico) contentHistorico.classList.add("d-none");
  }
  if (tabAgendar && tabConsultas) {
    tabAgendar.addEventListener("click", () => {
      hideAllTabs();
      tabAgendar.classList.add("active");
      contentAgendar.classList.remove("d-none");
    });
    tabConsultas.addEventListener("click", () => {
      hideAllTabs();
      tabConsultas.classList.add("active");
      contentConsultas.classList.remove("d-none");
    });
    if (tabHistorico) {
      tabHistorico.addEventListener("click", () => {
        hideAllTabs();
        tabHistorico.classList.add("active");
        contentHistorico.classList.remove("d-none");
      });
    }
  }
  const btnTipoPresencial = document.getElementById("btn-tipo-presencial");
  const btnTipoTeleconsulta = document.getElementById("btn-tipo-teleconsulta");
  let tipoConsultaAtual = "Presencial";
  if (btnTipoPresencial && btnTipoTeleconsulta) {
    btnTipoPresencial.addEventListener("click", function () {
      tipoConsultaAtual = "Presencial";
      btnTipoPresencial.classList.add("btn-presencial-active");
      btnTipoPresencial.classList.remove("btn-teleconsulta-inactive");
      btnTipoTeleconsulta.classList.add("btn-teleconsulta-inactive");
      btnTipoTeleconsulta.classList.remove("btn-presencial-active");
    });
    btnTipoTeleconsulta.addEventListener("click", function () {
      tipoConsultaAtual = "Teleconsulta";
      btnTipoTeleconsulta.classList.add("btn-presencial-active");
      btnTipoTeleconsulta.classList.remove("btn-teleconsulta-inactive");
      btnTipoPresencial.classList.add("btn-teleconsulta-inactive");
      btnTipoPresencial.classList.remove("btn-presencial-active");
    });
  }
  const selectClinica = document.getElementById("select-clinica");
  const selectEspecialidade = document.getElementById("select-especialidade");
  const especialidadesPorClinica = {
    "Saúde da Mulher": ["Ginecologia", "Obstetrícia", "Mastologista"],
    "Vida Plus": [
      "Clínico geral",
      "Cardiologia",
      "Geriatria",
      "Pediatria",
      "Pneumologia",
      "Endocrinologia",
      "Psiquiatria",
    ],
    "Clínica Rios": [
      "Nefrologia",
      "Hematologia",
      "Gastroenterologia",
      "Urologia",
    ],
    "SP Saúde": ["Neurologia", "Laringologia", "Oftalmologia", "Ortopedia"],
    "Bem Estar Clínica": [
      "Dermatologia",
      "Nutrição",
      "Fisioterapia",
      "Acupuntura",
    ],
    "Centro Médico Avançado": [
      "Oncologia",
      "Reumatologia",
      "Infectologia",
      "Cirurgia Geral",
    ],
  };
  if (selectClinica && selectEspecialidade) {
    selectClinica.addEventListener("change", function () {
      const clinicaSelecionada = this.value;
      const especialidades = especialidadesPorClinica[clinicaSelecionada] || [];
      selectEspecialidade.innerHTML =
        "<option selected disabled>Selecione uma especialidade</option>";
      if (especialidades.length > 0) {
        selectEspecialidade.disabled = false;
        especialidades.forEach(function (espec) {
          const option = document.createElement("option");
          option.value = espec;
          option.textContent = espec;
          selectEspecialidade.appendChild(option);
        });
      } else {
        selectEspecialidade.disabled = true;
        selectEspecialidade.innerHTML =
          "<option selected disabled>Nenhuma especialidade disponível</option>";
      }
    });
  }
  const selectPeriodo = document.getElementById("select-periodo");
  const selectHorario = document.getElementById("select-horario");
  const horariosPorPeriodo = {
    Manhã: ["08:00", "09:00", "10:00", "11:00"],
    Tarde: ["13:00", "14:00", "15:30", "16:00", "17:00"],
  };
  if (selectPeriodo && selectHorario) {
    selectHorario.innerHTML =
      "<option selected disabled>Selecione um período primeiro</option>";
    selectHorario.disabled = true;
    selectPeriodo.addEventListener("change", function () {
      const periodoSelecionado = this.value;
      const horarios = horariosPorPeriodo[periodoSelecionado] || [];
      selectHorario.innerHTML =
        "<option selected disabled>Selecione um horário</option>";
      if (horarios.length > 0) {
        selectHorario.disabled = false;
        horarios.forEach(function (hora) {
          const option = document.createElement("option");
          option.value = hora;
          option.textContent = hora;
          selectHorario.appendChild(option);
        });
      } else {
        selectHorario.disabled = true;
        selectHorario.innerHTML =
          "<option selected disabled>Nenhum horário disponível</option>";
      }
    });
  }
  const btnAgendar = document.getElementById("btn-agendar");
  if (btnAgendar) {
    btnAgendar.addEventListener("click", function () {
      const clinica =
        selectClinica && selectClinica.value !== "Selecione uma clínica"
          ? selectClinica.value
          : "sua clínica";
      const especialidade =
        selectEspecialidade &&
        selectEspecialidade.value !== "Selecione uma especialidade"
          ? selectEspecialidade.value
          : "Clínica Geral";
      const selectHorario = document.getElementById("select-horario");
      let horario = "um horário";
      if (selectHorario && selectHorario.selectedIndex > 0) {
        horario = selectHorario.options[selectHorario.selectedIndex].text;
      }
      const modalEspec = document.getElementById("modal-especialidade");
      const modalHora = document.getElementById("modal-horario");
      const modalClinica = document.getElementById("modal-clinica");
      if (modalEspec) modalEspec.innerText = especialidade;
      if (modalHora) modalHora.innerText = horario;
      if (modalClinica) modalClinica.innerText = clinica;
    });
  }
  renderizarConsultas();
  renderizarHistoricoConsultas();
});
let idConsultaEmFoco = null;
function renderizarConsultas() {
  const lista = document.getElementById("listaConsultasAgendadas");
  if (!lista) return;
  let consultas = JSON.parse(
    localStorage.getItem("consultasAgendadas") || "[]",
  );
  const dynamicItems = document.querySelectorAll(".dynamic-consulta");
  dynamicItems.forEach((item) => item.remove());
  consultas.forEach((c, index) => {
    const div = document.createElement("div");
    div.className =
      "border rounded-4 p-4 mb-3 d-flex justify-content-between align-items-center flex-wrap gap-3 consulta-item dynamic-consulta";
    div.innerHTML = `
            <div>
                <h5 class="fw-bold mb-3 text-navy">Consulta: ${c.especialidade}</h5>
                <div class="d-flex gap-4 text-secondary flex-wrap">
                    <span class="d-flex align-items-center bg-light rounded-pill px-3 py-1 font-md">
                        <i class="bi bi-calendar-event me-2 text-primary"></i> ${c.data}
                    </span>
                    <span class="d-flex align-items-center bg-light rounded-pill px-3 py-1 font-md">
                        <i class="bi bi-clock me-2 text-primary"></i> às ${c.horario}
                    </span>
                    <span class="d-flex align-items-center font-md">
                        <i class="bi bi-geo-alt me-2"></i> ${c.clinica}
                    </span>
                </div>
            </div>
            <div class="d-flex flex-column flex-md-row gap-2">
                <button class="btn btn-brand-primary px-4 rounded-3" onclick="solicitarRemarcacaoConsulta('${index}', '${c.especialidade}', '${c.clinica}')">Remarcar</button>
                <button class="btn btn-outline-brand-danger px-4 rounded-3" onclick="cancelarConsulta('${index}')">Desmarcar</button>
            </div>
        `;
    lista.appendChild(div);
  });
}
function confirmarAgendamento() {
  const selectClinica = document.getElementById("select-clinica");
  const selectEspecialidade = document.getElementById("select-especialidade");
  const selectHorario = document.getElementById("select-horario");
  const inputData = document.getElementById("input-data");
  const clinica =
    selectClinica && selectClinica.value !== "Selecione uma clínica"
      ? selectClinica.value
      : "Clínica Padrão";
  const especialidade =
    selectEspecialidade &&
    selectEspecialidade.value !== "Selecione uma especialidade" &&
    selectEspecialidade.value !== "Selecione a clínica primeiro"
      ? selectEspecialidade.value
      : "Consulta";
  const horario =
    selectHorario && selectHorario.selectedIndex > 0
      ? selectHorario.options[selectHorario.selectedIndex].text
      : "Horário a definir";
  let dataFormatada = "Data não informada";
  if (inputData && inputData.value) {
    const d = new Date(inputData.value + "T12:00:00");
    dataFormatada = d.toLocaleDateString("pt-BR");
  }
  let consultas = JSON.parse(
    localStorage.getItem("consultasAgendadas") || "[]",
  );
  if (idConsultaEmFoco !== null && idConsultaEmFoco !== "default") {
    consultas[idConsultaEmFoco].data = dataFormatada;
    consultas[idConsultaEmFoco].horario = horario;
    consultas[idConsultaEmFoco].clinica = clinica;
    consultas[idConsultaEmFoco].especialidade = especialidade;
  } else {
    consultas.push({
      clinica: clinica,
      especialidade: especialidade,
      data: dataFormatada,
      horario: horario,
    });
    if (idConsultaEmFoco === "default") {
      const def = document.getElementById("consulta-default");
      if (def) def.remove();
    }
  }
  localStorage.setItem("consultasAgendadas", JSON.stringify(consultas));
  idConsultaEmFoco = null;

  if (selectClinica) selectClinica.selectedIndex = 0;
  if (selectEspecialidade) {
    selectEspecialidade.innerHTML = "<option selected disabled>Selecione uma especialidade</option>";
    selectEspecialidade.disabled = true;
  }
  if (inputData) inputData.value = "";
  
  const selectPeriodo = document.getElementById("select-periodo");
  if (selectPeriodo) selectPeriodo.selectedIndex = 0;
  
  if (selectHorario) {
    selectHorario.innerHTML = "<option selected disabled>Selecione um período primeiro</option>";
    selectHorario.disabled = true;
  }

  renderizarConsultas();
  document.getElementById("tab-consultas").click();
  setTimeout(() => {
    alert("Consulta confirmada com sucesso!");
  }, 100);
}
function solicitarRemarcacaoConsulta(id, especialidade, clinica) {
  idConsultaEmFoco = id;
  document.getElementById("nomeConsultaRemarcacao").innerText =
    especialidade + " na " + clinica;
  var modal = new bootstrap.Modal(
    document.getElementById("modalConfirmarRemarcacaoAgenda"),
  );
  modal.show();
}
function confirmarRemarcacaoAgenda() {
  var modalConf = bootstrap.Modal.getInstance(
    document.getElementById("modalConfirmarRemarcacaoAgenda"),
  );
  if (modalConf) modalConf.hide();
  document.getElementById("tab-agendar").click();
  document.getElementById("input-data").value = "";
  if (document.getElementById("select-periodo")) {
    document.getElementById("select-periodo").selectedIndex = 0;
  }
  const selectHorario = document.getElementById("select-horario");
  if (selectHorario) {
    selectHorario.innerHTML =
      "<option selected disabled>Selecione um período primeiro</option>";
    selectHorario.disabled = true;
  }
  if (idConsultaEmFoco !== null && idConsultaEmFoco !== "default") {
    let consultas = JSON.parse(
      localStorage.getItem("consultasAgendadas") || "[]",
    );
    if (consultas[idConsultaEmFoco]) {
      const clinicaPre = consultas[idConsultaEmFoco].clinica;
      const especPre = consultas[idConsultaEmFoco].especialidade;
      const selectClinica = document.getElementById("select-clinica");
      const selectEspecialidade = document.getElementById(
        "select-especialidade",
      );
      if (selectClinica) {
        selectClinica.value = clinicaPre;
        const event = new Event("change");
        selectClinica.dispatchEvent(event);
        if (selectEspecialidade) {
          selectEspecialidade.value = especPre;
        }
      }
    }
  }
  alert(
    "Por favor, selecione uma nova data e horário para a sua consulta e clique em Agendar.",
  );
}
function cancelarConsulta(id) {
  if (confirm("Tem certeza que deseja desmarcar esta consulta?")) {
    if (id === "default") {
      const def = document.getElementById("consulta-default");
      if (def) def.remove();
    } else {
      let consultas = JSON.parse(
        localStorage.getItem("consultasAgendadas") || "[]",
      );
      consultas.splice(id, 1);
      localStorage.setItem("consultasAgendadas", JSON.stringify(consultas));
      renderizarConsultas();
    }
  }
}

// --- HISTÓRICO DE CONSULTAS REALIZADAS ---
const historicoConsultas = [
  {
    especialidade: "Ginecologia",
    medico: "Dra. Cláudia",
    data: "12/03/2026",
    clinica: "Saúde da Mulher",
  },
  {
    especialidade: "Oftalmologia",
    medico: "Dr. Marcos",
    data: "05/02/2026",
    clinica: "SP Saúde",
  },
  {
    especialidade: "Oftalmologia",
    medico: "Dr. Marcos",
    data: "15/10/2025",
    clinica: "SP Saúde",
  },
  {
    especialidade: "Ginecologia",
    medico: "Dra. Cláudia",
    data: "20/09/2024",
    clinica: "Saúde da Mulher",
  },
  {
    especialidade: "Ginecologia",
    medico: "Dra. Cláudia",
    data: "15/04/2024",
    clinica: "Saúde da Mulher",
  },
  {
    especialidade: "Oftalmologia",
    medico: "Dr. Marcos",
    data: "10/01/2024",
    clinica: "SP Saúde",
  },
  {
    especialidade: "Clínica Geral",
    medico: "Dra. Ana",
    data: "10/01/2026",
    clinica: "Bem Estar Clínica",
  },
  {
    especialidade: "Dermatologia",
    medico: "Dr. Carlos",
    data: "15/11/2025",
    clinica: "Vida Plus",
  },
];

function parseDataBR(dataStr) {
  const partes = dataStr.split("/");
  if (partes.length === 3) {
    return new Date(partes[2], partes[1] - 1, partes[0]);
  }
  return new Date(dataStr);
}

function renderizarHistoricoConsultas() {
  const lista = document.getElementById("listaHistoricoConsultas");
  if (!lista) return;
  lista.innerHTML = "";

  const ordenadas = [...historicoConsultas].sort((a, b) => {
    return parseDataBR(b.data) - parseDataBR(a.data);
  });

  ordenadas.forEach((c) => {
    const partes = c.data.split("/");
    let dataFormatada = c.data;
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
            <h6 class="fw-bold mb-2 text-brand-primary">${c.especialidade} com ${c.medico}</h6>
            <div class="d-flex justify-content-between align-items-end flex-wrap gap-2">
                <div class="d-flex gap-4 text-secondary font-sm">
                    <span class="d-flex align-items-center">
                        <i class="bi bi-calendar3 me-1"></i> ${dataFormatada}
                    </span>
                    <span class="d-flex align-items-center">
                        <i class="bi bi-geo-alt me-1"></i> ${c.clinica}
                    </span>
                </div>
                <span class="badge bg-success text-white rounded-pill px-3 py-1">Realizada</span>
            </div>
        `;
    lista.appendChild(div);
  });
}
