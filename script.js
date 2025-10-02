
const popup = document.getElementById('popupArvore');
const openBtn = document.getElementById('openArvoreBtn');
const fecharBtn = document.getElementById('fecharBtn');

function abrirArvore(){
  if (!popup) return;
  popup.classList.add('open');
  popup.setAttribute('aria-hidden','false');

  setTimeout(drawConnections, 60);
}
function fecharArvore(){
  if (!popup) return;
  popup.classList.remove('open');
  popup.setAttribute('aria-hidden','true');

  const svg = document.getElementById('connections');
  if(svg) svg.innerHTML = '';
}

openBtn && openBtn.addEventListener('click', abrirArvore);
fecharBtn && fecharBtn.addEventListener('click', fecharArvore);

popup && popup.addEventListener('click', (e) => { if(e.target === popup) fecharArvore(); });
window.addEventListener('keydown', (e) => { if(e.key === 'Escape') fecharArvore(); });

const connections = [
  ['python','java'],
  ['python','html'],
  ['java','sql'],
  ['html','css'],
  ['html','js'],
];

function drawConnections(){
  const svg = document.getElementById('connections');
  if(!svg) return;

  svg.innerHTML = '';

  function getCenter(el){
    const r = el.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    return {
      x: r.left + r.width/2 - svgRect.left,
      y: r.top + r.height/2 - svgRect.top,
      w: r.width,
      h: r.height
    };
  }

  connections.forEach(([fromId,toId])=>{
    const a = document.getElementById(fromId);
    const b = document.getElementById(toId);
    if(!a || !b) return;

    const ca = getCenter(a);
    const cb = getCenter(b);

    const dx = cb.x - ca.x;
    const dy = cb.y - ca.y;
    const dist = Math.hypot(dx,dy);
    if(dist === 0) return;
    const ux = dx / dist;
    const uy = dy / dist;

    const ra = (Math.min(ca.w, ca.h) / 2) - 3;
    const rb = (Math.min(cb.w, cb.h) / 2) - 3;

    const x1 = ca.x + ux * ra;
    const y1 = ca.y + uy * ra;
    const x2 = cb.x - ux * rb;
    const y2 = cb.y - uy * rb;

    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', 'conn-line');
    svg.appendChild(line);
  });
}


window.addEventListener('resize', () => { if(popup && popup.classList.contains('open')) drawConnections(); });

const arvore = document.getElementById('arvore');
if(arvore){
  const mo = new MutationObserver(() => {
    if(popup && popup.classList.contains('open')) drawConnections();
  });
  mo.observe(arvore, { attributes: true, childList: false, subtree: true });
}
const mapa = document.querySelector('.arvore-habilidades');

let isDragging = false;
let startX, startY;
let scrollLeft, scrollTop;

mapa.addEventListener('mousedown', (e) => {
  isDragging = true;
  mapa.style.cursor = 'grabbing';
  startX = e.pageX - mapa.offsetLeft;
  startY = e.pageY - mapa.offsetTop;
  scrollLeft = mapa.scrollLeft;
  scrollTop = mapa.scrollTop;
});

mapa.addEventListener('mouseleave', () => {
  isDragging = false;
  mapa.style.cursor = 'grab';
});

mapa.addEventListener('mouseup', () => {
  isDragging = false;
  mapa.style.cursor = 'grab';
});

mapa.addEventListener('mousemove', (e) => {
  if(!isDragging) return;
  e.preventDefault();
  const x = e.pageX - mapa.offsetLeft;
  const y = e.pageY - mapa.offsetTop;
  const walkX = (x - startX) * 1; 
  const walkY = (y - startY) * 1; 
  mapa.scrollLeft = scrollLeft - walkX;
  mapa.scrollTop = scrollTop - walkY;
});

const xpBar = document.querySelector('.xp-bar');
const xpText = document.querySelector('.xp-text');

function atualizarXP(atual, max) {
  const percent = (atual / max) * 100;
  xpBar.style.width = percent + '%';
  xpText.textContent = `${atual} / ${max}`;
}

atualizarXP(60, 100);