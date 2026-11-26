(() => {
  const player = document.getElementById('player');
  if (!player) return;

  const audio = document.getElementById('player-audio');
  const btn = document.getElementById('player-play');
  const barra = document.getElementById('player-barra');
  const progresso = document.getElementById('player-progresso');
  const atualEl = document.getElementById('player-atual');
  const totalEl = document.getElementById('player-total');

  let arrastando = false;

  const formatar = (seg) => {
    if (!isFinite(seg)) return '0:00';
    const m = Math.floor(seg / 60);
    const s = Math.floor(seg % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const desenhar = (tempo) => {
    const pct = audio.duration ? (tempo / audio.duration) * 100 : 0;
    progresso.style.width = pct + '%';
    atualEl.textContent = formatar(tempo);
    barra.setAttribute('aria-valuenow', Math.round(pct));
  };

  const tempoNoPonto = (clientX) => {
    const r = barra.getBoundingClientRect();
    const frac = Math.min(Math.max((clientX - r.left) / r.width, 0), 1);
    return frac * (audio.duration || 0);
  };

  btn.addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
  });

  audio.addEventListener('play', () => {
    player.classList.add('tocando');
    btn.setAttribute('aria-label', 'Pausar');
  });
  audio.addEventListener('pause', () => {
    player.classList.remove('tocando');
    btn.setAttribute('aria-label', 'Tocar');
  });
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    desenhar(0);
  });
  const mostrarTotal = () => { totalEl.textContent = formatar(audio.duration); };
  audio.addEventListener('loadedmetadata', mostrarTotal);
  audio.addEventListener('durationchange', mostrarTotal);
  if (audio.readyState >= 1) mostrarTotal();
  audio.addEventListener('timeupdate', () => {
    if (!arrastando) desenhar(audio.currentTime);
  });

  barra.addEventListener('pointerdown', (e) => {
    if (!audio.duration) return;
    arrastando = true;
    barra.setPointerCapture(e.pointerId);
    desenhar(tempoNoPonto(e.clientX));
  });
  barra.addEventListener('pointermove', (e) => {
    if (arrastando) desenhar(tempoNoPonto(e.clientX));
  });
  const soltar = (e) => {
    if (!arrastando) return;
    arrastando = false;
    audio.currentTime = tempoNoPonto(e.clientX);
  };
  barra.addEventListener('pointerup', soltar);
  barra.addEventListener('pointercancel', soltar);

  barra.addEventListener('keydown', (e) => {
    if (!audio.duration) return;
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
    if (e.key === 'ArrowLeft') audio.currentTime = Math.max(audio.currentTime - 5, 0);
  });
})();
