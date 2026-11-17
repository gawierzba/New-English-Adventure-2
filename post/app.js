"use strict";
/* Stage 15.1-15.2, four functional letters and a trustworthy stamp book.
 * No account, tracking, microphone, or "learning by mere opening".
 * All language evidence is shared only through the Passport review scheduler. */
(()=>{
const P=window.EA2_PASSPORT_ENGINE, E=window.EA2_LUMO_POST_ENGINE, A=window.EA2_LUMO_POST_ART;
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
let state=E.read(localStorage),snapshot=P.readSnapshot(localStorage),sound=localStorage.getItem("nea2-post-voice-v1")!=="off",toastTimer=null;
function toast(message){
 const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>t.classList.remove("show"),3100)
}
function speak(en){
 if(!sound){toast("Wymowa jest wyłączona. Możesz ją włączyć przy górnym menu.");return}
 if(!("speechSynthesis" in window&&"SpeechSynthesisUtterance" in window)){
  toast("Ta przeglądarka nie obsługuje odczytywania angielskich zdań.");return
 }
 try{
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(en);
  u.lang="en-GB";u.rate=.81;u.pitch=1.07;
  const voice=window.speechSynthesis.getVoices();
  const select=voice.find(v=>/^en[-_]GB/i.test(v.lang))||voice.find(v=>/^en/i.test(v.lang));
  if(select)u.voice=select;
  window.speechSynthesis.speak(u)
 }catch(e){toast("Nie udało się odtworzyć wymowy.")}
}
function persist(next){
 if(!next)return false;
 state=next;
 if(!E.save(localStorage,state))toast("Przeglądarka nie pozwala zapisać postępu poczty.");
 render();return true
}
function counters(){
 const s=E.stats(state,snapshot);
 $("opened-count").innerHTML=s.opened+"<small>/"+s.total+"</small>";
 $("finished-count").innerHTML=s.completed+"<small>/"+s.total+"</small>";
 $("stamp-count").innerHTML=s.completed+"<small>/"+s.total+"</small>";
 $("album-label").textContent=s.completed+" / "+s.total+" ODKRYTE"
}
function drawLetters(){
 const grid=$("letter-grid");grid.textContent="";
 E.LETTERS.forEach((l,i)=>{
  const item=state.letters[l.id],known=E.words(snapshot,l).length,can=E.eligible(snapshot,l);
  const b=document.createElement("button");b.type="button";b.dataset.letter=l.id;
  b.className="letter-card"+(item.completed?" done":"")+(state.selected===l.id?" selected":"");
  b.style.setProperty("--letter-color",l.color);b.style.setProperty("--letter-paper",l.paper);
  b.setAttribute("aria-label","Otwórz list: "+l.title+", od "+l.name);
  b.innerHTML='<span class="letter-overline">LETTER NO. 0'+(i+1)+' · '+escapeHTML(l.english.toUpperCase())+'</span>'+
   '<div class="letter-art"><div class="letter-envelope"><span class="letter-seal" aria-hidden="true">'+l.seal+'</span></div></div>'+
   '<h3 class="letter-title">'+escapeHTML(l.title)+'</h3>'+
   '<span class="letter-from">Od: '+escapeHTML(l.name)+' · '+escapeHTML(l.from)+'</span>'+
   '<div class="letter-card-bottom"><span class="label">'+(item.completed?"✦ Stempel zdobyty":can?
    "✧ Gotowe do ćwiczeń":known?"🌱 Poznane "+known+" słowo":"✉ Czeka na otwarcie")+
   '</span><span class="arrow" aria-hidden="true">↗</span></div>';
  grid.appendChild(b)
 })
}
function drawAlbum(){
 const gallery=$("album-grid");gallery.textContent="";
 E.LETTERS.forEach(l=>{
  const st=state.letters[l.id],card=document.createElement("article");
  card.className="album-card"+(st.completed?"":" locked");
  card.style.setProperty("--letter-color",l.color);card.style.setProperty("--letter-paper",l.paper);
  const stamp=document.createElement("div");stamp.className="stamp-graphic";stamp.textContent=st.completed?l.seal:"◇";
  const title=document.createElement("strong");title.textContent=st.completed?"Stempel od "+l.name:"Jeszcze nieodkryty";
  const info=document.createElement("small");
  info.textContent=st.completed?(st.independent?"Co najmniej jeden list rozwiązany bez pomocy.":"List ukończony wspólnie z Lumo."):"Otwórz list i ukończ dwie krótkie zagadki.";
  const link=document.createElement("button");link.type="button";link.dataset.letter=l.id;link.textContent=st.completed?"Czytaj ponownie ↗":"Otwórz kopertę ↗";
  card.append(stamp,title,info,link);gallery.appendChild(card)
 })
}
function stage(html,kicker,tip){
 $("desk-stage").innerHTML=html;
 $("desk-page-label").textContent=kicker||"HELLO, EXPLORER!";
 if(tip)$("lumo-tip").textContent=tip
}
function header(marker,title,desc){
 return '<span class="desk-tag">'+marker+'</span><h3 class="desk-title">'+title+'</h3><p class="desk-intro">'+desc+'</p>'
}
function action(name,label,kind="mail-button"){
 return '<button type="button" class="'+kind+'" data-action="'+name+'">'+label+'</button>'
}
function actions(...buttons){return '<div class="mail-actions">'+buttons.join("")+'</div>'}
function showWelcome(){
 stage(header("🦉 A LETTER FROM LUMO","You've got <em>mail!</em>","W gwiezdnym oknie pojawiły się cztery wiadomości od przyjaciół. Którą kopertę chcesz otworzyć jako pierwszą?")+
 '<div class="welcome-mail"><span class="big-owl" aria-hidden="true">🦉</span><div><strong>Hello, Little Explorer!</strong>'+
 '<p>To ja, Lumo. Moja poczta lubi małe odkrycia. Listy możesz czytać zawsze — bez żadnego sprawdzianu. Gdy poznasz odpowiednie słówka, zaproszę Cię do dwóch zagadek i przygotuję pamiątkowy stempel.</p></div></div>'+
 '<div class="welcome-steps"><div><b>💌</b> Otwórz</div><div><b>🎧</b> Posłuchaj</div><div><b>✦</b> Odbierz stempel</div></div>'+
 actions(action("to-inbox","Wybieram pierwszą kopertę ↗")),
 "THE FIRST LETTER","Każdy list jest otwarty dla ciekawych świata. Możesz zacząć od dowolnego bohatera.")
}
function letterPaper(l){
 return '<div class="letter-open" style="--letter-color:'+l.color+';--letter-paper:'+l.paper+'">'+
 '<div class="letter-open-icon" aria-hidden="true">'+l.icon+'</div>'+
 '<div><span>FROM: '+escapeHTML(l.from.toUpperCase())+' · TO: LITTLE EXPLORER</span>'+
 '<h4>'+escapeHTML(l.salutation)+'</h4><p>'+escapeHTML(l.story)+'</p>'+
 '<strong lang="en">'+escapeHTML(l.phrase(l.words[0]))+'</strong>'+
 '<small>Signed: '+escapeHTML(l.sign)+' · Posłuchaj przykładowego zdania, jeśli masz ochotę.</small></div></div>'
}
function showLetter(){
 const l=E.letter(state.selected);
 if(!l){showWelcome();return}
 const known=E.words(snapshot,l),can=E.eligible(snapshot,l);
 if(state.active&&state.active.id===l.id){showQuiz();return}
 if(state.letters[l.id].completed){showFinished(l);return}
 const note=can?'<div class="study-gate"><strong>✦ List gotowy do ćwiczeń!</strong> Znane słowa: '+known.length+' z '+l.words.length+
 '. Lumo przygotuje dwie krótkie zagadki tylko z tego, co już poznano w krainie.</div>':
 '<div class="study-gate locked"><strong>🌱 Jeszcze spokojnie odkrywamy.</strong> Poznano '+known.length+' z '+l.words.length+
 ' słów z listu. Aby rozwiązać zadania, odwiedź odpowiednią krainę i poznaj co najmniej dwa różne wyrazy. Samo otwarcie koperty nie zalicza nauki.</div>';
 stage(header("✉ ROZPIECZĘTOWANA KOPERTA",escapeHTML(l.title)+" <em>✧</em>",
  "Przeczytaj wiadomość od przyjaciela. Możesz ją odsłuchać, a dopiero później — gdy znasz potrzebne słówka — rozwiązać mini-zadania.")+
 letterPaper(l)+note+
 actions(action("hear-letter","♫ Posłuchaj zdania","mail-button alt"),
  can?action("start-letter","🧩 Odpowiadam na list →"):'<a class="mail-button" href="'+l.link+'">Poznaj słówka w krainie '+l.unit+' ↗</a>',
  action("to-inbox","Inna koperta","mail-button quiet")),
 "LETTER FROM "+l.name.toUpperCase(),"Najpierw przeczytaj list. Zadania uruchamiamy tylko z już poznanych słów.")
}
function showQuiz(){
 const a=state.active,l=E.letter(a.id),q=E.task(state,snapshot);
 if(!q){showRepair();return}
 const answered=a.answers.length>a.index,record=answered?a.answers[a.index]:null;
 const topic=a.index===0?"POSŁUCHAJ WIADOMOŚCI":"PRZECZYTAJ I ODPOWIEDZ";
 const label=a.index===0?
  "Lumo mówi po angielsku. Wskaż znaczenie tej wiadomości.":
  "Przeczytaj polskie hasło i wybierz pełne angielskie zdanie.";
 const cue=a.index===0?q.sentence:"Jak opiszesz po angielsku: „"+q.target.pl+"”?";
 const opts=q.choices.map(w=>{
  const right=w.key===q.target.key,glow=a.hint>=2&&right,yes=answered&&right;
  const answer=a.index===0?w.pl:l.phrase(w.en);
  return '<button type="button" class="answer-option'+(glow?" glow":"")+(yes?" right":"")+
   '" data-action="answer" data-key="'+escapeHTML(w.key)+'"'+(answered?' disabled':'')+
   (a.index===1?' lang="en"':'')+'><span aria-hidden="true">'+w.icon+'</span><b>'+escapeHTML(answer)+'</b></button>'
 }).join("");
 const questionHint=a.hint===1?(a.index===0?'To po polsku: '+q.target.pl+'.':
 'Szukaj zdania, w którym występuje słowo zaczynające się na „'+q.target.en[0].toUpperCase()+'”.'):
 a.hint>=2?"Lumo podświetliła właściwą odpowiedź. Możesz ją wybrać i przejść dalej.":"";
 const feedback=answered?'<div class="quiz-feedback '+(record.independent?"good":"help")+'">'+
 (record.independent?"✦ Świetnie! Samodzielna odpowiedź.":"♡ Rozwiązaliśmy to wspólnie. To także dobra nauka.")+
 '<strong lang="en">'+escapeHTML(q.sentence)+'</strong><small>'+escapeHTML(q.target.pl)+'</small></div>':
 a.mistakes?'<div class="quiz-feedback">Spróbuj jeszcze raz. Wybierz zdanie lub obrazek pasujący do wiadomości Lumo.</div>':"";
 stage(header("✦ "+topic,"Zagadka "+(a.index+1)+" <em>z 2.</em>",label)+
 '<div class="mailmeter"><span class="'+(a.index===0?"active":"passed")+'"></span><span class="'+(a.index===1?"active":"")+'"></span></div>'+
 '<div class="quiz-letter-cue"><span class="owl-icon" aria-hidden="true">🦉</span><div><span>LUMO SAYS</span>'+
 '<strong'+(a.index===0?' lang="en"':'')+'>'+escapeHTML(cue)+'</strong></div>'+
 '<button type="button" data-action="hear-question" aria-label="Posłuchaj angielskiego zdania">♫</button></div>'+
 '<div class="answer-options">'+opts+'</div>'+
 (questionHint?'<div class="quiz-hint">'+escapeHTML(questionHint)+'</div>':"")+
 feedback+
 actions(answered?action("next-question",a.index===a.tasks.length-1?"Odbierz stempel pocztowy →":"Kolejna zagadka →"):
 action("hint",a.hint===0?"💡 Mała podpowiedź":a.hint===1?"✨ Podświetl odpowiedź":"♡ Odkryjmy razem","mail-button alt"),
 action("hear-question","♫ Posłuchaj","mail-button alt"),
 action("read-letter","Wróć do listu","mail-button quiet"))+
 '<p class="quiz-note">Nie ma ocen ani stopera. Po pomyłce lub podpowiedzi zapisujemy próbę z pomocą, nie samodzielny sukces.</p>',
 "TASK "+(a.index+1)+" / "+a.tasks.length,
 "Wybierz odpowiedź, która pasuje do wiadomości. Podpowiedź nie blokuje zabawy.")
}
function showRepair(){
 const l=E.letter(state.selected);
 stage(header("✉ MAŁA PRZERWA","Lumo <em>porządkuje listy.</em>",
 "Dane poznanych słów zmieniły się podczas zagadki. Zobacz ponownie list i rozpocznij nową próbę, gdy będziesz gotowy.")+
 actions(action("repair","Wróć do otwartego listu →")),
 "LET'S TRY AGAIN","Możesz zawsze wrócić do koperty. Stare ukończone listy pozostają w albumie.")
}
function showFinished(l){
 const record=state.letters[l.id];
 const symbol=l.seal;
 stage(header("✦ THE LETTER IS DELIVERED","Pieczątka od <em>"+escapeHTML(l.name)+"!</em>",
 "Odpowiedź dotarła do nadawcy, a do Twojego albumu trafił kolejny pamiątkowy stempel.")+
 '<div class="post-closure"><span aria-hidden="true">'+symbol+'</span><strong>'+escapeHTML(l.title)+'</strong>'+
 '<blockquote lang="en">'+escapeHTML(l.thanks)+'</blockquote>'+
 '<p>'+escapeHTML(l.story)+'</p><small>'+(record.independent?
 "Podczas co najmniej jednej wizyty obie zagadki zostały rozwiązane bez podpowiedzi.":
 "Zadania udało się ukończyć z pomocą Lumo. Możesz wrócić i spróbować samodzielnie.")+'</small></div>'+
 actions(action("hear-thanks","♫ Posłuchaj odpowiedzi","mail-button alt"),
  action("repeat-letter","Rozwiąż list ponownie ↻"),
  action("to-album","Zobacz stemple","mail-button alt"),
  action("to-inbox","Inna koperta","mail-button quiet")),
 "STAMP COLLECTED","Brawo za ukończenie całego listu! Możesz wrócić do tej koperty w każdej chwili.")
}
function scrollTo(id){
 const el=$(id);if(!el)return;
 const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 el.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})
}
function selectLetter(id){
 if(!E.letter(id))return;
 state=E.visit(E.read(localStorage),id);persist(state);scrollTo("maildesk")
}
function beginLetter(){
 const id=state.selected,l=E.letter(id);if(!l)return;
 const next=E.start(state,snapshot,id);
 if(!next){toast("Do ćwiczeń potrzebne są dwa poznane słowa z krainy "+l.unit+".");return}
 persist(next)
}
function answer(key){
 const result=E.answer(state,snapshot,key);
 if(!result)return;
 if(!result.correct){persist(result.state);return}
 if(!E.save(localStorage,result.state)){toast("Nie udało się zapisać odpowiedzi w poczcie.");return}
 state=result.state;
 const updated=P.applyAnswer(P.readHistory(localStorage),result.record.key,result.independent,Date.now());
 if(!P.saveHistory(localStorage,updated.history))toast("Odpowiedź zapisana w poczcie, ale powtórka nie została zapisana w paszporcie.");
 render()
}
function hint(){
 const a=state.active,q=E.task(state,snapshot);
 if(!a||!q)return;
 if(a.hint<2){persist(E.hint(state));return}
 answer(q.target.key)
}
function nextQuestion(){
 const a=state.active;if(!a||a.answers.length<=a.index)return;
 const next=E.next(state);if(!next)return;
 if(next.active.index>=next.active.tasks.length){
  const finished=E.finish(next);if(finished){persist(finished);toast("✦ Stempel z listu został dodany do albumu!")}
  return
 }
 persist(next)
}
function showOpenedAgain(){const a=state.active;if(!a)return;persist({...state,active:null})}
function render(){
 snapshot=P.readSnapshot(localStorage);state=E.read(localStorage);
 $("mailroom-art").innerHTML=A.room;
 counters();drawLetters();drawAlbum();
 if(!state.selected){showWelcome();return}
 showLetter()
}
function action(name,value){
 switch(name){
  case "to-inbox":scrollTo("letters");break;
  case "to-album":scrollTo("stamps");break;
  case "hear-letter":{const l=E.letter(state.selected);if(l)speak(l.salutation+" "+l.phrase(l.words[0]));break}
  case "start-letter":beginLetter();break;
  case "hear-question":{const q=E.task(state,snapshot);if(q)speak(q.sentence);break}
  case "answer":answer(value);break;
  case "hint":hint();break;
  case "next-question":nextQuestion();break;
  case "read-letter":showOpenedAgain();break;
  case "repair":showOpenedAgain();break;
  case "hear-thanks":{const l=E.letter(state.selected);if(l)speak(l.thanks);break}
  case "repeat-letter":beginLetter();break;
 }
}
$("letter-grid").addEventListener("click",e=>{
 const b=e.target.closest("[data-letter]");if(b)selectLetter(b.dataset.letter)
});
$("album-grid").addEventListener("click",e=>{
 const b=e.target.closest("[data-letter]");if(b)selectLetter(b.dataset.letter)
});
$("desk-stage").addEventListener("click",e=>{
 const b=e.target.closest("[data-action]");if(b)action(b.dataset.action,b.dataset.key||"")
});
$("lumo-greeting").addEventListener("click",()=>speak("Hello, Explorer! You've got mail! Let's open a letter."));
$("sound-toggle").addEventListener("click",()=>{
 sound=!sound;try{localStorage.setItem("nea2-post-voice-v1",sound?"on":"off")}catch(e){}
 if(!sound&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 $("sound-toggle").textContent=sound?"♫":"♪";
 $("sound-toggle").setAttribute("aria-label",sound?"Wyłącz angielską wymowę":"Włącz angielską wymowę");
 $("sound-toggle").setAttribute("aria-pressed",String(sound))
});
window.addEventListener("pageshow",render);
window.addEventListener("storage",e=>{
 if(e.key===E.KEY||e.key===P.HISTORY_KEY||P.CATALOG.some(u=>u.storage.key===e.key))render()
});
window.EA2StarPost=Object.freeze({
 inspect:()=>({opened:E.LETTERS.filter(l=>state.letters[l.id].opened).map(l=>l.id),
  completed:E.LETTERS.filter(l=>state.letters[l.id].completed).map(l=>l.id),
  independent:E.LETTERS.filter(l=>state.letters[l.id].independent).map(l=>l.id),
  selected:state.selected,active:state.active?{id:state.active.id,index:state.active.index,
   hint:state.active.hint,mistakes:state.active.mistakes,tasks:state.active.tasks.map(t=>({...t})),
   answers:state.active.answers.map(a=>({...a}))}:null}),
 open:selectLetter,action
});
if(!sound){$("sound-toggle").textContent="♪";$("sound-toggle").setAttribute("aria-label","Włącz angielską wymowę");$("sound-toggle").setAttribute("aria-pressed","false")}
render();
})();