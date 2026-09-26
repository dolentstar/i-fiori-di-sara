// Orari (lunedì → domenica), [oraInizio, min, oraFine, min]; fonte: Google e directory
const GIORNI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const H = [[[15, 30, 19, 30]], [[9, 0, 19, 30]], [[9, 0, 19, 30]], [[9, 0, 19, 30]], [[9, 0, 19, 30]], [[9, 0, 19, 30]], []];

const ora = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
const oggi = (ora.getDay() + 6) % 7, min = ora.getHours() * 60 + ora.getMinutes();
const f = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const fascia = H[oggi].find(([a, b, c, d]) => min >= a * 60 + b && min < c * 60 + d);
const dopo = H[oggi].find(([a, b]) => min < a * 60 + b);
let prossimo = null;
for (let i = 1; i <= 7 && !dopo && !prossimo; i++) { const g = (oggi + i) % 7; if (H[g].length) prossimo = [g, H[g][0]]; }
const testo = fascia ? `Aperto ora, fino alle ${f(fascia[2], fascia[3])}` : dopo ? `Chiuso ora, apre alle ${f(dopo[0], dopo[1])}`
  : `Chiuso ora, riapre ${prossimo[0] === (oggi + 1) % 7 ? 'domani' : GIORNI[prossimo[0]].toLowerCase()} alle ${f(prossimo[1][0], prossimo[1][1])}`;
document.querySelectorAll('[data-stato]').forEach(e => { e.classList.add(fascia ? 'aperto' : 'chiuso'); e.textContent = testo; });
const tab = document.getElementById('orari');
if (tab) tab.innerHTML = H.map((sl, i) => `<tr class="${i === oggi ? 'oggi' : ''}"><td>${GIORNI[i]}</td><td>${sl.length ? sl.map(s => f(s[0], s[1]) + '–' + f(s[2], s[3])).join(', ') : 'Chiuso'}</td></tr>`).join('');

// Occasioni: schede accessibili (frecce sinistra/destra)
const tabs = [...document.querySelectorAll('[role=tab]')];
const scegli = t => {
  tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
};
tabs.forEach((t, i) => {
  t.addEventListener('click', () => scegli(t));
  t.addEventListener('keydown', e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; scegli(n); n.focus(); }
  });
});
