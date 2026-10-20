/**
 * Care Plus - Saber+
 * Gerenciamento de leitura de artigos e resgate de Care Coins ao final da leitura.
 */

const ARTIGOS_DATA = {
  "saude-mental": {
    id: "saude-mental",
    categoria: "Artigo • Bem-estar Emocional",
    titulo: "Saúde mental: como cultivar o equilíbrio emocional no dia a dia",
    tempoLeitura: "3 min de leitura",
    imagem: "../img/Mental-healphy.jpeg",
    resumo: "Pequenos hábitos diários ajudam a prevenir a ansiedade, burnout e promovem mais disposição mental.",
    conteudo: `
      <p>Cuidar da mente é tão vital quanto praticar exercícios físicos ou manter exames de rotina em dia. No ritmo acelerado em que vivemos, o estresse crônico e a sobrecarga de tarefas podem comprometer gradativamente o sistema imunológico, a qualidade do sono e os relacionamentos pessoais.</p>
      
      <h3>1. Estabeleça pausas de descompressão</h3>
      <p>Estudos neurológicos comprovam que pequenas pausas de 5 minutos a cada 90 minutos de foco intenso restauram a oxigenação cerebral e reduzem os níveis de cortisol. Experimente alongar o corpo, respirar fundo ou beber água longe das telas.</p>

      <div class="article-callout">
        <i class="bi bi-lightbulb-fill text-warning me-2"></i>
        <strong>Dica Care Plus:</strong> O programa <em>Mental Care</em> oferece sessões de apoio psicológico presencial e por telemedicina para beneficiários e seus dependentes.
      </div>

      <h3>2. Qualidade do sono como escudo biológico</h3>
      <p>O sono não é apenas descanso: é quando o cérebro realiza a limpeza de toxinas e consolida memórias. Desconectar o celular 45 minutos antes de dormir e manter o quarto escuro e arejado são passos decisivos para uma boa higiene do sono.</p>

      <h3>3. Não hesite em procurar acolhimento</h3>
      <p>Sentir-se sobrecarregado não é sinal de fraqueza. Conversar com um profissional de psicologia traz ferramentas práticas de autoconhecimento e regulação emocional que transformam sua qualidade de vida.</p>
    `
  },
  "alimentacao-equilibrada": {
    id: "alimentacao-equilibrada",
    categoria: "Vídeo & Guia • Nutrição",
    titulo: "Alimentação equilibrada: benefícios comprovados para longevidade e prevenção",
    tempoLeitura: "4 min de leitura",
    imagem: "../img/Healthy-food.jpeg",
    resumo: "Entenda como uma nutrição rica em alimentos in natura previne doenças crônicas e eleva a imunidade.",
    conteudo: `
      <p>Uma nutrição consciente não se baseia em restrições radicais, mas na consistência de boas escolhas diárias. A comida é combustível para todas as células do corpo e a principal aliada na longevidade.</p>

      <h3>1. Descasque mais, desembale menos</h3>
      <p>Priorizar alimentos in natura e minimamente processados (vegetais, legumes, grãos integrais, frutas e proteínas magras) reduz drasticamente a ingestão de sódio, gorduras saturadas e conservantes artificiais.</p>

      <div class="article-callout">
        <i class="bi bi-heart-pulse-fill text-danger me-2"></i>
        <strong>Prevenção em Foco:</strong> Dietas ricas em fibras reduzem em até 30% o risco de doenças cardiovasculares e auxiliam no controle glicêmico.
      </div>

      <h3>2. Hidratação inteligente</h3>
      <p>A água participa de quase todas as reações químicas do organismo. Manter uma garrafinha por perto e consumir cerca de 35 ml de água por quilo de peso corporal mantém rins saudáveis, pele hidratada e melhora a concentração.</p>

      <h3>3. O prazer de comer com atenção plena</h3>
      <p>Comer sem distrações de smartphones ou televisão permite que os sinais de saciedade sejam percebidos a tempo, prevenindo episódios de compulsão alimentar e melhorando a digestão.</p>
    `
  },
  "atividade-fisica": {
    id: "atividade-fisica",
    categoria: "Artigo • Longevidade Ativa",
    titulo: "Você já se mexeu hoje? Como a rotina de exercícios melhora sua saúde e disposição",
    tempoLeitura: "3 min de leitura",
    imagem: "../img/Exercise.jpeg",
    resumo: "Movimentar o corpo regularmente protege o coração, reduz a ansiedade e aumenta a expectativa de vida.",
    conteudo: `
      <p>O sedentarismo é considerado um dos maiores fatores de risco evitáveis do mundo moderno. A boa notícia é que o corpo humano responde de forma rápida e positiva a qualquer estímulo de movimento consistente.</p>

      <h3>1. A regra dos 150 minutos semanais</h3>
      <p>A Organização Mundial da Saúde (OMS) recomenda ao menos 150 minutos de atividade moderada por semana. Isso equivale a apenas 30 minutos, 5 vezes por semana — o que pode ser uma caminhada rápida, pedalada ou dança.</p>

      <div class="article-callout">
        <i class="bi bi-shield-check text-primary me-2"></i>
        <strong>Benefício Imediato:</strong> A prática de exercícios libera endorfinas e dopamina logo nos primeiros 20 minutos, gerando sensação prolongada de bem-estar.
      </div>

      <h3>2. Fortalecimento muscular protege as articulações</h3>
      <p>Exercícios resistidos (como musculação ou pilates) fortalecem tendões, aumentam a densidade óssea e previnem dores posturais comuns a quem passa muitas horas sentado.</p>

      <h3>3. Encontre uma atividade que você goste</h3>
      <p>A melhor atividade física é aquela que você consegue manter no longo prazo. Escolha modalidades prazerosas e convide amigos ou familiares para tornar o momento ainda mais estimulante.</p>
    `
  },
  "outubro-rosa": {
    id: "outubro-rosa",
    categoria: "Campanha Especial • Saúde da Mulher",
    titulo: "Outubro Rosa: como prevenir o câncer de mama com diagnóstico precoce e rotina de exames",
    tempoLeitura: "4 min de leitura",
    imagem: "../img/outubro-rosa.jpg",
    resumo: "Quando diagnosticado precocemente, o câncer de mama tem mais de 95% de chances de cura. Saiba como se cuidar.",
    conteudo: `
      <p>O <strong>Outubro Rosa</strong> é uma campanha mundial dedicada à conscientização sobre a importância da prevenção e do diagnóstico precoce do câncer de mama e do colo do útero. Informação de qualidade salva vidas.</p>

      <h3>1. O papel fundamental da Mamografia</h3>
      <p>A mamografia é o exame padrão-ouro capaz de detectar microcalcificações e lesões milimétricas muito antes de se tornarem palpáveis. Mulheres a partir dos 40 anos devem realizar o exame anualmente, ou conforme indicação de seu ginecologista ou mastologista.</p>

      <div class="article-callout">
        <i class="bi bi-check2-circle text-success me-2"></i>
        <strong>Mais de 95% de chance de cura:</strong> Quanto mais cedo o nódulo for identificado, menos invasivo é o tratamento e maiores são as chances de cura completa.
      </div>

      <h3>2. Autocuidado e conhecimento do próprio corpo</h3>
      <p>O autoexame das mamas deve ser feito mensalmente para que a mulher conheça a textura e o aspecto natural de suas mamas, permitindo notar alterações como nódulos, secreções ou alterações na pele.</p>

      <h3>3. Hábitos que reduzem o risco</h3>
      <ul>
        <li>Manter o peso corporal adequado com alimentação equilibrada;</li>
        <li>Praticar atividades físicas regularmente;</li>
        <li>Evitar o consumo de bebidas alcoólicas e tabaco;</li>
        <li>Amamentar, quando possível, pois o aleitamento materno é fator protetor.</li>
      </ul>

      <p>Pelo portal Care Plus, você pode agendar sua mamografia e ultrassom de mamas diretamente na aba de <strong>Meus Exames</strong> de forma ágil e prática.</p>
    `
  },
  "novembro-azul": {
    id: "novembro-azul",
    categoria: "Campanha Especial • Saúde Masculina",
    titulo: "Novembro Azul: prevenção ao câncer de próstata e a importância do autocuidado masculino",
    tempoLeitura: "4 min de leitura",
    imagem: "../img/novembro-azul.jpg",
    resumo: "Deixe o preconceito de lado: exames preventivos de rotina são simples, rápidos e essenciais para a vida.",
    conteudo: `
      <p>O <strong>Novembro Azul</strong> reforça a conscientização sobre a saúde do homem, com foco prioritário na prevenção e no combate ao câncer de próstata — o segundo tipo de câncer mais incidente na população masculina.</p>

      <h3>1. Diagnóstico precoce sem tabus</h3>
      <p>O câncer de próstata em estágio inicial costuma ser totalmente silencioso, não apresentando dor nem sintomas urinários. Por essa razão, a consulta periódica com o urologista é a única forma eficaz de detecção preventiva.</p>

      <div class="article-callout">
        <i class="bi bi-info-circle-fill text-primary me-2"></i>
        <strong>Quando iniciar os exames?</strong> A partir dos 50 anos para homens sem histórico na família, ou aos 45 anos para homens negros ou com parentes de primeiro grau que tiveram a doença.
      </div>

      <h3>2. A dupla de exames essenciais</h3>
      <p>A avaliação médica combina o exame de sangue <strong>PSA (Antígeno Prostático Específico)</strong> e o exame clínico de toque retal. Os dois exames se complementam e, juntos, garantem alta precisão diagnóstica.</p>

      <h3>3. Saúde masculina integral</h3>
      <p>Além da próstata, o homem deve monitorar regularmente a pressão arterial, taxas de colesterol, glicemia e a saúde cardiovascular. Cuidar de si é um ato de responsabilidade e amor com quem você ama.</p>
    `
  },
  "saude-crianca": {
    id: "saude-crianca",
    categoria: "Guia Pediátrico • Prevenção Infantil",
    titulo: "Saúde da criança: como prevenir doenças infantis com vacinação em dia e rotina médica",
    tempoLeitura: "4 min de leitura",
    imagem: "../img/saude-crianca.jpg",
    resumo: "Acompanhamento pediátrico preventivo, vacinas e bons hábitos constroem o futuro de uma vida saudável.",
    conteudo: `
      <p>A infância é a fase de formação dos principais sistemas biológicos e hábitos que acompanharão o indivíduo por toda a vida. A prevenção pediátrica é o caminho mais seguro para garantir um crescimento forte e feliz.</p>

      <h3>1. Vacinação: o escudo definitivo</h3>
      <p>Manter a caderneta de vacinação da criança rigorosamente em dia é a medida preventiva mais importante e eficaz da medicina moderna. As vacinas protegem contra doenças graves como meningite, poliomielite, sarampo e pneumonia.</p>

      <div class="article-callout">
        <i class="bi bi-shield-fill-check text-success me-2"></i>
        <strong>Puericultura em Dia:</strong> As consultas de rotina permitem acompanhar ganho de peso, estatura, marco de desenvolvimento motor e linguagem.
      </div>

      <h3>2. Saúde bucal desde os primeiros dentes</h3>
      <p>A visita ao odontopediatra deve começar logo após o nascimento dos primeiros dentinhos de leite. A limpeza e a prevenção de cáries precoces protegem a gengiva e a futura dentição permanente.</p>

      <h3>3. Menos telas, mais movimento e sono</h3>
      <p>Brincadeiras ao ar livre, contato com a natureza e estímulo à leitura fortalecem o sistema imune e a saúde emocional. Recomenda-se evitar telas antes dos 2 anos e limitar a 1 hora por dia para crianças até 5 anos.</p>
    `
  }
};

const STORAGE_KEY_ARTIGOS_LIDOS = "careplus_artigos_lidos";
let artigoAtivoId = null;

function getArtigosLidos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ARTIGOS_LIDOS) || "[]");
  } catch (e) {
    return [];
  }
}

function marcarArtigoComoLido(id) {
  const lidos = getArtigosLidos();
  if (!lidos.includes(id)) {
    lidos.push(id);
    localStorage.setItem(STORAGE_KEY_ARTIGOS_LIDOS, JSON.stringify(lidos));
  }
  atualizarBadgesArtigosLidos();
}

function isArtigoLido(id) {
  return getArtigosLidos().includes(id);
}

function atualizarBadgesArtigosLidos() {
  const lidos = getArtigosLidos();
  document.querySelectorAll(".content-card").forEach((card) => {
    const id = card.getAttribute("data-artigo-id");
    const checkIcon = card.querySelector(".badge-status-leitura");
    if (checkIcon) {
      if (lidos.includes(id)) {
        checkIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success fs-5" title="Conteúdo já concluído"></i>';
      } else {
        checkIcon.innerHTML = '';
      }
    }
  });

  // Atualiza banner de progresso
  const bannerRestantes = document.getElementById("texto-progresso-nivel");
  if (bannerRestantes) {
    const total = Object.keys(ARTIGOS_DATA).length;
    const lidosCount = lidos.length;
    const restantes = Math.max(0, 3 - lidosCount);
    if (restantes > 0) {
      bannerRestantes.innerHTML = `Você está a <span class="fw-bold">${restantes} conteúdo${restantes > 1 ? "s" : ""}</span> para subir para o nível Ouro. Vamos Aprender algo novo hoje?`;
    } else {
      bannerRestantes.innerHTML = `Parabéns, Amanda! Você completou os conteúdos recomendados e alcançou o <span class="fw-bold text-warning">Nível Ouro</span>!`;
    }
  }
}

function abrirArtigo(id) {
  const artigo = ARTIGOS_DATA[id];
  if (!artigo) return;

  artigoAtivoId = id;

  const secaoLista = document.getElementById("secao-lista-artigos");
  const secaoLeitura = document.getElementById("secao-leitura-artigo");
  if (secaoLista) secaoLista.classList.add("d-none");
  if (secaoLeitura) secaoLeitura.classList.remove("d-none");

  // Preenche dados do artigo
  document.getElementById("artigo-header-img").src = artigo.imagem;
  document.getElementById("artigo-categoria").textContent = artigo.categoria;
  document.getElementById("artigo-tempo").innerHTML = `<i class="bi bi-clock me-1"></i> ${artigo.tempoLeitura}`;
  document.getElementById("artigo-titulo").textContent = artigo.titulo;
  document.getElementById("artigo-corpo").innerHTML = artigo.conteudo;

  // Atualiza botão de resgate de Care Coins
  const btnResgate = document.getElementById("btn-concluir-leitura");
  if (btnResgate) {
    if (isArtigoLido(id)) {
      btnResgate.className = "btn btn-success px-4 px-md-5 py-3 rounded-pill fw-bold text-white";
      btnResgate.disabled = true;
      btnResgate.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> Leitura Concluída (+50 XP já resgatados)';
    } else {
      btnResgate.className = "btn btn-brand-primary px-4 px-md-5 py-3 rounded-pill fw-bold text-white";
      btnResgate.disabled = false;
      btnResgate.innerHTML = '<i class="bi bi-award-fill me-2 text-warning fs-5"></i> Concluir Leitura e Ganhar +50 XP';
    }
  }

  // Rola suavemente para o topo do artigo
  window.scrollTo({ top: 120, behavior: "smooth" });
}

function voltarParaLista() {
  artigoAtivoId = null;
  const secaoLista = document.getElementById("secao-lista-artigos");
  const secaoLeitura = document.getElementById("secao-leitura-artigo");
  if (secaoLeitura) secaoLeitura.classList.add("d-none");
  if (secaoLista) secaoLista.classList.remove("d-none");

  atualizarBadgesArtigosLidos();
  window.scrollTo({ top: 120, behavior: "smooth" });
}

function concluirLeituraArtigo() {
  if (!artigoAtivoId) return;

  if (isArtigoLido(artigoAtivoId)) {
    alert("Você já resgatou os pontos deste artigo anteriormente!");
    return;
  }

  // Concede os +50 XP via global.js
  if (typeof window.addScore === "function") {
    window.addScore(50);
  }

  marcarArtigoComoLido(artigoAtivoId);

  const btnResgate = document.getElementById("btn-concluir-leitura");
  if (btnResgate) {
    btnResgate.className = "btn btn-success px-4 px-md-5 py-3 rounded-pill fw-bold text-white";
    btnResgate.disabled = true;
    btnResgate.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> Leitura Concluída (+50 XP Resgatados!)';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarBadgesArtigosLidos();

  // Permite abrir artigo via hash na URL (ex: saber.html#outubro-rosa)
  const hash = window.location.hash.replace("#", "");
  if (hash && ARTIGOS_DATA[hash]) {
    abrirArtigo(hash);
  }
});
