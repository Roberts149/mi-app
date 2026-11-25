(function(){
var $=function(i){return document.getElementById(i)},LS=window.localStorage;
function jget(k,d){try{var v=JSON.parse(LS.getItem(k));return v==null?d:v}catch(e){return d}}
function say(s){var t=$('toast');t.textContent=s;t.classList.add('show');clearTimeout(say.k);say.k=setTimeout(function(){t.classList.remove('show')},2600)}

/* Audio y subtítulos */
var CP=HTMLMediaElement.prototype.canPlayType;
HTMLMediaElement.prototype.canPlayType=function(t){if(/mpegurl/i.test(String(t))&&LS.getItem('mrc.hlsjs')!=='0'&&window.Hls&&window.Hls.isSupported&&window.Hls.isSupported())return '';return CP.call(this,t)};
var OH=window.Hls;
if(OH){var W=function(cfg){var h=new OH(cfg);window.__xh=h;
h.on(OH.Events.AUDIO_TRACKS_UPDATED,function(){var p=LS.getItem('mrc.alang');if(!p)return;for(var i=0;i<h.audioTracks.length;i++)if(h.audioTracks[i].lang===p){h.audioTrack=i;break}});
h.on(OH.Events.SUBTITLE_TRACKS_UPDATED,function(){var p=LS.getItem('mrc.slang');if(!p)return;if(p==='off'){h.subtitleTrack=-1;h.subtitleDisplay=false;return}for(var i=0;i<h.subtitleTracks.length;i++)if(h.subtitleTracks[i].lang===p){h.subtitleTrack=i;h.subtitleDisplay=true;break}});
return h};Object.setPrototypeOf(W,OH);W.prototype=OH.prototype;window.Hls=W}
var DN=null;try{DN=new Intl.DisplayNames(['es'],{type:'language'})}catch(e){}
function nice(t,i,w){var lang=String(t.lang||t.language||'').trim(),nm=String(t.name||t.label||'').trim(),L='';
if(lang&&lang!=='und'&&lang!=='zxx'){try{L=DN?DN.of(lang):''}catch(e){}if(!L||L===lang)L=lang.toUpperCase();else L=L.charAt(0).toUpperCase()+L.slice(1)}
var gen=!nm||/^stream[_ ]?\d+$/i.test(nm)||nm.toLowerCase()===lang.toLowerCase();
if(!L)return gen?w+' '+(i+1):nm;
return L+(!gen&&nm.toLowerCase().indexOf(L.toLowerCase())<0?' · '+nm:'')+' ('+lang+')'}
function cur(){var h=window.__xh;return h&&h.media===$('vid')?h:null}
function sheetT(title,items,pick){var e=$('xpin');if(e)e.remove();
var o=document.createElement('div'),s=document.createElement('div'),h=document.createElement('h3');o.id='xpin';s.className='sheet';h.textContent=title;s.appendChild(h);
items.forEach(function(it){var b=document.createElement('button');b.className='ep s';b.textContent=it.t;b.onclick=function(){o.remove();pick(it.v)};s.appendChild(b)});
o.appendChild(s);o.onclick=function(ev){if(ev.target===o)o.remove()};document.body.appendChild(o)}
function audio(){var v=$('vid'),h=cur(),it=[],i;
if(h&&h.audioTracks&&h.audioTracks.length>1){
for(i=0;i<h.audioTracks.length;i++){var t=h.audioTracks[i];it.push({t:(i===h.audioTrack?'✓ ':'')+nice(t,i,'Audio'),v:i})}
sheetT('Audio',it,function(k){h.audioTrack=k;var l=h.audioTracks[k]&&h.audioTracks[k].lang;if(l)LS.setItem('mrc.alang',l);say('Audio: '+nice(h.audioTracks[k],k,'Audio'))});return}
var a=v.audioTracks;
if(a&&a.length>1){for(i=0;i<a.length;i++)it.push({t:(a[i].enabled?'✓ ':'')+nice(a[i],i,'Audio'),v:i});
sheetT('Audio',it,function(k){for(var j=0;j<a.length;j++)a[j].enabled=(j===k);say('Audio cambiado')});return}
say('Este video no trae otros audios, o su formato no deja cambiarlos aquí')}
function subs(){var v=$('vid'),h=cur(),it=[{t:'Desactivar',v:-1}],i;
if(h&&h.subtitleTracks&&h.subtitleTracks.length){
for(i=0;i<h.subtitleTracks.length;i++){var t=h.subtitleTracks[i];it.push({t:(i===h.subtitleTrack?'✓ ':'')+nice(t,i,'Subtítulos'),v:i})}
sheetT('Subtítulos',it,function(k){h.subtitleTrack=k;h.subtitleDisplay=k>=0;var l=k>=0&&h.subtitleTracks[k]&&h.subtitleTracks[k].lang;LS.setItem('mrc.slang',k<0?'off':(l||''));say(k<0?'Subtítulos apagados':'Subtítulos: '+nice(h.subtitleTracks[k],k,'Subtítulos'))});return}
var tt=[];for(i=0;i<v.textTracks.length;i++){var x=v.textTracks[i];if(x.kind==='subtitles'||x.kind==='captions')tt.push(x)}
if(tt.length){tt.forEach(function(x,j){it.push({t:(x.mode==='showing'?'✓ ':'')+nice(x,j,'Subtítulos'),v:j})});
sheetT('Subtítulos',it,function(k){tt.forEach(function(x,j){x.mode=j===k?'showing':'disabled'});say(k<0?'Subtítulos apagados':'Subtítulos activados')});return}
say('Este video no trae subtítulos, o su formato no deja activarlos aquí')}
var bar=document.querySelector('#pl .bar.b');
function mkb(t,f){var b=document.createElement('button');b.className='s';b.textContent=t;b.onclick=f;return b}
if(bar){bar.appendChild(mkb('🔊 Audio',audio));bar.appendChild(mkb('💬 Subs',subs))}

/* Actualizar listas solas al abrirlas */
var UH=6*3600*1000;
function on(){return LS.getItem('mrc.autoupd')!=='0'}
function srcById(id){var a=jget('mrc.s',[]);for(var i=0;i<a.length;i++)if(a[i].id===id)return a[i];return null}
function check(id){if(!on())return;var s=srcById(id);if(!s||s.type==='f')return;
var last=parseInt(LS.getItem('mrc.upd.'+id)||'0',10);if(Date.now()-last<UH)return;
var n=0,iv=setInterval(function(){n++;if(LS.getItem('mrc.last')!==id){clearInterval(iv);return}
if(!$('vBrowse').classList.contains('hidden')&&/elementos/.test($('st').textContent)){clearInterval(iv);LS.setItem('mrc.upd.'+id,String(Date.now()));$('rf').click()}
else if(n>70)clearInterval(iv)},150)}
var SI=Storage.prototype.setItem;
Storage.prototype.setItem=function(k,v){SI.call(this,k,v);if(k==='mrc.last'&&this===LS)setTimeout(function(){check(v)},0)};
$('rf').addEventListener('click',function(){var id=LS.getItem('mrc.last');if(id)LS.setItem('mrc.upd.'+id,String(Date.now()))});
var ad=$('add'),row=ad&&ad.parentNode;
if(row){var tb=document.createElement('button'),lab=function(){tb.textContent='🔄 Auto-actualizar: '+(on()?'Sí':'No')};tb.className='s';lab();
tb.onclick=function(){LS.setItem('mrc.autoupd',on()?'0':'1');lab();say(on()?'Las listas se actualizan solas cada 6 horas':'Actualización automática apagada')};row.appendChild(tb);
var t2=document.createElement('button'),l2=function(){t2.textContent='🎚 Audio/subs avanzado: '+(LS.getItem('mrc.hlsjs')!=='0'?'Sí':'No')};t2.className='s';l2();
t2.onclick=function(){LS.setItem('mrc.hlsjs',LS.getItem('mrc.hlsjs')!=='0'?'0':'1');l2();say('Se aplica al abrir el siguiente canal')};row.appendChild(t2)}
})();(function(){
var $=function(i){return document.getElementById(i)},LS=window.localStorage,v=$('vid');
if(!v)return;
function say(s){var t=$('toast');t.textContent=s;t.classList.add('show');clearTimeout(say.k);say.k=setTimeout(function(){t.classList.remove('show')},2200)}
var SZ=[['Pequeño',18],['Mediano',24],['Grande',32],['Extra grande',42]];
var st=document.createElement('style');document.head.appendChild(st);
function size(){var i=parseInt(LS.getItem('mrc.ssz')||'1',10);if(!(i>=0&&i<SZ.length))i=1;
st.textContent='video::cue{font-size:'+SZ[i][1]+'px;color:#fff;background:rgba(0,0,0,.65);text-shadow:0 0 4px #000}';return i}
size();
function lift(){var c=this.activeCues;if(!c)return;for(var i=0;i<c.length;i++){try{c[i].snapToLines=true;c[i].line=-4}catch(e){}}}
function hook(t){if(t.__xl)return;t.__xl=1;t.addEventListener('cuechange',lift)}
for(var i=0;i<v.textTracks.length;i++)hook(v.textTracks[i]);
v.textTracks.addEventListener('addtrack',function(e){hook(e.track)});
var bar=document.querySelector('#pl .bar.b');
if(bar){var b=document.createElement('button');b.className='s';b.textContent='Aa Tamaño';
b.onclick=function(){var i=(size()+1)%SZ.length;LS.setItem('mrc.ssz',String(i));size();say('Subtítulos: '+SZ[i][0])};bar.appendChild(b)}
})();(function(){
var $=function(i){return document.getElementById(i)},LS=window.localStorage;
function jget(k,d){try{var v=JSON.parse(LS.getItem(k));return v==null?d:v}catch(e){return d}}
function say(s){var t=$('toast');t.textContent=s;t.classList.add('show');clearTimeout(say.k);say.k=setTimeout(function(){t.classList.remove('show')},2400)}

/* Después de renombrar: reinicio sin intro y sin abrir la última lista */
try{var pa=sessionStorage.getItem('xren');if(pa){sessionStorage.removeItem('xren');LS.setItem('mrc.auto','0');
setTimeout(function(){var s=$('skip');if(s)s.click()},60);
setTimeout(function(){LS.setItem('mrc.auto',pa);var c=$('auto');if(c)c.checked=pa!=='0'},4000)}}catch(e){}

/* Renombrar listas */
function rename(id,name){var e=$('xpin');if(e)e.remove();var o=document.createElement('div');o.id='xpin';
o.innerHTML='<div class="sheet"><h3>Renombrar lista</h3><input id="xrn" maxlength="60" placeholder="Nuevo nombre"><button id="xrs" style="width:100%;margin-top:8px">Guardar</button></div>';
o.onclick=function(ev){if(ev.target===o)o.remove()};document.body.appendChild(o);var inp=$('xrn');inp.value=name;inp.focus();
$('xrs').onclick=function(){var n=inp.value.trim();if(!n){say('Escribe un nombre');return}
var a=jget('mrc.s',[]);for(var i=0;i<a.length;i++)if(a[i].id===id)a[i].name=n.slice(0,60);
try{LS.setItem('mrc.s',JSON.stringify(a));sessionStorage.setItem('xren',LS.getItem('mrc.auto')||'1')}catch(x){}
say('Nombre guardado');setTimeout(function(){location.reload()},500)}}
var sr=$('srcs');
function decorate(){var a=jget('mrc.s',[]);[].forEach.call(sr.children,function(c,i){if(!c.classList.contains('src')||c.querySelector('.xren')||!a[i])return;
var b=document.createElement('button'),id=a[i].id,nm=a[i].name;b.className='s xren';b.textContent='✏';b.onclick=function(){rename(id,nm)};c.appendChild(b)})}
if(sr){new MutationObserver(decorate).observe(sr,{childList:true});decorate()}

/* Restablecer idioma de audio y subtítulos */
var ad=$('add'),row=ad&&ad.parentNode;
function ln(c){try{return new Intl.DisplayNames(['es'],{type:'language'}).of(c)}catch(e){return c}}
if(row){var lb=document.createElement('button'),lab=function(){var a=LS.getItem('mrc.alang'),s=LS.getItem('mrc.slang');
lb.textContent='🌐 Idioma: '+(a||s?'audio '+(a?ln(a):'—')+' · subs '+(s==='off'?'apagados':(s?ln(s):'—')):'sin preferencia')};
lb.className='s';lab();lb.onclick=function(){LS.removeItem('mrc.alang');LS.removeItem('mrc.slang');lab();say('Idioma restablecido')};row.appendChild(lb)}
})();(function(){
var $=function(i){return document.getElementById(i)},LS=window.localStorage,v=$('vid');
if(!v)return;
function jget(k,d){try{var x=JSON.parse(LS.getItem(k));return x==null?d:x}catch(e){return d}}
function say(s){var t=$('toast');t.textContent=s;t.classList.add('show');clearTimeout(say.k);say.k=setTimeout(function(){t.classList.remove('show')},2400)}
function opt(k){return LS.getItem(k)!=='0'}
var st=document.createElement('style');
st.textContent='.card.xdead{display:none!important}.card.xwarn::before{content:"⚠";position:absolute;left:8px;top:4px;color:#e8a76a;z-index:2}';
document.head.appendChild(st);

/* Canales caídos: marcar, saltar y ocultar */
function dk(){return 'mrc.dead.'+LS.getItem('mrc.last')}
function dead(){return jget(dk(),[])}
function setDead(a){try{LS.setItem(dk(),JSON.stringify(a.slice(-400)))}catch(e){}}
function applyDead(){var hide=opt('mrc.hidedead'),a=dead();
[].forEach.call($('grid').children,function(c){var s=c.querySelector('.cm span'),n=s?s.textContent.trim():'',d=a.indexOf(n)>=0;
c.classList.toggle('xdead',d&&hide);c.classList.toggle('xwarn',d&&!hide)})}
new MutationObserver(applyDead).observe($('grid'),{childList:true});
var chain=0,pm=$('pm');
new MutationObserver(function(){if((pm.textContent||'').indexOf('No se pudo reproducir')!==0)return;
var name=($('pt').textContent||'').trim();
setTimeout(function(){if(($('pt').textContent||'').trim()!==name)return;
if(v.readyState>=2&&!v.paused&&v.currentTime>0)return;
if(!/\.m3u8|\.ts(\?|$)/i.test(v.currentSrc||''))return;
var a=dead();if(a.indexOf(name)<0){a.push(name);setDead(a)}applyDead();
if(opt('mrc.autoskip')&&chain<5){chain++;say('Canal no disponible, probando el siguiente…');var b=$('pn');if(b)b.click()}},3500)
}).observe(pm,{childList:true,characterData:true,subtree:true});
v.addEventListener('playing',function(){chain=0;var n=($('pt').textContent||'').trim(),a=dead(),i=a.indexOf(n);if(i>=0){a.splice(i,1);setDead(a);applyDead()}});

/* Siguiente episodio automático */
v.addEventListener('ended',function(){if(!opt('mrc.autonext'))return;
if(!/S\d+\s*E\d+|T\d+\s*E\d+|Cap[ií]tulo|Episod/i.test($('pt').textContent||''))return;
say('Siguiente episodio…');setTimeout(function(){var b=$('pn');if(b)b.click()},1500)});

/* Velocidad de reproducción */
var bar=document.querySelector('#pl .bar.b'),SP=[1,1.25,1.5,2,0.75],si=0,sb=null;
if(bar){sb=document.createElement('button');sb.className='s';sb.textContent='⏩ 1x';
sb.onclick=function(){si=(si+1)%SP.length;v.playbackRate=SP[si];sb.textContent='⏩ '+SP[si]+'x';say('Velocidad '+SP[si]+'x')};bar.appendChild(sb)}
new MutationObserver(function(){si=0;v.playbackRate=1;if(sb)sb.textContent='⏩ 1x'}).observe($('pt'),{childList:true,characterData:true,subtree:true});

/* Ajustes de reproducción (inicio) */
function sheetO(){var e=$('xpin');if(e)e.remove();
var o=document.createElement('div'),s=document.createElement('div'),h=document.createElement('h3');o.id='xpin';s.className='sheet';h.textContent='Reproducción';s.appendChild(h);
[['mrc.autoskip','Saltar al siguiente si un canal falla'],['mrc.hidedead','Ocultar canales caídos'],['mrc.autonext','Siguiente episodio automático']].forEach(function(r){
var b=document.createElement('button'),lab=function(){b.textContent=r[1]+': '+(opt(r[0])?'Sí':'No')};b.className='ep s';lab();
b.onclick=function(){LS.setItem(r[0],opt(r[0])?'0':'1');lab();applyDead()};s.appendChild(b)});
var z=document.createElement('button');z.className='ep s';z.textContent='🧹 Olvidar canales caídos de esta lista';
z.onclick=function(){setDead([]);applyDead();say('Lista de canales caídos vacía')};s.appendChild(z);
o.appendChild(s);o.onclick=function(ev){if(ev.target===o)o.remove()};document.body.appendChild(o)}
var ad=$('add'),row=ad&&ad.parentNode;
if(row){var ob=document.createElement('button');ob.className='s';ob.textContent='⚙ Reproducción';ob.onclick=sheetO;row.appendChild(ob)}
})();
