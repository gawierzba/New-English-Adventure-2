"use strict";
/* Stage 10 user interface. Pure lesson and compass engines loaded first. */
(()=>{
const P=window.EA2_PASSPORT_ENGINE,X=window.EA2_EXPEDITION_ENGINE,$=id=>document.getElementById(id);
let snapshot=P.readSnapshot(localStorage),journey=X.readJourney(localStorage),unit=0,trip=null,sound=localStorage.getItem("nea2-sound-v1")!=="off",toastTimer=null;
const $stage=$("station-stage"),N=()=>Date.now(),done=()=>Object.keys(journey.visited).filter(k=>Number(k)>=1&&Number(k)<=8).length;
function draw(){
 snapshot=P.readSnapshot(localStorage);
 journey=X.readJourney(localStorage);
 renderRoute();renderCounters();renderPieces();
 if(!unit)welcome()
}
function renderCounters(){
 const total=done(),ready=X.routeStatus(snapshot,journey).filter(r=>r.unlocked).length;
 $("compass-total").innerHTML=total+" <small>/ 8</small>";
 $("worlds-ready").innerHTML=ready+" <small>/ 8</small>";
 $("words-known").textContent=snapshot.totals.seen
}
function renderPieces(){
 const el=$("compass-pieces");el.textContent="";
 for(let k=1;k<=8;k++){
  const span=document.createElement("span");span.className="piece"+(journey.visited[k]?" found":"");
  span.textContent=journey.visited[k]?"✦":"◇";
  span.setAttribute("aria-label","Fragment "+k+": "+(journey.visited[k]?"odkryty":"nieodkryty"));el.appendChild(span)
 }
 $("pieces-note").textContent=done()===8?"Wszystkie osiem fragmentów! Kompas znów wskazuje drogę.":done()===0?
 "Odkrywaj kolejne fragmenty bez pośpiechu.":"Zebrano "+done()+" z 8 fragmentów. Każdy krok przybliża nas do celu."
}
function renderRoute(){
 const grid=$("route-grid");grid.textContent="";
 X.routeStatus(snapshot,journey).forEach((r,i)=>{
  const b=document.createElement("button");b.type="button";
  b.className="route-card"+(!r.unlocked?" locked":"")+(r.finished?" done":"");
  b.style.setProperty("--color",r.world.color);
  b.style.setProperty("--angle",((i%4)-1.5)*5+"deg");
  b.dataset.unit=String(r.id);
  b.setAttribute("aria-label","Przystanek "+r.id+". "+r.info.title+". "+(r.finished?"Fragment kompasu zdobyty":r.unlocked?"Można wyruszyć":"Najpierw poznaj dwa słowa w tej krainie"));
  b.innerHTML='<span class="route-index">STOP 0'+r.id+'</span>'+
    '<div class="route-art" aria-hidden="true"><span>'+r.info.scene+'</span></div>'+
    '<strong>'+r.info.title+'</strong><span class="route-short">'+r.info.short+'</span>'+
    '<span class="route-status">'+(r.finished?"✦ Fragment odkryty":r.unlocked?"✧ Gotowy do wyprawy":"○ Najpierw odkryj słówka")+'</span>'+
    '<div class="route-count" aria-hidden="true"><span style="width:'+(r.world.total?Math.round(r.known/r.world.total*100):0)+'%"></span></div>';
  b.addEventListener("click",()=>visit(r.id));grid.appendChild(b)
 })
}
const button=(act,label,cl="act")=>'<button type="button" data-action="'+act+'" class="'+cl+'">'+label+'</button>';
const heading=(tag,title,intro)=>'<span class="step-tag">'+tag+'</span><h3 class="step-title">'+title+'</h3><p class="step-intro">'+intro+'</p>';
const scene=(emoji,title,desc,color)=>'<div class="scene-panel" style="--sky:'+color+'"><div class="scene-emoji" aria-hidden="true">'+emoji+'</div>'+
 '<div class="scene-text"><span>THE LOST COMPASS</span><h4>'+title+'</h4><p>'+desc+'</p></div></div>';
function view(html,tip){
 $stage.innerHTML=html;
 if(tip)$("lumo-tip").textContent=tip;
 $("ribbon-world").textContent=unit?"STATION 0"+unit:"ALL THE WORLDS"
}
function welcome(){
 view(heading("🦉 LUMO ZAPRASZA","Wyrusz po <em>osiem fragmentów!</em>","Kompas rozpadł się na osiem części. Każda kraina zna jedną tajemnicę. Pomożesz Lumo odnaleźć wszystkie?")+
 scene("🧭","Zaczynamy wielką przygodę!","Wybierz dowolną krainę z mapy powyżej. W każdej czekają dwa krótkie zadania: poznane słowo i zdanie.", "#edf4fa")+
 '<div class="intro-steps"><span><b>🔎</b> Rozpoznaj</span><span><b>💬</b> Dokończ</span><span><b>✦</b> Odkryj</span></div>'+
 '<div class="discovery">Wszystkie zadania pojawiają się dopiero po poznaniu potrzebnych słów. Za prośbę o pomoc nie tracisz fragmentu kompasu.</div>'+
 '<div class="controls">'+button("go-map","Wybiorę przystanek ↗")+'</div>',
 "W każdej krainie ukryta jest jedna część kompasu. Możesz wybierać przystanki w dowolnej kolejności.")
}
function goToStation(){
 $("station").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})
}
function visit(u){
 if(u<1||u>8)return;
 snapshot=P.readSnapshot(localStorage);
 journey=X.readJourney(localStorage);unit=u;trip=null;
 renderCounters();renderRoute();renderPieces();
 const w=snapshot.worlds.find(z=>z.id===u);
 if(!X.isEligible(snapshot,u)){
  const info=X.moduleInfo(u);
  view(heading("🌱 JESZCZE CHWILA","Zanim wyruszymy… <em>poznaj słowa!</em>","Na razie zapisano "+w.seen+" z "+w.total+" podstawowych słów w tej krainie. Do uczciwych zagadek potrzebujemy przynajmniej dwóch różnych poznanych nazw.")+
  scene(info.scene,info.title,"Nie odblokowujemy pytań z nieznanymi odpowiedziami. Otwórz krainę, poznaj słowa i wróć do ekspedycji.",info.sky)+
  '<div class="controls"><a class="act" href="../unit-'+u+'/">Odwiedź tę krainę →</a>'+button("go-map","Inny przystanek","act alt")+'</div>',
  "Najpierw nauka, potem zgadywanie. Dwa poznane słowa wystarczą, żeby rozpocząć tę część ekspedycji.");
  goToStation();return
 }
 const info=X.moduleInfo(u),completed=journey.visited[u];
 view(heading("✦ PRZYSTANEK 0"+u,info.title.replace(/ /g," ")+" <em>czeka!</em>",info.story)+
 scene(info.scene,completed?"Możesz odwiedzić tę krainę ponownie.":"Lumo widzi ślad kompasu!",info.short+". Dwa małe odkrycia i następna część kompasu trafi na naszą mapę.",info.sky)+
 '<div class="intro-steps"><span><b>🔎</b> Znajdź słowo</span><span><b>💬</b> Ułóż zdanie</span><span><b>🧭</b> Fragment</span></div>'+
 (completed?'<div class="discovery">✦ Już odwiedziłeś ten przystanek. Możesz przejść go ponownie i przypomnieć sobie słowa!</div>':"")+
 '<div class="controls">'+button("start-stop","Wyruszam z Lumo! →")+button("go-map","Wróć na mapę","act alt")+'</div>',
 "Przed nami krótka zagadka i zdanie z języka, który poznaliśmy w tej krainie.");
 goToStation()
}
function startStop(){
 if(!unit)return;
 const built=X.buildStop(snapshot,unit);
 if(!built){visit(unit);return}
 trip={built,index:0,hint:0,wrong:null,misses:0,done:false,results:[]};
 renderTask()
}
function renderTask(){
 if(!trip)return;
 const task=trip.built.tasks[trip.index],prompt=X.taskPrompt(task),labels="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 const choices=task.options.map((w,i)=>{
  const classes=(trip.done&&w.key===task.item.key?" good":"")+(trip.wrong===w.key?" wrong":"")+(trip.hint>=2&&w.key===task.item.key?" glow":"");
  const text=X.optionText(task,w);
  return '<button type="button" data-action="answer" data-value="'+w.key+'" class="choice'+classes+'"'+(trip.done?" disabled":"")+
   (task.kind!=="reverse"?' lang="en"':"")+'><span>'+labels[i]+'</span>'+text+'</button>'
 }).join("");
 const feedback=trip.done?'<div class="feedback '+(trip.results[trip.results.length-1].independent?"good":"helped")+'">'+
   (trip.results[trip.results.length-1].independent?"Świetnie! Udało się bez pomocy. ":"Wspólnie odkryliśmy odpowiedź! ")+
   '<strong lang="en">'+task.item.en+'</strong> — '+task.item.pl+'.</div>':
   trip.wrong?'<div class="feedback">To jeszcze nie to. Spójrz ponownie lub poproś Lumo o wskazówkę.</div>':"";
 const hint=trip.hint===1?'<div class="hint"><strong>✦ Podpowiedź:</strong> właściwa odpowiedź zaczyna się na <b>'+
  X.optionText(task,task.item)[0].toUpperCase()+'</b>.</div>':
  trip.hint>=2?'<div class="hint"><strong>✦ Podpowiedź:</strong> podświetliłam prawidłową odpowiedź. Możesz ją kliknąć albo poprosić o rozwiązanie.</div>':"";
 const how=task.kind==="phrase"?'<div class="discovery">To zdanie korzysta z konstrukcji z Twojego podręcznika. Uwaga: czasem potrzebne jest <b>a</b> albo <b>an</b>, a czasem żadnego przedimka.</div>':"";
 view(heading("🧭 PRZYSTANEK 0"+unit+" · ZADANIE "+(trip.index+1)+" Z 2",
  prompt.title.replace(" po angielsku"," <em>po angielsku</em>"),prompt.description)+
 '<div class="task-dots"><span class="'+(trip.index===0?"active":"past")+'"></span><span class="'+(trip.index===1?"active":"")+'"></span></div>'+
 '<div class="riddle"><div class="riddle-ico" aria-hidden="true">'+(task.kind==="phrase"?"💬":task.item.icon)+'</div>'+
 '<div class="riddle-content"><small>'+prompt.tag+'</small><h4'+(task.kind==="reverse"?' lang="en"':"")+'>'+prompt.main+'</h4><p>'+
 (task.kind==="phrase"?'Po polsku: '+task.item.pl+'.':'Poznaliśmy to słowo w krainie numer '+unit+'.')+
 '</p></div></div>'+how+'<div class="choices">'+choices+'</div>'+feedback+hint+
 '<div class="controls">'+(trip.done?button("next-task",trip.index===0?"Drugie zadanie →":"Zobacz fragment kompasu →"):
 button("hint",trip.hint===0?"💡 Podpowiedź":trip.hint===1?"💡 Podświetl odpowiedź":"✨ Odkryjmy razem","act alt"))+
 button("listen","♫ Posłuchaj nazwy","act alt")+button("stop-leave","Przerwij bez utraty odkryć","act quiet")+'</div>'+
 '<p class="quiet-note">Zadanie nie ma stopera. Pomoc nie blokuje ukończenia przystanku, a postępy zapisywane są wyłącznie w tej przeglądarce.</p>',
 "Pamiętaj: pomoc jest zawsze dostępna. Zwróć uwagę na znaczenie słowa i całą angielską konstrukcję.");
}
function answer(key,forced=false){
 if(!trip||trip.done)return;
 const task=trip.built.tasks[trip.index];
 if(!forced&&key!==task.item.key){trip.wrong=key;trip.misses++;renderTask();return}
 const independent=!forced&&trip.hint===0&&trip.misses===0;
 trip.done=true;
 trip.results.push({key:task.item.key,en:task.item.en,independent});
 // Use the same 1/3/7/14/30-day review history as the passport.
 const old=P.readHistory(localStorage),update=P.applyAnswer(old,task.item.key,independent,N());
 if(!P.saveHistory(localStorage,update.history))toast("Nie udało się zapisać terminu powtórki.");
 renderTask()
}
function hint(){
 if(!trip||trip.done)return;
 if(trip.hint<2){trip.hint++;renderTask()}
 else answer("",true)
}
function nextTask(){
 if(!trip||!trip.done)return;
 if(trip.index===1){completeStation();return}
 trip.index++;trip.hint=0;trip.misses=0;trip.wrong=null;trip.done=false;
 renderTask()
}
function completeStation(){
 if(!trip||trip.results.length!==2)return;
 const info=trip.built.info,needsHelp=trip.results.some(r=>!r.independent);
 const fresh=X.completeStop(journey,unit,needsHelp,N());
 if(X.writeJourney(localStorage,fresh))journey=fresh;else toast("Twoje fragmenty nie zostały zapisane w tej przeglądarce.");
 snapshot=P.readSnapshot(localStorage);
 renderCounters();renderRoute();renderPieces();
 const total=done(),isFinal=total===8;
 view(heading("✦ FRAGMENT ODKRYTY · "+unit+" / 8",
  isFinal?"Kompas znowu <em>wskazuje drogę!</em>":"Udało się! <em>Fragment znaleziony.</em>",
  "Odwiedziliśmy "+info.title+". Dzięki angielskim słowom nasza mapa jest bogatsza o kolejny fragment.")+
 '<div class="end-art" aria-hidden="true">'+(isFinal?"🦉🧭🌟":info.scene+"🧭")+'</div>'+
 '<div class="end-summary"><strong>'+total+" z 8 fragmentów kompasu"+'</strong>'+
 (needsHelp?"Część zagadek rozwiązaliśmy z pomocą Lumo. To także prawdziwy krok w nauce!":
 "Dwa krótkie zadania udało się rozwiązać samodzielnie.")+
 (isFinal?'<p>Osiem krain, wiele poznanych słów i jedna wielka przygoda. Brawo za całe odkrywanie!</p>':
 '<p>Teraz możemy odwiedzić następny świat albo wrócić do własnego paszportu.</p>')+
 '<div class="controls">'+button("go-map",isFinal?"Zobacz moją pełną mapę":"Wybieram kolejny przystanek →")+
 '<a class="act alt" href="../passport/">📘 Mój paszport</a></div></div>',
 "To nie test ani ocena. Zebrany fragment oznacza ukończenie wyprawy, a paszport pamięta, które wyrazy ćwiczyliśmy samodzielnie.");
 trip=null
}
function speak(value){
 if(!sound){toast("Wymowa jest wyłączona. Włącz ją u góry.");return}
 if(!("speechSynthesis" in window&&"SpeechSynthesisUtterance" in window)){toast("Ta przeglądarka nie obsługuje odczytywania zdań.");return}
 try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(value);u.lang="en-GB";u.rate=.83;window.speechSynthesis.speak(u)}catch(e){toast("Nie udało się odczytać słowa.")}
}
function toggleSound(){sound=!sound;try{localStorage.setItem("nea2-sound-v1",sound?"on":"off")}catch(e){}
 const el=$("sound-toggle");el.setAttribute("aria-pressed",String(sound));el.textContent=sound?"♫":"♪";if(!sound&&"speechSynthesis" in window)window.speechSynthesis.cancel()
}
function toast(msg){const e=$("toast");e.textContent=msg;e.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove("show"),3200)}
$stage.addEventListener("click",e=>{
 const b=e.target.closest("[data-action]");if(!b)return;
 switch(b.dataset.action){
  case "go-map":$("route").scrollIntoView({behavior:"smooth",block:"start"});break;
  case "start-stop":startStop();break;
  case "answer":answer(b.dataset.value);break;
  case "hint":hint();break;
  case "listen":if(trip)speak(trip.built.tasks[trip.index].item.en);break;
  case "next-task":nextTask();break;
  case "stop-leave":visit(unit);break;
 }
});
$("sound-toggle").addEventListener("click",toggleSound);
$("sound-toggle").setAttribute("aria-pressed",String(sound));
if(!sound)$("sound-toggle").textContent="♪";
$("reset-expedition").addEventListener("click",()=>{
 if(!window.confirm("Wyczyścić wyłącznie odkryte fragmenty kompasu? Postępy i terminy powtórek w paszporcie pozostaną bez zmian."))return;
 try{localStorage.removeItem("nea2-expedition-v1")}catch(e){toast("Nie udało się wyczyścić kompasu.");return}
 unit=0;trip=null;draw();toast("Kompas jest pusty. Możesz wyruszyć od nowa!")
});
window.addEventListener("pageshow",()=>{if(!trip){snapshot=P.readSnapshot(localStorage);journey=X.readJourney(localStorage);renderCounters();renderPieces();renderRoute()}});
window.addEventListener("storage",e=>{if(!trip&&(e.key==="nea2-expedition-v1"||P.CATALOG.some(u=>u.storage.key===e.key))){draw()}});
window.EA2Expedition=Object.freeze({
 inspect:()=>({unlocked:X.routeStatus(P.readSnapshot(localStorage),X.readJourney(localStorage)).filter(w=>w.unlocked).map(w=>w.id),
  completed:Object.keys(X.readJourney(localStorage).visited).map(Number),
  activeUnit:unit,activeTask:trip?trip.index:null,
  taskComplete:trip?trip.done:null,results:trip?trip.results.slice():[]}),
 selectStop:visit
});
draw();
})();