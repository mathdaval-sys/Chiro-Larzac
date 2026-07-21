const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');if(toggle&&nav){toggle.addEventListener('click',()=>{nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',nav.classList.contains('is-open'));});}
function parseCSV(text){const lines=text.replace(/^﻿/,'').trim().split(/?
/);if(!lines.length)return[];const headers=lines[0].split(';').map(s=>s.trim());return lines.slice(1).filter(Boolean).map(line=>{const vals=line.split(';');return Object.fromEntries(headers.map((h,i)=>[h,(vals[i]||'').trim()]));});}
let communeData={};let communeGroups={};
const cpieColors=['#8EC14F','#71BDD8','#EFBB3D','#E8DBAE'];
const communeLayout=[
{id:'vissec',x:125,y:100,lines:['Vissec'],color:0},
{id:'le-cros',x:260,y:100,lines:['Le Cros'],color:1},
{id:'sorbs',x:395,y:100,lines:['Sorbs'],color:2},
{id:'saint-felix',x:530,y:100,lines:['Saint-Félix-de-','l’Héras'],color:3},
{id:'saint-michel',x:665,y:100,lines:['Saint-Michel-','d’Alajou'],color:0},
{id:'le-caylar',x:190,y:210,lines:['Le Caylar'],color:2},
{id:'les-rives',x:325,y:210,lines:['Les Rives'],color:3},
{id:'saint-maurice',x:460,y:210,lines:['Saint-Maurice-','Navacelles'],color:0},
{id:'romiguieres',x:595,y:210,lines:['Romiguières'],color:1},
{id:'la-vacquerie',x:730,y:210,lines:['La Vacquerie-et-','Saint-Martin-de-','Castries'],color:2},
{id:'pegairolles',x:210,y:325,lines:['Pégairolles-de-','l’Escalette'],color:0},
{id:'saint-pierre',x:345,y:325,lines:['Saint-Pierre-','de-la-Fage'],color:1},
{id:'lauroux',x:480,y:325,lines:['Lauroux'],color:2},
{id:'saint-jean-bueges',x:615,y:325,lines:['Saint-Jean-de-','Buèges'],color:3},
{id:'soubes',x:175,y:440,lines:['Soubès'],color:2},
{id:'fozieres',x:310,y:440,lines:['Fozières'],color:3},
{id:'soumont',x:445,y:440,lines:['Soumont'],color:0},
{id:'saint-etienne',x:580,y:440,lines:['Saint-Étienne-','de-Gourgas'],color:1},
{id:'saint-privat',x:715,y:440,lines:['Saint-Privat'],color:2},
{id:'les-plans',x:245,y:555,lines:['Les Plans'],color:0},
{id:'poujols',x:380,y:555,lines:['Poujols'],color:1},
{id:'arboras',x:515,y:555,lines:['Arboras'],color:3},
{id:'saint-jean-blaquiere',x:650,y:555,lines:['Saint-Jean-de-','la-Blaquière'],color:0},
{id:'saint-saturnin',x:785,y:555,lines:['Saint-Saturnin-','de-Lucian'],color:1}
];
function valueOrDash(v){return v===''||v==null?'—':v;}
function selectCommune(id){Object.entries(communeGroups).forEach(([key,group])=>{group.classList.toggle('is-active',key===id);});const d=communeData[id];if(!d)return;document.querySelector('#map-name').textContent=d.commune;document.querySelector('#map-date').textContent=d.date_maj?`Données mises à jour le ${d.date_maj}`:'Date de mise à jour non renseignée';document.querySelector('#map-species').textContent=valueOrDash(d.nb_especes);document.querySelector('#map-roosts').textContent=valueOrDash(d.nb_gites);document.querySelector('#map-bats').textContent=valueOrDash(d.nb_individus);document.querySelector('#map-buildings').textContent=valueOrDash(d.batiments_prospectes);document.querySelector('#map-caves').textContent=valueOrDash(d.cavites_prospectees);document.querySelector('#map-nights').textContent=valueOrDash(d.nuits_acoustiques);}
function hexPoints(cx,cy,w=120,h=86){const hw=w/2, hh=h/2;return [[cx-hw*0.72,cy-hh],[cx+hw*0.72,cy-hh],[cx+hw,cy],[cx+hw*0.72,cy+hh],[cx-hw*0.72,cy+hh],[cx-hw,cy]].map(p=>p.join(',')).join(' ');}
function buildMap(){const target=document.querySelector('#territory-map');if(!target)return;const svgParts=[`<svg viewBox="0 0 920 660" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`];
communeLayout.forEach(c=>{const fill=cpieColors[c.color%cpieColors.length];const lines=c.lines||[c.id];const lineHeight=15;const startY=c.y-(lines.length-1)*lineHeight/2+4;const tspans=lines.map((line,i)=>`<tspan x="${c.x}" y="${startY+i*lineHeight}">${line}</tspan>`).join('');svgParts.push(`<g class="commune-group" data-id="${c.id}" tabindex="0" role="button" aria-label="${lines.join(' ')}"><polygon class="commune-shape" points="${hexPoints(c.x,c.y)}" fill="${fill}"/><text class="commune-label" text-anchor="middle">${tspans}</text></g>`);});
svgParts.push('</svg>');target.innerHTML=svgParts.join('');target.querySelectorAll('.commune-group').forEach(g=>{const id=g.dataset.id;communeGroups[id]=g;g.addEventListener('click',()=>selectCommune(id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectCommune(id);}});});}
async function initMap(){const target=document.querySelector('#territory-map');if(!target)return;try{const rows=parseCSV(await (await fetch('data/donnees-communes.csv',{cache:'no-store'})).text());rows.forEach(d=>communeData[d.id]=d);buildMap();const dates=rows.map(r=>r.date_maj).filter(Boolean).sort();if(dates.length)document.querySelector('#global-update').textContent=`Dernière mise à jour : ${dates.at(-1)}`;}catch(e){console.error(e);target.innerHTML='<p class="map-load-error">La carte n’a pas pu être chargée. Rechargez la page dans quelques instants.</p>';}}
async function initSpecies(){const grid=document.querySelector('#species-grid');if(!grid)return;try{const rows=await (await fetch('data/especes.json',{cache:'no-store'})).json();grid.innerHTML=rows.map(s=>`<article class="species-card"><div class="species-photo-placeholder">Photo à ajouter</div><div class="species-copy"><h3><a href="${s.lien_sfepm}" target="_blank" rel="noopener">${s.nom}</a></h3><p><em>${s.scientifique}</em></p><a class="species-link" href="${s.lien_sfepm}" target="_blank" rel="noopener">Voir la monographie SFEPM →</a></div></article>`).join('');}catch(e){console.error(e);}}
initMap();initSpecies();
