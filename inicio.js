;(function(){
var $=function(i){return document.getElementById(i)},vh=$('vHome'),vb=$('vBrowse'),tabs=$('tabs');
if(!vh||!vb||!tabs||$('mini'))return;
var I={home:'M3 11 12 3l9 8M5 10v10h14V10',tv:'M3 7h18v13H3zM8 2l4 5 4-5M10 11l5 3-5 3z',film:'M3 4h18v16H3zM7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4',series:'M6 8h15v12H6zM3 16V4h14',clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l4 2',heart:'M12 20S3 15 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 15 12 20 12 20z',search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM15 15l6 6',layers:'M12 3 2 8l10 5 10-5zM2 13l10 5 10-5',add:'M3 6h13M3 11h13M3 16h7M18 13v8M14 17h8',gear:'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',info:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7v.1'};
var T=[['tv','TV en vivo','Todos los canales','live'],['film','Películas','Tu cine en casa','vod'],['series','Series','Temporadas y capítulos','series'],['clock','Continuar viendo','Donde te quedaste','rec'],['heart','Favoritos','Tus preferidos','fav'],['search','Buscar','Encuentra rápido','q'],['layers','Categorías','Por género','cat'],['add','Agregar listas','Carga tus listas','add']];
var N=[['home','Inicio','','ini']].concat(T,[['gear','Listas y ajustes','','set'],['info','Acerca de','','info']]);
var css='#vBrowse.mnu{padding:0;background:radial-gradient(ellipse at 50% 35%,#3f93db,#1c62ad 60%,#0f427d)}#vBrowse.mnu>:not(#mini){display:none!important}#vBrowse:not(.mnu)>#mini{display:none}'+
'#mini{min-height:100vh;color:#fff;font-family:Oswald,"Arial Narrow",sans-serif;padding-top:env(safe-area-inset-top,0px)}'+
'#mini .mh{position:relative;overflow:hidden;min-height:220px;padding:16px 18px 22px;display:flex;flex-direction:column;justify-content:flex-end;background:#1c62ad url(cascada.jpg) right center/cover;border-bottom:4px solid #ffcb45}'+
'#mini .mh:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0f427d 4%,#0f427daa 45%,#0f427d00 75%)}'+
'#mini .mr{position:absolute;inset:-100px 0 0 45%;opacity:.3;background:repeating-linear-gradient(90deg,#0000 0 13px,#fff 14px,#0000 15px 31px);-webkit-mask:repeating-linear-gradient(180deg,#0000,#000 50px,#0000 100px);animation:mfall .9s linear infinite}@keyframes mfall{to{transform:translateY(100px)}}'+
'#mini .mb{position:relative}#mini h1{margin:0;font-size:clamp(38px,8vw,78px);line-height:.95;color:#ffcb45;text-shadow:0 3px 0 #a8741a,0 5px 10px #0008}#mini h1 span{display:block;font-size:1.3em;color:#fff;text-shadow:0 3px 0 #8fa6c2,0 5px 10px #0008}'+
'#mini .ms{font-family:"Kaushan Script",cursive;color:#fff0b8;font-size:clamp(18px,3vw,28px);text-shadow:0 2px 6px #000a}'+
'#mini .mc{position:absolute;right:14px;top:12px;text-align:right;background:#0f427db0;border:1px solid #ffcb4588;border-radius:14px;padding:6px 14px;font-size:13px}#mini .mc b{display:block;font-size:23px}'+
'#mini .mm{display:grid;gap:16px;padding:16px}#mini nav{order:2;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;background:#0f427d99;border-radius:18px;padding:8px}'+
'#mini button{background:none;color:#fff;border:0;outline:0;font-weight:400}#mini svg{width:1em;height:1em;fill:none;stroke:#ffcb45;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}'+
'#mini nav button{display:flex;align-items:center;gap:10px;padding:7px 12px;border-radius:10px;font-size:14px}#mini nav svg{font-size:20px}'+
'#mini .mg{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-content:start}'+
'#mini .mt{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:136px;padding:12px 8px;border-radius:18px;background:linear-gradient(165deg,#4aa0e6,#1b5fa8 45%,#103f78);box-shadow:inset 0 0 0 2px #ffcb4599,0 8px 18px #06274f88;transition:transform .15s}'+
'#mini .mt svg{font-size:44px;margin-bottom:6px}#mini .mt b{font-size:18px;text-transform:uppercase}#mini .mt small{color:#fff0b8;font-size:13px}'+
'#mini button:focus,#mini button:active{background:linear-gradient(180deg,#fff0b8,#ffcb45 55%,#e0a21f);color:#0d3566}#mini .mt:focus{transform:scale(1.05);box-shadow:0 0 0 3px #fff,0 0 28px #ffcb45}#mini button:focus *,#mini button:active *{color:#0d3566;stroke:#0d3566}'+
'@media(min-width:720px){#mini .mm{grid-template-columns:200px 1fr}#mini nav{order:0;flex-direction:column;flex-wrap:nowrap;justify-content:flex-start;gap:2px}#mini .mg{grid-template-columns:repeat(4,1fr)}#mini .mt{min-height:165px}}'+
'@media(min-width:720px) and (max-height:600px){#mini .mh{min-height:130px;padding-bottom:10px}#mini h1{font-size:36px}#mini .ms{font-size:16px}#mini nav button{padding:2px 10px;font-size:13px}#mini .mt{min-height:112px}#mini .mt svg{font-size:30px}}'+
'@media(max-width:719px){#mini .mc{position:relative;right:auto;top:auto;align-self:flex-end;margin-bottom:10px;font-size:11px;padding:4px 10px}#mini .mc b{font-size:17px}}.src{flex-wrap:wrap}.src .sp{flex:1 1 100%;min-width:0}.src b{overflow-wrap:anywhere}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var f=document.createElement('link');f.rel='stylesheet';f.href='https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Kaushan+Script&display=swap';document.head.appendChild(f);
function ic(k){return '<svg viewBox="0 0 24 24"><path d="'+I[k]+'"/></svg>'}
var m=document.createElement('div');m.id='mini';
m.innerHTML='<div class="mh"><div class="mr"></div><div class="mc"><b></b><span></span></div><div class="mb"><h1>MRCASCADAS<span>IPTV</span></h1><div class="ms">Tu entretenimiento sin límites</div></div></div><div class="mm"><nav>'+
N.map(function(x){return '<button data-a="'+x[3]+'">'+ic(x[0])+'<span>'+x[1]+'</span></button>'}).join('')+'</nav><div class="mg">'+
T.map(function(x){return '<button class="mt" data-a="'+x[3]+'">'+ic(x[0])+'<b>'+x[1]+'</b><small>'+x[2]+'</small></button>'}).join('')+'</div></div>';
vb.insertBefore(m,vb.firstChild);
var inSec=false,fromHome=true;
function first(){var b=m.querySelector('.mt');if(b)b.focus({preventScroll:true})}
function open(){vb.classList.add('mnu');window.scrollTo(0,0);setTimeout(first,80)}
function tab(t){var b=tabs.querySelector('[data-t="'+t+'"]');if(b)b.click()}
function toLists(then){history.back();if(then)setTimeout(then,350)}
function act(a){
if(a==='ini'){first();return}
if(a==='set'){toLists();return}
if(a==='add'){toLists(function(){$('add').click()});return}
if(a==='info'){var t=$('toast');t.textContent='MRCASCADAS IPTV · Tu televisión, a tu manera';t.classList.add('show');setTimeout(function(){t.classList.remove('show')},2600);return}
history.pushState({v:'browse',sec:1},'');inSec=true;vb.classList.remove('mnu');
if(a==='q'){setTimeout(function(){$('q').focus()},100);return}
if(a==='cat'){tab('live');var n=0,iv=setInterval(function(){var c=$('chips').querySelector('button');if(c){c.focus();clearInterval(iv)}else if(++n>40)clearInterval(iv)},250);return}
tab(a);setTimeout(function(){var b=tabs.querySelector('[data-t="'+a+'"]');if(b)b.focus()},150)}
m.addEventListener('click',function(e){var b=e.target.closest('button');if(b)act(b.getAttribute('data-a'))});
var back=$('back');
if(back){var h=document.createElement('button');h.className='s';h.textContent='🏠 Inicio';h.onclick=function(){if(inSec)history.back();else open()};back.parentNode.insertBefore(h,back.nextSibling)}
window.addEventListener('popstate',function(e){var s=e.state;if(!s||s.v!=='browse')return;if(s.sec){inSec=true;vb.classList.remove('mnu')}else if(inSec){inSec=false;open()}});
function sync(){if(!vh.classList.contains('hidden')){fromHome=true;inSec=false;if(vb.classList.contains('mnu'))vb.classList.remove('mnu')}else if(!vb.classList.contains('hidden')&&fromHome){fromHome=false;open()}}
var ob=new MutationObserver(sync);[vh,vb].forEach(function(v){ob.observe(v,{attributes:true,attributeFilter:['class']})});
function reloj(){var d=new Date();m.querySelector('.mc b').textContent=d.toLocaleTimeString('es-MX',{hour:'numeric',minute:'2-digit',hour12:true});m.querySelector('.mc span').textContent=d.toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}
reloj();setInterval(reloj,10000);sync();
})();
