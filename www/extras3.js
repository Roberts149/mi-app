(function(){
var $=function(i){return document.getElementById(i)},LS=window.localStorage;
function jget(k,d){try{var v=JSON.parse(LS.getItem(k));return v==null?d:v}catch(e){return d}}
function say(s){var t=$('toast');t.textContent=s;t.classList.add('show');clearTimeout(say.k);say.k=setTimeout(function(){t.classList.remove('show')},2600)}

/* Audio y subtítulos */
var OH=window.Hls;
if(OH){var W=function(cfg){var h=new OH(cfg);window.__xh=h;return h};Object.setPrototypeOf(W,OH);W.prototype=OH.prototype;window.Hls=W}
function cur(){var h=window.__xh;return h&&h.media===$('vid')?h:null}
function sheetT(title,items,pick){var e=$('xpin');if(e)e.remove();
var o=document.createElement('div'),s=document.createElement('div'),h=document.createElement('h3');o.id='xpin';s.className='sheet';h.textContent=title;s.appendChild(h);
items.forEach(function(it){var b=document.createElement('button');b.className='ep s';b.textContent=it.t;b.onclick=function(){o.remove();pick(it.v)};s.appendChild(b)});
o.appendChild(s);o.onclick=function(ev){if(ev.target===o)o.remove()};document.body.appendChild(o)}
function audio(){var v=$('vid'),h=cur(),it=[],i;
if(h&&h.audioTracks&&h.audioTracks.length>1){
for(i=0;i<h.audioTracks.length;i++){var t=h.audioTracks[i];it.push({t:(i===h.audioTrack?'✓ ':'')+(t.name||t.lang||'Audio '+(i+1)),v:i})}
sheetT('Audio',it,function(k){h.audioTrack=k;say('Audio cambiado')});return}
var a=v.audioTracks;
if(a&&a.length>1){for(i=0;i<a.length;i++)it.push({t:(a[i].enabled?'✓ ':'')+(a[i].label||a[i].language||'Audio '+(i+1)),v:i});
sheetT('Audio',it,function(k){for(var j=0;j<a.length;j++)a[j].enabled=(j===k);say('Audio cambiado')});return}
say('Este video no trae otros audios, o su formato no deja cambiarlos aquí')}
function subs(){var v=$('vid'),h=cur(),it=[{t:'Desactivar',v:-1}],i;
if(h&&h.subtitleTracks&&h.subtitleTracks.length){
for(i=0;i<h.subtitleTracks.length;i++){var t=h.subtitleTracks[i];it.push({t:(i===h.subtitleTrack?'✓ ':'')+(t.name||t.lang||'Subtítulos '+(i+1)),v:i})}
sheetT('Subtítulos',it,function(k){h.subtitleTrack=k;h.subtitleDisplay=k>=0;say(k<0?'Subtítulos apagados':'Subtítulos activados')});return}
var tt=[];for(i=0;i<v.textTracks.length;i++){var x=v.textTracks[i];if(x.kind==='subtitles'||x.kind==='captions')tt.push(x)}
if(tt.length){tt.forEach(function(x,j){it.push({t:(x.mode==='showing'?'✓ ':'')+(x.label||x.language||'Subtítulos '+(j+1)),v:j})});
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
tb.onclick=function(){LS.setItem('mrc.autoupd',on()?'0':'1');lab();say(on()?'Las listas se actualizan solas cada 6 horas':'Actualización automática apagada')};row.appendChild(tb)}
})();
