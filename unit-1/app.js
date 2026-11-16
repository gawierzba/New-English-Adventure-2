"use strict";
/* Unit 1 learning engine. New original exercises. Source scope:
 * nine WordCards, numbers 11-15 and Unit 1 sentence patterns.
 * No spoken-accuracy detection, grades, pressure or surprise unknown vocabulary.
 */
(()=>{
const words=[
 ["bat","rakietka do tenisa stołowego","🏓"],
 ["bike","rower","🚲"],
 ["computer","komputer","💻"],
 ["computer game","gra komputerowa","🎮"],
 ["robot","robot","🤖"],
 ["scooter","hulajnoga","🛴"],
 ["spaceship","statek kosmiczny","🚀"],
 ["TV","telewizja / telewizor","📺"],
 ["watch","zegarek","⌚"]
].map(([en,pl,icon])=>({en,pl,icon}));
const nums=[["eleven",11],["twelve",12],["thirteen",13],["fourteen",14],["fifteen",15]].map(([en,n])=>({en,n}));
const $=id=>document.getElementById(id);
const root=$("stage-root");
const store="ea2-unit-1-learning-v1",mainStore="nea2-learned-v1";
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function load(){try{const x=JSON.parse(localStorage.getItem(store));if(x&&typeof x==="object"&&!Array.isArray(x))return {items:x.items||{},sound:x.sound!==false,visits:Number(x.visits)||0}}catch(e){}return{items:{},sound:true,visits:0}}
let state=load(),session=[],step=0,idx=0,flipped=false;
let task={list:[],index:0,choices:[],misses:0,hint:0,done:false,wrong:null,assisted:false};
let choice=null,said=false,toastTimer;
const record=w=>state.items[w.en]||(state.items[w.en]={seen:false,find:0,ask:0,said:0,helps:0,last:0});
const seen=()=>words.filter(w=>record(w).seen);
function homeSync(){
 try{
 const x=JSON.parse(localStorage.getItem(mainStore)||"[]"),known=new Set(Array.isArray(x)?x:[]);
 words.forEach(w=>{let p=record(w);if(p.seen&&p.find>0&&p.ask>0)known.add("1|"+w.en)});
 localStorage.setItem(mainStore,JSON.stringify([...known]));
 }catch(e){}
}
function persist(){try{localStorage.setItem(store,JSON.stringify(state))}catch(e){}homeSync();refresh();atlas()}
function touch(w,field){
 const p=record(w);if(field==="seen")p.seen=true;else p[field]=(p[field]||0)+1;p.last=Date.now();persist()
}
function selectWords(){
 const unseen=shuffle(words.filter(w=>!record(w).seen));
 const revision=shuffle(words.filter(w=>record(w).seen)).sort((a,b)=>{
   const p=record(a),q=record(b);return p.find+p.ask-q.find-q.ask || p.last-q.last;
 });
 return [...unseen,...revision].slice(0,5)
}
function newTrip(){state.visits++;session=selectWords();persist();go(0);$("przygoda").scrollIntoView({behavior:"smooth",block:"start"})}
const hasVoice="speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
function toast(msg){const n=$("toast");n.textContent=msg;n.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>n.classList.remove("visible"),3300)}
function speak(text){
 if(!state.sound){toast("Włącz dźwięk w górnym menu.");return}
 if(!hasVoice){toast("Ta przeglądarka nie obsługuje wymowy słówek.");return}
 try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-GB";u.rate=.83;u.pitch=1.04;const vv=speechSynthesis.getVoices();u.voice=vv.find(v=>/^en[-_]GB/i.test(v.lang))||vv.find(v=>/^en/i.test(v.lang))||null;speechSynthesis.speak(u)}catch(e){toast("Nie udało się uruchomić wymowy.")}
}
function refresh(){
 const n=seen().length,k=words.filter(w=>record(w).find>0).length;
 $("top-progress").textContent=n+"/9 odkrytych";$("journey-word-count").textContent=n;$("stat-seen").textContent=n;$("stat-find").textContent=k;
 $("master-bar").style.width=(n/9*100)+"%";$("master-progress").setAttribute("aria-valuenow",String(n))
}
function atlas(){
 const el=$("atlas-grid");el.textContent="";
 words.forEach(w=>{
 const p=record(w),card=document.createElement("article");card.className="atlas-item";
 const art=document.createElement("span");art.className="atlas-art";art.textContent=w.icon;art.setAttribute("aria-hidden","true");
 const meta=document.createElement("div");meta.className="atlas-name";
 const en=document.createElement("strong");en.textContent=w.en;en.lang="en";
 const pl=document.createElement("small");pl.textContent=w.pl;
 const status=document.createElement("span");status.className="atlas-status"+(p.seen?" seen":"");
 status.textContent=p.find&&p.ask?"✓ POWTÓRZONE":p.seen?"✓ POZNANE":"CZEKA NA ODKRYCIE";meta.append(en,pl,status);
 const play=document.createElement("button");play.type="button";play.className="atlas-audio";play.textContent="♫";
 play.setAttribute("aria-label","Posłuchaj: "+w.en);play.addEventListener("click",()=>speak(w.en));
 card.append(art,meta,play);el.appendChild(card)
 })
}
function title(tag,head,intro){return '<div class="stage-header"><span class="stage-kicker">'+tag+'</span><h3>'+head+'</h3><p>'+intro+'</p></div>'}
function btn(a,text,cls="btn btn-main",attrs=""){return '<button type="button" class="'+cls+'" data-action="'+a+'" '+attrs+'>'+text+'</button>'}
function dots(i,n){return '<div class="five-dots" role="img" aria-label="Krok '+(i+1)+' z '+n+'">'+Array.from({length:n},(_,k)=>'<span class="'+(k<i?"done":k===i?"current":"")+'"></span>').join("")+"</div>"}
function show(html,tip){root.innerHTML=html;if(tip)$("robi-tip").textContent=tip}
function go(n){
 step=n;idx=0;flipped=false;choice=null;said=false;
 document.querySelectorAll("[data-step]").forEach(b=>{const on=Number(b.dataset.step)===n;b.classList.toggle("active",on);b.setAttribute("aria-current",on?"step":"false")});
 if(n===0)welcome();if(n===1)discover();if(n===2)prepare("find");if(n===3)prepare("ask");if(n===4)favourite();if(n===5)prepare("number");if(n===6)finish()
}
function welcome(){
 show(title("🧭 TWOJA WYPRAWA","Cześć! Jestem <em>Robi.</em>","Witaj w moim warsztacie! Poznamy kilka zabawek, a potem wykorzystamy je do zabawy po angielsku.")+
 '<div class="welcome-shell"><div class="welcome-scene"><span class="welcome-big" aria-hidden="true">🤖</span><div class="welcome-bubble">Hello, friend! 👋</div></div>'+
 '<div class="welcome-content"><h4>Wybierz się ze mną na wyprawę!</h4><p>Na dzisiaj przygotowałem pięć skarbów. Kolejna wyprawa może wyglądać inaczej.</p><ul class="welcome-list">'+
 '<li><span>🔎</span> Poznajemy słowa</li><li><span>🧩</span> Szukamy przedmiotów</li><li><span>💬</span> Pytamy i odpowiadamy</li><li><span>💜</span> Mówimy o ulubionej rzeczy</li></ul></div></div>'+
 '<div class="soft-box"><span class="section-label">WAŻNA ZASADA</span><p>Możesz próbować wiele razy, korzystać z podpowiedzi i oglądać rozwiązania. Tutaj nie ma ocen!</p></div>'+
 '<div class="stage-actions">'+btn("begin","Odkrywam skarby ↗")+btn("numbers","Wolę najpierw liczby","btn btn-outline")+'</div>',
 "Najpierw pokażę Ci zabawki. Nie musisz pamiętać ich od razu.")
}
function discover(){
 const w=session[idx];if(!w)return;
 if(!record(w).seen)touch(w,"seen");
 show(title("🔎 ODKRYWAM · "+(idx+1)+"/"+session.length,"Poznaj mój <em>skarb!</em>","Obejrzyj obrazek, posłuchaj angielskiego słowa i odkryj, co oznacza.")+
 dots(idx,session.length)+
 '<div class="learn-main"><div class="learn-visual"><span class="visual-badge">ROBI\'S TREASURE</span><span class="item-emoji" aria-hidden="true">'+w.icon+'</span><span class="visual-spark" aria-hidden="true">✦</span></div>'+
 '<div class="learn-copy"><span class="section-label">PO ANGIELSKU</span><h4 lang="en">'+w.en+'</h4>'+btn("voice","♫ Posłuchaj wymowy","pronunciation")+
 '<div class="reveal-box">'+(flipped?'<span class="section-label">PO POLSKU</span><div class="translation">'+w.pl+'</div>':btn("reveal","Odkryj znaczenie 👀",""))+'</div>'+
 '<p class="lesson-hint">Spróbuj powiedzieć słowo razem z Robim. Nie musisz tego robić idealnie.</p></div></div>'+
 '<div class="stage-actions">'+(idx?btn("prev","← Poprzednie słowo","btn btn-outline"):"")+btn("next",idx===session.length-1?"Przejdź do zabawy →":"Następny skarb →")+'</div>'+
 '<p class="safety-note">Zobaczenie słówka nie oznacza jeszcze, że trzeba je pamiętać. Wrócimy do niego później.</p>',
 "To jest "+w.en+". Możesz słuchać tyle razy, ile zechcesz.")
}
function needs(min){
 const items=seen();if(items.length>=min)return items;
 show(title("🌱 MAŁA WSKAZÓWKA","Najpierw <em>odkryjmy.</em>","Zanim zaczniemy tę zabawę, poznaj przynajmniej "+min+" słówka.")+
 '<div class="needs-intro"><div class="big-sign">🧸</div><p>Nie będę pytał o nieznane zabawki. Zobaczymy je razem!</p><div class="stage-actions">'+btn("begin","Poznaj słówka ↗")+'</div></div>',
 "Najpierw pokazuję, a dopiero później pytam.")
 return null
}
function weakItems(arr,n){
 return shuffle(arr).map(w=>({w,score:record(w).find+record(w).ask+Math.random()*1.3}))
 .sort((a,b)=>a.score-b.score).slice(0,n).map(x=>x.w)
}
function makeTask(type){
 const known=needs(type==="number"?0:type==="favourite"?1:3);
 if(!known&&type!=="number"){task.list=[];return false}
 task={type,list:[],index:0,choices:[],misses:0,hint:0,done:false,wrong:null,assisted:false,intro:type==="number"};
 if(type==="find"){
   task.list=weakItems(known,Math.min(4,known.length));
 }else if(type==="ask"){
   task.list=shuffle(weakItems(known,Math.min(4,known.length)).map((w,i)=>{
     const same=i%2===0,other=shuffle(known.filter(x=>x.en!==w.en))[0];
     return {shown:w,asked:same?w:other,same}
   }))
 }else if(type==="number"){
   task.list=shuffle(nums).slice(0,3)
 }
 return true
}
function prepare(type){
 if(!makeTask(type))return;
 prepareChoices();renderTask()
}
function prepareChoices(){
 task.misses=0;task.hint=0;task.done=false;task.wrong=null;task.assisted=false;
 const item=task.list[task.index];if(!item)return;
 if(task.type==="find")task.choices=shuffle([item,...shuffle(seen().filter(w=>w.en!==item.en)).slice(0,2)]);
 if(task.type==="number")task.choices=shuffle([item,...shuffle(nums.filter(n=>n.n!==item.n)).slice(0,2)]);
}
function renderTask(){
 if(task.type==="find")renderFind();
 if(task.type==="ask")renderAsk();
 if(task.type==="number"){if(task.intro)renderNumberIntro();else renderNumber()}
}
function renderFind(){
 const w=task.list[task.index];
 const choices=task.choices.map(x=>'<button type="button" '+(task.done?"disabled":"")+
   ' data-action="find-answer" data-value="'+x.en+'" class="choice-item '+(task.done&&x.en===w.en?"correct":task.wrong===x.en?"wrong":"")+
   (task.hint>=2&&x.en===w.en?" glow":"")+'"><span class="choice-emoji" aria-hidden="true">'+x.icon+'</span><span>'+x.en+'</span></button>').join("");
 const hint=task.hint===1?'<div class="help-message"><strong>Podpowiedź:</strong> '+w.en+' oznacza '+w.pl+'.</div>':
 task.hint>=2?'<div class="help-message">Robi podświetlił właściwy obrazek. Możesz w niego kliknąć lub zobaczyć rozwiązanie.</div>':"";
 const result=task.done?'<div class="feedback '+(task.assisted?"info":"good")+'">'+(task.assisted?"Razem znaleźliśmy odpowiedź! 🌈 ":"Świetnie, samodzielnie! ✨ ")+'<span lang="en">It\'s a '+w.en+'.</span></div>':
 task.wrong?'<div class="feedback try">Wybrany obrazek to '+words.find(x=>x.en===task.wrong).pl+'. Spróbuj odnaleźć '+w.pl+'.</div>':"";
 show(title("🧩 SZUKAM · "+(task.index+1)+"/"+task.list.length,"Gdzie jest <em>zabawka?</em>","Wskaż obrazek pasujący do angielskiego słowa. Nie wiesz? Poproś Robiego o pomoc.")+
 dots(task.index,task.list.length)+
 '<div class="task-display"><span class="task-symbol" aria-hidden="true">🔎</span><div class="task-content"><div class="task-meta">FIND THE TOY!</div><div class="task-english" lang="en">'+w.en+'</div>'+btn("voice","♫ Posłuchaj","help-btn")+'</div></div>'+
 '<div class="choice-grid">'+choices+'</div>'+result+hint+
 '<div class="help-row">'+(task.done?btn("task-next",task.index===task.list.length-1?"Teraz zagadki →":"Dalej →"):
 btn("find-hint",task.hint===0?"💡 Pierwsza podpowiedź":task.hint===1?"💡 Druga podpowiedź":"✨ Zobacz rozwiązanie","help-btn"))+
 btn("begin","Jeszcze poćwiczę słówka","subtle-link")+'</div>',
 "Widzisz trzy zabawki? Zawsze możesz poprosić mnie o wskazówkę.")
}
function answerFind(value,help=false){
 if(task.done)return;
 const w=task.list[task.index];
 if(!help&&value!==w.en){task.misses++;task.wrong=value;renderFind();return}
 task.done=true;task.assisted=help||task.misses>0||task.hint>0;touch(w,task.assisted?"helps":"find");renderFind();
 if(!task.assisted)speak("Well done!")
}
function renderAsk(){
 const q=task.list[task.index],phrase="Is it a "+q.asked.en+"?";
 const answer=q.same?"Yes, it is.":"No, it isn't.";
 const hint=task.hint===1?'<div class="help-message">„'+q.asked.en+'” to '+q.asked.pl+'. Na obrazku jest '+q.shown.pl+'.</div>':
 task.hint>=2?'<div class="help-message">Odpowiedź: <b lang="en">'+answer+'</b></div>':"";
 const line=task.done?'<div class="feedback good">'+answer+' '+(q.same?"It\'s a "+q.shown.en+".":"It isn\'t a "+q.asked.en+". It\'s a "+q.shown.en+".")+'</div>':
 task.wrong?'<div class="feedback try">Spójrz na obrazek ponownie. To jest '+q.shown.pl+'. Możesz spróbować raz jeszcze.</div>':"";
 show(title("💬 ZGADUJĘ · "+(task.index+1)+"/"+task.list.length,"Czy to <em>ta rzecz?</em>","Popatrz i odpowiedz po angielsku: „Yes” albo „No”.")+
 dots(task.index,task.list.length)+
 '<div class="task-display"><span class="task-symbol" aria-hidden="true">'+q.shown.icon+'</span><div class="task-content"><div class="task-meta">ROBI ASKS</div>'+
 '<div class="task-english" lang="en">'+phrase+'</div>'+btn("voice","♫ Posłuchaj pytania","help-btn")+'</div></div>'+
 '<div class="choice-grid yesno"><button type="button" '+(task.done?"disabled":"")+' class="choice-item yes-answer '+(task.done&&q.same?"correct":task.wrong==="yes"?"wrong":"")+
 '" data-action="ask-answer" data-value="yes"><span class="choice-emoji" aria-hidden="true">👍</span>Yes, it is.</button>'+
 '<button type="button" '+(task.done?"disabled":"")+' class="choice-item no-answer '+(task.done&&!q.same?"correct":task.wrong==="no"?"wrong":"")+
 '" data-action="ask-answer" data-value="no"><span class="choice-emoji" aria-hidden="true">🙅</span>No, it isn\'t.</button></div>'+
 line+hint+'<div class="help-row">'+(task.done?btn("task-next",task.index===task.list.length-1?"Opowiedz o sobie →":"Kolejne pytanie →"):
 btn("ask-hint",task.hint===0?"💡 Podpowiedź":task.hint===1?"💡 Pokaż odpowiedź":"✨ Odkryj rozwiązanie","help-btn"))+
 btn("begin","Wróć do słówek","subtle-link")+'</div>',
 "Popatrz na obrazek. Jeśli się pomylisz, spróbujesz jeszcze raz.")
}
function answerAsk(v,force=false){
 if(task.done)return;
 const q=task.list[task.index];
 if(!force&&(v==="yes")!==q.same){task.misses++;task.wrong=v;renderAsk();return}
 task.done=true;task.assisted=force||task.misses>0||task.hint>0;
 touch(q.shown,task.assisted?"helps":"ask");renderAsk();speak(q.same?"Yes, it is.":"No, it isn't.")
}
function renderNumberIntro(){
 const cards=nums.map(x=>'<button type="button" class="number-intro-item" data-action="num-speak" data-value="'+x.en+'"><strong>'+x.n+'</strong><span lang="en">'+x.en+'</span><small>♫ Posłuchaj</small></button>').join("");
 show(title("⭐ LICZBY · ODKRYWANIE","Najpierw <em>poznajmy liczby!</em>","Jedenaście, dwanaście, trzynaście, czternaście, piętnaście. Dotykaj kart i słuchaj, jak brzmią po angielsku.")+
 '<div class="number-intro-grid">'+cards+'</div>'+
 '<div class="soft-box"><span class="section-label">JAK SIĘ UCZYMY?</span><p>Posłuchaj nowych liczb. Możesz powtarzać je za Robim. Dopiero kiedy zechcesz, przejdziemy do gwiazdkowej zabawy.</p></div>'+
 '<div class="stage-actions">'+btn("start-counting","Teraz policzmy gwiazdki →")+btn("begin","Wrócę do zabawek","btn btn-outline")+'</div>',
 "Najpierw razem powiemy liczby od jedenastu do piętnastu. Dopiero potem będziemy zgadywać.");
}
function renderNumber(){
 const q=task.list[task.index];
 const star=Array.from({length:q.n},()=>'<span aria-hidden="true">★</span>').join("");
 const opts=task.choices.map(x=>'<button type="button" '+(task.done?"disabled":"")+' data-action="number-answer" data-value="'+x.n+'" class="number-opt '+(task.done&&x.n===q.n?"correct":task.wrong===String(x.n)?"wrong":"")+'">'+x.en+'</button>').join("");
 show(title("⭐ LICZĘ · "+(task.index+1)+"/"+task.list.length,"Liczymy <em>gwiazdki!</em>","Policz gwiazdki i wybierz angielskie słowo oznaczające ich liczbę.")+
 dots(task.index,task.list.length)+
 '<div class="number-card"><span class="section-label">COUNT THE STARS</span><div class="number-cloud" aria-label="'+q.n+' gwiazdek">'+star+'</div><p>Ile jest gwiazdek?</p></div>'+
 '<div class="number-options">'+opts+'</div>'+
 (task.done?'<div class="feedback good">Tak! '+q.n+' to <strong lang="en">'+q.en+'</strong>! ⭐</div>':task.wrong?'<div class="feedback try">Spróbuj jeszcze raz i policz powoli.</div>':"")+
 '<div class="stage-actions">'+(task.done?btn("task-next",task.index===task.list.length-1?"Podsumuj wyprawę →":"Kolejne gwiazdki →"):"")+
 btn("voice","♫ Posłuchaj liczby","btn btn-outline")+
 (!task.done&&task.misses?btn("number-help","💡 Pokaż odpowiedź","subtle-link"):"")+'</div>',
 "Jedenaście, dwanaście, trzynaście, czternaście, piętnaście. Dobrze jest je wypowiadać na głos.")
}
function answerNumber(n,help=false){
 if(task.done)return;
 const q=task.list[task.index];
 if(Number(n)!==q.n&&!help){task.misses++;task.wrong=String(n);renderNumber();return}
 task.done=true;renderNumber();speak(q.en);
 if(help)toast("Razem odkryliśmy rozwiązanie! ⭐")
}
function nextTask(){
 if(task.index===task.list.length-1){go(task.type==="find"?3:task.type==="ask"?4:6);return}
 task.index++;prepareChoices();renderTask()
}
function favourite(){
 const pool=needs(1);if(!pool)return;
 show(title("💜 OPOWIADAM","Co jest <em>Twoje</em> ulubione?","Nie ma jednej prawidłowej odpowiedzi! Wybierz rzecz, którą najbardziej lubisz.")+
 '<div class="soft-box"><span class="section-label">MY FAVOURITE THING</span><p>Wybierz zabawkę, zbuduj swoje zdanie, posłuchaj wymowy i spróbuj powiedzieć je na głos.</p></div>'+
 '<div class="favourite-options">'+pool.map(w=>'<button type="button" class="fav-option '+(choice&&choice.en===w.en?"selected":"")+'" aria-pressed="'+Boolean(choice&&choice.en===w.en)+
 '" data-action="choose-fav" data-value="'+w.en+'"><span aria-hidden="true">'+w.icon+'</span>'+w.en+'</button>').join("")+'</div>'+
 '<div class="favourite-sentence"><span class="section-label">TWOJE ZDANIE</span><strong lang="en">'+(choice?"My favourite thing is a "+choice.en+".":"My favourite thing is a...")+'</strong>'+
 '<div class="sentence-trans">'+(choice?"Moją ulubioną rzeczą jest "+choice.pl+".":"Dotknij wybranej zabawki.")+'</div></div>'+
 '<div class="stage-actions">'+(choice?btn("say-fav","♫ Posłuchaj zdania","btn btn-outline"):"")+
 (choice&&!said?btn("mark-said","Spróbowałem(am) powiedzieć! ↗"):"")+
 (said?btn("numbers","Teraz pobawmy się liczbami →"):"")+'</div>'+
 '<div class="say-reminder">'+(said?"Piękna próba! ❤️ Nie oceniamy wymowy. Najważniejsze, że ćwiczysz.":"Możesz powtarzać razem z Robim. Aplikacja nie nagrywa Twojego głosu.")+'</div>',
 "To Twoja własna odpowiedź! Wybierz to, co naprawdę lubisz. Potem spróbuj o tym opowiedzieć.")
}
function finish(){
 const n=seen().length,f=words.filter(w=>record(w).find>0).length,a=words.filter(w=>record(w).ask>0).length;
 show('<div class="finish-view"><div class="finish-emblem" aria-hidden="true">🏝️</div>'+
 title("🎉 WYPRAWA ZAKOŃCZONA","Brawo, <em>Odkrywco!</em>","Nie musisz wszystkiego pamiętać po jednej wizycie. Ważne, że próbujesz i uczysz się nowych rzeczy.")+
 '<div class="finish-cards"><span><strong>'+n+'/9</strong> słówek poznanych</span><span><strong>'+f+'</strong> rozpoznanych samodzielnie</span><span><strong>'+a+'</strong> przećwiczonych pytań</span></div>'+
 '<p>Kiedy wrócisz, Robi wybierze inne skarby i wróci do tych, które warto jeszcze przećwiczyć. Bez ocen i bez presji!</p>'+
 '<div class="stage-actions">'+btn("new-trip","Nowa wyprawa ↗")+btn("begin","Jeszcze raz posłucham słów","btn btn-outline")+'</div></div>',
 "Każda próba się liczy. Widzimy się podczas kolejnej wyprawy!")
}
root.addEventListener("click",e=>{
 const t=e.target.closest("[data-action]");if(!t)return;
 const a=t.dataset.action,v=t.dataset.value;
 switch(a){
 case "begin":go(1);break;
 case "numbers":go(5);break;
 case "reveal":flipped=true;discover();break;
 case "prev":idx=Math.max(0,idx-1);flipped=false;discover();break;
 case "next":if(idx===session.length-1)go(2);else{idx++;flipped=false;discover()}break;
 case "voice":if(step===1)speak(session[idx].en);else if(step===2)speak(task.list[task.index].en);else if(step===3)speak("Is it a "+task.list[task.index].asked.en+"?");else if(step===5)speak(task.list[task.index].en);break;
 case "find-answer":answerFind(v);break;
 case "find-hint":if(task.hint<2){task.hint++;touch(task.list[task.index],"helps");renderFind()}else answerFind(task.list[task.index].en,true);break;
 case "ask-answer":answerAsk(v);break;
 case "ask-hint":if(task.hint<2){task.hint++;touch(task.list[task.index].shown,"helps");renderAsk()}else answerAsk("",true);break;
 case "num-speak":speak(v);break;
 case "start-counting":task.intro=false;renderNumber();break;
 case "number-answer":answerNumber(v);break;
 case "number-help":answerNumber(task.list[task.index].n,true);break;
 case "task-next":nextTask();break;
 case "choose-fav":choice=words.find(w=>w.en===v);said=false;favourite();break;
 case "say-fav":if(choice)speak("My favourite thing is a "+choice.en+".");break;
 case "mark-said":if(choice&&!said){touch(choice,"said");said=true;favourite()}break;
 case "new-trip":newTrip();break;
 }
});
document.querySelectorAll(".mission-tab").forEach(b=>b.addEventListener("click",()=>{
 go(Number(b.dataset.step));$("stage-panel").scrollIntoView({behavior:"smooth",block:"nearest"})
}));
$("hero-vocab").addEventListener("click",()=>$("atlas").scrollIntoView({behavior:"smooth"}));
function soundButton(){
 $("sound-switch").setAttribute("aria-pressed",String(state.sound));
 $("sound-switch").setAttribute("aria-label",state.sound?"Wyłącz wymowę słówek":"Włącz wymowę słówek");
 $("sound-switch").innerHTML=state.sound?'♫ <span>Dźwięk</span>':'♪ <span>Wyciszono</span>';
}
$("sound-switch").addEventListener("click",()=>{state.sound=!state.sound;if(!state.sound&&hasVoice)speechSynthesis.cancel();persist();soundButton()});
$("atlas-speak").addEventListener("click",()=>{
 if(!state.sound){toast("Włącz dźwięk w górnym menu.");return}
 if(!hasVoice){toast("Ta przeglądarka nie obsługuje wymowy.");return}
 speechSynthesis.cancel();words.forEach(w=>{const u=new SpeechSynthesisUtterance(w.en);u.lang="en-GB";u.rate=.82;speechSynthesis.speak(u)})
});
$("print-unit").addEventListener("click",()=>window.print());
$("parent-details").addEventListener("click",()=>{
 const open=$("details-panel").hidden;$("details-panel").hidden=!open;
 $("parent-details").setAttribute("aria-expanded",String(open));
 $("parent-details").textContent=open?"Zwiń informacje ↑":"Jak liczymy postępy? ↓"
});
$("reset-progress").addEventListener("click",()=>{
 if(!window.confirm("Usunąć zapisane postępy tej krainy na tym urządzeniu?"))return;
 state={items:{},sound:state.sound,visits:0};persist();
 try{const x=JSON.parse(localStorage.getItem(mainStore)||"[]");if(Array.isArray(x))localStorage.setItem(mainStore,JSON.stringify(x.filter(k=>!String(k).startsWith("1|"))))}catch(e){}
 session=selectWords();go(0);toast("Postępy wyczyszczone.")
});
window.EnglishAdventureUnit1=Object.freeze({
 wordCount:words.length,numbers:nums.map(x=>x.n),phrases:["It's a","It isn't a","Is it a?","My favourite thing is"],
 inspect:()=>({introduced:seen().map(x=>x.en),session:session.map(x=>x.en),independent:words.filter(w=>record(w).find&&record(w).ask).map(w=>w.en)}),
 startAgain:newTrip
});
session=selectWords();refresh();atlas();soundButton();go(0);
})();