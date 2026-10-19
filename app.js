const CHANNELS=[
{id:"estrellas",name:"Las Estrellas",logo:"✦",region:"mexico",now:"Noticiero En Punto",time:"15:00 – 16:00",next:"16:00 – 17:00 · El Amor Invencible",accent:"#6c5368",stream:""},
{id:"canal5",name:"Canal 5",logo:"5",region:"mexico",now:"Vecinos",time:"15:00 – 16:00",next:"16:00 – 17:00 · Como dice el dicho",accent:"#303030",stream:""},
{id:"azteca",name:"Azteca UNO",logo:"UNO",region:"mexico",now:"Hechos Meridiano",time:"15:00 – 16:00",next:"16:00 – 17:00 · Ventaneando",accent:"#3a4b5b",stream:""},
{id:"foro",name:"FOROtv",logo:"FORO",region:"mexico",now:"Expreso de la Mañana",time:"15:00 – 16:00",next:"16:00 – 17:00 · FORO Global",accent:"#d41425",stream:""},
{id:"nmas",name:"N+",logo:"N+",region:"mexico",now:"Despierta",time:"15:00 – 16:00",next:"16:00 – 17:00 · Noticieros N+",accent:"#df1e36",stream:""},
{id:"telemundo",name:"Telemundo",logo:"T",region:"spanish",now:"Noticias",time:"15:00 – 16:00",next:"16:00 – 17:00 · En Casa",accent:"#391b26",stream:""},
{id:"univision",name:"Univision",logo:"U",region:"spanish",now:"Despierta América",time:"15:00 – 16:00",next:"16:00 – 17:00 · Noticias",accent:"#243c55",stream:""},
{id:"espn",name:"ESPN",logo:"ESPN",region:"world",now:"SportsCenter",time:"15:00 – 16:00",next:"16:00 – 17:00 · Fútbol",accent:"#252c34",stream:""},
{id:"tudn",name:"TUDN",logo:"TUDN",region:"mexico",now:"Línea de 4",time:"15:00 – 16:00",next:"16:00 – 17:00 · Fútbol",accent:"#087d59",stream:""},
{id:"disney",name:"Disney",logo:"Disney",region:"world",now:"Programación infantil",time:"15:00 – 16:00",next:"16:00 – 17:00 · Series",accent:"#0874dc",stream:""}
];
const CATEGORIES=["México","Español","Mundo","Deportes","Noticias","Entretenimiento","Cultura","Infantil","Música"];
const GUIDE=[
["✦","Las Estrellas HD","Noticiero En Punto","El Amor Invencible","La Rosa de Guadalupe"],
["5","Canal 5 HD","Vecinos","Como dice el dicho","La CQ"],
["UNO","Azteca UNO","Hechos Meridiano","Ventaneando","Lo que callamos las mujeres"],
["FORO","FOROtv","Expreso de la Mañana","FORO Global","Las Noticias"],
["N+","N+","Despierta","Noticieros N+","En Punto"]
];

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={selected:"estrellas",favorites:new Set(JSON.parse(localStorage.getItem("tvvidaa.favorites")||"[]")),filter:"all"};

function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.__t);window.__t=setTimeout(()=>el.classList.remove("show"),1800)}
function currentChannel(){return CHANNELS.find(x=>x.id===state.selected)||CHANNELS[0]}

function renderChannels(list){
 const row=$("#channelRow");row.innerHTML="";
 list.forEach(ch=>{
  const b=document.createElement("button");
  b.className="focusable channel-card"+(ch.id===state.selected?" selected":"");
  b.dataset.id=ch.id;b.style.background=`linear-gradient(145deg,${ch.accent},#05090e)`;
  b.innerHTML=`<span class="logo">${ch.logo}</span><small>${ch.name}</small>`;
  b.onclick=()=>selectChannel(ch.id,true);
  row.appendChild(b);
 });
}
function renderCategories(){
 const row=$("#categoryRow");row.innerHTML="";
 CATEGORIES.forEach(name=>{
  const b=document.createElement("button");b.className="focusable category-card";b.innerHTML=`<b>${name}</b>`;
  b.onclick=()=>{if(name==="México")applyFilter("mexico");else if(name==="Español")applyFilter("spanish");else if(name==="Mundo")applyFilter("world");else {renderChannels(CHANNELS);toast("Categoría: "+name)}};
  row.appendChild(b);
 });
}
function renderGuide(){
 const g=$("#guideGrid");g.innerHTML="";
 GUIDE.forEach(r=>{const d=document.createElement("div");d.className="guide-row";d.innerHTML=`<div class="guide-channel"><div class="guide-logo">${r[0]}</div><span>${r[1]}</span></div><div class="programs"><span>${r[2]}</span><span>${r[3]}</span><span>${r[4]}</span></div>`;g.appendChild(d)});
}
function selectChannel(id,play){
 state.selected=id;const ch=currentChannel();
 $$(".channel-card").forEach(x=>x.classList.toggle("selected",x.dataset.id===id));
 $("#heroLogo").textContent=ch.logo;$("#heroName").textContent=ch.name+" HD";$("#heroTime").textContent=ch.time;$("#heroProgram").textContent=ch.now;$("#heroNext").textContent=ch.next;
 $("#heroBg").style.background=`radial-gradient(circle at 73% 44%,${ch.accent} 0,transparent 24%),linear-gradient(160deg,#233a63,#0b1523)`;
 const v=$("#video");
 if(play && ch.stream){
  v.src=ch.stream;v.classList.add("on");v.play().catch(()=>toast("Pulsa OK para iniciar reproducción"));
 }else{v.pause();v.removeAttribute("src");v.classList.remove("on")}
 toast(ch.name+" seleccionado");
}
function applyFilter(filter){
 state.filter=filter;let list=CHANNELS;
 if(["mexico","spanish","world"].includes(filter))list=CHANNELS.filter(x=>x.region===filter);
 if(filter==="favorites"){list=CHANNELS.filter(x=>state.favorites.has(x.id));if(!list.length){toast("Aún no tienes favoritos");list=CHANNELS}}
 renderChannels(list);
}
function toggleFavorite(){
 const ch=currentChannel();
 if(state.favorites.has(ch.id)){state.favorites.delete(ch.id);toast(ch.name+" eliminado de favoritos")}
 else{state.favorites.add(ch.id);toast(ch.name+" agregado a favoritos")}
 localStorage.setItem("tvvidaa.favorites",JSON.stringify([...state.favorites]));
 if(state.filter==="favorites")applyFilter("favorites");
}
function setNavActive(btn){$$(".nav-item").forEach(x=>x.classList.toggle("active",x===btn))}
function openPanel(title,html){
 $("#panelTitle").textContent=title;$("#panelBody").innerHTML=html;$("#overlay").classList.remove("hidden");
 const first=$("#panelBody .focusable")||$("#panelClose");setTimeout(()=>first.focus(),0);
}
function closePanel(){$("#overlay").classList.add("hidden");const active=$(".nav-item.active");if(active)active.focus()}
function openSearch(){
 openPanel("Buscar",`<input id="searchInput" class="focusable search-input" placeholder="Buscar canal..." autocomplete="off"><div id="searchResults" class="result-list"></div>`);
 const input=$("#searchInput");
 const render=q=>{const items=CHANNELS.filter(x=>x.name.toLowerCase().includes(q.toLowerCase()));$("#searchResults").innerHTML=items.map(x=>`<button class="focusable result-btn" data-result="${x.id}"><span>${x.name}</span><b>${x.logo}</b></button>`).join("");$$("[data-result]").forEach(b=>b.onclick=()=>{selectChannel(b.dataset.result,false);closePanel()})};
 render("");input.addEventListener("input",()=>render(input.value));
}
function openSettings(){
 const auto=localStorage.getItem("tvvidaa.autoplay")==="1";
 openPanel("Configuración",`
 <button id="favBtn" class="focusable setting-btn"><span>Favorito del canal actual</span><b>${state.favorites.has(state.selected)?"Quitar ★":"Agregar ☆"}</b></button>
 <button id="autoBtn" class="focusable setting-btn"><span>Autoplay</span><b>${auto?"Activado":"Desactivado"}</b></button>
 <button id="resetBtn" class="focusable setting-btn"><span>Restablecer preferencias</span><b>↺</b></button>`);
 $("#favBtn").onclick=()=>{toggleFavorite();openSettings()};
 $("#autoBtn").onclick=()=>{localStorage.setItem("tvvidaa.autoplay",auto?"0":"1");openSettings()};
 $("#resetBtn").onclick=()=>{localStorage.removeItem("tvvidaa.favorites");localStorage.removeItem("tvvidaa.autoplay");state.favorites.clear();toast("Preferencias restablecidas");closePanel()};
}
$("#panelClose").onclick=closePanel;

$$(".nav-item").forEach(btn=>btn.onclick=()=>{
 setNavActive(btn);const a=btn.dataset.action;
 if(a==="home"||a==="channels")applyFilter("all");
 else if(a==="mexico")applyFilter("mexico");
 else if(a==="spanish")applyFilter("spanish");
 else if(a==="world")applyFilter("world");
 else if(a==="favorites")applyFilter("favorites");
 else if(a==="guide"){$("#guideGrid").scrollIntoView({block:"nearest"});toast("Guía TV")}
 else if(a==="search")openSearch();
 else if(a==="settings")openSettings();
});

function updateClock(){
 const d=new Date();
 $("#clock").textContent=d.toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit",hour12:false});
 $("#date").textContent=d.toLocaleDateString("es-MX",{weekday:"short",day:"2-digit",month:"short",year:"numeric"}).replaceAll(".","");
 $("#guideDate").textContent=d.toLocaleDateString("es-MX",{weekday:"long",day:"2-digit",month:"short"});
 $("#progress").style.width=(d.getMinutes()/60*100)+"%";
}
function focusables(){return $$(".focusable").filter(x=>x.offsetParent!==null)}
function move(dir){
 const els=focusables();if(!els.length)return;
 let cur=document.activeElement;if(!els.includes(cur)){els[0].focus();return}
 const c=cur.getBoundingClientRect();let best=null,score=Infinity;
 els.forEach(el=>{if(el===cur)return;const r=el.getBoundingClientRect();let p,s;
  if(dir==="ArrowRight"&&r.left>=c.right-2){p=r.left-c.right;s=Math.abs(r.top-c.top)}
  else if(dir==="ArrowLeft"&&r.right<=c.left+2){p=c.left-r.right;s=Math.abs(r.top-c.top)}
  else if(dir==="ArrowDown"&&r.top>=c.bottom-2){p=r.top-c.bottom;s=Math.abs(r.left-c.left)}
  else if(dir==="ArrowUp"&&r.bottom<=c.top+2){p=c.top-r.bottom;s=Math.abs(r.left-c.left)}
  else return;const sc=p*3+s;if(sc<score){score=sc;best=el}
 });if(best){best.focus();best.scrollIntoView({block:"nearest",inline:"nearest"})}
}
document.addEventListener("keydown",e=>{
 if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){e.preventDefault();move(e.key);return}
 if(e.key==="Enter"){e.preventDefault();document.activeElement?.click?.();return}
 if(["Escape","Backspace"].includes(e.key)||[8,27,461,10009].includes(e.keyCode)){e.preventDefault();if(!$("#overlay").classList.contains("hidden"))closePanel();else{$('.nav-item[data-action="home"]').focus()};return}
 if(e.key.toLowerCase()==="f"){toggleFavorite()}
});
window.addEventListener("online",()=>$("#netState").textContent="Internet conectado");
window.addEventListener("offline",()=>$("#netState").textContent="Sin conexión");

renderChannels(CHANNELS);renderCategories();renderGuide();selectChannel("estrellas",false);updateClock();setInterval(updateClock,30000);
window.addEventListener("load",()=>$('.nav-item[data-action="home"]').focus());