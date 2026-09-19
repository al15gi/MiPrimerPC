let productos=[];
let filtro="todos";

async function cargar(){
  try{
    const r=await fetch("productos.json");
    if(!r.ok) throw new Error("productos.json no disponible");
    productos=await r.json();
    render();
  }catch(e){
    document.getElementById("contenedor-productos").innerHTML='<p class="error">Error cargando el catálogo.</p>';
    console.error(e);
  }
}

function esc(t){
 return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function render(){
 const q=document.getElementById("busqueda").value.toLowerCase().trim();
 const lista=productos.filter(p=>{
   const cat=filtro==="todos" || p.grupo===filtro || p.tags.includes(filtro) || (filtro==="economico" && (p.tags.includes("bajo") || p.tags.includes("perifericos") || p.tags.includes("portatil")));
   const texto=(p.nombre+" "+p.categoria+" "+p.desc).toLowerCase();
   return cat && (!q || texto.includes(q));
 });
 const box=document.getElementById("contenedor-productos");
 box.innerHTML="";
 document.getElementById("sin-resultados").hidden=lista.length>0;
 document.getElementById("contador").textContent=lista.length+" productos disponibles";
 document.getElementById("titulo").textContent=filtro==="todos"?"Selección actual":nombreFiltro(filtro);
 lista.forEach(p=>{
   const card=document.createElement("article");
   card.className="tarjeta";
   card.innerHTML=`
    <img src="${p.imagen}" alt="${esc(p.nombre)}" loading="lazy">
    <div class="contenido">
      <span class="tipo">${esc(p.categoria)}</span>
      <h3>${esc(p.nombre)}</h3>
      <strong class="precio">${esc(p.precio)}</strong>
      <p>${esc(p.desc)}</p>
      <a class="comprar" href="${p.enlace}" target="_blank" rel="nofollow sponsored noopener">Ver en Amazon →</a>
    </div>`;
   box.appendChild(card);
 });
}

function nombreFiltro(f){
 const m={economico:"💰 Económico: piezas, periféricos y portátiles",bajo:"💶 Presupuesto bajo",medio:"⚡ Presupuesto medio",alto:"🚀 Presupuesto alto",portatil:"💻 Portátiles",gamer:"🎮 Gaming",perifericos:"⌨️ Periféricos",programacion:"👨‍💻 Programación"};
 return m[f]||"Selección actual";
}

document.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll(".filtro").forEach(b=>{
   b.addEventListener("click",()=>{
     filtro=b.dataset.filtro;
     document.querySelectorAll(".filtro").forEach(x=>x.classList.toggle("activo",x===b));
     render();
     window.scrollTo({top:document.querySelector("main").offsetTop-20,behavior:"smooth"});
   });
 });
 document.getElementById("busqueda").addEventListener("input",render);
 cargar();
});