const eventos = [
  {
    titulo:    'O Dia que Te Conheci',
    data:      '22/02/26',
    subtitulo: 'Reunião da Mocidade, Central de Hortolândia',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Primeira conversa... pra valer!',
    data:      'xx/xx/xx',
    subtitulo: 'Culto para jovens, Morada do Sol I',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Girassol',
    data:      '08/03/26',
    subtitulo: 'Reunião de Jovens e Café da Manhã, Jardim Alice',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Primeiro Encontro',
    data:      '22/03/26',
    subtitulo: 'Shopping Polo & Parque de Diversões',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Culto com Anciã Rute',
    data:      '29/03/26',
    subtitulo: 'Culto para jovens, M&R Pizzaria',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Segundo Encontro',
    data:      '01/04/26',
    subtitulo: 'Concerto musical, Dvořák. CIAEI.',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Dom Pedro',
    data:      '03/04/26',
    subtitulo: '',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Piquenique no Parque',
    data:      '05/04/26',
    subtitulo: 'Parque Ecológico, Indaiatuba',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Cinema Michael Jackson',
    data:      '',
    subtitulo: '',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Cafeteria - Papo Bíblia',
    data:      '',
    subtitulo: '',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Cinema em casa - O Hobbit',
    data:      '',
    subtitulo: '',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Dona Nice Cozinha 0 Glúten, Campinas',
    data:      '',
    subtitulo: '',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Filmes Star Wars',
    data:      '',
    subtitulo: '',
    descricao: '',
    foto:      null,
  },
  {
    titulo:    'Montar Lego',
    data:      '',
    subtitulo: '',
    descricao: '',
    foto:      null,
  },
];

const btnSim = document.getElementById('btn-sim');
const btnNao = document.getElementById('btn-nao');
const telaIni = document.getElementById('tela-inicial');
const girassol = document.getElementById('girassol');
const pergunta = document.getElementById('pergunta');

const telaList = document.getElementById('tela-listagem');
const girassolTopo = document.getElementById('girassol-topo');
const cardsLista = document.getElementById('cards-lista');

const mensagensSim = [
  'Sim!',
  'Tem certeza?',
  'Certeza absoluta?',
  'Última chance!',
  'Sim, sim, sim!',
  'Aceita logo!',
  '99% dos químicos recomendam',
  'Perdeu a graça. Vota sim logo.',
  'Vai mesmo dizer não!?',
  'Não complica 😤',
  'É literalmente um clique',
  'Não (disfarçado de sim)',
  'Vamo estar facilitando?',
  'Plot twist: você vai clicar em sim',
  'Eu não tenho o dia todo',
  'Vai, Bel Caceteira',
  'POR FAVOR',
  'PELO AMOR DE DEUS',
  'Não seja má, girassol...',
];

let ultimaMensagem = 'Sim!';
function mensagemAleatoria() {
  const disponiveis = mensagensSim.filter(m => m !== ultimaMensagem);
  const nova = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  ultimaMensagem = nova;
  return nova;
}

let naoClicks = 0;
const SIM_W_INICIAL = 200;
const SIM_H_INICIAL = 48;
const CRESCIMENTO   = 0.18;
let simW, simH, simLeft, simTop;

function aplicarBtnSim(w, h, left, top, fs, radius) {
  btnSim.style.width = w      + 'px';
  btnSim.style.height = h      + 'px';
  btnSim.style.left = left   + 'px';
  btnSim.style.top = top    + 'px';
  btnSim.style.fontSize = fs     + 'px';
  btnSim.style.borderRadius = radius + 'px';
  btnSim.style.lineHeight = '1.2';
  btnSim.style.whiteSpace = 'normal';
  btnSim.style.textAlign = 'center';
  btnSim.style.display = 'flex';
  btnSim.style.alignItems = 'center';
  btnSim.style.justifyContent = 'center';
  btnSim.style.padding = '12px 24px';
}

function posicaoInicialSim() {
  const vW = window.innerWidth;
  const vH = window.innerHeight;
  simW = SIM_W_INICIAL;
  simH = SIM_H_INICIAL;
  simLeft = (vW - simW) / 2;
  simTop = vH * 0.56;
  aplicarBtnSim(simW, simH, simLeft, simTop, 18, 999);
}

function posicaoInicialNao() {
  const vW = window.innerWidth;
  const vH = window.innerHeight;
  const nW = 200, nH = 48;
  btnNao.style.width = nW + 'px';
  btnNao.style.left = ((vW - nW) / 2) + 'px';
  btnNao.style.top = (vH * 0.56 + nH + 16) + 'px';
}

function teleportarNao() {
  const margin = 16;
  const nW = btnNao.offsetWidth  || 200;
  const nH = btnNao.offsetHeight || 48;
  const vW = window.innerWidth;
  const vH = window.innerHeight;
  const pad = 24;
  const simR = {
    left: simLeft - pad,
    right: simLeft + simW + pad,
    top: simTop  - pad,
    bottom: simTop  + simH + pad,
  };

  let x, y, tentativas = 0;
  do {
    x = margin + Math.random() * (vW - nW - margin * 2);
    y = margin + Math.random() * (vH - nH - margin * 2);
    tentativas++;
  } while (tentativas < 80 && sobrepoe(x, y, nW, nH, simR));

  if (tentativas >= 80 && sobrepoe(x, y, nW, nH, simR)) {
    btnNao.classList.add('sumindo');
    setTimeout(() => { btnNao.style.display = 'none'; }, 500);
    return;
  }

  btnNao.style.left = x + 'px';
  btnNao.style.top  = y + 'px';
}

function sobrepoe(x, y, w, h, ref) {
  return !(x + w < ref.left || x > ref.right || y + h < ref.top || y > ref.bottom);
}

function clicarNao() {
  naoClicks++;
  btnSim.textContent = mensagemAleatoria();

  const vW = window.innerWidth;
  const vH = window.innerHeight;
  const fator = Math.pow(1 + CRESCIMENTO, naoClicks);

  simW = SIM_W_INICIAL * fator;
  simH = SIM_H_INICIAL * fator;
  simLeft = Math.max(0, (vW - simW) / 2);
  simTop = Math.max(0, (vH - simH) / 2);

  const fs = Math.min(18 * Math.pow(1 + CRESCIMENTO * 0.6, naoClicks), 64);
  const fillRatio = Math.max(simW / vW, simH / vH);
  const radius = Math.max(999 * (1 - fillRatio * 1.2), 0);

  aplicarBtnSim(simW, simH, simLeft, simTop, fs, radius);
  teleportarNao();
}

function clicarSim() {
  btnSim.style.pointerEvents = 'none';
  btnNao.style.pointerEvents = 'none';

  const gRect = girassol.getBoundingClientRect();

  const gVoando = document.createElement('div');
  gVoando.textContent = '🌻';
  gVoando.className = 'sunflower voando';
  gVoando.style.fontSize = '72px';
  gVoando.style.left = gRect.left + 'px';
  gVoando.style.top = gRect.top  + 'px';
  gVoando.style.lineHeight = '1';
  document.body.appendChild(gVoando);

  const destinoFontSize = 36;
  const destinoLeft = window.innerWidth / 2 - destinoFontSize / 2;
  const destinoTop = 20;

  telaIni.classList.add('saindo');
  btnSim.classList.add('sumindo-sim');
  btnNao.classList.add('sumindo');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      gVoando.style.fontSize = destinoFontSize + 'px';
      gVoando.style.left     = destinoLeft + 'px';
      gVoando.style.top      = destinoTop  + 'px';
    });
  });

  setTimeout(() => {
    girassolTopo.style.opacity = '0';
    girassolTopo.classList.add('visivel');

    gVoando.remove();

    requestAnimationFrame(() => {
      girassolTopo.style.transition = 'opacity .25s ease';
      girassolTopo.style.opacity = '1';
    });

    document.body.style.overflow = 'auto';
    telaList.classList.add('visivel');

    const wrappers = document.querySelectorAll('.card-wrapper');
    wrappers.forEach((w, i) => {
      setTimeout(() => w.classList.add('apareceu'), i * 150);
    });
  }, 720);
}

function renderizarCards() {
  cardsLista.innerHTML = '';

  eventos.forEach((ev, idx) => {
    if (idx > 0) {
      const sep = document.createElement('div');
      sep.className = 'separador';
      sep.innerHTML = '<span></span><span></span><span></span>';
      cardsLista.appendChild(sep);
    }

    const lado = idx % 2 === 0 ? 'esquerda' : 'direita';

    const wrapper = document.createElement('div');
    wrapper.className = `card-wrapper ${lado}`;

    const fotoHTML = ev.foto
      ? `<img class="card-foto" src="${ev.foto}" alt="${ev.titulo}" />`
      : `<div class="card-foto-placeholder">🌻</div>`;

    wrapper.innerHTML = `
      <div class="card" id="card-${idx}">
        ${fotoHTML}
        <div class="card-corpo">
          <div class="card-titulo">${ev.titulo}</div>
          <div class="card-data">${ev.data}</div>
          <div class="card-subtitulo">${ev.subtitulo}</div>
        </div>
        <div class="card-descricao">${ev.descricao}</div>
        <div class="card-rodape">
          <button class="chevron" onclick="toggleCard(${idx})" aria-label="Expandir">&#8964;</button>
        </div>
      </div>
    `;

    cardsLista.appendChild(wrapper);
  });
}

function toggleCard(idx) {
  document.getElementById('card-' + idx).classList.toggle('expandido');
}

window.addEventListener('load', () => {
  renderizarCards();
  posicaoInicialSim();
  posicaoInicialNao();
});

window.addEventListener('resize', () => {
  if (naoClicks === 0) {
    posicaoInicialSim();
    posicaoInicialNao();
  }
});