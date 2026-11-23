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
})();
