(function(){
var $=function(i){return document.getElementById(i)},LS=window.localStorage;
function say(s){var t=$('toast');t.textContent=s;t.classList.add('show');clearTimeout(say.k);say.k=setTimeout(function(){t.classList.remove('show')},2600)}
var TH=[['Dorado',null,43],['Azul',180,223],['Rojo',-43,0],['Verde',85,128],['Violeta',235,278]];
var sel=['.view:not(#vPlayer)','#intro','#modal','#xpin','#xg','#pl .bar','#toast','#xbn','#xn'].map(function(s){return 'html[data-xt] '+s}).join(',');
var css=document.createElement('style');
css.textContent=sel+'{filter:hue-rotate(var(--xh,0deg))}'
+'html[data-xt] body{background:radial-gradient(ellipse at top,hsl(var(--xb,43) 40% 11%) 0,#070707 55%)}'
+'#xbn{position:fixed;left:4vw;bottom:calc(120px + env(safe-area-inset-bottom,0px));z-index:20;background:#000b;border:1px solid #d6b45b;color:#f4df9b;font:700 20px Georgia,serif;padding:10px 18px;border-radius:14px;opacity:0;transition:opacity .4s;pointer-events:none;max-width:80vw}'
+'#xbn.on{opacity:1}';
document.head.appendChild(css);

/* Temas de color */
function applyTheme(){var i=parseInt(LS.getItem('mrc.theme')||'0',10)||0;if(i<0||i>=TH.length)i=0;var h=document.documentElement;
if(TH[i][1]===null)h.removeAttribute('data-xt');else{h.setAttribute('data-xt','1');h.style.setProperty('--xh',TH[i][1]+'deg');h.style.setProperty('--xb',TH[i][2])}return i}
applyTheme();

/* Bienvenida con tu nombre */
function nm(){return LS.getItem('mrc.name')||''}
var tg=document.querySelector('#intro .tag');
if(tg&&nm()){var w=document.createElement('p');w.className='tag';w.style.cssText='margin-top:10px;animation-delay:2.6s';w.textContent='BIENVENIDO, '+nm().toUpperCase();tg.parentNode.insertBefore(w,tg.nextSibling)}

/* Copia de seguridad */
function backup(){var o={};for(var i=0;i<LS.length;i++){var k=LS.key(i);if(k&&k.indexOf('mrc.')===0)o[k]=LS.getItem(k)}return JSON.stringify(o)}
function closeB(){var o=$('xpin');if(o)o.remove()}
function sheetB(){closeB();var o=document.createElement('div');o.id='xpin';
o.innerHTML='<div class="sheet"><h3>Copia de seguridad</h3><p class="muted">Guarda tus listas, favoritos y ajustes. La copia incluye usuario y contraseña de tus listas: guárdala solo en un lugar privado.</p><textarea id="xbt" style="width:100%;height:130px;background:#090909;color:#fff;border:1px solid #62512a;border-radius:10px;padding:10px;margin:6px 0;font-size:12px" placeholder="Aquí aparece tu copia, o pega una para restaurar"></textarea><button id="xbc" style="width:100%;margin-top:6px">📋 Copiar mi copia</button><button class="s" id="xbr" style="width:100%;margin-top:8px">♻ Restaurar desde el texto</button><p class="muted">Las listas agregadas desde archivo no entran en la copia: se agregan de nuevo.</p></div>';
o.onclick=function(e){if(e.target===o)closeB()};document.body.appendChild(o);
$('xbc').onclick=function(){var t=$('xbt');t.value=backup();t.select();
try{navigator.clipboard.writeText(t.value).then(function(){say('Copia copiada. Pégala en un lugar seguro')},function(){say('Mantén presionado el texto y copia')})}catch(e){say('Mantén presionado el texto y copia')}};
$('xbr').onclick=function(){var o2;try{o2=JSON.parse($('xbt').value.trim())}catch(e){say('El texto no es una copia válida');return}
var ks=Object.keys(o2||{}).filter(function(k){return k.indexOf('mrc.')===0});if(!ks.length){say('No encontré datos en la copia');return}
ks.forEach(function(k){try{LS.setItem(k,String(o2[k]))}catch(e){}});say('Copia restaurada');setTimeout(function(){location.reload()},900)}}

/* Inicio: nombre, tema y copia */
var h2=document.createElement('div'),x1=$('xhome'),sr=$('srcs');h2.id='xhome2';
if(x1)x1.parentNode.insertBefore(h2,x1);else if(sr)sr.parentNode.insertBefore(h2,sr);
function draw2(){h2.textContent='';
var g=document.createElement('button');g.className='s';g.style.cssText='width:100%;text-align:left;margin:8px 0;font-family:Georgia,serif;font-size:18px';
g.textContent=nm()?'👋 Bienvenido, '+nm()+'  ✏':'👋 Toca aquí para poner tu nombre';
g.onclick=function(){var n=prompt('¿Cómo te llamas?',nm());if(n===null)return;n=n.trim().slice(0,24);if(n)LS.setItem('mrc.name',n);else LS.removeItem('mrc.name');draw2()};
var row=document.createElement('div');row.className='row';row.style.margin='6px 0';
var tb=document.createElement('button');tb.className='s';tb.textContent='🎨 Tema: '+TH[applyTheme()][0];
tb.onclick=function(){var i=((parseInt(LS.getItem('mrc.theme')||'0',10)||0)+1)%TH.length;LS.setItem('mrc.theme',String(i));tb.textContent='🎨 Tema: '+TH[applyTheme()][0]};
var bb=document.createElement('button');bb.className='s';bb.textContent='💾 Copia de seguridad';bb.onclick=sheetB;
row.appendChild(tb);row.appendChild(bb);h2.appendChild(g);h2.appendChild(row)}
draw2();

/* Banner del canal */
function cardsX(){return [].filter.call($('grid').children,function(c){return c.style.display!=='none'&&c.querySelector('.cm')})}
var bn=document.createElement('div'),bt2=0;bn.id='xbn';document.body.appendChild(bn);
new MutationObserver(function(){if($('vPlayer').classList.contains('hidden'))return;var n=($('pt').textContent||'').trim();if(!n)return;
var cs=cardsX(),num='';for(var i=0;i<cs.length;i++){var s=cs[i].querySelector('.cm span');if(s&&s.textContent===n){num=String(i+1);break}}
bn.textContent=(num?num+' · ':'')+n;bn.classList.add('on');clearTimeout(bt2);bt2=setTimeout(function(){bn.classList.remove('on')},4000)}).observe($('pt'),{childList:true,characterData:true,subtree:true});
})();
