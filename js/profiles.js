/* ── USDI FC — Fiches techniques des joueurs ──
   Utilisé par teams.html (1re fiche seulement) et profiles.html (toutes les fiches).

   Pour ajouter un joueur : ajouter un objet dans PLAYER_SHEETS et déposer sa photo dans img/players/.
   - first / last : prénom(s) et nom (le nom s'affiche en grand, en doré)
   - height       : clé de traduction de la taille (ex. 'sheet.h.kone' → '1,82 m' / '1.82 m' dans js/i18n.js)
   - pos / foot   : clés de traduction du poste et du pied fort
   - number       : dossard (facultatif)
   - video        : lien YouTube (facultatif ; sans lien, pas de bouton vidéo) */
const PLAYER_SHEETS = [
  {
    first: 'Boubacar Junior',
    last: 'KONE',
    photo: 'img/players/boubacar-junior-kone.jpg',
    height: 'sheet.h.kone',
    weight: '80 kg',
    club: 'Espoir de Koumassi',
    pos: 'sheet.pos.cb',
    foot: 'sheet.foot.left',
    video: 'https://youtu.be/XGRyCkb25ys'
  },
  {
    first: 'Konan Arthur',
    last: 'KONAN',
    photo: 'img/players/konan-arthur-konan.jpg',
    height: 'sheet.h.konan',
    weight: '65 kg',
    club: 'EFYM',
    number: 10,
    pos: 'sheet.pos.cam',
    foot: 'sheet.foot.right',
    video: 'https://youtu.be/XJ-_WLQwqW4'
  },
  {
    first: 'Tony',
    last: 'GUEDE',
    photo: 'img/players/tony-guede.jpg',
    height: 'sheet.h.guede',
    weight: '80 kg',
    club: 'Espoir de Koumassi',
    number: 9,
    pos: 'sheet.pos.st',
    foot: 'sheet.foot.right',
    video: 'https://youtu.be/Z0TVw_7T9AQ'
  }
];

/* Position of each role on the pitch (viewBox 105 × 68, play goes left → right) */
const PITCH_SPOTS = {
  'sheet.pos.cb':  { x: 20, y: 34 },
  'sheet.pos.cam': { x: 66, y: 34 },
  'sheet.pos.st':  { x: 86, y: 34 }
};

function pitchSVG(pos) {
  const s = PITCH_SPOTS[pos] || { x: 52.5, y: 34 };
  return `
  <svg class="pf-pitch" viewBox="0 0 105 68" role="img" aria-hidden="true">
    <defs>
      <pattern id="pf-stripes" width="15" height="68" patternUnits="userSpaceOnUse">
        <rect width="7.5" height="68" fill="#123821"/><rect x="7.5" width="7.5" height="68" fill="#0f311c"/>
      </pattern>
    </defs>
    <rect width="105" height="68" fill="url(#pf-stripes)"/>
    <g fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="0.45">
      <rect x="2" y="2" width="101" height="64"/>
      <line x1="52.5" y1="2" x2="52.5" y2="66"/>
      <circle cx="52.5" cy="34" r="9.15"/>
      <rect x="2" y="13.84" width="16.5" height="40.32"/>
      <rect x="2" y="24.84" width="5.5" height="18.32"/>
      <rect x="86.5" y="13.84" width="16.5" height="40.32"/>
      <rect x="97.5" y="24.84" width="5.5" height="18.32"/>
    </g>
    <circle cx="52.5" cy="34" r="0.6" fill="rgba(255,255,255,0.7)"/>
    <!-- FC USDI logo marks our half (we attack left → right) -->
    <clipPath id="pf-logo-clip"><circle cx="37" cy="34" r="8"/></clipPath>
    <image href="img/logo.png" x="29" y="26" width="16" height="16" clip-path="url(#pf-logo-clip)"/>
    <circle cx="37" cy="34" r="8" fill="none" stroke="#D4A017" stroke-width="0.6"/>
    <circle class="pf-spot-ring" cx="${s.x}" cy="${s.y}" r="5" fill="rgba(212,160,23,0.25)"/>
    <circle cx="${s.x}" cy="${s.y}" r="3" fill="#D4A017" stroke="#000" stroke-width="0.6"/>
  </svg>`;
}

function sheetHTML(p) {
  const full = `${p.first} ${p.last}`;
  const videoBtn = p.video
    ? `<a class="pf-video" href="${p.video}" target="_blank" rel="noopener"><i class="fa-brands fa-youtube"></i><span data-i18n="sheet.video">Voir la vidéo</span></a>`
    : '';
  const numberRow = p.number
    ? `<div class="pf-row"><dt data-i18n="sheet.number">Dossard</dt><dd>${p.number}</dd></div>`
    : '';
  return `
  <article class="pf-card">
    <div class="pf-top">
      <div class="pf-info">
        <div class="pf-kicker" data-i18n="sheet.portfolio">Fiche joueur</div>
        <div class="pf-tag" data-i18n="${p.pos}"></div>
        <h3 class="pf-name"><span class="pf-first">${p.first}</span><span class="pf-last">${p.last}</span></h3>
        <dl class="pf-rows">
          <div class="pf-row"><dt data-i18n="sheet.club">Club actuel</dt><dd>${p.club}</dd></div>
          <div class="pf-row"><dt data-i18n="sheet.pos">Poste</dt><dd data-i18n="${p.pos}"></dd></div>
          <div class="pf-row"><dt data-i18n="sheet.foot">Pied fort</dt><dd data-i18n="${p.foot}"></dd></div>
          ${numberRow}
        </dl>
        ${videoBtn}
      </div>
      <div class="pf-photo">
        <img src="${p.photo}" alt="${full}" loading="lazy" onerror="this.remove();" />
        <img class="pf-badge" src="img/logo.png" alt="" aria-hidden="true" />
        ${p.number ? `<span class="pf-number">${p.number}</span>` : ''}
      </div>
    </div>
    <div class="pf-bottom">
      <div class="pf-figs">
        <div class="pf-h" data-i18n="sheet.keyfig">Chiffres clés</div>
        <div class="pf-fig-grid">
          <div><div class="pf-num" data-i18n="${p.height}"></div><div class="pf-lab" data-i18n="sheet.height">Taille</div></div>
          <div><div class="pf-num">${p.weight}</div><div class="pf-lab" data-i18n="sheet.weight">Poids</div></div>
          <div><div class="pf-num" data-i18n="${p.foot}"></div><div class="pf-lab" data-i18n="sheet.foot">Pied fort</div></div>
        </div>
      </div>
      <div class="pf-pitch-box">
        <div class="pf-h" data-i18n="sheet.pitch">Position sur le terrain</div>
        ${pitchSVG(p.pos)}
        <div class="pf-legend">
          <span><i class="pf-dot"></i><span data-i18n="sheet.main">Poste principal</span> : <b data-i18n="${p.pos}"></b></span>
          <span class="pf-dir"><span data-i18n="sheet.dir">Sens du jeu</span> <i class="fa-solid fa-arrow-right-long"></i></span>
        </div>
      </div>
    </div>
  </article>`;
}

/* Render sheets into a container. limit = number of sheets to show (all if omitted). */
function renderSheets(containerId, limit) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const list = limit ? PLAYER_SHEETS.slice(0, limit) : PLAYER_SHEETS;
  el.innerHTML = list.map(sheetHTML).join('');
}
