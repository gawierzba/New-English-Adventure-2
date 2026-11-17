"use strict";
/* Stage 13 · The Lost Star. Independent narrative progress, native-review scoring. */
(()=>{
const P=window.EA2_PASSPORT_ENGINE,T=window.EA2_LIVING_TOWN_ENGINE,S=window.EA2_TOWN_STORY_ENGINE;
const ART=window.EA2_TOWN_STORY_ART;
const SCENES={...window.EA2_TOWN_ART,...window.EA2_TOWN_EXTRA_ART};
const $=id=>document.getElementById(id);
let data=S.read(localStorage),snapshot=P.readSnapshot(localStorage),speaker=localStorage.getItem("nea2-story-voice-v1")!=="off",timer=null;
const chapter=()=>data.active?S.CHAPTERS[data.active.chapter]||null:null;
const story=()=>data.active;
const escapeHTML=value=>String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const btn=(act,txt,style="primary")=>'<button type="button" class="story-button '+style+'" data-action="'+act+'">'+txt+'</button>';
const heading=(label,title,intro)=>'<span class="page-tag">'+label+'</span><h3 class="page-title">'+title+'</h3><p class="page-intro">'+intro+'</p>';
function toast(text){
 const el=$("toast");el.textContent=text;el.classList.add("show");
 clearTimeout(timer);timer=setTimeout(()=>el.classList.remove("show"),3500)
}
function speak(en){
 if(!speaker){toast("Dźwięk jest wyłączony. Możesz go włączyć u góry strony.");return}
 if(!("speechSynthesis" in window&&"SpeechSynthesisUtterance" in window)){toast("Ta przeglądarka nie obsługuje czytania angielskich zdań.");return}
 try{
 window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(en);u.lang="en-GB";u.rate=.83;
 const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>/^en[-_]GB/.test(v.lang))||voices.find(v=>/^en[-_]US/.test(v.lang))||voices.find(v=>/^en/.test(v.lang))||null;
 window.speechSynthesis.speak(u)
 }catch(e){toast("Nie udało się odtworzyć głosu.")}
}
function save(next){if(!next)return false;data=next;if(!S.write(localStorage,data))toast("Nie udało się zapisać przygody na tym urządzeniu.");render();return true}
function setStage(html,info){
 $("story-stage").innerHTML=html;
 $("page-kicker").textContent=info||"THE LOST STAR";
 const current=story();
 $("page-number").textContent=current?"0"+(Math.min(current.chapter,3)+1)+" / 04":"01 / 04";
 $("lumo-help").textContent=current?
  current.chapter<3?"Lumo: każda droga jest dobra. Możesz posłuchać słów i skorzystać z podpowiedzi.":"Wróciliśmy z całą gwiazdą! Otwórzmy jej tajemnicę.":
  "Lumo: nie ma złych wyborów. Możesz wrócić do księgi i odkrywać nowe zakończenia."
}
function progress(){
 const a=story(),step=a?a.chapter:0,route=a?a.route:[],complete=data.runs.length;
 $("progress-label").textContent=a?"ROZDZIAŁ "+(step+1)+" Z 3":complete?"KSIĘGA GOTOWA DO PONOWNEGO OTWARCIA":"KSIĘGA JESZCZE ZAMKNIĘTA";
 const node=$("chapter-track");node.textContent="";
 S.CHAPTERS.forEach((c,i)=>{
  const cell=document.createElement("div");cell.className="chapter-track-item"+(a&&i===a.chapter?" current":"")+(a&&i<a.chapter?" complete":"");
  const mark=document.createElement("span");mark.textContent=a&&i<a.chapter?"✦":i+1+".";
  const strong=document.createElement("strong");strong.textContent=c.title;
  const small=document.createElement("small");
  const v=a?route[i]||"":"";small.textContent=v?(T.getVenue(v)||{}).name||"":"PRZYGODA "+(i+1);
  cell.append(mark,strong,small);node.appendChild(cell)
 })
}
function cover(){
 const last=data.runs.length?data.runs[data.runs.length-1]:null;
 $("hero-art").innerHTML=ART.cover;
 const ending=last?S.ENDINGS[last.ending]:null;
 setStage(heading("PROLOG · ZANIM ZABŁYŚNIE GWIAZDA","Posłuchaj, jak zaczęła się <em>tajemnica…</em>",
  "Pewnej nocy z nieba nad Miasteczkiem pod Chmurami zniknęło światło. Trzy maleńkie promienie rozleciały się po uliczkach. Lumo odnalazła stary list.")+
 '<div class="storybook-letter"><span class="letter-seal">✉️</span><div><strong>Drogi Odkrywco!</strong><p>Żeby zapalić gwiazdę, odnajdź trzy promienie. Każdy kryje się w innym miejscu. Wybieraj własną drogę i pomagaj przyjaciołom. Światło wróci dzięki Tobie.</p><small>Podpisano: Przyjaciele Miasteczka</small></div></div>'+
 '<div class="guide-chips"><span>🧭 Wybierz</span><span>💬 Porozmawiaj</span><span>✨ Odkryj finał</span></div>'+
 (ending?'<p class="saved-ending">✦ Ostatnia historia: '+escapeHTML(ending.title)+'. Możesz wybrać inną trasę i odkryć kolejny finał!</p>':"")+
 '<div class="page-buttons">'+btn("begin",last?"Wyruszam na nową trasę →":"Rozpoczynam opowieść →")+
 '<a href="../" class="story-button subtle">Najpierw zwiedzę miasteczko</a></div>',
 "THE PROLOGUE")
}
function routeCard(opt){
 const v=T.getVenue(opt.id),known=S.known(snapshot,opt.id).length,eligible=known>=2;
 return '<button class="route-option" type="button" data-action="choose" data-venue="'+opt.id+'" style="--card-color:'+v.color+'">'+
  '<span class="route-icon" aria-hidden="true">'+opt.symbol+'</span><span class="route-copy"><b>'+escapeHTML(opt.short)+'</b>'+
  '<small>'+escapeHTML(opt.why)+'</small><span class="course-gate">'+(eligible?"✦ Znam "+known+" słów — mogę rozwiązać zagadki":"🌱 Zwiedzę to miejsce bez sprawdzianu")+'</span></span>'+
  '<span class="route-arrow" aria-hidden="true">↗</span></button>'
}
function renderChoice(){
 const c=chapter();if(!c)return;const a=story();
 setStage(heading("ROZDZIAŁ "+(c.index+1)+" Z 3 · "+c.title.toUpperCase(),
 c.question.replace("?",'<em>?</em>'),"Możesz wybrać dowolną drogę. Każdy wybór zmienia spotkanie, a niektóre z nich również finał naszej historii.")+
 '<div class="choice-decor"><span class="choice-decor-owl">🦉</span><div><strong lang="en">Where shall we go?</strong><p>W którą stronę ruszamy? Wybór należy do Ciebie.</p></div></div>'+
 '<div class="route-options">'+c.choices.map(routeCard).join("")+'</div>'+
 '<div class="chapter-footnote">Nie ma zamkniętych dróg. Bez poznanych słów możesz poznawać opowieść bez testu; w znanych krainach otrzymasz krótkie zadania językowe.</div>'+
 '<div class="page-buttons">'+btn("restart","Zacznij historię od początku","subtle")+'</div>',
 "CHAPTER 0"+(c.index+1)+" · CHOOSE YOUR PATH")
}
function scenePanel(v){
 const image=SCENES[v.id]||ART.cover;
 return '<div class="book-scene"><div class="scene-svg-wrap">'+image+'</div>'+
 '<span class="scene-caption">'+escapeHTML(v.english)+' · THE LITTLE TOWN</span></div>'
}
function renderEncounter(){
 const a=story(),c=chapter(),id=a.route[a.chapter],v=T.getVenue(id),choice=c.choices.find(x=>x.id===id),known=S.known(snapshot,id),eligible=known.length>=2;
 setStage(heading("ROZDZIAŁ "+(a.chapter+1)+" Z 3 · ODKRYWANIE",choice.short+"<em> czeka na nas!</em>",choice.story)+
 scenePanel(v)+
 '<div class="encounter-card"><span class="encounter-symbol">'+choice.symbol+'</span><div><strong>Wiadomość od Lumo</strong><p>'+
 (eligible?"Znasz tu "+known.length+" poznanych słów. Rozwiążemy dwa krótkie zadania po angielsku. Odpowiedzi będą oparte tylko na tych słowach.":
 "W tej krainie poznano jeszcze mniej niż dwa różne słowa z naszej sceny. Możemy mimo to odkrywać historię, bez udawania, że rozwiązaliśmy sprawdzian.")+
 '</p></div></div>'+
 '<div class="page-buttons">'+(eligible?btn("start-quiz","Zaczynam zagadki po angielsku →"):
 btn("skip-quiz","Odkrywam historię bez sprawdzianu →"))+
 '<a class="story-button subtle" href="../../unit-'+v.unit+'/">Poznaj słowa w krainie '+v.unit+'</a>'+
 btn("change-route","Wybiorę inną drogę","subtle")+'</div>',
 "CHAPTER 0"+(c.index+1)+" · "+v.english.toUpperCase())
}
function renderQuestion(){
 const a=story(),c=chapter(),v=T.getVenue(a.route[a.chapter]),t=S.taskView(a,snapshot);
 if(!t){showRepair();return}
 const answered=a.answers.length>a.step,last=answered?a.answers[a.step]:null;
 const wrong=a.missed>0&&!answered;
 let cue="",tip="",opts=[];
 if(t.mode==="find"){
  cue="Lumo szuka przedmiotu: "+t.word.pl+".";
  tip="Wybierz angielską nazwę, którą już znasz.";
  opts=t.options.map(w=>({key:w.key,label:w.en,icon:w.icon}))
 }else if(t.mode==="understand"){
  cue=v.phrase(t.word.en);
  tip="Lumo mówi po angielsku. Wybierz polskie znaczenie najważniejszego słowa.";
  opts=t.options.map(w=>({key:w.key,label:w.pl,icon:w.icon}))
 }else{
  cue="Jak powiesz po angielsku: „"+t.word.pl+"”?";
  tip="Wybierz prawidłową całą angielską wypowiedź.";
  opts=t.options.map(w=>({key:w.key,label:v.phrase(w.en),icon:w.icon}))
 }
 const firstLetter=t.mode==="understand"?t.word.pl[0].toUpperCase():t.mode==="speak"?v.phrase(t.word.en)[0].toUpperCase():t.word.en[0].toUpperCase();
 const hint=a.hints===1?"Podpowiedź: szukana odpowiedź zaczyna się od litery "+firstLetter+".":
 a.hints>=2?"Lumo podświetliła prawidłową odpowiedź. Możesz ją wybrać albo odkryć razem.":"";
 const feedback=answered?'<div class="answer-feedback '+(last.independent?"independent":"assisted")+'">'+
 (last.independent?"✦ Brawo! Udało Ci się bez pomocy.":"♡ Odpowiedź poznaliśmy wspólnie. To też świetny krok!")+
 '<strong lang="en">'+escapeHTML(v.phrase(t.word.en))+'</strong><small>'+escapeHTML(t.word.pl)+'</small></div>':
 wrong?'<div class="answer-feedback">Spróbuj jeszcze raz. Pomyłka jest częścią odkrywania!</div>':"";
 setStage(heading("ROZDZIAŁ "+(c.index+1)+" · ZAGADKA "+(a.step+1)+" / "+a.tasks.length,
  "Lumo prosi o <em>małą pomoc.</em>",tip)+
 '<div class="task-progress">'+a.tasks.map((x,i)=>'<span class="'+(i<a.step?"completed":i===a.step?"current":"")+'"></span>').join("")+'</div>'+
 '<div class="dialogue-bubble"><div class="bubble-owl">🦉</div><div><span>LUMO SAYS</span><strong'+(t.mode==="understand"?' lang="en"':'')+'>'+escapeHTML(cue)+'</strong></div>'+
 '<button class="listen-bubble" type="button" data-action="listen" aria-label="Posłuchaj angielskiego zdania">♫</button></div>'+
 '<div class="answer-cards">'+opts.map(o=>'<button type="button" class="answer-card'+(a.hints>=2&&o.key===t.word.key?" glows":"")+
 (answered&&o.key===t.word.key?" correct":"")+'" data-action="answer" data-word="'+escapeHTML(o.key)+'"'+(answered?' disabled':'')+
 (t.mode!=="understand"?' lang="en"':'')+'><span>'+escapeHTML(o.icon)+'</span><b>'+escapeHTML(o.label)+'</b></button>').join("")+'</div>'+
 (hint?'<div class="hint-message">'+escapeHTML(hint)+'</div>':"")+feedback+
 '<div class="page-buttons">'+(answered?btn("next-answer",a.step===a.tasks.length-1?"Zobacz odnaleziony promień →":"Kolejna zagadka →"):
 btn("hint",a.hints===0?"💡 Podpowiedź":a.hints===1?"✨ Podświetl odpowiedź":"♡ Odkryjmy razem","subtle"))+
 btn("listen","♫ Posłuchaj Lumo","subtle")+'</div>'+
 '<p class="answer-note">Nie ma ocen. Jeśli poprosisz o pomoc lub pomylisz odpowiedź, historia potoczy się dalej, a słowo wróci później w paszporcie.</p>',
 "CHAPTER 0"+(c.index+1)+" · YOUR ENGLISH")
}
function renderChapterEnd(){
 const a=story(),c=chapter(),id=a.route[a.chapter],v=T.getVenue(id),choice=c.choices.find(x=>x.id===id),assessed=a.tasks.length>0;
 setStage(heading("✦ ODNALEZIONO PROMIEŃ "+(a.chapter+1)+" Z 3",
 "Mamy kolejny <em>promień gwiazdy!</em>",choice.storyEnd)+
 scenePanel(v)+
 '<div class="ray-award"><span>✦</span><div><strong>Promień '+(a.chapter+1)+' · '+escapeHTML(choice.short)+'</strong>'+
 '<p>'+(assessed?"Poznaliśmy jeszcze kilka angielskich słów. Śmiało zabierz je ze sobą w dalszą podróż.":
 "Przeżyliśmy rozdział bez sprawdzianu. Możesz wrócić do niego, gdy poznasz odpowiednie słowa.")+'</p></div></div>'+
 '<div class="page-buttons">'+btn("finish-chapter",a.chapter===2?"Zapalmy gwiazdę! →":"Wyruszmy po następny promień →")+'</div>',
 "CHAPTER 0"+(c.index+1)+" · THE FOUND LIGHT")
}
function renderRestore(){
 const a=story(),ending=S.endingFor(a.route);
 if(!ending){showRepair();return}
 setStage(heading("✨ TRZY PROMIENIE · WIELKI FINAŁ",
 "Gwiazda zaczyna <em>świecić!</em>",
 "Dzięki Twoim decyzjom miasteczko odnalazło wszystkie trzy promienie. Zobacz, jaki finał napisała Twoja podróż.")+
 '<div class="restored-preview">'+ART.ending(ending.id)+'</div>'+
 '<div class="restored-box"><strong>'+escapeHTML(ending.title)+'</strong><p>Dotknij gwiazdy, żeby odkryć pełne zakończenie i zapisać je w swojej bibliotece.</p>'+
 '<span class="big-starlight" aria-hidden="true">✦</span></div>'+
 '<div class="page-buttons">'+btn("restore-star","Odkrywam zakończenie! ✦")+'</div>',
 "THE LOST STAR · THE FINALE")
}
function finale(run){
 const e=S.ENDINGS[run.ending];if(!e)return;
 $("hero-art").innerHTML=ART.ending(e.id);
 const path=S.routeLabels(run.route),unique=path.map(c=>c.symbol).join(" → ");
 setStage(heading("✦ TWOJE ZAKOŃCZENIE · THE END",escapeHTML(e.title)+" <em>✦</em>",
 "Oto jedyne w swoim rodzaju zakończenie tej drogi. Następnym razem możesz odkryć zupełnie inną opowieść.")+
 '<div class="final-illustration">'+ART.ending(e.id)+'</div>'+
 '<div class="final-verse"><span>'+escapeHTML(e.subtitle.toUpperCase())+'</span><p>'+escapeHTML(e.text)+'</p>'+
 '<strong lang="en">'+escapeHTML(e.english)+'</strong><button data-action="listen-final" type="button" aria-label="Posłuchaj zakończenia po angielsku">♫</button></div>'+
 '<div class="souvenir"><span>'+e.symbol+'</span><div><strong>'+escapeHTML(e.souvenir)+'</strong><small>Nowa pamiątka w bibliotece opowieści</small></div></div>'+
 '<div class="story-route-summary"><b>Twoja droga:</b> '+unique+'<small>'+run.answers+
 ' odpowiedzi językowych · '+run.independent+' samodzielnych. Podróż nie jest oceniana.</small></div>'+
 '<div class="page-buttons">'+btn("begin","Przeżyję inną opowieść →")+
 btn("see-library","Zobacz moje zakończenia","subtle")+
 '<a class="story-button subtle" href="../">Wróć do miasteczka</a></div>',
 "THE END · "+e.subtitle.toUpperCase())
}
function renderLibrary(){
 const known=new Set(data.runs.map(r=>r.ending));
 $("library-counter").textContent=known.size+" / 4 zakończeń";
 const gallery=$("ending-gallery");gallery.textContent="";
 Object.keys(S.ENDINGS).forEach(id=>{
  const e=S.ENDINGS[id],unlocked=known.has(id),card=document.createElement("div");
  card.className="ending-card"+(!unlocked?" undiscovered":"");
  card.style.setProperty("--ending-color",e.color);
  const art=document.createElement("span");art.className="ending-symbol";art.textContent=unlocked?e.symbol:"◇";
  const label=document.createElement("strong");label.textContent=unlocked?e.title:"Nieodkryta historia";
  const description=document.createElement("small");description.textContent=unlocked?e.souvenir:"Wybierz inną trasę, by odkryć ten finał.";
  card.append(art,label,description);gallery.appendChild(card)
 });
 const list=$("run-history");list.textContent="";
 data.runs.slice(-6).reverse().forEach((run,i)=>{
  const row=document.createElement("div");row.className="history-row";
  const mark=document.createElement("span");mark.textContent=S.ENDINGS[run.ending].symbol;
  const info=document.createElement("span"),title=document.createElement("strong"),sub=document.createElement("small");
  title.textContent=S.ENDINGS[run.ending].title;
  sub.textContent=S.routeLabels(run.route).map(x=>x.symbol).join(" → ")+" · "+run.independent+" samodzielnych / "+run.answers+" ćwiczeń";
  info.append(title,sub);row.append(mark,info);list.appendChild(row)
 });
 if(!data.runs.length){const p=document.createElement("p");p.className="empty-library";p.textContent="Pierwsze zakończenie dopiero na Ciebie czeka. Otwórz księgę i wybierz własną drogę!";list.appendChild(p)}
}
function renderPrint(){
 const p=$("print-body");p.textContent="";
 if(!data.runs.length){p.textContent="Odkrywca jeszcze tworzy swoją pierwszą opowieść.";return}
 const r=data.runs[data.runs.length-1],e=S.ENDINGS[r.ending];
 const h=document.createElement("h2");h.textContent=e.title;
 const desc=document.createElement("p");desc.textContent=e.text;
 p.append(h,desc);
 S.routeLabels(r.route).forEach((v,i)=>{
  const row=document.createElement("p");row.className="print-line";row.textContent=(i+1)+". "+v.symbol+" "+v.short+" — "+v.storyEnd;p.appendChild(row)
 });
 const quote=document.createElement("p");quote.textContent="Moje angielskie zdanie: "+e.english;p.appendChild(quote)
}
function render(){
 snapshot=P.readSnapshot(localStorage);data=S.read(localStorage);
 progress();renderLibrary();renderPrint();
 const a=story();
 if(!a){cover();return}
 $("hero-art").innerHTML=ART.cover;
 if(a.chapter===3){renderRestore();return}
 if(!a.route[a.chapter]){renderChoice();return}
 if(a.tasks.length===0){renderEncounter();return}
 if(a.step<a.tasks.length){renderQuestion();return}
 if(a.answers.length===a.tasks.length){renderChapterEnd();return}
 showRepair()
}
function showRepair(){
 setStage(heading("🦉 LUMO POTRZEBUJE POMOCY","Wróćmy do <em>ostatniego śladu.</em>",
 "Zmienił się zapis poznanych słów lub przerwano zadanie. Możesz wrócić do początku aktualnego rozdziału bez utraty wcześniej ukończonych części.")+
 '<div class="page-buttons">'+btn("repair","Wróć do wyboru w tym rozdziale →")+
 btn("restart","Rozpocznij nową opowieść","subtle")+'</div>',"A LITTLE DETOUR")
}
function restartChapter(){
 const a=story();if(!a)return;
 const next={...data,active:{...a,route:a.route.slice(0,a.chapter),tasks:[],answers:[],step:0,hints:0,missed:0}};
 save(next)
}
function startStory(){
 if(story()&&!window.confirm("Rozpocząć inną historię od początku? Ostatnie ukończone opowieści pozostaną w bibliotece."))return;
 save(S.begin(data))
}
function chooseRoute(id){
 const next=S.choose(data,id);if(!next)return;
 save(next)
}
function startQuiz(){
 const a=story();if(!a||a.tasks.length)return;
 const next=S.startTasks(data,snapshot);if(!next)return;
 if(!next.active.tasks.length){toast("W tej krainie brakuje dwóch poznanych słów. Odkryjmy historię bez testu.");return}
 save(next)
}
function askHint(){
 const a=story();if(!a)return;
 if(a.hints<2)save(S.hint(data));
 else{const t=S.taskView(a,snapshot);if(t)makeAnswer(t.word.key)}
}
function makeAnswer(key){
 const a=story();if(!a)return;
 const check=S.answer(data,snapshot,key);
 if(!check)return;
 if(!check.correct){save(check.data);return}
 const next=check.data;
 if(!S.write(localStorage,next)){toast("Nie można zapisać historii; spróbuj ponownie.");return}
 data=next;
 const history=P.applyAnswer(P.readHistory(localStorage),check.record.key,check.independent,Date.now());
 if(!P.saveHistory(localStorage,history.history))toast("Historia zapisana, ale nie udało się zapisać powtórki w paszporcie.");
 render()
}
function moveOn(){
 const a=story();if(!a)return;
 if(a.step<a.tasks.length){save(S.next(data));return}
 save(S.chapterDone(data))
}
function finishChapter(){save(S.chapterDone(data))}
function finishStory(){
 const result=S.finish(data);if(!result)return;
 const record=result.final;
 const next={version:1,runs:result.runs,active:null};
 if(!S.write(localStorage,next)){toast("Nie udało się zapisać zakończenia.");return}
 data=next;progress();renderLibrary();renderPrint();finale(record)
}
function playTask(){
 const a=story();if(!a)return;
 const t=S.taskView(a,snapshot);
 if(!t)return;
 const v=T.getVenue(a.route[a.chapter]);
 speak(a.chapter===1?v.phrase(t.word.en):a.chapter===2?v.phrase(t.word.en):"Find the "+t.word.en+".")
}
function act(name,value){
 switch(name){
 case "begin":startStory();break;
 case "choose":chooseRoute(value);break;
 case "start-quiz":startQuiz();break;
 case "skip-quiz":finishChapter();break;
 case "answer":makeAnswer(value);break;
 case "hint":askHint();break;
 case "next-answer":moveOn();break;
 case "finish-chapter":finishChapter();break;
 case "restore-star":finishStory();break;
 case "listen":playTask();break;
 case "listen-final":{const runs=data.runs;const end=runs.length?S.ENDINGS[runs[runs.length-1].ending]:null;if(end)speak(end.english);break}
 case "change-route":restartChapter();break;
 case "repair":restartChapter();break;
 case "restart":startStory();break;
 case "see-library":$("history").scrollIntoView({behavior:"smooth",block:"start"});break;
 }
}
$("story-stage").addEventListener("click",e=>{
 const button=e.target.closest("[data-action]");if(!button)return;
 act(button.dataset.action,button.dataset.venue||button.dataset.word||"")
});
$("voice-toggle").addEventListener("click",()=>{
 speaker=!speaker;try{localStorage.setItem("nea2-story-voice-v1",speaker?"on":"off")}catch(e){}
 if(!speaker&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 $("voice-toggle").textContent=speaker?"♫":"♪";
 $("voice-toggle").setAttribute("aria-label",speaker?"Wyłącz angielską wymowę":"Włącz angielską wymowę");
 $("voice-toggle").setAttribute("aria-pressed",String(speaker))
});
$("lumo-say").addEventListener("click",()=>speak("Hello, Explorer! We can find the lost star!"));
$("print-story").addEventListener("click",()=>{renderPrint();try{window.print()}catch(e){toast("Drukowanie jest niedostępne.")}});
window.addEventListener("pageshow",render);
window.addEventListener("storage",e=>{if(e.key===S.KEY||P.CATALOG.some(x=>x.storage.key===e.key))render()});
window.EA2Story=Object.freeze({inspect:()=>({
 active:data.active?{chapter:data.active.chapter,route:data.active.route.slice(),tasks:data.active.tasks.slice(),answers:data.active.answers.slice(),step:data.active.step,hints:data.active.hints,missed:data.active.missed}:null,
 endings:data.runs.map(r=>r.ending),runs:data.runs.length,
 knownPlaces:S.CHAPTERS.map(c=>c.choices.map(x=>({id:x.id,known:S.known(P.readSnapshot(localStorage),x.id).length})))
}),act});
if(!speaker){$("voice-toggle").textContent="♪";$("voice-toggle").setAttribute("aria-pressed","false");$("voice-toggle").setAttribute("aria-label","Włącz angielską wymowę")}
render()
})();