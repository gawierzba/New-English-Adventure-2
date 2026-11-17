"use strict";
/* Unit 6 — He likes cheese! · Smakowita Pracownia Lili.
 * Source: NEA 2 parent guide PDF p.10 and WordCards Unit 6 PDF pp.15-18.
 * 14 core WordCards + two words from parent's guide: cereal, soup.
 * Fictional guests, no food judgments. Guided game before questions.
 */
(()=>{
const WORDS=[
 ["bread","chleb","🍞",true],["cake","ciasto","🍰",true],["carrots","marchewki","🥕",true],
 ["cereal","płatki zbożowe","🥣",false],["cheese","ser","🧀",true],["chocolate","czekolada","🍫",true],
 ["fish","ryba","🐟",true],["grapes","winogrona","🍇",true],["ice cream","lody","🍨",true],
 ["mushrooms","grzyby","🍄",true],["onions","cebule","🧅",true],["peas","groszek","🫛",true],
 ["salad","sałatka","🥗",true],["soup","zupa","🍲",false],["strawberries","truskawki","🍓",true],
 ["tomatoes","pomidory","🍅",true]
].map(([en,pl,icon,card])=>({en,pl,icon,card}));
const START=["cheese","grapes","cake","carrots","bread"], GUESTS=[
 {name:"Leo",who:"He",pl:"On",emoji:"🦊"},
 {name:"Ada",who:"She",pl:"Ona",emoji:"🐰"}
];
const $=id=>document.getElementById(id),root=$("stage"),KEY="ea2-food-v1",HOME="nea2-learned-v1";
const byName=en=>WORDS.find(w=>w.en===en),guest=i=>GUESTS[i]||GUESTS[0];
const shuffle=list=>{const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=list=>list[Math.floor(Math.random()*list.length)];
const fresh=()=>({words:{},sound:true,visits:0});
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||"null");if(v&&typeof v==="object"&&!Array.isArray(v))return{words:v.words&&typeof v.words==="object"?v.words:{},sound:v.sound!==false,visits:Number(v.visits)||0}}catch(e){}return fresh()}
let state=load(),step=0,session=[],card=0,translation=false,plate={who:0,food:"cheese",likes:true,said:false};
let mystery=null,market=null,bingo=null,toastTimer=null;
function stat(w){const v=state.words[w.en]||{};return{seen:!!v.seen,found:Number(v.found)||0,market:Number(v.market)||0,spoken:Number(v.spoken)||0,helps:Number(v.helps)||0,last:Number(v.last)||0}}
const known=en=>!!byName(en)&&stat(byName(en)).seen;
const explored=()=>WORDS.filter(w=>stat(w).seen);
function syncMain(){try{const x=JSON.parse(localStorage.getItem(HOME)||"[]"),set=new Set(Array.isArray(x)?x.filter(v=>typeof v==="string"):[]);WORDS.forEach(w=>{const p=stat(w);if(p.seen&&(p.found>0||p.market>0))set.add("6|"+w.en)});localStorage.setItem(HOME,JSON.stringify([...set]))}catch(e){}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}syncMain();counters();gallery()}
function mark(w,key){if(!w)return;const p=stat(w);if(key==="seen")p.seen=true;else if(["found","market","spoken","helps"].includes(key))p[key]++;p.last=Date.now();state.words[w.en]=p;persist()}
function selectSession(){
 if(explored().length===0)return START.map(byName);
 const unseen=shuffle(WORDS.filter(w=>!stat(w).seen)),review=shuffle(explored()).sort((a,b)=>(stat(a).found+stat(a).market)-(stat(b).found+stat(b).market)||stat(a).last-stat(b).last);
 return [...unseen,...review].slice(0,5);
}
function priority(list,n,key){return shuffle(list).map(w=>({w,weight:(key?stat(w)[key]:stat(w).found+stat(w).market)+Math.random()*1.3})).sort((a,b)=>a.weight-b.weight).slice(0,Math.min(n,list.length)).map(v=>v.w)}
function counters(){const n=explored().length,ind=WORDS.filter(w=>stat(w).found>0||stat(w).market>0).length;
 $("nav-count").textContent=n+" / 16";$("strip-known").textContent=n;$("seen").textContent=n;$("independent").textContent=ind;
 $("progress-fill").style.width=(100*n/16)+"%";$("progress").setAttribute("aria-valuenow",String(n))
}
function gallery(){const list=$("word-grid");list.textContent="";WORDS.forEach(w=>{
 const art=document.createElement("article");art.className="word-card";
 const pic=document.createElement("span");pic.className="word-icon";pic.textContent=w.icon;pic.setAttribute("aria-hidden","true");
 const box=document.createElement("div");box.className="word-info";
 const h=document.createElement("strong");h.lang="en";h.textContent=w.en;
 const p=document.createElement("small");p.textContent=w.pl;
 const progress=document.createElement("em");progress.className=stat(w).seen?"known":"";
 progress.textContent=stat(w).found||stat(w).market?"✓ PRZEĆWICZONE":stat(w).seen?"✓ POZNANE":w.card?"KARTA SŁOWA":"Z PORADNIKA";
 box.append(h,p,progress);
 const audio=document.createElement("button");audio.type="button";audio.className="word-play";audio.textContent="♫";audio.setAttribute("aria-label","Posłuchaj: "+w.en);audio.addEventListener("click",()=>speak(w.en));
 art.append(pic,box,audio);list.appendChild(art)
})}
const canSpeak=("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
function toast(text){const e=$("toast");e.textContent=text;e.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove("show"),3400)}
function speak(text){if(!state.sound){toast("Wymowa jest wyłączona. Włącz ją u góry strony.");return}if(!canSpeak){toast("Ta przeglądarka nie ma syntezatora mowy.");return}try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-GB";u.rate=.83;u.pitch=1.02;const voices=window.speechSynthesis.getVoices(),v=voices.find(x=>/^en[-_]GB/i.test(x.lang))||voices.find(x=>/^en/i.test(x.lang));if(v)u.voice=v;window.speechSynthesis.speak(u)}catch(e){toast("Nie udało się odczytać zdania.")}}
function soundUI(){const b=$("sound");b.setAttribute("aria-pressed",String(state.sound));b.setAttribute("aria-label",state.sound?"Wyłącz wymowę":"Włącz wymowę");b.innerHTML=state.sound?'♫ <span>Wymowa</span>':'♪ <span>Wyciszono</span>'}
const btn=(action,label,cls="action")=>'<button type="button" data-action="'+action+'" class="'+cls+'">'+label+'</button>';
const head=(label,title,sub)=>'<div class="stage-top"><span class="stage-kicker">'+label+'</span><h3>'+title+'</h3><p>'+sub+'</p></div>';
const dots=(i,n)=>'<div class="dots" role="img" aria-label="Krok '+(i+1)+' z '+n+'">'+Array.from({length:n},(_,k)=>'<span class="'+(k<i?"done":k===i?"here":"")+'"></span>').join("")+'</div>';
function display(html,tip){root.innerHTML=html;if(tip)$("lila-tip").textContent=tip}
function go(n){
 step=n;card=0;translation=false;
 document.querySelectorAll(".tab").forEach(t=>{const active=Number(t.dataset.step)===n;t.classList.toggle("active",active);t.setAttribute("aria-current",active?"step":"false")});
 if(n===0)welcome();if(n===1)discover();if(n===2)startPlate();if(n===3)startMystery();if(n===4)startMarket();if(n===5)startBingo();if(n===6)finish();
}
function welcome(){display(head("👋 WITAJ W PRACOWNI","Cześć! Jestem <em>Lila!</em>","W naszej kuchni tworzymy śmieszne potrawy dla wymyślonych gości. Poznamy składniki i nauczymy się opowiadać, co ktoś lubi.")+
 '<div class="welcome-layout"><div class="welcome-art"><span class="emoji" aria-hidden="true">🦔👩‍🍳</span><span class="welcome-sign">Hello, little chef! ✿</span></div>'+
 '<div class="welcome-copy"><h4>Co dziś ugotujemy?</h4><p>Najpierw pooglądamy słowa, a potem przygotujemy kolorowy talerz, pobawimy się w detektywów, otworzymy sklepik i zagramy w bingo.</p>'+
 '<ul><li><span>🔍</span> Poznaj składniki</li><li><span>🍽️</span> Ułóż talerz</li><li><span>🛒</span> Zrób zakupy</li><li><span>🎉</span> Zagraj w bingo</li></ul></div></div>'+
 '<div class="info"><b>Ważne:</b> każdy może lubić coś innego. Nie oceniamy jedzenia, nie namawiamy do kosztowania i nie pytamy o diety. To opowieść o wymyślonych bohaterach.</div>'+
 '<div class="buttons">'+btn("discover","Odkryjmy produkty ↗")+btn("plate","Wolę ułożyć talerz","action-alt")+'</div>',
 "Poznajemy angielskie nazwy produktów, zanim zaczniemy ich szukać w zabawach.");}
function discover(){
 const w=session[card];if(!w)return;if(!stat(w).seen)mark(w,"seen");
 display(head("🔍 ODKRYWANIE · "+(card+1)+"/"+session.length,"Co kryje nasza <em>spiżarnia?</em>","Spójrz na obrazek, posłuchaj słowa i odkryj jego polskie znaczenie. Nie musisz zapamiętać go od razu.")+
 dots(card,session.length)+
 '<div class="flash-layout"><div class="flash-picture"><span class="label">'+(w.card?"WORD CARD":"EXTRA WORD")+' ✿</span>'+
 '<span class="food" role="img" aria-label="'+w.pl+'">'+w.icon+'</span></div>'+
 '<div class="flash-content"><span class="micro">ENGLISH</span><h4 lang="en">'+w.en+'</h4>'+btn("hear-word","♫ Posłuchaj wymowy","audio-btn")+
 '<div class="flash-translation">'+(translation?'<span class="micro">PO POLSKU</span><strong>'+w.pl+'</strong>':btn("reveal","Pokaż znaczenie 👀",""))+'</div>'+
 '<p class="tiny">Spróbuj powiedzieć słowo razem z Lilą. Odsłuchuj je tyle razy, ile chcesz!</p></div></div>'+
 '<div class="buttons">'+(card?btn("previous","← Poprzednia karta","action-alt"):"")+
 btn("next-word",card===session.length-1?"Czas na nasz talerz! →":"Następny produkt →")+'</div>'+
 '<p class="tiny">Poznane słowo trafia do spiżarni, ale nie znaczy to jeszcze, że trzeba je znać na pamięć.</p>',
 "Prawdziwa nauka zaczyna się od poznawania. Dziś nasze słowo to "+w.en+".");
}
function requireWords(n,what){
 if(explored().length>=n)return true;
 display(head("🌱 JESZCZE TROSZKĘ ODKRYWANIA","Najpierw poznajmy <em>produkty.</em>","Do "+what+" potrzebujemy przynajmniej "+n+" poznane słowa. Zaraz pokażę Ci je na obrazkach.")+
 '<div class="welcome-layout"><div class="welcome-art"><span class="emoji">🔍🥕</span></div>'+
 '<div class="welcome-copy"><h4>Nie zgadujemy nieznanych słów.</h4><p>Najpierw je zobaczymy i usłyszymy, a potem spróbujemy użyć w zabawach.</p><div class="buttons">'+btn("discover","Poznaj produkty →")+'</div></div></div>',
 "Nie martw się! Najpierw przećwiczymy kilka słówek, żeby zabawa była łatwa.");
 return false;
}
function plateSentence(){const g=guest(plate.who);return g.who+(plate.likes?" likes ":" doesn't like ")+plate.food+"."}
function platePolish(){const g=guest(plate.who),w=byName(plate.food);return g.pl+(plate.likes?" lubi ":" nie lubi ")+w.pl+"."}
function startPlate(){
 if(!requireWords(1,"przygotowania talerza"))return;
 if(!known(plate.food))plate.food=explored()[0].en;plate.said=false;renderPlate();
}
function renderPlate(){
 const g=guest(plate.who),w=byName(plate.food);
 const buttons=explored().map(x=>'<button type="button" data-action="plate-food" data-value="'+x.en+'" class="food-choice '+(plate.food===x.en?"selected":"")+
 '" aria-pressed="'+String(plate.food===x.en)+'"><span aria-hidden="true">'+x.icon+'</span>'+x.en+'</button>').join("");
 display(head("🍽️ KOLOROWY TALERZ","Danie dla <em>gościa!</em>","Wybierz fikcyjną postać, połóż produkt na talerzu i zdecyduj, co ona lubi. Lila ułoży z tego angielskie zdanie.")+
 '<div class="guest-toggle"><button type="button" data-action="plate-guest" data-value="0" class="'+(plate.who===0?"active":"")+'"><span aria-hidden="true">🦊</span> Leo — He / On</button>'+
 '<button type="button" data-action="plate-guest" data-value="1" class="'+(plate.who===1?"active":"")+'"><span aria-hidden="true">🐰</span> Ada — She / Ona</button></div>'+
 '<div class="plate-world"><span class="plate-label">LILA’S MAGIC PLATE ✿</span><div class="table-striped"></div>'+
 '<div class="plate-place"><span class="plate-food" role="img" aria-label="'+w.pl+'">'+w.icon+'</span>'+
 '<span class="plate-guest" aria-label="'+g.name+'">'+g.emoji+'</span><span class="plate-corner">'+(plate.likes?"♡":"✿")+'</span></div></div>'+
 '<div class="food-picker">'+buttons+'</div>'+
 '<div class="likes-toggle"><button type="button" data-action="plate-likes" data-value="yes" class="'+(plate.likes?"active":"")+'">♡ likes — lubi</button>'+
 '<button type="button" data-action="plate-likes" data-value="no" class="dislike '+(!plate.likes?"active":"")+'">✿ doesn’t like — nie lubi</button></div>'+
 '<div class="sentence-board"><span class="micro">YOUR ENGLISH SENTENCE</span><strong lang="en">'+plateSentence()+'</strong><p>'+platePolish()+'</p></div>'+
 '<div class="buttons">'+btn("hear-plate","♫ Posłuchaj zdania","action-alt")+
 btn("say-plate",plate.said?"Spróbowałem(am)! ✓":"Spróbuję powiedzieć →")+
 btn("to-mystery","Odgadnijmy smaki →","action-alt")+'</div>'+
 '<p class="tiny">Postacie mają wymyślone upodobania. Żaden produkt nie jest tu „dobry” ani „zły”, a każda próba powiedzenia zdania się liczy.</p>',
 "Zmieniając talerz, uczymy się mówić He likes albo She doesn't like.");
}
function mysteryTask(w,options,i){
 const g=guest(i%2),likes=i%2===0;
 return {word:w,options:shuffle([w,...shuffle(options.filter(x=>x.en!==w.en)).slice(0,2)]),who:g,likes};
}
function startMystery(){
 if(!requireWords(3,"zagadek smakowych"))return;
 const pool=explored(),tasks=priority(pool,Math.min(4,pool.length),"found");
 mystery={intro:true,tasks:shuffle(tasks.map((w,i)=>mysteryTask(w,pool,i))),index:0,hint:0,wrong:null,done:false,assisted:false};renderMystery();
}
function renderMystery(){
 if(!mystery)return;
 if(mystery.intro){
 display(head("🕵️ WPROWADZENIE","Najpierw <em>posłuchajmy!</em>","Leo i Ada mają swoje wymyślone smaki. Zobaczmy dwa zdania, zanim spróbujemy rozpoznawać produkty.")+
 '<div class="detect-scene"><div class="detect-image"><span class="who">🦊</span>🧀</div>'+
 '<div class="detect-text"><span class="micro">LOOK AND LEARN</span><h4 lang="en">He likes cheese.</h4><p>Leo lubi ser.</p>'+btn("hear-example","♫ Posłuchaj zdania","action-alt")+'</div></div>'+
 '<div class="info"><b>Drugi przykład:</b> <span lang="en">She doesn’t like carrots.</span> — Ada nie lubi marchewek. Słowa <em>likes</em> oraz <em>doesn’t like</em> zmieniają sens zdania.</div>'+
 '<div class="buttons">'+btn("begin-mystery","Odkrywam smaki →")+btn("plate","Jeszcze ułożę talerz","action-alt")+'</div>',
 "Po angielsku He likes oznacza On lubi, a She doesn't like — Ona nie lubi.");return;
 }
 const q=mystery.tasks[mystery.index];
 const line=q.who.who+(q.likes?" likes ":" doesn't like ")+q.word.en+".";
 const opts=q.options.map(w=>'<button type="button" data-action="mystery-answer" data-value="'+w.en+'" '+(mystery.done?"disabled":"")+
 ' class="'+(mystery.done&&q.word.en===w.en?"correct":mystery.wrong===w.en?"wrong":"")+(mystery.hint>=2&&q.word.en===w.en?" glow":"")+
 '"><span role="img" aria-label="'+w.pl+'">'+w.icon+'</span><small>Wybierz obrazek</small></button>').join("");
 const reply=mystery.done?'<div class="response '+(mystery.assisted?"with-help":"yes")+'">'+
 (mystery.assisted?"Udało się z pomocą Lili! ":"Brawo! To samodzielne odkrycie. ")+
 '<span lang="en">'+q.word.en+'</span> oznacza: '+q.word.pl+'.</div>':
 mystery.wrong!==null?'<div class="response again">To inny składnik. Spróbuj ponownie albo zajrzyj do podpowiedzi.</div>':"";
 const hint=mystery.hint===1?'<div class="hint"><b>Pierwsza podpowiedź:</b> <span lang="en">'+q.word.en+'</span> znaczy '+q.word.pl+'.</div>':
 mystery.hint>=2?'<div class="hint"><b>Druga podpowiedź:</b> Lila podświetliła właściwy obrazek. Możesz go wybrać lub wspólnie odkryć odpowiedź.</div>':"";
 display(head("🕵️ DETEKTYW SMAKU · "+(mystery.index+1)+"/"+mystery.tasks.length,
 "O którym <em>produkcie</em> mowa?","Lila wypowiada zdanie. Wybierz produkt, o którym mówi, korzystając z poznanych słówek.")+
 dots(mystery.index,mystery.tasks.length)+
 '<div class="detect-scene"><div class="detect-image"><span class="who">'+q.who.emoji+'</span><span aria-hidden="true">🍽️</span></div>'+
 '<div class="detect-text"><span class="micro">LISTEN AND LOOK</span><h4 lang="en">'+line+'</h4>'+btn("hear-mystery","♫ Posłuchaj zdania","action-alt")+'</div></div>'+
 '<div class="answers">'+opts+'</div>'+reply+hint+
 '<div class="buttons">'+(mystery.done?btn("next-mystery",mystery.index===mystery.tasks.length-1?"Otwórzmy sklepik →":"Kolejny gość →"):
 btn("mystery-hint",mystery.hint===0?"💡 Wskazówka":mystery.hint===1?"💡 Podświetl odpowiedź":"✨ Pokaż rozwiązanie","action-alt"))+
 btn("plate","Wróć do talerza","action-link")+'</div>',
 "Lila pomoże Ci znaleźć słowo. Błąd i podpowiedź są normalną częścią nauki.");
}
function answerMystery(value,forced=false){
 if(!mystery||mystery.intro||mystery.done)return;
 const q=mystery.tasks[mystery.index];
 if(!forced&&value!==q.word.en){mystery.wrong=value;renderMystery();return}
 mystery.done=true;mystery.assisted=forced||mystery.hint>0||mystery.wrong!==null;
 mark(q.word,mystery.assisted?"helps":"found");renderMystery();if(!mystery.assisted)speak("Well done!");
}
function nextMystery(){
 if(!mystery||!mystery.done)return;
 if(mystery.index===mystery.tasks.length-1){go(4);return}
 mystery.index++;mystery.hint=0;mystery.wrong=null;mystery.done=false;mystery.assisted=false;renderMystery()
}
function startMarket(){
 if(!requireWords(3,"zabawy w sklep"))return;
 const pool=explored(),targets=priority(pool,Math.min(3,pool.length),"market");
 market={intro:true,tasks:targets.map(w=>({word:w,options:shuffle([w,...shuffle(pool.filter(v=>v.en!==w.en)).slice(0,2)])})),index:0,
 hint:0,wrong:null,done:false,assisted:false,thanks:false,basket:[]};renderMarket();
}
function renderMarket(){
 if(!market)return;
 if(market.intro){
 display(head("🛒 UCZYMY SIĘ ROZMOWY","Witaj w <em>sklepiku!</em>","Najpierw Lila pokaże Ci trzy proste zdania. Potem pobawimy się w kupowanie produktów.")+
 '<div class="shop-scene"><div class="shop-picture"><span aria-hidden="true">🦔🧀</span><b>THE FOOD SHOP</b></div><div class="shop-copy"><h4>Can I have cheese, please?</h4><p>Czy mogę prosić o ser?</p>'+btn("hear-shop-demo","♫ Posłuchaj rozmowy","action-alt")+'</div></div>'+
 '<div class="dialogue"><strong lang="en">Here you are. — Thank you!</strong><p>Proszę bardzo. — Dziękuję!</p></div>'+
 '<div class="info"><b>Zasada:</b> w każdym zadaniu wybieramy jedynie poznane produkty. Jeśli czegoś nie pamiętasz, Lila podpowie.</div>'+
 '<div class="buttons">'+btn("begin-market","Zróbmy zakupy →")+btn("plate","Najpierw mój talerz","action-alt")+'</div>',
 "Gdy prosimy o jedzenie, mówimy Can I have …, please? Sprzedawca odpowiada Here you are.");return
 }
 const q=market.tasks[market.index];
 const choices=q.options.map(w=>'<button type="button" data-action="market-answer" data-value="'+w.en+'" '+(market.done?"disabled":"")+
 ' class="'+(market.done&&w.en===q.word.en?"chosen":"")+'"><span role="img" aria-label="'+w.pl+'">'+w.icon+'</span><small>Produkt</small></button>').join("");
 const spoken=market.done?'<div class="dialogue"><strong lang="en">Here you are!</strong><p>Sprzedawca podał wybrany produkt. Odpowiedz mu: <span lang="en">Thank you!</span></p>'+
 btn("market-thanks",market.thanks?"Powiedziałem(am) „Thank you!” ✓":"Powiem „Thank you!” →","action-alt")+'</div>':"";
 const feedback=market.done?'<div class="response '+(market.assisted?"with-help":"yes")+'">'+
 (market.assisted?"Kupiliśmy to razem. ":"Świetnie, samodzielnie znalazłeś produkt! ")+q.word.en+' — '+q.word.pl+'.</div>':
 market.wrong!==null?'<div class="response again">To inny produkt. Spróbuj jeszcze raz, możesz skorzystać ze wskazówki.</div>':"";
 const hint=market.hint===1?'<div class="hint"><b>Wskazówka:</b> <span lang="en">'+q.word.en+'</span> znaczy '+q.word.pl+'.</div>':
 market.hint>=2?'<div class="hint"><b>Rozwiązanie:</b> Wybierz produkt '+q.word.pl+'.</div>':"";
 const basket=market.basket.map(w=>'<span class="basket-item">'+w.icon+' '+w.en+'</span>').join("");
 display(head("🛒 ZAKUPY · "+(market.index+1)+"/"+market.tasks.length,
 "Co podamy <em>kupującemu?</em>","Posłuchaj prośby w sklepiku i wybierz właściwy produkt. Następnie przećwicz krótką odpowiedź.")+
 dots(market.index,market.tasks.length)+
 '<div class="shop-scene"><div class="shop-picture"><span aria-hidden="true">🦔🛍️</span><b>THE LITTLE SHOP</b></div>'+
 '<div class="shop-copy"><span class="micro">CUSTOMER SAYS</span><h4 lang="en">Can I have '+q.word.en+', please?</h4>'+btn("hear-request","♫ Posłuchaj prośby","action-alt")+'</div></div>'+
 '<div class="market-options">'+choices+'</div>'+feedback+hint+spoken+
 '<div class="shop-basket">'+(basket||'<span class="tiny">Twój koszyk jest jeszcze pusty…</span>')+'</div>'+
 '<div class="buttons">'+(market.done&&market.thanks?btn("next-market",market.index===market.tasks.length-1?"Zagramy w bingo! →":"Kolejny klient →"):"")+
 (!market.done?btn("market-hint",market.hint===0?"💡 Podpowiedź":market.hint===1?"💡 Pokaż odpowiedź":"✨ Odkryj wspólnie","action-alt"):"")+
 btn("plate","Wróć do kuchni","action-link")+'</div>',
 "W sklepiku prosimy: Can I have …, please? Potem mówimy Here you are i Thank you.");
}
function answerMarket(value,forced=false){
 if(!market||market.intro||market.done)return;
 const q=market.tasks[market.index];
 if(!forced&&value!==q.word.en){market.wrong=value;renderMarket();return}
 market.done=true;market.assisted=forced||market.hint>0||market.wrong!==null;market.basket.push(q.word);
 mark(q.word,market.assisted?"helps":"market");renderMarket();
}
function nextMarket(){
 if(!market||!market.done||!market.thanks)return;
 if(market.index===market.tasks.length-1){go(5);return}
 market.index++;market.hint=0;market.wrong=null;market.done=false;market.assisted=false;market.thanks=false;renderMarket();
}
function makeBingo(){
 const knownWords=explored(),size=knownWords.length>=9?3:2,count=size*size;
 const board=shuffle(knownWords).slice(0,count);
 bingo={size,board,marks:[],target:pick(board).en,wrong:null,hint:0,win:false,assist:false};
}
function startBingo(){if(!requireWords(4,"bingo"))return;makeBingo();renderBingo()}
function hasLine(){
 if(!bingo)return false;const n=bingo.size,marks=bingo.marks;
 for(let r=0;r<n;r++)if(Array.from({length:n},(_,c)=>r*n+c).every(i=>marks.includes(bingo.board[i].en)))return true;
 for(let c=0;c<n;c++)if(Array.from({length:n},(_,r)=>r*n+c).every(i=>marks.includes(bingo.board[i].en)))return true;
 if(Array.from({length:n},(_,i)=>i*n+i).every(i=>marks.includes(bingo.board[i].en)))return true;
 return Array.from({length:n},(_,i)=>i*n+(n-1-i)).every(i=>marks.includes(bingo.board[i].en))
}
function renderBingo(){
 const card=bingo.board.find(w=>w.en===bingo.target),done=bingo.marks.includes(bingo.target);
 const tiles=bingo.board.map(w=>{
  const selected=bingo.marks.includes(w.en);
  return '<button type="button" data-action="bingo-answer" data-value="'+w.en+'" '+(selected||bingo.win?"disabled":"")+
  ' class="bingo-tile '+(selected?"marked":"")+(bingo.hint>=2&&bingo.target===w.en?" glow":"")+'" aria-label="Obrazek: '+w.pl+'">'+
  '<span aria-hidden="true">'+w.icon+'</span><small>'+(selected?"✓ ODKRYTE":"OBRAZEK")+'</small></button>';
 }).join("");
 const feedback=bingo.wrong!==null?'<div class="response again">Ten obrazek pokazuje inny produkt. Przyjrzyj się jeszcze raz.</div>':"";
 const hint=bingo.hint===1?'<div class="hint"><b>Wskazówka:</b> <span lang="en">'+card.en+'</span> oznacza '+card.pl+'.</div>':
 bingo.hint>=2?'<div class="hint"><b>Rozwiązanie:</b> Właściwy obrazek został podświetlony. Możesz kliknąć go lub poprosić Lilę o pokazanie.</div>':"";
 const end=bingo.win?'<div class="bingo-win">🎉 BINGO! Wspaniała przygoda ze słowami!</div>'+
 '<div class="info"><b>Udało się!</b> Połączyliśmy obrazki w rząd, kolumnę lub po skosie. A teraz możesz wybrać nową planszę lub odpocząć.</div>':"";
 display(head("🎉 OBRAZKOWE BINGO","Bingo w <em>kuchni Lili!</em>","Posłuchaj nazwy produktu i znajdź jego obrazek. Każda próba pomaga zapamiętać kolejne słowo.")+
 '<div class="bingo-question"><span class="micro">LOOK FOR THE FOOD</span><h4 lang="en">'+(bingo.win?"BINGO!":"Find the "+card.en+"!")+'</h4>'+
 (!bingo.win?btn("hear-bingo","♫ Posłuchaj słowa","action-alt"):"")+
 '<p>'+(bingo.size===2?"Mała plansza 2 × 2 — poznajemy pierwsze słowa.":"Duża plansza 3 × 3 — znamy już więcej słówek!")+'</p></div>'+
 '<div class="bingo-board '+(bingo.size===3?"grid-3":"")+'">'+tiles+'</div>'+end+
 (!bingo.win?feedback+hint:"")+
 '<div class="buttons">'+(bingo.win?btn("new-bingo","Nowa plansza ↻")+btn("summary","Zobacz moje odkrycia →","action-alt"):
 btn("bingo-hint",bingo.hint===0?"💡 Podpowiedź":bingo.hint===1?"💡 Podświetl obrazek":"✨ Odkryj rozwiązanie","action-alt"))+
 btn("plate","Wróć do talerza","action-link")+'</div>'+
 '<p class="tiny">Nie liczymy czasu ani nie odejmujemy punktów. Podpowiedzi służą nauce, a nie są karą.</p>',
 "To bingo nie jest na czas! Jeśli nie znasz słowa, pokażę Ci znaczenie.");
}
function bingoAnswer(value,forced=false){
 if(!bingo||bingo.win||bingo.marks.includes(bingo.target))return;
 if(!forced&&value!==bingo.target){bingo.wrong=value;renderBingo();return}
 const w=byName(bingo.target),helped=forced||bingo.hint>0||bingo.wrong!==null;
 bingo.marks.push(w.en);mark(w,helped?"helps":"found");
 bingo.win=hasLine();
 if(!bingo.win){const rest=bingo.board.filter(x=>!bingo.marks.includes(x.en));bingo.target=pick(rest).en;bingo.wrong=null;bingo.hint=0}
 renderBingo();
 if(bingo.win)speak("Bingo!");
}
function finish(){
 const n=explored().length,ind=WORDS.filter(w=>stat(w).found||stat(w).market).length,said=WORDS.filter(w=>stat(w).spoken).length;
 display('<div class="summary"><div class="summary-emoji" aria-hidden="true">🦔🍓🎉</div>'+
 head("✿ BRAWO, MAŁY KUCHARZU!","Well done, <em>little chef!</em>","Dziś odkrywałeś produkty, układałeś posiłki i rozmawiałeś po angielsku. A najważniejsze — próbowałeś!")+
 '<div class="summary-metrics"><span><b>'+n+'/16</b> poznanych produktów</span><span><b>'+ind+'</b> samodzielnie ćwiczonych</span><span><b>'+said+'</b> użytych podczas mówienia</span></div>'+
 '<p>Przy kolejnej wizycie Lila zaproponuje inne produkty i wróci do tych, które warto jeszcze poćwiczyć. Nie ma ocen ani presji.</p>'+
 '<div class="buttons">'+btn("new-trip","Nowa przygoda kulinarna ↗")+btn("plate","Jeszcze jeden talerz 🍽️","action-alt")+'</div></div>',
 "Brawo! Nawet jeśli korzystałeś z podpowiedzi, odkryłeś coś nowego.");
}
function newTrip(){state.visits++;session=selectSession();persist();go(0);$("adventure").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}
root.addEventListener("click",e=>{
 const el=e.target.closest("[data-action]");if(!el)return;const a=el.dataset.action,v=el.dataset.value;
 switch(a){
 case "discover":go(1);break;case "plate":go(2);break;case "to-mystery":go(3);break;
 case "reveal":translation=true;discover();break;
 case "hear-word":speak(session[card].en);break;
 case "previous":card=Math.max(0,card-1);translation=false;discover();break;
 case "next-word":if(card>=session.length-1)go(2);else{card++;translation=false;discover()}break;
 case "plate-food":if(known(v)){plate.food=v;plate.said=false;renderPlate()}break;
 case "plate-guest":if(v==="0"||v==="1"){plate.who=Number(v);plate.said=false;renderPlate()}break;
 case "plate-likes":if(v==="yes"||v==="no"){plate.likes=v==="yes";plate.said=false;renderPlate()}break;
 case "hear-plate":speak(plateSentence());break;
 case "say-plate":if(!plate.said){plate.said=true;mark(byName(plate.food),"spoken");renderPlate()}break;
 case "hear-example":speak("He likes cheese. She doesn't like carrots.");break;
 case "begin-mystery":mystery.intro=false;renderMystery();break;
 case "hear-mystery":{const q=mystery.tasks[mystery.index];speak(q.who.who+(q.likes?" likes ":" doesn't like ")+q.word.en+".");break}
 case "mystery-answer":answerMystery(v);break;
 case "mystery-hint":if(mystery){if(mystery.hint<2){mystery.hint++;renderMystery()}else answerMystery("",true)}break;
 case "next-mystery":nextMystery();break;
 case "hear-shop-demo":speak("Can I have cheese, please? Here you are. Thank you!");break;
 case "begin-market":market.intro=false;renderMarket();break;
 case "hear-request":speak("Can I have "+market.tasks[market.index].word.en+", please?");break;
 case "market-answer":answerMarket(v);break;
 case "market-hint":if(market){if(market.hint<2){market.hint++;renderMarket()}else answerMarket("",true)}break;
 case "market-thanks":if(market&&market.done&&!market.thanks){market.thanks=true;renderMarket();speak("Thank you!")}break;
 case "next-market":nextMarket();break;
 case "hear-bingo":speak(bingo.target);break;
 case "bingo-answer":bingoAnswer(v);break;
 case "bingo-hint":if(bingo){if(bingo.hint<2){bingo.hint++;renderBingo()}else bingoAnswer("",true)}break;
 case "new-bingo":makeBingo();renderBingo();break;
 case "summary":go(6);break;
 case "new-trip":newTrip();break;
 }
});
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{go(Number(t.dataset.step));$("stage").scrollIntoView({behavior:"smooth",block:"nearest"})}));
$("hero-plate").addEventListener("click",()=>{go(2);$("adventure").scrollIntoView({behavior:"smooth",block:"start"})});
$("sound").addEventListener("click",()=>{state.sound=!state.sound;if(!state.sound&&canSpeak)window.speechSynthesis.cancel();persist();soundUI()});
$("all-words").addEventListener("click",()=>{if(!state.sound||!canSpeak){toast("Włącz wymowę. Jeśli nie działa, sprawdź ustawienia przeglądarki.");return}try{window.speechSynthesis.cancel();WORDS.forEach(w=>{const u=new SpeechSynthesisUtterance(w.en);u.lang="en-GB";u.rate=.83;window.speechSynthesis.speak(u)})}catch(e){toast("Nie udało się odczytać wszystkich słów.")}});
$("print").addEventListener("click",()=>window.print());
$("about-progress").addEventListener("click",()=>{const open=$("about-panel").hidden;$("about-panel").hidden=!open;$("about-progress").setAttribute("aria-expanded",String(open));$("about-progress").textContent=open?"Zwiń informacje ↑":"Jak działa nauka? ↓"});
$("reset").addEventListener("click",()=>{
 if(!window.confirm("Usunąć postępy szóstej krainy zapisane w tej przeglądarce?"))return;
 state=fresh();try{const x=JSON.parse(localStorage.getItem(HOME)||"[]");if(Array.isArray(x))localStorage.setItem(HOME,JSON.stringify(x.filter(v=>!String(v).startsWith("6|"))))}catch(e){}
 persist();session=selectSession();go(0);soundUI();toast("Postępy szóstej krainy wyczyszczone.");
});
window.EnglishAdventureUnit6=Object.freeze({
 wordCount:WORDS.length,wordCardCount:WORDS.filter(w=>w.card).length,guideExtras:WORDS.filter(w=>!w.card).map(w=>w.en),
 words:WORDS.map(w=>w.en),
 inspect:()=>({seen:explored().map(w=>w.en),session:session.map(w=>w.en),independent:WORDS.filter(w=>stat(w).found||stat(w).market).map(w=>w.en),
 spoken:WORDS.filter(w=>stat(w).spoken).map(w=>w.en),bingoSize:bingo&&bingo.size}),
 newTrip
});
session=selectSession();counters();gallery();soundUI();go(0);
})();