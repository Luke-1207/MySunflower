(() => {
  const canvas = document.getElementById('buque');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const LARGURA = 520;
  const ALTURA = 610;
  const MARGEM_X = 24;
  const MARGEM_Y = 30;
  const CENTRO_X = 260;
  const LACO_Y = 512;
  const BASE_Y = 600;
  const INTERVALO = 2.7;
  const DURACAO_FLOR = 7.5;
  const PONTOS = 30;
  const DPR_MAX = 2;
  const INTERVALO_QUADRO = 1000 / 32;
  const ESCALA_ASSADA = 2;

  const FLORES = [
    [260, 66, 56], [158, 92, 52], [362, 92, 52], [76, 170, 49], [444, 170, 49],
    [208, 158, 58], [314, 156, 58], [122, 232, 54], [398, 232, 54],
    [260, 236, 64], [52, 268, 44], [468, 268, 44],
    [176, 296, 58], [344, 296, 58], [104, 346, 48], [416, 346, 48],
    [258, 348, 54], [190, 398, 44], [330, 398, 44],
  ];
  const ORDEM = [9, 5, 6, 0, 12, 13, 1, 2, 7, 8, 16, 3, 4, 14, 15, 10, 11, 17, 18];

  const limitar = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const suave = (v) => v * v * (3 - 2 * v);
  const saida = (v) => 1 - Math.pow(1 - v, 3);
  const elastico = (v) => 1 + 2.2 * Math.pow(v - 1, 3) + 1.2 * Math.pow(v - 1, 2);

  function gerador(semente) {
    return () => {
      semente = (semente + 0x6d2b79f5) | 0;
      let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function criarSprite(largura, altura, desenhar) {
    const sprite = document.createElement('canvas');
    sprite.width = largura;
    sprite.height = altura;
    desenhar(sprite.getContext('2d'), largura, altura);
    return sprite;
  }

  function spritePetala(cores, gordura, ponta) {
    return criarSprite(170, 64, (c, l, a) => {
      const meio = a / 2;
      const lado = meio * gordura;
      c.beginPath();
      c.moveTo(2, meio);
      c.bezierCurveTo(l * .22, meio - lado * 1.05, l * .62, meio - lado * 1.08, l - 2, meio + ponta);
      c.bezierCurveTo(l * .62, meio + lado * 1.08, l * .22, meio + lado * 1.05, 2, meio);
      c.closePath();
      const g = c.createLinearGradient(0, 0, l, 0);
      cores.forEach((cor, i) => g.addColorStop(i / (cores.length - 1), cor));
      c.fillStyle = g;
      c.fill();
      c.save();
      c.clip();
      c.lineCap = 'round';
      [-.5, -.22, .22, .5].forEach((d) => {
        c.strokeStyle = 'rgba(176,92,8,.28)';
        c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(8, meio);
        c.quadraticCurveTo(l * .5, meio + lado * d * 1.1, l * .9, meio + lado * d * .5);
        c.stroke();
      });
      c.strokeStyle = 'rgba(160,80,6,.42)';
      c.lineWidth = 2.4;
      c.beginPath();
      c.moveTo(4, meio);
      c.lineTo(l * .86, meio + ponta * .7);
      c.stroke();
      c.restore();
    });
  }

  function spriteDisco() {
    return criarSprite(280, 280, (c, l) => {
      const r = l / 2;
      const fundo = c.createRadialGradient(r, r, 0, r, r, r);
      fundo.addColorStop(0, '#4d3a14');
      fundo.addColorStop(.42, '#3a220e');
      fundo.addColorStop(.8, '#2c170a');
      fundo.addColorStop(.93, '#4a2a0d');
      fundo.addColorStop(1, 'rgba(74,42,13,0)');
      c.fillStyle = fundo;
      c.beginPath();
      c.arc(r, r, r, 0, Math.PI * 2);
      c.fill();
      const total = 620;
      for (let i = 1; i < total; i++) {
        const raio = (r - 8) * Math.sqrt(i / total);
        const angulo = i * 2.39996;
        const p = raio / r;
        const cor = p < .3 ? '#8e9a35' : p < .62 ? '#7a4a14' : p < .84 ? '#b8701a' : '#e0a02c';
        c.fillStyle = cor;
        c.globalAlpha = p < .3 ? .75 : .9;
        c.beginPath();
        c.arc(r + Math.cos(angulo) * raio, r + Math.sin(angulo) * raio, 2 + p * 2.2, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
    });
  }

  function spriteFolha(escuro, claro) {
    return criarSprite(200, 130, (c, l, a) => {
      const meio = a / 2;
      c.beginPath();
      c.moveTo(4, meio);
      c.bezierCurveTo(l * .1, meio - a * .52, l * .55, meio - a * .5, l - 3, meio);
      c.bezierCurveTo(l * .55, meio + a * .5, l * .1, meio + a * .52, 4, meio);
      c.closePath();
      const g = c.createLinearGradient(0, 0, 0, a);
      g.addColorStop(0, claro);
      g.addColorStop(1, escuro);
      c.fillStyle = g;
      c.fill();
      c.clip();
      c.strokeStyle = 'rgba(190,226,140,.5)';
      c.lineWidth = 2.2;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(6, meio);
      c.lineTo(l - 14, meio);
      c.stroke();
      c.lineWidth = 1.2;
      for (let i = 1; i <= 5; i++) {
        const x = l * (i / 6.4);
        const abertura = a * .34 * Math.sin((i / 6) * Math.PI) + 8;
        [-1, 1].forEach((lado) => {
          c.beginPath();
          c.moveTo(x, meio);
          c.quadraticCurveTo(x + 18, meio + lado * abertura * .55, x + 34, meio + lado * abertura);
          c.stroke();
        });
      }
    });
  }

  function spriteSombra() {
    return criarSprite(200, 200, (c, l) => {
      const r = l / 2;
      const g = c.createRadialGradient(r, r, r * .55, r, r, r);
      g.addColorStop(0, 'rgba(24,14,4,.5)');
      g.addColorStop(1, 'rgba(24,14,4,0)');
      c.fillStyle = g;
      c.fillRect(0, 0, l, l);
    });
  }

  const sprites = {
    sombra: spriteSombra(),
    frente: [
      spritePetala(['#d76c08', '#f49a10', '#ffc31f', '#ffdb4d'], .78, 0),
      spritePetala(['#d9700a', '#f7a512', '#ffcb2a', '#ffe366'], .68, 2),
      spritePetala(['#cf6507', '#f09210', '#fdbb1b', '#ffd43c'], .86, -2),
    ],
    fundo: [
      spritePetala(['#a84d05', '#d27c0a', '#eda012', '#f7b81f'], .8, 1),
      spritePetala(['#a04804', '#c9730a', '#e4960f', '#f2ae1a'], .7, -2),
    ],
    sepala: spritePetala(['#2c6229', '#3f8434', '#5ea544', '#79bb54'], .6, 0),
    disco: spriteDisco(),
    folhas: [spriteFolha('#2a5e2c', '#4f9a3f'), spriteFolha('#245428', '#438a38'), spriteFolha('#31682f', '#5ba548')],
  };

  function criarFlores() {
    const flores = FLORES.map(([x, y, raio], indice) => {
      const r = gerador(indice * 97 + 13);
      const inclinacao = limitar(Math.abs(x - CENTRO_X) / 230) * .3 + r() * .1;
      const lacoX = CENTRO_X + (x - CENTRO_X) * .07;
      const baseX = CENTRO_X - (x - CENTRO_X) * .17;
      const ctrlX = CENTRO_X + (x - CENTRO_X) * .3;
      const ctrlY = LACO_Y - (LACO_Y - y) * .6;
      const pontos = [];
      const trechoBase = 5;
      for (let i = 0; i <= trechoBase; i++) {
        const u = i / trechoBase;
        pontos.push({ x: baseX + (lacoX - baseX) * u, y: BASE_Y + (LACO_Y - BASE_Y) * u, s: 0 });
      }
      for (let i = 1; i < PONTOS; i++) {
        const u = i / (PONTOS - 1);
        const v = 1 - u;
        pontos.push({
          x: v * v * lacoX + 2 * v * u * ctrlX + u * u * x,
          y: v * v * LACO_Y + 2 * v * u * ctrlY + u * u * y,
          s: u,
        });
      }
      const folhas = [];
      const quantidade = 2 + Math.floor(r() * 2);
      for (let i = 0; i < quantidade; i++) {
        folhas.push({
          u: .22 + (i / quantidade) * .55 + r() * .08,
          lado: (i + indice) % 2 ? 1 : -1,
          tamanho: 44 + r() * 26,
          sprite: sprites.folhas[Math.floor(r() * sprites.folhas.length)],
          abertura: .75 + r() * .5,
          fase: r() * 6.28,
        });
      }
      const petalas = (quantidade2, deslocamento, grupo, tamanho) =>
        Array.from({ length: quantidade2 }, (_, i) => ({
          angulo: ((i + deslocamento) / quantidade2) * Math.PI * 2 + (r() - .5) * .09,
          comprimento: tamanho * (.9 + r() * .16),
          largura: .24 + r() * .05,
          sprite: grupo[Math.floor(r() * grupo.length)],
          atraso: i / quantidade2,
          fase: r() * 6.28,
        }));
      return {
        x, y, raio, pontos, folhas, inclinacao,
        direcao: Math.atan2(y - 240, x - CENTRO_X),
        rotacao: r() * 6.28,
        fase: x * .011 + r() * 1.2,
        amplitude: 9 + r() * 7,
        inicio: 0,
        petalasFundo: petalas(23, .5, sprites.fundo, 1.02),
        petalasFrente: petalas(21, 0, sprites.frente, .92),
        sepalas: petalas(12, .25, [sprites.sepala], .72),
      };
    });
    ORDEM.forEach((indice, posicao) => {
      flores[indice].inicio = .5 + posicao * INTERVALO;
    });
    return flores;
  }

  const flores = criarFlores();
  const tempoTotal = .5 + (ORDEM.length - 1) * INTERVALO + DURACAO_FLOR;

  function rajada(t) {
    return .72 + .28 * Math.sin(t * .17) * Math.sin(t * .09 + 1.3);
  }

  function ventoDe(flor, t) {
    return (Math.sin(t * .62 - flor.fase) + .45 * Math.sin(t * 1.07 - flor.fase * 1.6)) * rajada(t) * flor.amplitude;
  }

  function posicao(flor, ponto, vento) {
    const curva = Math.pow(ponto.s, 1.7);
    return { x: ponto.x + vento * curva, y: ponto.y + Math.abs(vento) * .12 * curva };
  }

  function amostrar(flor, avanco, vento) {
    const ultimo = flor.pontos.length - 1;
    const exato = avanco * ultimo;
    const i = Math.min(ultimo - 1, Math.floor(exato));
    const f = exato - i;
    const a = flor.pontos[i];
    const b = flor.pontos[i + 1];
    const pa = posicao(flor, a, vento);
    const pb = posicao(flor, b, vento);
    return {
      x: pa.x + (pb.x - pa.x) * f,
      y: pa.y + (pb.y - pa.y) * f,
      angulo: Math.atan2(pb.y - pa.y, pb.x - pa.x),
    };
  }

  function desenharCaule(flor, crescimento, vento) {
    const ultimo = flor.pontos.length - 1;
    const fim = crescimento * ultimo;
    const trechos = [[0, 12, 6], [12, 22, 4.8], [22, ultimo, 3.8]];
    [['#2c5f2b', 1], ['#5fa546', .36]].forEach(([cor, fator]) => {
      ctx.strokeStyle = cor;
      trechos.forEach(([de, ate, grossura]) => {
        if (fim <= de) return;
        ctx.lineWidth = grossura * fator;
        ctx.beginPath();
        const inicio = posicao(flor, flor.pontos[de], vento);
        ctx.moveTo(inicio.x - (fator < 1 ? 1 : 0), inicio.y);
        const limite = Math.min(ate, Math.floor(fim));
        for (let i = de + 1; i <= limite; i++) {
          const p = posicao(flor, flor.pontos[i], vento);
          ctx.lineTo(p.x - (fator < 1 ? 1 : 0), p.y);
        }
        if (fim < ate) {
          const ponta = amostrar(flor, crescimento, vento);
          ctx.lineTo(ponta.x - (fator < 1 ? 1 : 0), ponta.y);
        }
        ctx.stroke();
      });
    });
  }

  function desenharFolhas(flor, crescimento, vento, t) {
    const inicioFolhas = 6 / (flor.pontos.length - 1);
    flor.folhas.forEach((folha) => {
      const avanco = inicioFolhas + (1 - inicioFolhas) * folha.u;
      const abre = limitar((crescimento - avanco) / .3);
      if (abre <= 0) return;
      const ponto = amostrar(flor, avanco, vento);
      const balanco = Math.sin(t * .85 - flor.fase + folha.fase) * .1 + vento * .006;
      const angulo = ponto.angulo + folha.lado * (folha.abertura * saida(abre) + .1) + balanco * folha.lado + balanco * .5;
      const tamanho = folha.tamanho * saida(abre);
      ctx.save();
      ctx.translate(ponto.x, ponto.y);
      ctx.rotate(angulo);
      ctx.scale(1, folha.lado);
      ctx.drawImage(folha.sprite, 0, -tamanho * .3, tamanho, tamanho * .6);
      ctx.restore();
    });
  }

  function desenharPetalas(alvo, lista, raioBase, raio, abertura, ondulacao, t, flor) {
    for (const p of lista) {
      const abre = limitar((abertura - p.atraso * .45) / .55);
      if (abre <= 0) continue;
      const forma = elastico(abre);
      const fechada = 1 - saida(abre);
      const tremor = Math.sin(t * 1.15 + p.fase - flor.fase) * ondulacao;
      const comprimento = raio * p.comprimento * forma * (1 + tremor * .35);
      const largura = raio * p.largura * (.45 + .55 * forma) * 2;
      alvo.save();
      alvo.rotate(p.angulo + tremor * .55 + fechada * .35);
      alvo.drawImage(p.sprite, raioBase * .82, -largura / 2, comprimento, largura);
      alvo.restore();
    }
  }

  function desenharFundo(alvo, flor, raioDisco, botao, abertura, t) {
    const raio = flor.raio;
    const raioSombra = raio * 1.22 * saida(abertura);
    if (raioSombra > 0) alvo.drawImage(sprites.sombra, -raioSombra, -raioSombra + 5, raioSombra * 2, raioSombra * 2);
    desenharPetalas(alvo, flor.sepalas, raioDisco * .6, raio * (.5 + .5 * abertura), Math.max(botao, .4), 0, t, flor);
    desenharPetalas(alvo, flor.petalasFundo, raioDisco, raio, abertura, 0, t, flor);
  }

  function assarFundo(flor) {
    const meio = Math.ceil(flor.raio * 1.65);
    const lado = meio * 2 * ESCALA_ASSADA;
    flor.fundoAssado = criarSprite(lado, lado, (c) => {
      c.translate(lado / 2, lado / 2);
      c.scale(ESCALA_ASSADA, ESCALA_ASSADA);
      desenharFundo(c, flor, flor.raio * .42, 1, 1, 0);
    });
    flor.meioAssado = meio;
  }

  function desenharCabeca(flor, x, y, botao, abertura, vento, t) {
    const raio = flor.raio;
    const escala = .3 + .7 * botao;
    const raioDisco = raio * .42 * (.42 + .58 * saida(abertura));
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(vento * .0075);
    ctx.rotate(flor.direcao);
    ctx.scale(1 - flor.inclinacao, 1);
    ctx.rotate(-flor.direcao);
    ctx.rotate(flor.rotacao + Math.sin(t * .4 - flor.fase) * .025);
    ctx.scale(escala, escala);
    if (abertura >= 1) {
      if (!flor.fundoAssado) assarFundo(flor);
      const meio = flor.meioAssado;
      ctx.drawImage(flor.fundoAssado, -meio, -meio, meio * 2, meio * 2);
    } else {
      desenharFundo(ctx, flor, raioDisco, botao, abertura, t);
    }
    desenharPetalas(ctx, flor.petalasFrente, raioDisco, raio, limitar(abertura * 1.12 - .12), .05, t, flor);
    ctx.drawImage(sprites.disco, -raioDisco, -raioDisco, raioDisco * 2, raioDisco * 2);
    ctx.restore();
  }

  function desenharLaco(presenca, t) {
    if (presenca <= 0) return;
    const balanco = Math.sin(t * .7) * 3;
    const pontas = [[-1, 58, 62], [1, 62, 54]];
    ctx.save();
    ctx.translate(CENTRO_X, LACO_Y + 2);
    ctx.scale(saida(presenca), saida(presenca));
    ctx.lineJoin = 'round';
    pontas.forEach(([lado, comprimento, abertura]) => {
      ctx.fillStyle = '#c9a41c';
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.bezierCurveTo(lado * 12, 26, lado * (abertura * .5 + balanco), comprimento * .62, lado * abertura * .78 + balanco * 1.6, comprimento);
      ctx.lineTo(lado * abertura * .78 + lado * 6 + balanco * 1.6, comprimento - 14);
      ctx.lineTo(lado * abertura * .78 + lado * 18 + balanco * 1.6, comprimento - 8);
      ctx.bezierCurveTo(lado * (abertura * .6 + balanco), comprimento * .5, lado * 24, 22, 0, 0);
      ctx.fill();
    });
    [-1, 1].forEach((lado) => {
      const g = ctx.createLinearGradient(0, 0, lado * 46, 0);
      g.addColorStop(0, '#b8921a');
      g.addColorStop(.5, '#f0cf3c');
      g.addColorStop(1, '#ddb829');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(lado * 18, -30, lado * 52, -28 + balanco, lado * 50, -3 + balanco * .5);
      ctx.bezierCurveTo(lado * 50, 14 + balanco, lado * 20, 16, 0, 0);
      ctx.fill();
    });
    const g = ctx.createLinearGradient(-22, 0, 22, 0);
    g.addColorStop(0, '#b8921a');
    g.addColorStop(.5, '#f6da4e');
    g.addColorStop(1, '#b8921a');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(-21, -10, 42, 20, 5);
    ctx.fill();
    ctx.restore();
  }

  function desenharBrilho(presenca) {
    if (presenca <= 0) return;
    const g = ctx.createRadialGradient(CENTRO_X, 230, 20, CENTRO_X, 230, 290);
    g.addColorStop(0, `rgba(255,190,40,${.16 * presenca})`);
    g.addColorStop(.6, `rgba(255,170,20,${.06 * presenca})`);
    g.addColorStop(1, 'rgba(255,170,20,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-MARGEM_X, -MARGEM_Y, LARGURA + MARGEM_X * 2, ALTURA + MARGEM_Y * 2);
  }

  function desenhar(t) {
    const escala = canvas.width / (LARGURA + MARGEM_X * 2);
    ctx.setTransform(escala, 0, 0, escala, MARGEM_X * escala, MARGEM_Y * escala);
    ctx.clearRect(-MARGEM_X, -MARGEM_Y, LARGURA + MARGEM_X * 2, ALTURA + MARGEM_Y * 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    desenharBrilho(suave(limitar(t / tempoTotal)));

    const ativas = [];
    for (const flor of flores) {
      const p = limitar((t - flor.inicio) / DURACAO_FLOR);
      if (p > 0) ativas.push({ flor, p, vento: ventoDe(flor, t) * limitar(p * 1.6) });
    }
    for (const { flor, p, vento } of ativas) {
      const crescimento = suave(limitar(p / .62));
      desenharCaule(flor, crescimento, vento);
      desenharFolhas(flor, crescimento, vento, t);
    }
    desenharLaco(limitar((t - tempoTotal + 1.5) / 2.5), t);
    for (const { flor, p, vento } of ativas) {
      const crescimento = suave(limitar(p / .62));
      const botao = saida(limitar((p - .12) / .55));
      const abertura = suave(limitar((p - .55) / .45));
      const ponta = amostrar(flor, crescimento, vento);
      desenharCabeca(flor, ponta.x, ponta.y, botao, abertura, vento, t);
    }
  }

  function ajustarTamanho() {
    const caixa = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
    const largura = Math.round(caixa.width * dpr);
    const altura = Math.round(caixa.height * dpr);
    if (largura && (canvas.width !== largura || canvas.height !== altura)) {
      canvas.width = largura;
      canvas.height = altura;
    }
  }

  let tempo = 0;
  let anterior = null;
  let quadro = null;

  function animar(agora) {
    quadro = requestAnimationFrame(animar);
    if (anterior !== null && agora - anterior < INTERVALO_QUADRO) return;
    if (anterior !== null) tempo += Math.min((agora - anterior) / 1000, .25);
    anterior = agora;
    desenhar(tempo);
  }

  function ligar() {
    if (quadro === null) {
      anterior = null;
      quadro = requestAnimationFrame(animar);
    }
  }

  function desligar() {
    if (quadro !== null) {
      cancelAnimationFrame(quadro);
      quadro = null;
    }
  }

  ajustarTamanho();
  new ResizeObserver(ajustarTamanho).observe(canvas);
  new IntersectionObserver(([entrada]) => {
    if (entrada.isIntersecting) ligar();
    else desligar();
  }, { threshold: .08 }).observe(canvas);
})();
