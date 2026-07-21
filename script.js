const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(toggle&&nav){
  toggle.addEventListener('click',()=>{
    nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded',nav.classList.contains('is-open'));
  });
}

function parseCSV(text){
  const lines=text.replace(/^\uFEFF/,'').trim().split(/\r?\n/);
  if(!lines.length)return[];
  const headers=lines[0].split(';').map(s=>s.trim());
  return lines.slice(1).filter(Boolean).map(line=>{
    const vals=line.split(';');
    return Object.fromEntries(headers.map((h,i)=>[h,(vals[i]||'').trim()]));
  });
}

const cpieColors=['#8EC14F','#71BDD8','#EFBB3D','#E8DBAE'];
let communeData={};
let communeLayers={};
let selectedCode=null;

function valueOrDash(v){return v===''||v==null?'—':v;}

function selectCommune(code){
  selectedCode=code;
  Object.entries(communeLayers).forEach(([key,layer])=>{
    layer.setStyle({
      color:key===code?'#3C3C3B':'#ffffff',
      weight:key===code?4:2.2,
      fillOpacity:key===code?1:.9
    });
  });
  const d=communeData[code];
  if(!d)return;
  document.querySelector('#map-name').textContent=d.commune;
  document.querySelector('#map-date').textContent=d.date_maj
    ?`Données mises à jour le ${d.date_maj}`
    :'Date de mise à jour non renseignée';
  document.querySelector('#map-species').textContent=valueOrDash(d.nb_especes);
  document.querySelector('#map-roosts').textContent=valueOrDash(d.nb_gites);
  document.querySelector('#map-bats').textContent=valueOrDash(d.nb_individus);
  document.querySelector('#map-buildings').textContent=valueOrDash(d.batiments_prospectes);
  document.querySelector('#map-caves').textContent=valueOrDash(d.cavites_prospectees);
  document.querySelector('#map-nights').textContent=valueOrDash(d.nuits_acoustiques);
}

async function initMap(){
  const target=document.querySelector('#territory-map');
  if(!target||typeof L==='undefined')return;
  try{
    const [csvText,geojson]=await Promise.all([
      fetch('data/donnees-communes.csv',{cache:'no-store'}).then(r=>r.text()),
      fetch('data/communes.geojson',{cache:'no-store'}).then(r=>r.json())
    ]);
    const rows=parseCSV(csvText);
    rows.forEach(d=>communeData[d.code_insee]=d);

    const map=L.map(target,{
      zoomControl:true,
      attributionControl:false,
      scrollWheelZoom:false,
      minZoom:8
    });

    const layer=L.geoJSON(geojson,{
      style:feature=>({
        color:'#ffffff',
        weight:2.2,
        fillColor:cpieColors[Number(feature.properties.color_index)||0],
        fillOpacity:.9
      }),
      onEachFeature:(feature,polygon)=>{
        const code=feature.properties.code_insee;
        communeLayers[code]=polygon;
        polygon.on({
          click:()=>selectCommune(code),
          mouseover:()=>polygon.setStyle({weight:3.5,color:'#3C3C3B'}),
          mouseout:()=>polygon.setStyle({
            weight:selectedCode===code?4:2.2,
            color:selectedCode===code?'#3C3C3B':'#ffffff'
          })
        });
      }
    }).addTo(map);

    geojson.features.forEach(feature=>{
      const p=feature.properties;
      L.marker([p.label_lat,p.label_lon],{
        interactive:false,
        icon:L.divIcon({
          className:'commune-map-label',
          html:`<span>${p.commune}</span>`,
          iconSize:null
        })
      }).addTo(map);
    });

    map.fitBounds(layer.getBounds(),{padding:[25,25]});

    const dates=rows.map(r=>r.date_maj).filter(Boolean).sort();
    if(dates.length){
      document.querySelector('#global-update').textContent=`Dernière mise à jour : ${dates.at(-1)}`;
    }
  }catch(e){
    console.error(e);
    target.innerHTML='<p class="map-load-error">La carte n’a pas pu être chargée. Rechargez la page dans quelques instants.</p>';
  }
}

async function initSpecies(){
  const grid=document.querySelector('#species-grid');
  if(!grid)return;
  try{
    const rows=await fetch('data/especes.json',{cache:'no-store'}).then(r=>r.json());
    grid.innerHTML=rows.map(s=>`<article class="species-card">
      <div class="species-photo-placeholder">Photo à ajouter</div>
      <div class="species-copy">
        <h3><a href="${s.lien_sfepm}" target="_blank" rel="noopener">${s.nom}</a></h3>
        <p><em>${s.scientifique}</em></p>
        <a class="species-link" href="${s.lien_sfepm}" target="_blank" rel="noopener">Voir la monographie SFEPM →</a>
      </div>
    </article>`).join('');
  }catch(e){console.error(e);}
}

initMap();
initSpecies();
