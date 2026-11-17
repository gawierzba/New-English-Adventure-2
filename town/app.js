"use strict";
/* English Adventure 2 · Living Town
   No server, accounts, analytics or voice recording.
   A scene tap is NOT evidence of learning; only task answers update review history. */
(()=>{
const P=window.EA2_PASSPORT_ENGINE,E=window.EA2_LIVING_TOWN_ENGINE,A={...window.EA2_TOWN_ART,...window.EA2_TOWN_EXTRA_ART};
const $=id=>document.getElementById(id);
const LOC={
harbour:[
{en:"train",x:20,y:56,symbol:"🚂"},{en:"boat",x:70,y:66,symbol:"⛵"},
{en:"bus",x:32,y:85,symbol:"🚌"},{en:"river",x:77,y:89,symbol:"🌊"},
{en:"car",x:11,y:81,symbol:"🚗"},{en:"plane",x:80,y:19,symbol:"✈️"}
],
market:[
{en:"bread",x:15,y:62,symbol:"🥖"},{en:"cake",x:35,y:62,symbol:"🍰"},
{en:"carrots",x:53,y:62,symbol:"🥕"},{en:"strawberries",x:70,y:62,symbol:"🍓"},
{en:"grapes",x:87,y:62,symbol:"🍇"},{en:"cheese",x:84,y:86,symbol:"🧀"}
],
atelier:[
{en:"jacket",x:42,y:52,symbol:"🧥"},{en:"jeans",x:54,y:60,symbol:"👖"},
{en:"raincoat",x:67,y:56,symbol:"🧥"},{en:"scarf",x:79,y:49,symbol:"🧣"},
{en:"sun hat",x:87,y:20,symbol:"👒"},{en:"wellies",x:82,y:83,symbol:"🥾"}
],
station:[
{en:"train",x:47,y:73,symbol:"🚂"},{en:"bus",x:15,y:78,symbol:"🚌"},
{en:"car",x:84,y:79,symbol:"🚗"},{en:"lorry",x:83,y:62,symbol:"🚚"},
{en:"plane",x:83,y:17,symbol:"✈️"},{en:"tractor",x:13,y:61,symbol:"🚜"}
],
park:[
{en:"jump",x:38,y:69,symbol:"🤸"},{en:"run",x:30,y:91,symbol:"🏃"},
{en:"dance",x:69,y:62,symbol:"💃"},{en:"sing",x:73,y:30,symbol:"🎤"},
{en:"climb",x:18,y:52,symbol:"🧗"},{en:"walk",x:80,y:84,symbol:"🚶"}
],
theatre:[
{en:"mum",x:27,y:29,symbol:"👩"},{en:"dad",x:39,y:29,symbol:"👨"},
{en:"sister",x:50,y:29,symbol:"👧"},{en:"brother",x:61,y:29,symbol:"👦"},
{en:"grandma",x:72,y:29,symbol:"👵"},{en:"granddad",x:65,y:70,symbol:"👴"}
]};
let snap=P.readSnapshot(localStorage),state=E.read(localStorage);
let active=null,mission=null,inspection=null,sound=localStorage.getItem("nea2-town-sound-v1")!=="off",timer=null;
function now(){return Date.now()}
function short(id){return E.getVenue(id)}
function rows(v){return E.discovered(snap,v)}
function known(venue,en){return rows(venue).some(w=>w.en===en)}
function word(venue,en){return snap.all.find(w=>w.unit===venue.unit&&w.en===en)||null}
function status(){return E.status(snap,state)}
function toast(msg){
 const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(timer);
 timer=setTimeout(()=>el.classList.remove("show"),3200)
}
function speak(s){
 if(!sound){toast("Dźwięk jest wyłączony. Włącz go przy powitaniu Lumo.");return}
 if(!("speechSynthesis" in window&&"SpeechSynthesisUtterance" in window)){toast("Ta przeglądarka nie potrafi odczytać wymowy.");return}
 try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang="en-GB";u.rate=.84;
  const voices=window.speechSynthesis.getVoices(),voice=voices.find(v=>/^en[-_]GB/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));if(voice)u.voice=voice;
  window.speechSynthesis.speak(u)}catch(e){toast("Nie udało się odczytać angielskiego zdania.")}
}
function travelTo(id){
 snap=P.readSnapshot(localStorage);state=E.read(localStorage);
 const venue=short(id);if(!venue)return;
 active=venue;mission=null;inspection=null;
 const previous=state.places[id]||{};
 if(!previous.viewed){state.places[id]={...previous,viewed:true,enteredAt:now()};if(!E.save(localStorage,state))toast("Nie udało się zapisać odwiedzin w tej przeglądarce.")}
 drawAll();
 renderExplore();
 $("places").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})
}
function visitCount(){return status().filter(x=>x.viewed).length}
function finishCount(){return status().filter(x=>x.finished).length}
function learnedCount(){const unique=new Set();E.venues.forEach(v=>E.discovered(snap,v).forEach(w=>unique.add(w.key)));return unique.size}
function totalWords(){return new Set(E.venues.flatMap(v=>v.words.map(en=>v.unit+"|"+en))).size}
function renderCounters(){
 $("places-count").innerHTML=visitCount()+"<small>/"+E.venues.length+"</small>";
 $("town-words-count").innerHTML=learnedCount()+"<small>/"+totalWords()+"</small>";
 $("quests-count").innerHTML=finishCount()+"<small>/"+E.venues.length+"</small>"
}
function renderMap(){
 $("town-art").innerHTML=A.town.replace("</svg>",A.mapDecor+"</svg>");
 const night=$("town-map").classList.contains("is-night");
 $("town-map").classList.toggle("is-celebrating",finishCount()===E.venues.length);
 $("time-toggle").textContent=night?"☀ Pokaż dzień":"☾ Włącz wieczór";
 $("time-toggle").setAttribute("aria-pressed",String(night))
}
function renderMapNavigation(){
 const grid=$("map-navigation");grid.textContent="";
 status().forEach(v=>{
  const btn=document.createElement("button");btn.type="button";btn.className="place-card";
  btn.style.setProperty("--place-bg",v.color+"25");
  const icon=document.createElement("span");icon.className="place-icon";icon.textContent=v.icon;
  const copy=document.createElement("span");
  const title=document.createElement("strong");title.textContent=v.name;
  const sub=document.createElement("small");sub.textContent=v.subtitle;
  const tag=document.createElement("span");tag.className="place-tag";
  tag.textContent=v.finished?"✦ Pamiątka w dzienniku":v.playable?"✦ Mini-misja gotowa":v.known?("🌱 Poznane: "+v.known+"/2 potrzebne"):"○ Można zwiedzać";
  copy.append(title,sub,tag);btn.append(icon,copy);
  btn.addEventListener("click",()=>travelTo(v.id));grid.appendChild(btn)
 })
}
function renderSide(){
 const el=$("side-stamps");el.textContent="";
 status().forEach(v=>{
  const s=document.createElement("span");s.className="side-stamp"+(v.finished?" earned":"");
  s.title=v.name+" — "+(v.finished?"mini-przygoda ukończona":"do odkrycia");
  s.setAttribute("aria-label",s.title);s.textContent=v.finished?v.icon:"◇";
  el.appendChild(s)
 })
}
function renderJournal(){
 const grid=$("journal-cards");grid.textContent="";
 status().forEach(v=>{
  const card=document.createElement("article");card.className="journal-card"+(!v.finished?" locked":"");
  card.style.setProperty("--color",v.color);
  const seal=document.createElement("div");seal.className="journal-seal";seal.textContent=v.finished?v.icon:"✧";
  const title=document.createElement("strong");title.textContent=v.badge;
  const detail=document.createElement("small");detail.textContent=v.finished?
  "Misja ukończona · odwiedzin z misją: "+v.visits+(v.independent?" · przynajmniej jedna bez pomocy":" · wspólnie z Lumo"):
  v.viewed?"Już odwiedzone. Wróć po pamiątkę!":"Jeszcze nieodkryte.";
  const stateText=document.createElement("span");stateText.className="journal-state";
  stateText.textContent=v.finished?"✦ W DZIENNIKU":"○ CZEKA NA ODKRYCIE";
  const button=document.createElement("button");button.type="button";button.textContent="Odwiedź ↗";button.addEventListener("click",()=>travelTo(v.id));
  card.append(seal,title,detail,stateText,button);grid.appendChild(card)
 });
 const n=finishCount();
 $("journal-note").textContent=n===E.venues.length?"Wszystkie sześć miejskich pamiątek zebrane!":n===0?
 "Pierwsza pamiątka już na Ciebie czeka.":"Zebrano "+n+" z "+E.venues.length+" pamiątek. Pozostałe czekają!"
}
function renderPrint(){
 const grid=$("print-entries");grid.textContent="";
 status().forEach(v=>{
  const line=document.createElement("div");line.className="print-row";
  const sym=document.createElement("span");sym.textContent=v.finished?v.icon:"○";
  const b=document.createElement("div"),t=document.createElement("strong"),d=document.createElement("small");
  t.textContent=v.name;d.textContent=v.finished?"Odkryta pamiątka: "+v.badge:"Pamiątka jeszcze do odkrycia";
  b.append(t,d);line.append(sym,b);grid.appendChild(line)
 })
}
function drawAll(){snap=P.readSnapshot(localStorage);state=E.read(localStorage);renderCounters();renderMapNavigation();renderSide();renderJournal();renderPrint()}
function stage(html,tip){
 $("visit-stage").innerHTML=html;
 $("ribbon-place").textContent=active?active.english.toUpperCase():"THE LITTLE TOWN";
 if(tip)$("owl-tip").textContent=tip
}
const button=(act,text,cls="stage-action")=>'<button type="button" data-action="'+act+'" class="'+cls+'">'+text+'</button>';
const header=(label,title,desc)=>'<span class="stage-eyebrow">'+label+'</span><h3 class="stage-title">'+title+'</h3><p class="stage-lead">'+desc+'</p>';
function welcome(){
 active=null;mission=null;inspection=null;
 stage(header("🦉 LUMO WITA GOŚCI","Welcome to <em>our town!</em>","Jestem Lumo, Twoja przewodniczka. Czeka tu już sześć miejsc: przystań, sklepik, pracownia, dworzec, park i teatr rozmów. Wybierz własną drogę!")+
 '<div class="welcome-scene"><div class="big-owl" aria-hidden="true">🦉</div><div><strong>Three places. Many little stories.</strong>'+
 '<p>W każdej scenie dotkniesz przedmiotów, posłuchasz angielskich zdań i rozwiążesz krótką misję, gdy poznasz potrzebne słowa.</p></div></div>'+
 '<div class="steps-line"><span><b>👀</b> Obejrzyj</span><span><b>👆</b> Dotknij</span><span><b>💬</b> Powiedz</span></div>'+
 '<div class="stage-actions">'+button("to-map","Wybiorę miejsce na mapie ↗")+'</div>',
 "To Twoje miasteczko. Możesz zacząć od dowolnego miejsca!")
}
function sceneHtml(v,mode){
 const available=new Set(rows(v).map(w=>w.en));
 const display=LOC[v.id].filter(x=>(mode!=="mission"||v.kind!=="dialogue")&&(mode!=="mission"||available.has(x.en)));
 const target=mission&&!mission.done?mission.targets[mission.index].en:null;
 const spots=display.map(obj=>{
  const isKnown=available.has(obj.en),glow=mission&&mission.hint>=2&&obj.en===target,wrong=mission&&mission.wrong===obj.en;
  return '<button type="button" class="scene-hotspot'+(!isKnown?" unknown":"")+(glow?" correct-target":"")+(wrong?" wrong":"")+
   '" data-action="object" data-name="'+obj.en+'" style="left:'+obj.x+'%;top:'+obj.y+'%" aria-label="'+
   (mode==="mission"?"Wskaż obrazek: ":"Zobacz przedmiot: ")+obj.en+'"><span aria-hidden="true">'+
   (isKnown?obj.symbol:"✦")+'</span></button>'
 }).join("");
 const effect=mission&&mission.done?(v.id==="station"?" signal-open":v.id==="park"?" action-"+mission.targets[mission.index].en:v.id==="theatre"?" applause":""):"";
 return '<div class="scene-wrap'+effect+'"><div class="scene-illustration">'+A[v.id]+
 '<span class="scene-scene-label">'+v.english.toUpperCase()+' ✦</span>'+spots+'</div></div>'
}
function showInspection(v){
 if(!inspection)return"";
 const w=word(v,inspection),seen=known(v,inspection);
 if(!w)return"";
 const msg=seen?"To poznane słowo. Kliknij «Posłuchaj», by je powtórzyć.":
  "Możesz je obejrzeć podczas spaceru, ale dopiero przygoda w krainie "+v.unit+" zapisuje poznanie słowa.";
 return '<div class="lesson-prompt"><span aria-hidden="true">'+w.icon+'</span>'+
 '<div><strong lang="en">'+w.en+'</strong><small>'+w.pl+'. '+msg+'</small></div></div>'+
 '<div class="stage-actions">'+button("hear-object","♫ Posłuchaj słowa","stage-action alt")+
 (!seen?'<a class="stage-action" href="../unit-'+v.unit+'/">Poznaj w krainie '+v.unit+' →</a>':"")+'</div>'
}
function renderExplore(){
 if(!active)return welcome();
 const v=active,arr=rows(v),ready=arr.length>=2;
 const challenge=ready?
 '<div class="progress-summary"><b>✦ Misja jest gotowa.</b> Znasz '+arr.length+' z '+v.words.length+' słów z tej sceny. Lumo przygotuje '+Math.min(3,arr.length)+' zagadki z rzeczami, które już poznano.</div>':
 '<div class="progress-summary"><b>🌱 Spokojnie odkrywamy.</b> W tej scenie poznano '+arr.length+' z '+v.words.length+' słów. Do krótkiej misji potrzebujemy przynajmniej dwóch różnych słów z krainy '+v.unit+'. Możesz już zwiedzać wszystkie obrazki.</div>';
 stage(header("✦ MIEJSCE DO ODKRYCIA",v.name+" <em>wita!</em>",v.entry)+
 sceneHtml(v,"explore")+
 '<p class="scene-place-note">Dotknij jednego z pulsujących kółek na ilustracji, by poznać przedmiot. To swobodne zwiedzanie — bez ocen i bez zaliczania słów.</p>'+
 showInspection(v)+challenge+
 '<div class="stage-actions">'+(ready?button("begin-mission","🧩 Rozpocznij mini-przygodę →"):'<a class="stage-action" href="../unit-'+v.unit+'/">Poznaj angielskie słowa →</a>')+
 button("to-map","Wybierz inne miejsce","stage-action alt")+'</div>',
 "Dotykaj przedmiotów na rysunku. W mini-misji poproszę Cię o rozpoznanie tylko poznanych słów.")
}
function beginMission(){
 if(!active)return;
 snap=P.readSnapshot(localStorage);
 const run=E.createMission(snap,active);
 if(!run){toast("Do tej zabawy potrzeba dwóch poznanych słów.");renderExplore();return}
 mission={targets:run.targets,index:0,done:false,hint:0,wrong:null,misses:0,results:[]};inspection=null;renderMission()
}
function taskDots(){
 return '<div class="task-dots">'+mission.targets.map((x,i)=>'<span class="'+(i<mission.index?"past":i===mission.index?"active":"")+'"></span>').join("")+'</div>'
}
function renderMission(){
 if(!mission||!active)return;
 const v=active,t=mission.targets[mission.index],success=mission.done;
 const result=success?mission.results[mission.results.length-1]:null;
 const feedback=success?'<div class="feedback-box '+(result.independent?"good":"help")+'">'+
 (result.independent?"✦ Świetnie rozpoznany przedmiot!":"♡ Znaleźliśmy przedmiot wspólnie. Tak też się uczymy!")+
 '<span class="display-phrase" lang="en">'+t.phrase+'</span><small>'+t.pl+' · Możesz posłuchać całego zdania.</small></div>':
 mission.wrong?'<div class="feedback-box">To inny przedmiot. Wróć do ilustracji albo poproś Lumo o wskazówkę.</div>':"";
 const clue=mission.hint===1?'<div class="hint-box"><b>💡 Pierwsza wskazówka:</b> po polsku to „'+t.pl+'”. Spróbuj odnaleźć przedmiot na rysunku.</div>':
 mission.hint>=2?'<div class="hint-box"><b>✦ Druga wskazówka:</b> Lumo podświetliła właściwe kółko. Możesz go dotknąć albo wspólnie odkryć odpowiedź.</div>':"";
 const collected=mission.results.length?
 '<div class="scene-basket">'+mission.results.map(r=>'<span title="'+r.en+'">'+r.icon+'</span>').join("")+'</div>':"";
 const askText=v.id==="market"?"Lumo składa zamówienie":v.id==="atelier"?"Fela szuka ubrania":"Lumo wypatruje przedmiotu";
 stage(header("🧩 MINI-PRZYGODA · "+(mission.index+1)+" / "+mission.targets.length,
  askText+" <em>na ilustracji.</em>",
  "Posłuchaj zdania, spójrz na scenę i dotknij kółka przy właściwym przedmiocie. Każde pytanie korzysta tylko z poznanych słów.")+
 taskDots()+
 '<div class="target-line"><strong lang="en">'+t.cue+'</strong>'+
 button("hear-task","♫ Posłuchaj","stage-action alt")+'</div>'+
 sceneHtml(v,"mission")+collected+
 '<p class="scene-place-note">Kółka wskazują tylko obiekty z poznanego słownictwa. Wskazówkę możesz otworzyć w każdej chwili.</p>'+
 feedback+clue+
 '<div class="stage-actions">'+(success?
 button("next-task",mission.index===mission.targets.length-1?"Odbierz miejską pamiątkę →":"Kolejny przedmiot →"):
 button("hint",mission.hint===0?"💡 Mała podpowiedź":mission.hint===1?"✨ Podświetl przedmiot":"♡ Odkryjmy razem","stage-action alt"))+
 (success?button("hear-phrase","♫ Całe zdanie","stage-action alt"):"")+
 button("leave","Wróć do zwiedzania","stage-action quiet")+'</div>',
 "Zagadka dotyczy poznanych już słów. Jeśli się pomylisz, możesz próbować dalej bez limitu.")
}
function pickObject(en){
 if(!active)return;
 const v=active;
 if(!mission){inspection=en;renderExplore();return}
 if(mission.done)return;
 const target=mission.targets[mission.index];
 if(!known(v,en))return;
 if(!E.isCorrect(target,en)){mission.wrong=en;mission.misses++;renderMission();return}
 acceptAnswer(false)
}
function acceptAnswer(forced){
 if(!mission||mission.done)return;
 const target=mission.targets[mission.index];
 const independent=E.canRewardTask({correct:true,hinted:forced||mission.hint>0,missed:mission.misses>0});
 mission.done=true;
 mission.results.push({...target,independent});
 const outcome=P.applyAnswer(P.readHistory(localStorage),target.key,independent,now());
 if(!P.saveHistory(localStorage,outcome.history))toast("Nie udało się zapisać powtórki na tym urządzeniu.");
 renderMission()
}
function hint(){
 if(!mission||mission.done)return;
 if(mission.hint<2){mission.hint++;renderMission()}else acceptAnswer(true)
}
function nextTask(){
 if(!mission||!mission.done)return;
 if(mission.index===mission.targets.length-1){completeVenue();return}
 mission.index++;mission.hint=0;mission.misses=0;mission.wrong=null;mission.done=false;renderMission()
}
function completeVenue(){
 if(!mission||!active||mission.results.length!==mission.targets.length)return;
 const v=active,solved=mission.results.slice(),independent=solved.every(r=>r.independent);
 const next=E.nextState(state,v.id,independent,now());
 if(E.save(localStorage,next))state=next;else toast("Nie udało się zapisać miejskiej pamiątki.");
 mission=null;inspection=null;drawAll();
 const all=finishCount()===E.venues.length;
 stage(header("✦ PAMIĄTKA Z MIASTECZKA",all?"Całe miasteczko <em>odkryte!</em>":"Udało się! <em>Odkryliśmy miejsce.</em>",
 "Kolejny kawałek naszej opowieści trafił do Dziennika Małych Odkryć. Możesz wrócić tutaj lub wybrać inne miejsce.")+
 '<div class="scene-award"><span class="award-icon" aria-hidden="true">'+(all?"🦉🌟":v.icon)+'</span>'+
 '<strong>'+v.badge+'</strong><p>'+solved.length+' '+(solved.length===2?"słowa":"słowa")+' przećwiczone w przygodzie. '+
 (independent?"Tym razem wszystkie udało się rozpoznać bez podpowiedzi.":"Niektóre znaleźliśmy wspólnie — to także udana nauka!")+'</p></div>'+
 (all?'<div class="lesson-prompt"><span aria-hidden="true">🌈</span><div><strong>Ożyło całe miasteczko!</strong><small>Masz trzy miejskie pamiątki. Dziennik czeka na wspólne podsumowanie!</small></div></div>':"")+
 '<div class="stage-actions">'+button("back-explore","Obejrzę scenę jeszcze raz")+
 button("to-map","Inny zakątek miasteczka","stage-action alt")+
 button("to-journal","Otwórz mój dziennik","stage-action alt")+'</div>',
 "Każda mini-przygoda ma swoje miejsce w dzienniku. Nie ma ocen ani rankingu.")
}
function viewJournal(){
 $("journal").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})
}
function viewMap(){
 $("town").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})
}
function welcomeAudio(){speak("Hello, Explorer! Welcome to our little town. Let's explore!")}
function renderSound(){const el=$("sound-toggle");el.setAttribute("aria-pressed",String(sound));el.setAttribute("aria-label",sound?"Wyłącz wymowę":"Włącz wymowę");el.textContent=sound?"♫":"♪"}
function toggleEvening(){
 state.night=!state.night;if(!E.save(localStorage,state))toast("Nie udało się zapisać pory dnia.");
 $("town-map").classList.toggle("is-night",state.night);renderMap()
}
function resetTown(){
 if(!window.confirm("Wyczyścić wyłącznie dziennik Żywego Miasteczka? Postępy w ośmiu krainach i powtórki paszportu pozostaną bez zmian."))return;
 try{localStorage.removeItem(E.KEY)}catch(e){toast("Przeglądarka nie pozwala wyczyścić dziennika.");return}
 state=E.read(localStorage);active=null;mission=null;inspection=null;drawAll();welcome();toast("Miasteczko zaczyna nową przygodę.")
}
$("visit-stage").addEventListener("click",e=>{
 const b=e.target.closest("[data-action]");if(!b)return;
 const a=b.dataset.action,v=b.dataset.name;
 switch(a){
 case "object":pickObject(v);break;
 case "begin-mission":beginMission();break;
 case "hint":hint();break;
 case "hear-task":if(mission)speak(mission.targets[mission.index].cue);break;
 case "hear-phrase":if(mission)speak(mission.targets[mission.index].phrase);break;
 case "hear-object":if(active&&inspection)speak(inspection);break;
 case "next-task":nextTask();break;
 case "leave":mission=null;inspection=null;renderExplore();break;
 case "back-explore":renderExplore();break;
 case "to-map":viewMap();break;
 case "to-journal":viewJournal();break;
 }
});
document.querySelectorAll(".map-place").forEach(b=>b.addEventListener("click",()=>travelTo(b.dataset.place)));
$("owl-say").addEventListener("click",welcomeAudio);
$("sound-toggle").addEventListener("click",()=>{sound=!sound;try{localStorage.setItem("nea2-town-sound-v1",sound?"on":"off")}catch(e){};if(!sound&&"speechSynthesis" in window)window.speechSynthesis.cancel();renderSound()});
$("time-toggle").addEventListener("click",toggleEvening);
$("reset-town").addEventListener("click",resetTown);
$("print-journal").addEventListener("click",()=>{renderPrint();try{window.print()}catch(e){toast("Drukowanie jest niedostępne.")}});
window.addEventListener("pageshow",()=>{if(!mission){drawAll();if(active)renderExplore()}});
window.addEventListener("storage",e=>{if(!mission&&(e.key===E.KEY||P.CATALOG.some(x=>x.storage.key===e.key))){drawAll();if(active)renderExplore()}});
window.EA2LivingTown=Object.freeze({
 inspect:()=>({visited:status().filter(x=>x.viewed).map(x=>x.id),finished:status().filter(x=>x.finished).map(x=>x.id),
  known:learnedCount(),active:active?active.id:null,mission:mission?{index:mission.index,length:mission.targets.length,done:mission.done,hint:mission.hint,
  results:mission.results.slice(),target:mission.targets[mission.index].en}:null}),
 visit:travelTo,resetTown
});
$("town-art").innerHTML=A.town.replace("</svg>",A.mapDecor+"</svg>");
$("town-map").classList.toggle("is-night",state.night);
drawAll();renderMap();renderSound();welcome();
})();