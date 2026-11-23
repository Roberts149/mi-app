(function(){
var $=function(i){return document.getElementById(i)},LS=window.localStorage;
function jget(k,d){try{var v=JSON.parse(LS.getItem(k));return v==null?d:v}catch(e){return d}}
function say(s){var t=$('toast');t.textContent=s;t.classList.add('show');clearTimeout(say.k);say.k=setTimeout(function(){t.classList.remove('show')},2400)}
var css=document.createElement('style');
css.textContent='.view:not(#vPlayer){box-shadow:inset 0 0 50px #d6b45b14}'
+'.brand{background:linear-gradient(100deg,#8a6420,#f4df9b,#fff6d0,#d6b45b,#8a6420);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:xsh 5s linear infinite}'
+'@keyframes xsh{to{background-position:-250% 0}}'
+'.cm{transition:transform .15s,box-shadow .2s,border-color .2s}'
+'.cm:hover,.cm:focus-visible{transform:scale(1.04);border-color:#f4df9b;box-shadow:0 0 18px #d6b45b66}'
+'.src{box-shadow:0 0 0 1px #d6b45b22,0 6px 20px #0008}'
+'.top{border-bottom:1px solid #d6b45b44}'
+'#pl .bar.b{flex-wrap:wrap}'
+'.xclk{color:#f4df9b;font-size:13px;font-weight:700;letter-spacing:.04em;white-space:nowrap}'
+'.xb{padding:4px 10px;font-size:14px;border-radius:8px}'
+'.xmv{display:flex;gap:6px;justify-content:center;margin-top:4px}'
+'#xpin{position:fixed;inset:0;z-index:45;background:#000c;display:flex;align-items:flex-end;justify-content:center}';
document.head.appendChild(css);

/* Reloj y fecha */
function mk(){var s=document.createElement('span');s.className='xclk';return s}
var ch=mk(),cb=mk(),cp=mk(),hr=document.querySelector('#vHome .row'),rf=$('rf'),pf=$('pf');
ch.style.marginLeft='auto';
if(hr)hr.appendChild(ch);if(rf)rf.parentNode.insertBefore(cb,rf);if(pf)pf.parentNode.insertBefore(cp,pf);
function tick(){var d=new Date(),h=d.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'});
ch.textContent=d.toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'})+' · '+h;cb.textContent=h;cp.textContent=h}
tick();setInterval(tick,20000);

/* Bloqueo con PIN */
var K='mrc.pin',WK='mrc.pw',locked=true,lk=document.createElement('button');
lk.className='s';lk.textContent='🔒';if(rf)rf.parentNode.insertBefore(lk,rf);
function pin(){return LS.getItem(K)||''}
function words(){return jget(WK,[])}
function applyLock(){var on=pin()&&locked,w=words().map(function(x){return x.toLowerCase()});
lk.textContent=pin()&&!locked?'🔓':'🔒';
[].forEach.call(document.querySelectorAll('#chips .chip,#grid .card'),function(e){var h=false;
if(on&&w.length){var t=e.textContent.toLowerCase();h=w.some(function(x){return t.indexOf(x)>=0})}e.style.display=h?'none':''})}
new MutationObserver(applyLock).observe($('grid'),{childList:true});
new MutationObserver(applyLock).observe($('chips'),{childList:true});
function closeX(){var o=$('xpin');if(o)o.remove()}
function sheetX(html){closeX();var o=document.createElement('div');o.id='xpin';o.innerHTML='<div class="sheet">'+html+'</div>';
o.onclick=function(e){if(e.target===o)closeX()};document.body.appendChild(o)}
lk.onclick=function(){
if(!pin()){sheetX('<h3>Crear PIN</h3><p class="muted">Elige un PIN de 4 números. Con él ocultas canales y categorías por palabras.</p><input id="xp1" type="password" inputmode="numeric" maxlength="4" placeholder="PIN de 4 números"><button id="xok" style="width:100%;margin-top:8px">Guardar PIN</button>');
$('xok').onclick=function(){var p=$('xp1').value;if(!/^\d{4}$/.test(p)){say('Escribe 4 números');return}LS.setItem(K,p);locked=false;closeX();say('PIN creado');lk.click()};$('xp1').focus();return}
if(locked){sheetX('<h3>Desbloquear</h3><input id="xp1" type="password" inputmode="numeric" maxlength="4" placeholder="Tu PIN"><button id="xok" style="width:100%;margin-top:8px">Desbloquear</button>');
$('xok').onclick=function(){if($('xp1').value===pin()){locked=false;applyLock();closeX();say('Desbloqueado 🔓')}else say('PIN incorrecto')};$('xp1').focus();return}
sheetX('<h3>Bloqueo</h3><p class="muted">Palabras a ocultar, separadas por coma. Se ocultan los canales y categorías que las contengan.</p><input id="xw" placeholder="ej. adultos, xxx"><button id="xs" style="width:100%;margin-top:8px">Guardar y bloquear</button><button class="s" id="xq" style="width:100%;margin-top:8px">Quitar PIN</button>');
$('xw').value=words().join(', ');
$('xs').onclick=function(){var w=$('xw').value.split(',').map(function(x){return x.trim()}).filter(Boolean);try{LS.setItem(WK,JSON.stringify(w))}catch(e){}locked=true;applyLock();closeX();say('Bloqueado 🔒')};
$('xq').onclick=function(){LS.removeItem(K);applyLock();closeX();say('PIN eliminado')}};
applyLock();

/* Ordenar y renombrar favoritos */
function fk(){return 'mrc.f.'+LS.getItem('mrc.last')}
function mv(i,d){var a=jget(fk(),[]);if(i<0||i>=a.length)return;
if(d===0){var n=prompt('Nombre del favorito',a[i].n);if(n===null)return;n=n.trim();if(!n)return;a[i].n=n}
else{var j=i+d;if(j<0||j>=a.length)return;var t=a[i];a[i]=a[j];a[j]=t}
try{LS.setItem(fk(),JSON.stringify(a))}catch(e){}
var tb=document.querySelector('#tabs [data-t="fav"]');if(tb)tb.click()}
function decorate(){var tb=document.querySelector('#tabs .on');if(!tb||tb.dataset.t!=='fav'||$('q').value)return;
var n=jget(fk(),[]).length;
[].forEach.call($('grid').children,function(c,i){if(c.querySelector('.xmv')||i>=n)return;var d=document.createElement('div');d.className='xmv';
[['◀',-1],['✏',0],['▶',1]].forEach(function(p){var b=document.createElement('button');b.className='s xb';b.textContent=p[0];b.onclick=function(){mv(i,p[1])};d.appendChild(b)});c.appendChild(d)})}
new MutationObserver(decorate).observe($('grid'),{childList:true});

/* Reproductor: saltos, canal anterior y temporizador */
var bar=document.querySelector('#pl .bar.b');if(!bar)return;
function seek(d){var v=$('vid');if(isFinite(v.duration)&&v.duration>0)v.currentTime=Math.max(0,v.currentTime+d);else say('En vivo no se puede adelantar')}
function mkb(t,f){var b=document.createElement('button');b.className='s';b.textContent=t;b.onclick=f;return b}
bar.insertBefore(mkb('⏪10',function(){seek(-10)}),$('pq'));
bar.insertBefore(mkb('10⏩',function(){seek(10)}),$('pn'));
var steps=[15,30,60,90,0],si=4,T=0,iv=0,end=0,btn=mkb('🌙 Dormir',null);btn.id='pk';bar.appendChild(btn);
bar.appendChild(mkb('↩ Anterior',function(){
var r=jget('mrc.r.'+LS.getItem('mrc.last'),[]);if(r.length<2){say('No hay canal anterior');return}
$('px').click();setTimeout(function(){var t=document.querySelector('#tabs [data-t="rec"]');if(t)t.click();
setTimeout(function(){var c=$('grid').children[1],m=c&&c.querySelector('.cm');if(m)m.click()},120)},250)}));
function lab(){var r=Math.max(0,Math.ceil((end-Date.now())/60000));btn.textContent='🌙 '+r+' min'}
function off(){clearTimeout(T);clearInterval(iv);end=0;si=4;btn.textContent='🌙 Dormir'}
function fire(){var v=$('vid');try{v.pause()}catch(e){}off();say('Temporizador: buenas noches 🌙');
if(!$('vPlayer').classList.contains('hidden')){var b=$('px');if(b)b.click()}}
btn.onclick=function(){si=(si+1)%steps.length;var m=steps[si];clearTimeout(T);clearInterval(iv);
if(!m){off();say('Temporizador apagado');return}
end=Date.now()+m*60000;T=setTimeout(fire,m*60000);iv=setInterval(lab,15000);lab();say('Se apagará en '+m+' min 🌙')};
})();(function(){
var $=function(i){return document.getElementById(i)},LS=window.localStorage;
function jget(k,d){try{var v=JSON.parse(LS.getItem(k));return v==null?d:v}catch(e){return d}}
function say(s){var t=$('toast');t.textContent=s;t.classList.add('show');clearTimeout(say.k);say.k=setTimeout(function(){t.classList.remove('show')},2400)}
function fmt(s){var m=Math.floor(s/60),h=Math.floor(m/60);m=m%60;s=Math.floor(s%60);return(h?h+':'+(m<10?'0':''):'')+m+':'+(s<10?'0':'')+s}
var css=document.createElement('style');
css.textContent='@media (min-width:900px){body{font-size:20px}button{padding:16px 24px;font-size:20px}.grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}.cm{min-height:150px;font-size:17px}.cm img{width:80px;height:80px}.brand{font-size:36px}input,select{font-size:20px;padding:16px}.sheet{max-width:820px}}'
+'button:focus-visible,.cm:focus-visible{outline:4px solid #fff1b8;outline-offset:3px;box-shadow:0 0 28px #f4df9bcc}'
+'#xg{position:fixed;inset:0;z-index:45;background:#000d;display:flex;align-items:flex-end;justify-content:center}'
+'#xn{position:fixed;top:calc(16px + env(safe-area-inset-top,0px));right:20px;z-index:46;font:800 44px Georgia,serif;color:#f4df9b;text-shadow:0 0 12px #000;display:none}';
document.head.appendChild(css);

/* Guía de canales y salto por número */
function cards(){return [].filter.call($('grid').children,function(c){return c.style.display!=='none'&&c.querySelector('.cm')})}
function jump(c){var m=c&&c.querySelector('.cm');if(!m)return;
if(!$('vPlayer').classList.contains('hidden')){$('px').click();setTimeout(function(){m.click()},250)}else m.click()}
var pf=$('pf'),gb=document.createElement('button');gb.className='s';gb.textContent='📺 Guía';if(pf)pf.parentNode.insertBefore(gb,pf);
function closeG(){var o=$('xg');if(o)o.remove()}
gb.onclick=function(){var cs=cards();if(!cs.length){say('No hay lista de canales');return}
closeG();var o=document.createElement('div');o.id='xg';
o.innerHTML='<div class="sheet"><h3>Guía de canales</h3><input id="xgq" type="search" placeholder="Buscar…" autocomplete="off"><div id="xgl"></div></div>';
o.onclick=function(e){if(e.target===o)closeG()};document.body.appendChild(o);
var cur=($('pt').textContent||'').trim(),L=$('xgl');
function draw(q){L.textContent='';cs.forEach(function(c,i){var n=(c.querySelector('.cm span')||{}).textContent||'';if(q&&n.toLowerCase().indexOf(q)<0)return;
var b=document.createElement('button');b.className='ep s';b.textContent=(i+1)+'. '+(n===cur?'▶ ':'')+n;b.onclick=function(){closeG();jump(c)};L.appendChild(b);
if(n===cur&&!q)setTimeout(function(){b.scrollIntoView({block:'center'})},50)})}
draw('');$('xgq').oninput=function(){draw(this.value.toLowerCase().trim())}};
var buf='',bt=0,nb=document.createElement('div');nb.id='xn';document.body.appendChild(nb);
document.addEventListener('keydown',function(e){if($('vPlayer').classList.contains('hidden')||!/^[0-9]$/.test(e.key))return;
if(e.target&&e.target.tagName==='INPUT')return;buf=(buf+e.key).slice(-3);nb.textContent=buf;nb.style.display='block';clearTimeout(bt);
bt=setTimeout(function(){var n=parseInt(buf,10),cs=cards();buf='';nb.style.display='none';if(n>=1&&n<=cs.length)jump(cs[n-1]);else say('No existe el canal '+n)},1500)});

/* Inicio más pro: accesos directos y continuar viendo */
var hm=document.createElement('div'),sr=$('srcs');hm.id='xhome';if(sr)sr.parentNode.insertBefore(hm,sr);
function lastSrc(){var id=LS.getItem('mrc.last'),a=jget('mrc.s',[]);for(var i=0;i<a.length;i++)if(a[i].id===id)return{s:a[i],i:i};return null}
function openTab(i,tab,idx){var ch=$('srcs').children[i],b=ch&&ch.querySelector('button:not(.s)');if(!b)return;b.click();var n=0,iv=setInterval(function(){n++;
if(!$('vBrowse').classList.contains('hidden')&&/elementos/.test($('st').textContent)){clearInterval(iv);
var tb=document.querySelector('#tabs [data-t="'+tab+'"]');if(tb)tb.click();
if(idx>=0)setTimeout(function(){var c=$('grid').children[idx],m=c&&c.querySelector('.cm');if(m)m.click()},150)}
else if(n>60)clearInterval(iv)},150)}
function drawHome(){var l=lastSrc();hm.textContent='';if(!l)return;
var r=jget('mrc.r.'+l.s.id,[]),p=jget('mrc.p.'+l.s.id,{}),idx=-1;
for(var i=0;i<r.length;i++)if(r[i].t!=='live'&&p[r[i].k]>10){idx=i;break}
var row=document.createElement('div');row.className='row';row.style.margin='12px 0';
function add(t,f,c){var b=document.createElement('button');if(c)b.className=c;b.textContent=t;b.onclick=f;row.appendChild(b)}
if(idx>=0)add('▶ Continuar: '+r[idx].n.slice(0,28)+' · '+fmt(p[r[idx].k]),function(){openTab(l.i,'rec',idx)});
add('🕘 Recientes',function(){openTab(l.i,'rec',-1)},'s');add('★ Favoritos',function(){openTab(l.i,'fav',-1)},'s');
hm.appendChild(row)}
drawHome();
new MutationObserver(function(){if(!$('vHome').classList.contains('hidden'))drawHome()}).observe($('vHome'),{attributes:true,attributeFilter:['class']});
})();(function(){
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
