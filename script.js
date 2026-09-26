// La navata: cinque punti, dall'ingresso all'altare.
(() => {
  const P = {
    1: ['Fuori dalla chiesa', "Si comincia dall'ingresso: le composizioni all'esterno accolgono gli invitati prima ancora di entrare."],
    2: ['I venti banchi', "Un fiore a ogni banco lungo la navata, dall'ingresso fino all'altare: venti in tutto."],
    3: ['Ai lati degli sposi', "Due composizioni accanto alle sedie degli sposi, davanti all'altare."],
    4: ["L'altare", "Una composizione per l'altare, nei colori scelti per il matrimonio."],
    5: ['Il bouquet', 'Il bouquet della sposa, compreso nel pack.']
  };
  const sch = document.getElementById('scheda'), [num, tit, txt] = sch.querySelectorAll('.s-num, h3, .s-txt');
  let cur = 1;
  const vai = n => {
    cur = n;
    num.textContent = `${n} di 5`; tit.textContent = P[n][0]; txt.textContent = P[n][1];
    document.querySelectorAll('.punto').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.p === n)));
    document.querySelectorAll('.pianta [data-p]').forEach(g => g.classList.toggle('acceso', +g.dataset.p === n));
    document.getElementById('avanti').textContent = n === 5 ? 'Torna all\'ingresso' : 'Avanti lungo la navata';
  };
  document.querySelectorAll('.punto').forEach(b => b.addEventListener('click', () => vai(+b.dataset.p)));
  document.getElementById('avanti').addEventListener('click', () => vai(cur === 5 ? 1 : cur + 1));
  vai(1);
})();

// Aperto ora, per ciascun negozio (fuso Europe/Rome). Orari lun→dom.
(() => {
  const G = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const d = (now.getDay() + 6) % 7, m = now.getHours() * 60 + now.getMinutes(), f = (h, n) => `${h}:${String(n).padStart(2, '0')}`;
  document.querySelectorAll('.negozio').forEach(el => {
    const H = JSON.parse(el.dataset.orari);
    const on = H[d].find(s => m >= s[0] * 60 + s[1] && m < s[2] * 60 + s[3]);
    const later = !on && H[d].find(([a, b]) => m < a * 60 + b);
    let next = null; for (let i = 1; i <= 7 && !on && !later && !next; i++) { const g = (d + i) % 7; if (H[g].length) next = [g, H[g][0]]; }
    const t = on ? `Aperto ora, fino alle ${f(on[2], on[3])}` : later ? `Chiuso ora, apre alle ${f(later[0], later[1])}`
      : `Chiuso ora, riapre ${next[0] === (d + 1) % 7 ? 'domani' : G[next[0]]} alle ${f(next[1][0], next[1][1])}`;
    const s = el.querySelector('[data-stato]'); s.textContent = t; s.classList.add(on ? 'aperto' : 'chiuso');
  });
})();
