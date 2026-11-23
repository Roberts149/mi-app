(function(){
var $=function(i){return document.getElementById(i)};
var css=document.createElement('style');
css.textContent='.view:not(#vPlayer){box-shadow:inset 0 0 50px #d6b45b14}'
+'.brand{background:linear-gradient(100deg,#8a6420,#f4df9b,#fff6d0,#d6b45b,#8a6420);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:xsh 5s linear infinite}'
+'@keyframes xsh{to{background-position:-250% 0}}'
+'.cm{transition:transform .15s,box-shadow .2s,border-color .2s}'
+'.cm:hover,.cm:focus-visible{transform:scale(1.04);border-color:#f4df9b;box-shadow:0 0 18px #d6b45b66}'
+'.src{box-shadow:0 0 0 1px #d6b45b22,0 6px 20px #0008}'
+'.top{border-bottom:1px solid #d6b45b44}';
document.head.appendChild(css);

/* Temporizador para dormir */
var bar=document.querySelector('#pl .bar.b');if(!bar)return;
var steps=[15,30,60,90,0],si=4,T=0,iv=0,end=0,btn=document.createElement('button');
btn.className='s';btn.id='pk';btn.textContent='🌙 Dormir';bar.appendChild(btn);
function say(s){var t=$('toast');t.textContent=s;t.classList.add('show');clearTimeout(say.k);say.k=setTimeout(function(){t.classList.remove('show')},2400)}
function lab(){var r=Math.max(0,Math.ceil((end-Date.now())/60000));btn.textContent='🌙 '+r+' min'}
function off(){clearTimeout(T);clearInterval(iv);end=0;si=4;btn.textContent='🌙 Dormir'}
function fire(){var v=$('vid');try{v.pause()}catch(e){}off();say('Temporizador: buenas noches 🌙');
if(!$('vPlayer').classList.contains('hidden')){var b=$('px');if(b)b.click()}}
btn.onclick=function(){si=(si+1)%steps.length;var m=steps[si];clearTimeout(T);clearInterval(iv);
if(!m){off();say('Temporizador apagado');return}
end=Date.now()+m*60000;T=setTimeout(fire,m*60000);iv=setInterval(lab,15000);lab();say('Se apagará en '+m+' min 🌙')};
})();
