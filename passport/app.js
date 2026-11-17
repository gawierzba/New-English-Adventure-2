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
/* REVIEW MODULE */
refresh(true);
/* EVENTS */
})();