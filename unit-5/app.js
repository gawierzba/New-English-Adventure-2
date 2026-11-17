"use strict";
/* English Adventure 2 / Kraina 5 — I can jump!
 * Scope: parent guide NEA2, PDF page 9 and WordCards Unit 5, PDF pp 11-15.
 * 17 card words: 7 animals/person + 10 actions. Original character Kiko, no
 * copyrighted film characters, art or recordings. The child selects their
 * own abilities; this app makes no judgements about physical capability.
 */
(()=>{
const VOCAB=[
 {en:"bear",pl:"niedźwiedź",icon:"🐻",group:"animal"},
 {en:"bird",pl:"ptak",icon:"🐦",group:"animal"},
 {en:"boy",pl:"chłopiec",icon:"👦",group:"animal"},
 {en:"climb",pl:"wspinać się",icon:"🧗",group:"action"},
 {en:"dance",pl:"tańczyć",icon:"💃",group:"action"},
 {en:"elephant",pl:"słoń",icon:"🐘",group:"animal"},
 {en:"fly",pl:"latać",icon:"🕊️",group:"action"},
 {en:"jump",pl:"skakać",icon:"🤸",group:"action"},
 {en:"monkey",pl:"małpa",icon:"🐒",group:"animal"},
 {en:"ride a bike",pl:"jeździć na rowerze",icon:"🚴",group:"action"},
 {en:"ride a horse",pl:"jeździć konno",icon:"🏇",group:"action"},
 {en:"run",pl:"biegać",icon:"🏃",group:"action"},
 {en:"sing",pl:"śpiewać",icon:"🎤",group:"action"},
 {en:"snake",pl:"wąż",icon:"🐍",group:"animal"},
 {en:"swim",pl:"pływać",icon:"🏊",group:"action"},
 {en:"walk",pl:"chodzić",icon:"🚶",group:"action"},
 {en:"tiger",pl:"tygrys",icon:"🐅",group:"animal"}
];
const INTRO=["jump","run","monkey","bird","bear"];
const $=id=>document.getElementById(id), root=$("stage"),KEY="ea2-jungle-v1",HOME_KEY="nea2-learned-v1";
const byEn=en=>VOCAB.find(w=>w.en===en);
const shuffle=arr=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const choose=arr=>arr[Math.floor(Math.random()*arr.length)];
const fresh=()=>({words:{},sound:true,visits:0});
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||"null");if(v&&typeof v==="object"&&!Array.isArray(v))return{words:v.words&&typeof v.words==="object"?v.words:{},sound:v.sound!==false,visits:Number(v.visits)||0}}catch(e){}return fresh()}
let state=load(),step=0,session=[],index=0,reveal=false,labAction=null,labMode="can",labAnswer=null,labSaid=false;
let ranger=null,interview=null,mime=null,toastJob=null;
function progress(w){const p=state.words[w.en]||{};return{seen:!!p.seen,found:Math.max(0,Number(p.found)||0),used:Math.max(0,Number(p.used)||0),spoken:Math.max(0,Number(p.spoken)||0),helps:Math.max(0,Number(p.helps)||0),last:Math.max(0,Number(p.last)||0)}}
const learned=()=>VOCAB.filter(w=>progress(w).seen);
const known=en=>!!byEn(en)&&progress(byEn(en)).seen;
const animals=()=>VOCAB.filter(w=>w.group==="animal"&&progress(w).seen);
const actions=()=>VOCAB.filter(w=>w.group==="action"&&progress(w).seen);
function syncMain(){try{const v=JSON.parse(localStorage.getItem(HOME_KEY)||"[]"),x=new Set(Array.isArray(v)?v.filter(s=>typeof s==="string"):[]);VOCAB.forEach(w=>{const p=progress(w);if(p.seen&&(p.found>0||p.used>0))x.add("5|"+w.en)});localStorage.setItem(HOME_KEY,JSON.stringify([...x]))}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}syncMain();renderProgress();renderVocab()}
function mark(w,field){if(!w)return;const p=progress(w);if(field==="seen")p.seen=true;else if(["found","used","spoken","helps"].includes(field))p[field]++;p.last=Date.now();state.words[w.en]=p;save()}
function pickSession(){
 if(!learned().length)return INTRO.map(byEn);
 const notSeen=shuffle(VOCAB.filter(w=>!progress(w).seen));
 const reviewed=shuffle(learned()).sort((a,b)=>(progress(a).found+progress(a).used)-(progress(b).found+progress(b).used)||progress(a).last-progress(b).last);
 return [...notSeen,...reviewed].slice(0,5)
}
function weak(pool,n,field){return shuffle(pool).map(w=>({w,score:(field?progress(w)[field]:progress(w).found+progress(w).used)+Math.random()*1.2})).sort((a,b)=>a.score-b.score).slice(0,Math.min(n,pool.length)).map(x=>x.w)}
function renderProgress(){
 const n=learned().length,solo=VOCAB.filter(w=>progress(w).found>0||progress(w).used>0).length;
 $("top-count").textContent=n+" / 17";$("banner-count").textContent=n;$("seen-count").textContent=n;$("solo-count").textContent=solo;
 $("progress-bar").style.width=(n/17*100)+"%";$("progress").setAttribute("aria-valuenow",String(n));
}
function renderVocab(){
 const root=$("vocab-grid");root.textContent="";
 VOCAB.forEach(w=>{
 const tile=document.createElement("article");tile.className="word-card";
 const photo=document.createElement("span");photo.className="word-icon";photo.textContent=w.icon;photo.setAttribute("aria-hidden","true");
 const box=document.createElement("div");box.className="word-meta";
 const h=document.createElement("strong");h.textContent=w.en;h.lang="en";
 const pl=document.createElement("small");pl.textContent=w.pl;
 const status=document.createElement("span");status.className=progress(w).seen?"seen":"";
 status.textContent=progress(w).found||progress(w).used?"✓ PRZEĆWICZONE":progress(w).seen?"✓ POZNANE":"DO ODKRYCIA";
 box.append(h,pl,status);
 const sound=document.createElement("button");sound.className="word-hear";sound.type="button";sound.textContent="♫";
 sound.setAttribute("aria-label","Posłuchaj: "+w.en);sound.addEventListener("click",()=>speak(w.en));
 tile.append(photo,box,sound);root.appendChild(tile);
 })
}
const speechOK=("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");if(toastJob)clearTimeout(toastJob);toastJob=setTimeout(()=>el.classList.remove("show"),3400)}
function speak(text){
 if(!state.sound){toast("Dźwięk jest wyłączony. Możesz włączyć go u góry.");return}
 if(!speechOK){toast("Ta przeglądarka nie obsługuje odczytu angielskich słów.");return}
 try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-GB";u.rate=.83;u.pitch=1.02;
 const v=window.speechSynthesis.getVoices(),voice=v.find(x=>/^en[-_]GB/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang));if(voice)u.voice=voice;
 window.speechSynthesis.speak(u)}catch(e){toast("Nie udało się odczytać zdania.")}
}
function soundUI(){const b=$("sound-toggle");b.setAttribute("aria-pressed",String(state.sound));b.setAttribute("aria-label",state.sound?"Wyłącz wymowę":"Włącz wymowę");b.innerHTML=state.sound?'♫ <span>Wymowa</span>':'♪ <span>Wyciszono</span>'}
const btn=(action,label,cls="action")=>'<button type="button" class="'+cls+'" data-action="'+action+'">'+label+'</button>';
const head=(k,h,p)=>'<div class="stage-header"><span class="kicker">'+k+'</span><h3>'+h+'</h3><p>'+p+'</p></div>';
const dots=(i,n)=>'<div class="dots" role="img" aria-label="Krok '+(i+1)+' z '+n+'">'+Array.from({length:n},(_,j)=>'<span class="'+(j<i?"past":j===i?"now":"")+'"></span>').join("")+'</div>';
function show(h,t){root.innerHTML=h;if(t)$("kiko-tip").textContent=t}
function go(n){
 step=n;index=0;reveal=false;
 document.querySelectorAll(".step").forEach(x=>{const on=Number(x.dataset.step)===n;x.classList.toggle("active",on);x.setAttribute("aria-current",on?"step":"false")});
 if(n===0)welcome();if(n===1)discover();if(n===2)startLab();if(n===3)startRanger();if(n===4)startInterview();if(n===5)startMime();if(n===6)finish();
}
function welcome(){
 show(head("🏕️ WITAM W DŻUNGLI","Hej! Jestem <em>Kiko.</em>","Mam dziesięć pomysłów na ruch i siedmiu przyjaciół do poznania. Odkryjmy, co potrafimy powiedzieć po angielsku!")+
 '<div class="welcome-grid"><div class="welcome-illustration"><span role="img" aria-label="Uśmiechnięta małpka">🐒🌿</span><span class="label">Hello, explorer! ✿</span></div>'+
 '<div class="welcome-copy"><h4>Masz ochotę na przygodę?</h4><p>Najpierw pokazuję słówka i ruch. Dopiero potem będą zagadki, pytania i kalambury. Żadne ćwiczenie nie wymaga prawdziwego skakania czy wspinaczki.</p>'+
 '<ul><li><span>🔍</span> Odkrywanie słów</li><li><span>⚡</span> Ruchoma scena</li><li><span>🐾</span> Tropienie zwierząt</li><li><span>🎭</span> Teatr gestów</li></ul></div></div>'+
 '<div class="notice"><b>Nasza zasada:</b> każdy ma inne umiejętności. Zdania „I can…” i „I can’t…” pomagają o nich opowiadać, ale nie są sprawdzianem sprawności.</div>'+
 '<div class="action-row">'+btn("discover","Poznajmy przyjaciół →")+btn("lab","Chcę zobaczyć animacje","outline")+'</div>',
 "Najpierw uczymy się kilku nowych słów. Potem pokażę Ci, jak tworzyć z nich własne zdania.");
}
function discover(){
 const w=session[index];if(!w)return;
 if(!progress(w).seen)mark(w,"seen");
 show(head("🔍 ODKRYWAM · "+(index+1)+"/"+session.length,"Co to za <em>supermoc?</em>","Poznaj nową nazwę zwierzęcia albo czynność. Zobacz obrazek, posłuchaj angielskiego słowa i odkryj tłumaczenie.")+
 dots(index,session.length)+
 '<div class="flash-grid"><div class="flash-photo"><span class="photo-stamp">'+(w.group==="animal"?"ANIMAL FRIEND":"ACTION POWER")+'</span><span class="photo-emoji" role="img" aria-label="'+w.pl+'">'+w.icon+'</span></div>'+
 '<div class="flash-copy"><span class="micro">ENGLISH</span><h4 lang="en">'+w.en+'</h4>'+btn("speak-word","♫ Posłuchaj wymowy","listen")+
 '<div class="translation">'+(reveal?'<span class="micro">PO POLSKU</span><strong>'+w.pl+'</strong>':btn("reveal","Pokaż, co to znaczy 👀",""))+'</div>'+
 '<p class="footnote">Powiedz słowo z Kiko. Możesz odsłuchać je tyle razy, ile potrzebujesz.</p></div></div>'+
 '<div class="action-row">'+(index?btn("previous","← Poprzednia karta","outline"):"")+
 btn("next-card",index===session.length-1?"Zobaczmy supermoce! →":"Następne słowo →")+'</div>'+
 '<p class="footnote">Poznanie słowa nie oznacza jego opanowania. W kolejnych zabawach będziemy do niego wracać.</p>',
 "Po angielsku mówimy "+w.en+". Posłuchaj i spróbuj powtórzyć.");
}
function gate(kind,n,place){
 const pool=kind==="animal"?animals():actions();
 if(pool.length>=n)return pool;
 show(head("🌱 UCZYMY SIĘ STOPNIOWO","Zacznijmy od <em>odkrywania.</em>","Do tej zabawy warto poznać przynajmniej "+n+" "+(kind==="animal"?"nazwy zwierząt lub postaci.":"nazwy czynności."))+
 '<div class="welcome-grid"><div class="welcome-illustration"><span>🔍🌿</span></div><div class="welcome-copy"><h4>Nie zgadujemy nieznanych słów!</h4><p>Kiko najpierw pokaże przykłady i wyjaśni je po polsku. Dopiero potem spróbujesz samodzielnie.</p><div class="action-row">'+btn("discover","Poznaj nowe słówka →")+'</div></div></div>',
 "Jeśli słowo jest nowe, najpierw je poznamy. Potem wróci w naszej zabawie.");
 return null;
}
const ACTION_ICON={climb:"🧗",dance:"💃",fly:"🕊️",jump:"🤸","ride a bike":"🚴","ride a horse":"🏇",run:"🏃",sing:"🎤",swim:"🏊",walk:"🚶"};
const ENGLISH_MODE={can:()=> "I can "+labAction+".",cant:()=> "I can't "+labAction+".",question:()=> "Can you "+labAction+"?"};
const POLISH_MODE={can:()=> "Potrafię "+(byEn(labAction)?.pl||labAction)+".",cant:()=> "Nie potrafię: "+(byEn(labAction)?.pl||labAction)+".",question:()=> "Czy potrafisz: "+(byEn(labAction)?.pl||labAction)+"?"};
function motionStage(action,mode){
 // Scene actors are imaginary, so a chosen power is not a factual statement about a real animal.
 const stageMode=mode==="cant"?"cant":"can";
 return '<div class="action-stage" data-motion="'+action+'" data-mode="'+stageMode+'" role="img" aria-label="Kiko na ruchomej scenie: '+action+'">'+
 '<div class="action-sun"></div><div class="tree" aria-hidden="true">🌳</div><div class="ground"></div>'+
 '<div class="vine"></div><div class="music" aria-hidden="true">♫ ♪ ♫</div>'+
 '<div class="wheels" aria-hidden="true">🚲</div><div class="stage-horse" aria-hidden="true">🐎</div><div class="stage-bike" aria-hidden="true">🚲</div>'+
 '<div class="stage-bubbles" aria-hidden="true">◌ ◦ ○</div><div class="shadow"></div>'+
 '<div class="creature" aria-hidden="true">'+(action==="fly"?"🦜":action==="swim"?"🐒":"🐒")+'</div><div class="waves"></div>'+
 '<div class="action-badge">MOVE & LEARN ✿</div></div>';
}
function startLab(){
 if(!gate("action",1,"lab"))return;
 if(!labAction||!known(labAction))labAction=actions()[0].en;
 labMode="can";labAnswer=null;labSaid=false;renderLab();
}
function renderLab(){
 const options=actions();
 if(!options.some(w=>w.en===labAction))labAction=options[0].en;
 const line=ENGLISH_MODE[labMode](),explanation=POLISH_MODE[labMode]();
 const buttons=options.map(w=>'<button type="button" class="lab-action '+(labAction===w.en?"chosen":"")+
 '" data-action="pick-power" data-value="'+w.en+'" aria-pressed="'+String(labAction===w.en)+'"><span aria-hidden="true">'+w.icon+'</span>'+w.en+'</button>').join("");
 const modes=[["can","I can..."],["cant","I can't..."],["question","Can you...?"]];
 const select=modes.map(m=>'<button type="button" class="mode-btn '+(labMode===m[0]?"active":"")+
 '" data-action="pick-mode" data-value="'+m[0]+'" aria-pressed="'+String(labMode===m[0])+'">'+m[1]+'</button>').join("");
 const answer=labMode==="question"?'<div class="yes-no"><button type="button" data-action="answer-self" data-value="yes" class="'+(labAnswer==="yes"?"chosen":"")+'">😊 Yes, I can.</button>'+
 '<button type="button" data-action="answer-self" data-value="no" class="'+(labAnswer==="no"?"chosen":"")+'">🌱 No, I can\'t.</button></div>'+
 (labAnswer?'<div class="notice"><b>To Twoja odpowiedź:</b> <span lang="en">'+(labAnswer==="yes"?"Yes, I can.":"No, I can't.")+
 '</span> Żadna odpowiedź nie jest „gorsza”.</div>':""):"";
 show(head("⚡ RUCHOMA DŻUNGLA","Wybierz swoją <em>supermoc!</em>","Dotknij poznanej czynności. Kiko pokaże ruch, a Ty możesz zmienić zdanie: „umiem”, „nie umiem” lub „czy umiesz?”.")+
 motionStage(labAction,labMode)+
 '<div class="lab-list">'+buttons+'</div><div class="mode-tabs">'+select+'</div>'+
 '<div class="speech-box"><span>YOUR ENGLISH SENTENCE</span><strong lang="en">'+line+'</strong><p>'+explanation+'</p></div>'+
 answer+'<div class="action-row">'+btn("speak-line","♫ Posłuchaj zdania","outline")+
 (labMode==="question"?"":btn("try-line",labSaid?"Spróbowałem(am)! ✓":"Spróbuję powiedzieć zdanie →"))+
 btn("ranger","Zobacz zwierzęta →","outline")+'</div>'+
 '<p class="footnote">Możesz tylko oglądać animację lub wykonać łatwy gest w miejscu. Prawdziwe wspinanie, jazda konna i pływanie nie są potrzebne do tej zabawy.</p>',
 "Zmień czynność i obserwuj ruch. Gdy włączysz I can't, animacja zatrzyma się.");
}
function startRanger(){
 const a=gate("animal",3,"ranger");if(!a)return;
 const list=weak(a,Math.min(4,a.length),"found").map(w=>({target:w,options:shuffle([w,...shuffle(a.filter(x=>x.en!==w.en)).slice(0,2)])}));
 ranger={list,index:0,hint:0,wrong:null,done:false,assisted:false,intro:true};renderRanger();
}
function renderRanger(){
 if(!ranger)return;
 if(ranger.intro){
 show(head("🐾 SZKOŁA TROPICIELI","Najpierw <em>obserwujemy!</em>","Zanim rozpoczniemy zagadki, obejrzyj trzech poznanych przyjaciół. Klikaj zdjęcia i posłuchaj ich angielskich nazw.")+
 '<div class="quiz-options">'+animals().slice(0,3).map(w=>'<button type="button" data-action="hear-animal" data-value="'+w.en+'"><span aria-hidden="true">'+w.icon+'</span><small lang="en">'+w.en+'</small><small>'+w.pl+'</small></button>').join("")+'</div>'+
 '<div class="notice"><b>Jak będzie wyglądać zabawa?</b> Kiko powie słowo po angielsku, a Ty wybierzesz odpowiedni obrazek. Zagadki nigdy nie pytają o niepoznane zwierzę.</div>'+
 '<div class="action-row">'+btn("start-ranger","Zaczynam tropienie →")+btn("discover","Wrócę do kart","outline")+'</div>',
 "Najpierw pokazuję trzy zwierzęta. Potem spróbujesz znaleźć je po angielskiej nazwie.");return;
 }
 const q=ranger.list[ranger.index];
 const opts=q.options.map(w=>'<button type="button" data-action="ranger-answer" data-value="'+w.en+'" '+(ranger.done?"disabled":"")+
 ' class="'+(ranger.done&&w.en===q.target.en?"correct":ranger.wrong===w.en?"wrong":"")+
 (ranger.hint>=2&&w.en===q.target.en?" glow":"")+'"><span role="img" aria-label="'+w.pl+'">'+w.icon+'</span><small>Obrazek</small></button>').join("");
 const result=ranger.done?'<div class="feedback '+(ranger.assisted?"assisted":"good")+'">'+
 (ranger.assisted?"Znaleźliśmy to razem. ":"Brawo, samodzielny tropicielu! ")+
 '<span lang="en">'+q.target.en+'</span> to '+q.target.pl+'.</div>':
 ranger.wrong!==null?'<div class="feedback retry">To inny zwierzak. Popatrz na obrazki i spróbuj jeszcze raz!</div>':"";
 const hint=ranger.hint===1?'<div class="tip"><strong>Podpowiedź:</strong> <span lang="en">'+q.target.en+'</span> oznacza '+q.target.pl+'.</div>':
 ranger.hint>=2?'<div class="tip"><strong>Wskazówka:</strong> Kiko podświetlił właściwe zdjęcie. Możesz je kliknąć lub poprosić o rozwiązanie.</div>':"";
 show(head("🐾 TROPICIEL · "+(ranger.index+1)+"/"+ranger.list.length,"Który to <em>przyjaciel?</em>","Posłuchaj nazwy i dotknij właściwego obrazka. Możesz prosić o podpowiedź bez żadnej kary.")+
 dots(ranger.index,ranger.list.length)+
 '<div class="question-scene"><span class="big" aria-hidden="true">🔎</span><div class="question"><span class="micro">FIND THE ANIMAL</span><h4 lang="en">Find the '+q.target.en+'!</h4>'+btn("hear-target","♫ Posłuchaj","outline")+'</div></div>'+
 '<div class="quiz-options">'+opts+'</div>'+result+hint+
 '<div class="action-row">'+(ranger.done?btn("next-ranger",ranger.index===ranger.list.length-1?"Zadajmy pytania! →":"Kolejny trop →"):
 btn("ranger-hint",ranger.hint===0?"💡 Podpowiedź":ranger.hint===1?"💡 Druga wskazówka":"✨ Pokaż rozwiązanie","outline"))+
 btn("lab","Wrócę do ruchomej dżungli","quiet")+'</div>',
 "Rozpoznajesz małpę, ptaka, niedźwiedzia i inne poznane zwierzęta. Spokojnie!");
}
function rangerAnswer(value,forced=false){
 if(!ranger||ranger.done||ranger.intro)return;
 const q=ranger.list[ranger.index];
 if(!forced&&value!==q.target.en){ranger.wrong=value;renderRanger();return}
 ranger.done=true;ranger.assisted=forced||ranger.hint>0||ranger.wrong!==null;
 mark(q.target,ranger.assisted?"helps":"found");renderRanger();
 if(!ranger.assisted)speak("Great job!");
}
function rangerNext(){
 if(!ranger||!ranger.done)return;
 if(ranger.index===ranger.list.length-1){go(4);return}
 ranger.index++;ranger.hint=0;ranger.wrong=null;ranger.done=false;ranger.assisted=false;renderRanger();
}
function startInterview(){
 if(!gate("action",1,"interview"))return;
 const list=weak(actions(),Math.min(4,actions().length),"used");
 interview={intro:true,list,index:0,answer:null,spoken:false};renderInterview();
}
function renderInterview(){
 if(!interview)return;
 if(interview.intro){
 show(head("💬 MINI-LEKCJA","Jak zapytać o <em>supermoc?</em>","Pytania nie są sprawdzianem sprawności. To ćwiczenie językowe: wybierasz odpowiedź, która pasuje do Ciebie lub do wymyślonej postaci.")+
 '<div class="dialogue"><span class="speaker">KIKO PYTA</span><div class="line" lang="en">Can you jump?</div><p class="meaning">Umiesz skakać?</p></div>'+
 '<div class="yes-no"><button type="button" data-action="hear-example" data-value="yes">😊 <span lang="en">Yes, I can.</span></button><button type="button" data-action="hear-example" data-value="no">🌱 <span lang="en">No, I can\'t.</span></button></div>'+
 '<div class="tip"><strong>Zapamiętaj:</strong> <span lang="en">Can you…?</span> — „Czy potrafisz…?” Możesz odpowiedzieć <span lang="en">Yes, I can</span> albo <span lang="en">No, I can\'t</span>. Obie odpowiedzi są poprawne gramatycznie.</div>'+
 '<div class="action-row">'+btn("begin-interview","Teraz porozmawiajmy →")+btn("lab","Jeszcze przećwiczę zdania","outline")+'</div>',
 "Najpierw nauczymy się dwóch możliwych odpowiedzi na pytanie Can you?");return
 }
 const w=interview.list[interview.index],answer=interview.answer;
 show(head("💬 ROZMOWA · "+(interview.index+1)+"/"+interview.list.length,"Kiko pyta: <em>Can you…?</em>","Wybierz własną odpowiedź. To nie ocena umiejętności — możesz odpowiedzieć zgodnie z prawdą lub udawać fikcyjnego bohatera.")+
 dots(interview.index,interview.list.length)+
 '<div class="role-card"><div class="role-avatar" aria-hidden="true">'+w.icon+'</div><div class="role-text"><span class="micro">KIKO IS ASKING</span><h4 lang="en">Can you '+w.en+'?</h4><p>Czy potrafisz: '+w.pl+'?</p>'+btn("hear-interview","♫ Posłuchaj pytania","outline")+'</div></div>'+
 '<div class="yes-no"><button type="button" class="'+(answer==="yes"?"chosen":"")+'" data-action="interview-answer" data-value="yes">😊 Yes, I can.</button>'+
 '<button type="button" class="'+(answer==="no"?"chosen":"")+'" data-action="interview-answer" data-value="no">🌿 No, I can\'t.</button></div>'+
 (answer?'<div class="notice"><b>Twoje zdanie:</b> <span lang="en">'+(answer==="yes"?"Yes, I can. I can "+w.en+".":"No, I can't. I can't "+w.en+".")+
 '</span> Nie ma tu złych odpowiedzi — ćwiczysz mówienie o umiejętnościach.</div>':"")+
 '<div class="action-row">'+(answer?btn("next-interview",interview.index===interview.list.length-1?"Pora na kalambury →":"Kolejne pytanie →"):"")+
 btn("hear-interview","♫ Posłuchaj jeszcze raz","outline")+'</div><p class="footnote">Możesz nie wykonywać żadnego ruchu. Ćwiczymy przede wszystkim pytania i odpowiedzi po angielsku.</p>',
 "Każdy może mieć inne umiejętności. Tutaj obie odpowiedzi są w porządku.");
}
function startMime(){
 const a=gate("action",1,"mime");if(!a)return;
 mime={list:weak(a,Math.min(3,a.length),"spoken"),idx:0,shown:false,attempt:null};
 renderMime();
}
function renderMime(){
 if(!mime)return;
 const w=mime.list[mime.idx];
 const sentence="I can "+w.en+".";
 show(head("🎭 TEATR KIKO · "+(mime.idx+1)+"/"+mime.list.length,"Zagrajmy w <em>kalambury!</em>","W poradniku ta zabawa polega na pokazywaniu czynności gestem. Możesz odgrywać je na siedząco, wyobrażać sobie albo tylko je nazywać.")+
 dots(mime.idx,mime.list.length)+
 '<div class="charade-board"><div class="charade-img">'+w.icon+'<small>GUESS THE ACTION!</small></div>'+
 '<div class="charade-copy"><span class="micro">MIME & SPEAK</span><h4>'+(mime.shown?'<span lang="en">'+sentence+'</span>':'Co przedstawia ten obrazek?')+'</h4>'+
 '<p>'+(mime.shown?'"'+w.pl+'". Możesz pokazać bezpieczny gest i powiedzieć zdanie.':'Najpierw spróbuj rozpoznać ruch. W razie potrzeby pokażę słówko i gotowe zdanie.')+'</p>'+
 btn("show-mime",mime.shown?"♫ Posłuchaj zdania":"👀 Pokaż zdanie","outline")+'</div></div>'+
 (mime.shown?'<div class="speech-box"><span>YOUR ENGLISH SENTENCE</span><strong lang="en">'+sentence+'</strong><p>Potrafię: '+w.pl+'.</p></div>':"")+
 '<div class="action-row">'+(mime.shown?btn("mime-attempt",mime.attempt?"Spróbowałem(am)! ✓":"Spróbuję powiedzieć →"):"")+
 (mime.attempt?btn("next-mime",mime.idx===mime.list.length-1?"Zobacz moje odkrycia →":"Następne kalambury →"):"")+
 btn("lab","Jeszcze zobaczę animacje","outline")+'</div>'+
 '<p class="footnote">Nie musisz faktycznie pływać, wspinać się ani jeździć na koniu. Wystarczy mały gest, pokazanie obrazka lub powiedzenie zdania.</p>',
 "Najpierw odgadnij, potem posłuchaj i spróbuj powiedzieć: I can "+w.en+".");
}
function finish(){
 const n=learned().length,recognized=VOCAB.filter(w=>progress(w).found>0||progress(w).used>0).length,spoken=VOCAB.filter(w=>progress(w).spoken>0).length;
 show('<div class="finish"><div class="finish-emoji" aria-hidden="true">🐒🌿✨</div>'+
 head("✳ PRZYGODA ZAKOŃCZONA","Super, <em>Explorer!</em>","Dziś odkryliśmy nowe zwierzęta, pokazaliśmy supermoce i ćwiczyliśmy prawdziwe angielskie zdania.")+
 '<div class="finish-metrics"><span><strong>'+n+'/17</strong> poznanych słów</span><span><strong>'+recognized+'</strong> samodzielnych ćwiczeń</span><span><strong>'+spoken+'</strong> słów użytych w mówieniu</span></div>'+
 '<p>Nie trzeba pamiętać wszystkiego od razu. Przy następnej wyprawie pojawią się nowe słowa, a słabiej ćwiczone powrócą w innej kolejności.</p>'+
 '<div class="action-row">'+btn("new-trip","Kolejna wyprawa z Kiko ↗")+btn("lab","Jeszcze pobawmy się ruchami","outline")+'</div></div>',
 "Każda mała próba pomaga uczyć się języka. Do następnej przygody!");
}
function newTrip(){state.visits++;session=pickSession();save();go(0);$("missions").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}
root.addEventListener("click",e=>{
 const el=e.target.closest("[data-action]");if(!el)return;const a=el.dataset.action,v=el.dataset.value;
 switch(a){
 case "discover":go(1);break;case "lab":go(2);break;case "ranger":go(3);break;
 case "reveal":reveal=true;discover();break;case "speak-word":speak(session[index].en);break;
 case "previous":index=Math.max(0,index-1);reveal=false;discover();break;
 case "next-card":if(index===session.length-1)go(2);else{index++;reveal=false;discover()}break;
 case "pick-power":if(known(v)&&byEn(v).group==="action"){labAction=v;labAnswer=null;labSaid=false;renderLab()}break;
 case "pick-mode":if(["can","cant","question"].includes(v)){labMode=v;labAnswer=null;labSaid=false;renderLab()}break;
 case "speak-line":speak(ENGLISH_MODE[labMode]());break;
 case "answer-self":if(["yes","no"].includes(v)){labAnswer=v;renderLab();speak(v==="yes"?"Yes, I can.":"No, I can't.")}break;
 case "try-line":if(!labSaid){labSaid=true;mark(byEn(labAction),"used");renderLab()}break;
 case "hear-animal":if(known(v))speak(v);break;
 case "start-ranger":ranger.intro=false;renderRanger();break;
 case "hear-target":speak("Find the "+ranger.list[ranger.index].target.en+"!");break;
 case "ranger-answer":rangerAnswer(v);break;
 case "ranger-hint":if(ranger){if(ranger.hint<2){ranger.hint++;renderRanger()}else rangerAnswer("",true)}break;
 case "next-ranger":rangerNext();break;
 case "begin-interview":interview.intro=false;renderInterview();break;
 case "hear-example":speak(v==="yes"?"Yes, I can.":"No, I can't.");break;
 case "hear-interview":speak("Can you "+interview.list[interview.index].en+"?");break;
 case "interview-answer":if(["yes","no"].includes(v)){interview.answer=v;renderInterview();speak(v==="yes"?"Yes, I can.":"No, I can't.")}break;
 case "next-interview":if(interview.answer){if(interview.index>=interview.list.length-1)go(5);else{interview.index++;interview.answer=null;renderInterview()}}break;
 case "show-mime":if(!mime.shown){mime.shown=true;renderMime()}else speak("I can "+mime.list[mime.idx].en+".");break;
 case "mime-attempt":if(mime.shown&&!mime.attempt){mime.attempt=true;mark(mime.list[mime.idx],"spoken");renderMime()}break;
 case "next-mime":if(mime.attempt){if(mime.idx>=mime.list.length-1)go(6);else{mime.idx++;mime.shown=false;mime.attempt=null;renderMime()}}break;
 case "new-trip":newTrip();break;
 }
});
document.querySelectorAll(".step").forEach(tab=>tab.addEventListener("click",()=>{go(Number(tab.dataset.step));$("stage").scrollIntoView({behavior:"smooth",block:"nearest"})}));
$("jump-into-lab").addEventListener("click",()=>{go(2);$("missions").scrollIntoView({behavior:"smooth",block:"start"})});
$("sound-toggle").addEventListener("click",()=>{state.sound=!state.sound;if(!state.sound&&speechOK)window.speechSynthesis.cancel();save();soundUI()});
$("listen-all").addEventListener("click",()=>{if(!state.sound||!speechOK){toast("Dźwięk jest wyłączony lub niedostępny.");return}try{window.speechSynthesis.cancel();VOCAB.forEach(w=>{const u=new SpeechSynthesisUtterance(w.en);u.lang="en-GB";u.rate=.8;window.speechSynthesis.speak(u)})}catch(e){toast("Nie udało się odczytać listy.")}});
$("print-words").addEventListener("click",()=>window.print());
$("info-toggle").addEventListener("click",()=>{const open=$("info-content").hidden;$("info-content").hidden=!open;$("info-toggle").setAttribute("aria-expanded",String(open));$("info-toggle").textContent=open?"Zwiń informacje ↑":"O sposobie nauki ↓"});
$("clear").addEventListener("click",()=>{
 if(!window.confirm("Usunąć postępy piątej krainy w tej przeglądarce?"))return;
 state=fresh();try{const x=JSON.parse(localStorage.getItem(HOME_KEY)||"[]");if(Array.isArray(x))localStorage.setItem(HOME_KEY,JSON.stringify(x.filter(k=>!String(k).startsWith("5|"))))}catch(e){}
 save();session=pickSession();go(0);soundUI();toast("Postępy piątej krainy wyczyszczone.");
});
window.EnglishAdventureUnit5=Object.freeze({vocabulary:VOCAB.map(w=>w.en),animalCount:7,actionCount:10,inspect:()=>({seen:learned().map(w=>w.en),session:session.map(w=>w.en),independent:VOCAB.filter(w=>progress(w).found||progress(w).used).map(w=>w.en)}),newTrip});
session=pickSession();renderProgress();renderVocab();soundUI();go(0);
})();