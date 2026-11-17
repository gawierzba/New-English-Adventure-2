"use strict";
/* Paszport Małego Odkrywcy — verified world progress and first spaced reviews.
   No child account or microphone. Local data only. */
(()=>{
const Engine=window.EA2_PASSPORT_ENGINE,$=id=>document.getElementById(id),KEY=Engine.HISTORY_KEY;
let snapshot=null,quiz=null,toastJob=null;
const now=()=>Date.now();
const words=a=>Array.isArray(a)?a:[];
function refresh(renderIntro=false){
 snapshot=Engine.readSnapshot(localStorage,now());
 renderNumbers();renderStamps();renderUpcoming();renderPrintable();
 if(renderIntro||!quiz)renderWelcome()
}
function toast(text){const e=$("toast");e.textContent=text;e.classList.add("show");clearTimeout(toastJob);toastJob=setTimeout(()=>e.classList.remove("show"),3500)}
function number(n){return String(Math.max(0,Math.floor(Number(n)||0)))}
function renderNumbers(){
 const t=snapshot.totals;
 $("seen-count").innerHTML=number(t.seen)+"<small>/"+t.total+"</small>";
 $("recognized-count").textContent=number(t.recognized);
 $("visited-count").innerHTML=number(t.visited)+"<small>/8</small>";
 $("due-count").textContent=number(t.due)
}
function renderStamps(){
 const grid=$("stamp-grid");grid.textContent="";
 snapshot.worlds.forEach((w,i)=>{
  const el=document.createElement("a");
  el.href="../unit-"+w.id+"/";
  el.className="stamp-card "+(w.seen?"is-visited":"is-blank");
  el.style.setProperty("--stamp-color",w.color);
  el.style.setProperty("--tilt",((i%4)-1.5)*4+"deg");
  el.setAttribute("aria-label","Kraina "+w.id+" — "+w.title+", "+w.seen+" poznanych z "+w.total+", "+w.recognized+" rozpoznanych samodzielnie.");
  el.innerHTML='<span class="stamp-number">KRAINA 0'+w.id+'</span>'+
   '<div class="stamp-seal" aria-hidden="true"><span class="seal-emoji">'+w.icon+'</span><span class="seal-tag">'+(w.seen?"DISCOVERED":"EXPLORE")+'</span></div>'+
   '<strong>'+w.title+'</strong><span class="pl">'+w.pl+'</span>'+
   '<span class="stamp-state">'+(w.seen?"✦ "+w.seen+"/"+w.total+" poznanych":"○ Nieodkryta kraina")+'</span>'+
   '<div class="stamp-meter"><span style="width:'+(w.total?Math.round(w.seen/w.total*100):0)+'%"></span></div>'+
   '<span class="stamp-practice">'+(w.recognized?w.recognized+" rozpoznanych samodzielnie":"Każde słowo to nowy krok")+'</span>';
  grid.appendChild(el)
 });
 const t=snapshot.totals;
 $("book-message").textContent=t.visited===0?"Pierwsza pieczątka już na Ciebie czeka.":
 t.visited===8?"Wspaniale! Odkryłeś wszystkie osiem krain.":"Masz pieczątki z "+t.visited+" z 8 krain. Odkrywaj dalej!"
}
function dateLabel(timestamp){
 if(!timestamp)return"Przy kolejnej wizycie";
 const today=new Date(),then=new Date(timestamp);
 const todayStart=new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime();
 const nextStart=todayStart+24*60*60*1000;
 if(timestamp<nextStart)return"Dziś później";
 if(timestamp<nextStart+24*60*60*1000)return"Jutro";
 return new Intl.DateTimeFormat("pl-PL",{day:"numeric",month:"short"}).format(then)
}
function renderUpcoming(){
 const el=$("next-reviews");el.textContent="";
 const upcoming=Engine.readNext(snapshot,now(),4);
 if(upcoming.length===0){
  const p=document.createElement("p");p.textContent=snapshot.totals.seen===0?
   "Odkryj pierwsze słówka w jednej z krain, a pojawi się tutaj dalszy plan.":
   snapshot.totals.due?"Słowa do przypomnienia czekają w Akademii Powtórek.":"Nie masz jeszcze zaplanowanych późniejszych powrotów. Wybierz krótką powtórkę.";
  el.appendChild(p);return
 }
 upcoming.forEach(w=>{
  const line=document.createElement("div");line.className="next-review";
  const icon=document.createElement("span");icon.className="next-icon";icon.textContent=w.icon;
  const body=document.createElement("span");
  const h=document.createElement("strong");h.textContent=w.en;
  const hint=document.createElement("small");hint.textContent=w.pl+" · "+dateLabel(w.review.dueAt);
  body.append(h,hint);line.append(icon,body);el.appendChild(line)
 })
}
function renderPrintable(){
 const t=snapshot.totals;
 $("print-summary").textContent="Poznane: "+t.seen+" z "+t.total+" | Samodzielnie rozpoznane: "+t.recognized+" | Odwiedzone krainy: "+t.visited+" z 8.";
 const grid=$("print-stamps");grid.textContent="";
 snapshot.worlds.forEach(w=>{
  const item=document.createElement("div");item.className="print-stamp";
  const symbol=document.createElement("div");symbol.className="print-circle"+(w.seen?"":" empty");symbol.textContent=w.icon;
  const info=document.createElement("div");
  const title=document.createElement("strong");title.textContent="Kraina "+w.id+" · "+w.title;
  const details=document.createElement("small");details.textContent=w.seen+" z "+w.total+" poznanych · "+w.recognized+" rozpoznanych samodzielnie";
  info.append(title,details);item.append(symbol,info);grid.appendChild(item)
 })
}
function body(content){$("review-stage").innerHTML=content}
const btn=(act,text,cls="review-btn")=>'<button type="button" data-action="'+act+'" class="'+cls+'">'+text+'</button>';
const stageHead=(k,title,intro)=>'<span class="stage-tag">'+k+'</span><h3 class="stage-title">'+title+'</h3><p class="stage-intro">'+intro+'</p>';
function renderWelcome(){
 const t=snapshot.totals;
 if(t.seen===0){
  body(stageHead("🌱 PIERWSZA WYPRAWA","Twój paszport <em>czeka na odkrycia.</em>","Na razie nie znalazłem poznanych słów zapisanych w ośmiu krainach. Wróć do dowolnego świata i otwórz pierwsze karty.")+
  '<div class="review-empty"><div class="empty-emoji">🗺️</div><div><strong>Zaczynamy od pierwszego słowa!</strong>'+
  '<p>Nie będziemy zadawać pytań o słowa, których jeszcze nie poznano. Możesz zacząć w świecie robota albo wybrać inną krainę z mapy.</p></div></div>'+
  '<div class="review-actions"><a class="review-btn" href="../unit-1/">🚀 Odwiedź pierwszą krainę</a><a class="review-btn light" href="../index.html#mapa">🧭 Wybierz inną</a></div>'+
  '<p class="tiny-note">Jeżeli na dawnej fiszce ręcznie zaznaczyłeś słowo, paszport nie traktuje tego jako potwierdzonej nauki.</p>');return
 }
 if(t.seen===1){
  const first=snapshot.all.find(w=>w.seen);
  body(stageHead("🌿 DOPIERO ZACZYNAMY","Pierwsze słowo <em>odkryte!</em>","W paszporcie jest już "+first.en+" — "+first.pl+". Zanim zaczniemy zabawę z wybieraniem odpowiedzi, poznajmy jeszcze jedno słowo.")+
  '<div class="review-empty"><div class="empty-emoji">'+first.icon+'</div><div><strong>Jeszcze jedno odkrycie.</strong>'+
  '<p>Do uczciwego pytania potrzebujemy co najmniej dwóch wcześniej poznanych słów. Nie będę wymyślać nieznanych odpowiedzi.</p></div></div>'+
  '<div class="review-actions"><a class="review-btn" href="../unit-'+first.unit+'/">Odkryj kolejne słowo →</a></div>');return
 }
 if(t.due===0){
  const next=Engine.readNext(snapshot,now(),1)[0];
  const info=next?"Najbliższa zaplanowana powtórka: "+dateLabel(next.review.dueAt)+".":"Na razie możesz utrwalać słowa wtedy, kiedy zechcesz.";
  body(stageHead("🌟 DZIŚ WSZYSTKO PRZYPOMNIANE","Dobra praca, <em>Odkrywco!</em>","Nie masz teraz zaległych powtórek. "+info)+
  '<div class="review-empty"><div class="empty-emoji">🌈</div><div><strong>Odkrywanie nie ma końca.</strong><p>Możesz odwiedzić nową krainę lub wybrać dodatkową, dobrowolną powtórkę z tego, co już znasz.</p></div></div>'+
  '<div class="review-actions">'+btn("start-extra","✦ Powtórzę dla przyjemności")+'<a class="review-btn light" href="../index.html#mapa">Wróć do krain →</a></div>'+
  '<p class="tiny-note">Wczesna dodatkowa powtórka także może zaktualizować następny termin przypomnienia.</p>');return
 }
 body(stageHead("✦ MOJA MAŁA POWTÓRKA","Dziś przypomnimy sobie <em>kilka słów!</em>","W paszporcie czeka "+t.due+" "+(t.due===1?"słowo":t.due<5?"słowa":"słów")+". Wybiorę maksymalnie sześć, ze znanych już krain. Będą też wskazówki, jeśli coś umknęło.")+
 '<div class="review-empty"><div class="empty-emoji">🎒</div><div><strong>Ty decydujesz, kiedy zaczynamy.</strong>'+
 '<p>Raz wybieramy angielską nazwę, innym razem polskie znaczenie. Posłuchaj wymowy, spróbuj odpowiedzieć i nie przejmuj się pomyłkami.</p></div></div>'+
 '<div class="review-actions">'+btn("start-review","Wyruszam na krótką powtórkę ↗")+
 '<a class="review-btn light" href="../index.html#mapa">Najpierw odwiedzę krainę</a></div>'+
 '<p class="tiny-note">Wszystkie odpowiedzi pochodzą z poznanego materiału. Bez stopera, ocen i przypadkowych trudnych słów.</p>')
}
function makeQuiz(force=false){
 snapshot=Engine.readSnapshot(localStorage,now());
 const list=Engine.selectReviewItems(snapshot,now(),6,force);
 const qs=list.map((item,i)=>Engine.makeQuestion(item,snapshot,i)).filter(q=>q.options.length>=2);
 if(!qs.length){toast("Najpierw poznaj dwa różne słowa w krainach.");refresh(true);return}
 quiz={qs,index:0,hint:0,wrong:null,misses:0,done:false,assisted:false,results:[],extra:force};
 renderQuestion();
 $("review").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})
}
const dots=(index,total)=>'<div class="count-dots" role="img" aria-label="Krok '+(index+1)+' z '+total+'">'+Array.from({length:total},(_,k)=>'<span class="'+(k<index?"done":k===index?"current":"")+'"></span>').join("")+'</div>';
function renderQuestion(){
 if(!quiz)return;
 const q=quiz.qs[quiz.index],item=q.item,isPL=q.mode==="polish-to-english",isPicture=q.mode==="picture-to-english";
 const main=isPicture?item.icon:isPL?item.pl:item.en;
 const label=isPicture?"JAK NAZYWA SIĘ TEN OBRAZEK?":isPL?"JAK POWIESZ PO ANGIELSKU?":"CO TO ZNACZY PO POLSKU?";
 const desc=isPicture?"Zgadnij nazwę z poznanych kart. Po obrazkowej zagadce możesz posłuchać angielskiego słowa.":isPL?"Wybierz angielską nazwę. Jeśli nie pamiętasz, poproś o podpowiedź.":"Wybierz polskie znaczenie. Możesz też posłuchać wymowy.";
 const options=q.options.map((w,k)=>{
  const txt=(isPL||isPicture)?w.en:w.pl;
  const cls=quiz.done&&w.key===item.key?" correct":quiz.wrong===w.key?" incorrect":"";
  const highlighted=quiz.hint>=2&&w.key===item.key?" highlight":"";
  return'<button type="button" data-action="answer" data-value="'+w.key+'"'+(quiz.done?" disabled":"")+
   ' class="quiz-option'+cls+highlighted+'"'+((isPL||isPicture)?' lang="en"':"")+'><span>'+String.fromCharCode(65+k)+'</span>'+txt+'</button>'
 }).join("");
 const help=quiz.hint===1?'<div class="hint-box"><strong>✦ Pierwsza wskazówka:</strong> poprawna odpowiedź zaczyna się na literę <b>'+
  ((isPL||isPicture)?item.en:item.pl).slice(0,1).toUpperCase()+'</b>. Pomyśl o słowach z krainy „'+item.unitTitle+'”.</div>':
 quiz.hint>=2?'<div class="hint-box"><strong>✦ Druga wskazówka:</strong> Fela podświetliła prawidłową odpowiedź. Wskaż ją lub odkryj rozwiązanie razem z nią.</div>':"";
 const feedback=quiz.done?'<div class="question-feedback '+(quiz.assisted?"assisted":"good")+'">'+
 (quiz.assisted?"Przypomnieliśmy sobie razem! ":"Świetnie — tym razem udało się samodzielnie! ")+
 '<b lang="en">'+item.en+'</b> — '+item.pl+'.</div>':
 quiz.wrong?'<div class="question-feedback">To nie ta odpowiedź. Możesz spróbować ponownie, poprosić o pomoc albo odsłonić rozwiązanie. Niczego nie tracisz.</div>':"";
 const actions=quiz.done?
 btn("next-question",quiz.index===quiz.qs.length-1?"Zobacz naszą wyprawę →":"Następne słowo →")+
 btn("listen","♫ Posłuchaj angielskiej nazwy","review-btn light"):
 btn("hint",quiz.hint===0?"💡 Mała wskazówka":quiz.hint===1?"💡 Podświetl odpowiedź":"✨ Odkryjmy razem","review-btn light")+
 (isPL||isPicture?"":btn("listen","♫ Posłuchaj słowa","review-btn light"));
 body(stageHead("✦ POWTÓRKA · "+(quiz.index+1)+" / "+quiz.qs.length,
  "Poznane słowo, <em>nowe spojrzenie.</em>","Odpowiedz na spokojnie. Pomoc i ponowne próby są zawsze dostępne.")+
  dots(quiz.index,quiz.qs.length)+
  '<div class="question-box"><div class="question-icon" aria-hidden="true">'+(isPicture?"👀":isPL?"🔎":"🎧")+'</div>'+
  '<div><span class="question-meta">'+label+' · KRAINA 0'+item.unit+'</span>'+
  '<div class="question-main'+(isPicture?' visual-question':'')+'"'+(isPicture?' role="img" aria-label="Obrazek z poznanej krainy"':isPL?'':' lang="en"')+'>'+main+'</div>'+
  '<div class="question-desc">'+desc+'</div></div></div>'+
  '<div class="quiz-options">'+options+'</div>'+feedback+help+
  '<div class="review-actions">'+actions+btn("end-review","Zakończ na dziś","review-btn ghost")+'</div>'+
  '<p class="tiny-note">Rozpoznanie bez wskazówki jest zapisywane osobno. Po pomyłce lub pomocy słowo wróci do ćwiczeń wcześniej — to nie kara, tylko dodatkowa okazja do nauki.</p>')
}
function correctAnswer(forced=false){
 if(!quiz||quiz.done)return;
 const q=quiz.qs[quiz.index],independent=!forced&&quiz.hint===0&&quiz.misses===0;
 quiz.done=true;quiz.assisted=!independent;
 const saved=Engine.applyAnswer(Engine.readHistory(localStorage),q.item.key,independent,now());
 if(!Engine.saveHistory(localStorage,saved.history))toast("Nie udało się zapisać powtórki w tej przeglądarce.");
 quiz.results.push({en:q.item.en,pl:q.item.pl,unit:q.item.unit,independent});
 refresh(false);
 renderQuestion()
}
function answer(value){
 if(!quiz||quiz.done)return;
 const q=quiz.qs[quiz.index];
 if(value!==q.item.key){quiz.wrong=value;quiz.misses++;renderQuestion();return}
 correctAnswer(false)
}
function hint(){
 if(!quiz||quiz.done)return;
 if(quiz.hint<2){quiz.hint++;renderQuestion()}
 else correctAnswer(true)
}
function nextQuestion(){
 if(!quiz||!quiz.done)return;
 if(quiz.index>=quiz.qs.length-1){renderResult();return}
 quiz.index++;quiz.hint=0;quiz.wrong=null;quiz.misses=0;quiz.done=false;quiz.assisted=false;
 renderQuestion()
}
function speak(text){
 if(localStorage.getItem("nea2-sound-v1")==="off"){toast("Wymowa jest wyłączona na stronie głównej. Możesz ją tam włączyć.");return}
 if(!("speechSynthesis" in window&&"SpeechSynthesisUtterance" in window)){
  toast("Przeglądarka nie udostępnia wymowy. Angielskie słowo jest nadal widoczne.");return
 }
 try{
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang="en-GB";u.rate=.83;
  const voices=window.speechSynthesis.getVoices(),chosen=voices.find(v=>/^en[-_]GB/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));
  if(chosen)u.voice=chosen;
  window.speechSynthesis.speak(u)
 }catch(e){toast("Nie udało się odczytać nazwy — możesz skorzystać z tekstu.")}
}
function renderResult(){
 if(!quiz)return;
 const completed=quiz.results.length,ind=quiz.results.filter(r=>r.independent).length,help=completed-ind;
 const t=Engine.readSnapshot(localStorage,now()).totals;
 const chips=quiz.results.map(r=>'<span>'+r.en+(r.independent?" ✦":" ♡")+'</span>').join("");
 const more=t.due?btn("start-review","Kolejna mała powtórka ↗"):btn("start-extra","Jeszcze trochę poćwiczę");
 body('<div class="review-result"><div class="result-emoji" aria-hidden="true">🧭🌟</div>'+
  '<span class="stage-tag">✦ TWOJA MAŁA PODRÓŻ</span>'+
  '<h3>Every word is <em>an adventure!</em></h3>'+
  '<p>Świetnie, że próbowałeś! Każde przypomnienie wzmacnia znajomość angielskiego — także wtedy, gdy korzystamy z pomocy.</p>'+
  '<div class="result-grid"><span><strong>'+ind+'</strong> przypomnianych samodzielnie</span>'+
  '<span><strong>'+help+'</strong> odkrytych wspólnie</span></div>'+
  '<div class="words-review">'+chips+'</div>'+
  '<p>To nie są stopnie ani wyniki testu. Po prostu wiemy, do których słów warto wrócić. '+(t.due?"Czekają jeszcze kolejne słowa do powtórki.":"Pozostałe słowa wrócą w zaplanowanym czasie.")+'</p>'+
  '<div class="review-actions">'+more+btn("back-to-passport","Moje pieczątki","review-btn light")+'</div></div>');
 quiz=null
}
/* REVIEW MODULE */
refresh(true);
$("review-stage").addEventListener("click",e=>{
 const el=e.target.closest("[data-action]");if(!el)return;
 const action=el.dataset.action,value=el.dataset.value;
 switch(action){
  case "start-review":quiz=null;makeQuiz(false);break;
  case "start-extra":quiz=null;makeQuiz(true);break;
  case "answer":answer(value);break;
  case "hint":hint();break;
  case "listen":if(quiz)speak(quiz.qs[quiz.index].item.en);break;
  case "next-question":nextQuestion();break;
  case "end-review":renderResult();break;
  case "back-to-passport":$("passport").scrollIntoView({behavior:"smooth",block:"start"});break;
 }
});
$("passport-print").addEventListener("click",()=>{renderPrintable();try{window.print()}catch(e){toast("Drukowanie nie jest dostępne w tej przeglądarce.")}});
$("parent-toggle").addEventListener("click",()=>{
 const box=$("parent-details"),open=box.hidden;box.hidden=!open;
 $("parent-toggle").setAttribute("aria-expanded",String(open));
 $("parent-toggle").innerHTML=open?"Zwiń szczegóły <span>↑</span>":"Co dokładnie liczymy? <span>↓</span>"
});
$("review-reset").addEventListener("click",()=>{
 if(!window.confirm("Wyczyścić wyłącznie historię powtórek paszportu? Odkrycia w ośmiu krainach pozostaną bez zmian."))return;
 try{localStorage.removeItem(KEY)}catch(e){toast("Nie udało się usunąć historii powtórek.");return}
 quiz=null;refresh(true);toast("Historia powtórek wyczyszczona. Pieczątki z krain pozostały.")
});
window.addEventListener("pageshow",()=>refresh(!quiz));
window.addEventListener("focus",()=>{if(!quiz)refresh(true)});
window.addEventListener("storage",e=>{
 if(e.key===KEY||Engine.CATALOG.some(u=>u.storage.key===e.key)){if(!quiz)refresh(true);else refresh(false)}
});
window.EA2Passport=Object.freeze({
 inspect:()=>({totals:Engine.readSnapshot(localStorage,now()).totals,worlds:Engine.readSnapshot(localStorage,now()).worlds,
  due:Engine.readSnapshot(localStorage,now()).all.filter(w=>w.needsReview).map(w=>w.key),quizActive:!!quiz}),
 startReview:()=>makeQuiz(false),startExtra:()=>makeQuiz(true)
});
/* EVENTS */
})();