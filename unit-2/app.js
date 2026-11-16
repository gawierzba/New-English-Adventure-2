"use strict";
/* English Adventure 2 · Unit 2 — My family
 * Original learning activities using source-backed scope from the parent guide,
 * WordCards and Unit 2 worksheets. All characters and pictures are invented.
 * "My family" activities use fictional families rather than a child's personal situation.
 */
(()=>{
const PEOPLE=[
 {en:"aunt",pl:"ciocia",who:"Zosia",icon:"👩‍🦰",generation:1,note:"Siostra mamy Neli"},
 {en:"baby sister",pl:"siostrzyczka (niemowlę)",who:"Iga",icon:"👶",generation:2,note:"Najmłodsza siostra Neli"},
 {en:"big brother",pl:"starszy brat",who:"Olek",icon:"🧑‍🦱",generation:2,note:"Starszy brat Neli"},
 {en:"brother",pl:"brat",who:"Franek",icon:"👦",generation:2,note:"Brat Neli"},
 {en:"cousin",pl:"kuzyn / kuzynka",who:"Ada",icon:"👧",generation:2,note:"Córka cioci Zosi"},
 {en:"dad",pl:"tata",who:"Kuba",icon:"👨",generation:1,note:"Tata Neli"},
 {en:"granddad",pl:"dziadek",who:"Jan",icon:"👴",generation:0,note:"Tata mamy Neli"},
 {en:"grandma",pl:"babcia",who:"Maria",icon:"👵",generation:0,note:"Mama mamy Neli"},
 {en:"mum",pl:"mama",who:"Ewa",icon:"👩",generation:1,note:"Mama Neli"},
 {en:"sister",pl:"siostra",who:"Hania",icon:"👧",generation:2,note:"Siostra Neli"},
 {en:"uncle",pl:"wujek",who:"Bartek",icon:"👨‍🦱",generation:1,note:"Mąż cioci Zosi"}
];
const PROFILES=[
 {name:"Mila",icon:"👧",roles:["mum","dad","sister","grandma","cousin","aunt"]},
 {name:"Oskar",icon:"🧒",roles:["dad","mum","brother","granddad","uncle","big brother"]},
 {name:"Lena",icon:"👧",roles:["grandma","aunt","baby sister","big brother","cousin"]},
 {name:"Tomek",icon:"🧒",roles:["mum","sister","granddad","uncle","brother"]},
 {name:"Zoja",icon:"👧",roles:["dad","grandma","baby sister","uncle","sister"]},
 {name:"Filip",icon:"👦",roles:["aunt","cousin","big brother","granddad","brother"]}
];
const KEY="ea2-family-v1",HOME_KEY="nea2-learned-v1";
const $=id=>document.getElementById(id);
const root=$("stage");
const shuffle=a=>{const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
const byWord=en=>PEOPLE.find(p=>p.en===en);
const article=en=>(/^(aunt|uncle)\b/.test(en)?"an ":"a ")+en;
const englishList=items=>items.length===1?items[0]:items.length===2?items.join(" and "):items.slice(0,-1).join(", ")+" and "+items[items.length-1];
function defaultData(){return{entries:{},sound:true,visits:0}}
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||"null");if(d&&typeof d==="object"&&!Array.isArray(d))return{entries:d.entries&&typeof d.entries==="object"?d.entries:{},sound:d.sound!==false,visits:Number(d.visits)||0}}catch(e){}return defaultData()}
let data=load(),step=0,trip=[],flip=false,position=0;
let activity=null,treeRevealed=new Set(),photoChoices=[],photoAbsent=null,photoSpoken=false,toastTimeout=null;
function stats(p){
 const saved=data.entries[p.en]||{};
 return{seen:!!saved.seen,recognise:Math.max(0,Number(saved.recognise)||0),interview:Math.max(0,Number(saved.interview)||0),
    helps:Math.max(0,Number(saved.helps)||0),story:Math.max(0,Number(saved.story)||0),last:Math.max(0,Number(saved.last)||0)};
}
function learned(){return PEOPLE.filter(p=>stats(p).seen)}
function update(p,field){
 const s=stats(p);if(field==="seen")s.seen=true;
 else if(["recognise","interview","helps","story"].includes(field))s[field]++;
 s.last=Date.now();data.entries[p.en]=s;save();
}
function save(){
 try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}
 syncHome();renderProgress();renderGallery();
}
function syncHome(){
 try{
 const stored=JSON.parse(localStorage.getItem(HOME_KEY)||"[]");
 const set=new Set(Array.isArray(stored)?stored.filter(v=>typeof v==="string"):[]);
 PEOPLE.forEach(p=>{const s=stats(p);if(s.seen&&s.recognise>0&&s.interview>0)set.add("2|"+p.en)});
 localStorage.setItem(HOME_KEY,JSON.stringify(Array.from(set)));
 }catch(e){}
}
function pickTrip(){
 const unseen=shuffle(PEOPLE.filter(p=>!stats(p).seen));
 const known=shuffle(learned()).sort((a,b)=>{
  const a1=stats(a),b1=stats(b);
  return(a1.recognise+a1.interview)-(b1.recognise+b1.interview)||a1.last-b1.last;
 });
 return [...unseen,...known].slice(0,5)
}
function weakPractice(pool,n){
 return shuffle(pool).map(p=>({p,score:stats(p).recognise+stats(p).interview+Math.random()*1.5}))
 .sort((a,b)=>a.score-b.score).slice(0,Math.min(n,pool.length)).map(x=>x.p)
}
const speechAvailable="speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;
function toast(text){
 const el=$("toast");el.textContent=text;el.classList.add("show");
 if(toastTimeout)clearTimeout(toastTimeout);
 toastTimeout=setTimeout(()=>el.classList.remove("show"),3200)
}
function speak(text){
 if(!data.sound){toast("Dźwięk jest wyłączony. Możesz go włączyć u góry.");return}
 if(!speechAvailable){toast("Ta przeglądarka nie obsługuje syntezatora mowy.");return}
 try{
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);utterance.lang="en-GB";utterance.rate=.83;utterance.pitch=1.03;
  const voices=window.speechSynthesis.getVoices();
  utterance.voice=voices.find(v=>/^en[-_]GB/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang))||null;
  window.speechSynthesis.speak(utterance);
 }catch(e){toast("Wymowa nie jest obecnie dostępna na tym urządzeniu.")}
}
function soundState(){
 const b=$("sound-toggle");b.setAttribute("aria-pressed",String(data.sound));
 b.setAttribute("aria-label",data.sound?"Wyłącz wymowę":"Włącz wymowę");
 b.innerHTML=data.sound?'♫ <span>Dźwięk</span>':'♪ <span>Wyciszono</span>';
}
function renderProgress(){
 const seen=learned().length,solo=PEOPLE.filter(p=>stats(p).recognise>0).length;
 $("header-count").textContent=seen+" / 11";$("banner-known").textContent=seen;
 $("seen-count").textContent=seen;$("solo-count").textContent=solo;
 $("progress-fill").style.width=(100*seen/11)+"%";
 $("discovery-progress").setAttribute("aria-valuenow",String(seen))
}
function renderGallery(){
 const gallery=$("vocab-grid");gallery.textContent="";
 PEOPLE.forEach(p=>{
  const card=document.createElement("article");card.className="word-card";
  const pic=document.createElement("div");pic.className="word-photo";pic.textContent=p.icon;pic.setAttribute("aria-hidden","true");
  const meta=document.createElement("div");meta.className="word-meta";
  const title=document.createElement("strong");title.lang="en";title.textContent=p.en;
  const pl=document.createElement("small");pl.textContent=p.pl;
  const state=document.createElement("span");state.className=stats(p).seen?"seen":"";
  state.textContent=stats(p).recognise>0&&stats(p).interview>0?"✓ PRZEĆWICZONE":stats(p).seen?"✓ POZNANE":"DO ODKRYCIA";
  meta.append(title,pl,state);
  const hear=document.createElement("button");hear.type="button";hear.className="word-speak";hear.textContent="♫";hear.setAttribute("aria-label","Posłuchaj słowa "+p.en);
  hear.addEventListener("click",()=>speak(p.en));card.append(pic,meta,hear);gallery.appendChild(card)
 })
}
function head(kicker,title,description){
 return '<div class="stage-head"><span class="stage-kicker">'+kicker+'</span><h3>'+title+'</h3><p>'+description+'</p></div>'
}
function btn(action,label,cls="primary-cta",extra=""){
 return '<button type="button" class="'+cls+'" data-action="'+action+'" '+extra+'>'+label+'</button>'
}
function dots(index,total){
 return '<div class="step-dots" role="img" aria-label="Karta '+(index+1)+' z '+total+'">'+Array.from({length:total},(_,i)=>
 '<span class="'+(i<index?"past":i===index?"current":"")+'"></span>').join("")+"</div>"
}
function show(html,tip){
 root.innerHTML=html;
 if(tip)$("pipi-tip").textContent=tip
}
function go(n){
 step=n;position=0;flip=false;photoChoices=[];photoAbsent=null;photoSpoken=false;
 document.querySelectorAll(".lesson-pill").forEach(tab=>{
  const active=Number(tab.dataset.step)===n;tab.classList.toggle("active",active);tab.setAttribute("aria-current",active?"step":"false");
 });
 if(n===0)welcome();
 if(n===1)discover();
 if(n===2){treeRevealed=new Set(learned().map(p=>p.en));renderTree()}
 if(n===3)prepareMatch();
 if(n===4)prepareInterview();
 if(n===5)renderStudio();
 if(n===6)finish();
}
function welcome(){
 show(head("🏡 ZACZYNAMY","Hello! Jestem <em>Pipi.</em>","Zebrałam stare zdjęcia, ale nie znam wszystkich angielskich podpisów. Pomożesz mi?")+
 '<div class="welcome-layout"><div class="welcome-polaroid"><div class="welcome-emoji" role="img" aria-label="Lisiczka z aparatem">🦊📸</div><div class="polaroid-caption">Our little family story ♡</div></div>'+
 '<div class="welcome-text"><h4>Album ma wiele tajemnic!</h4><p>Wymyślona Nela ma sporą rodzinę. Poznamy słówka, obejrzymy rodzinne drzewo i pobawimy się w wywiady.</p>'+
 '<ul class="welcome-list"><li><span>📷</span> Odkryj fotografie</li><li><span>🌳</span> Poznaj drzewo rodzinne</li><li><span>🎤</span> Zapytaj i odpowiedz</li><li><span>💌</span> Ułóż własną historię</li></ul></div></div>'+
 '<div class="hint-panel"><strong>Najważniejsze:</strong> Nie musisz opowiadać o swojej prawdziwej rodzinie. Tutaj wspólnie wymyślamy historie i spokojnie uczymy się angielskiego.</div>'+
 '<div class="actions">'+btn("discover","Otwieram album →")+btn("tree","Chcę zobaczyć drzewo 🌳","minor-cta")+'</div>',
 "Każda rodzina wygląda inaczej. W naszej zabawie poznajemy fikcyjną Nelę i jej krewnych.")
}
function discover(){
 const p=trip[position];if(!p)return;
 if(!stats(p).seen)update(p,"seen");
 show(head("📷 NOWA FOTOGRAFIA · "+(position+1)+"/"+trip.length,"Kto jest na <em>zdjęciu?</em>","Poznaj jedną osobę z opowieści. Posłuchaj nazwy, obejrzyj fotografię i odkryj tłumaczenie.")+
 dots(position,trip.length)+
 '<div class="discover-body"><div class="big-photo"><span class="photo-stamp">FAMILY ALBUM</span><span class="picture-person" role="img" aria-label="Postać: '+p.who+'">'+p.icon+'</span><span class="photo-title">'+p.who+' ♡</span></div>'+
 '<div class="discover-copy"><span class="inline-label">ENGLISH</span><h4 lang="en">'+p.en+'</h4>'+btn("hear-card","♫ Posłuchaj wymowy","listen-btn")+
 '<div class="reveal-card">'+(flip?'<span class="inline-label">PO POLSKU</span><strong>'+p.pl+'</strong><small>'+p.note+'</small>':btn("flip-card","Odkryj, co to znaczy 👀",""))+'</div>'+
 '<p class="flash-instruction">Powtórz słowo razem z Pipi. Pamiętaj, że możesz słuchać wiele razy.</p></div></div>'+
 '<div class="actions">'+(position>0?btn("prev-card","← Poprzednia karta","minor-cta"):"")+
 btn("next-card",position===trip.length-1?"Zajrzyjmy na drzewo! →":"Następne zdjęcie →")+'</div><p class="small-note">To etap odkrywania — niczego nie oceniamy. Możesz wrócić do zdjęć w dowolnej chwili.</p>',
 "Zobacz zdjęcie "+p.who+". Po angielsku ta osoba to "+p.en+".")
}
function renderTree(){
 const groups=[
 {label:"DZIADKOWIE NELI",list:PEOPLE.filter(p=>p.generation===0)},
 {label:"RODZICE, CIOCIA I WUJEK",list:PEOPLE.filter(p=>p.generation===1)},
 {label:"RODZEŃSTWO I KUZYNOSTWO",list:PEOPLE.filter(p=>p.generation===2)}
 ];
 const tree=groups.map((g,i)=>
 (i?'<div class="tree-path" aria-hidden="true"></div>':"")+
 '<div class="generation"><div class="generation-label">'+g.label+'</div>'+g.list.map(p=>{
 const revealed=treeRevealed.has(p.en);
 return '<button type="button" class="tree-person '+(revealed?"featured":"unseen")+'" data-action="tree-person" data-value="'+p.en+'" aria-label="Odkryj: '+p.who+', '+p.pl+'">'+
 '<span class="person-emoji" aria-hidden="true">'+p.icon+'</span><span class="person-name">'+p.who+'</span>'+
 '<span class="person-role">'+p.pl+'</span><span class="person-role en" lang="en">'+(revealed?p.en:"odkryj ✦")+'</span>'+
 (revealed?'<span class="person-tick" aria-hidden="true">✓</span>':"")+'</button>'
 }).join("")+'</div>'
 ).join("");
 show(head("🌳 DRZEWO RODZINNE","Poznaj rodzinę <em>Neli.</em>","Każda fotografia ma swoje miejsce. Kliknij osobę na drzewie, by odkryć jej angielską nazwę i usłyszeć wymowę.")+
 '<div class="tree-intro"><strong>Oto wymyślona rodzina:</strong> Maria i Jan są dziadkami Neli. Ewa i Kuba są jej rodzicami. Zosia jest siostrą Ewy, a Bartek jej mężem. Ada jest córką Zosi. Pozostałe dzieci są rodzeństwem Neli.</div>'+
 '<div class="family-tree">'+tree+'</div>'+
 '<div class="tree-story"><strong>🔎 Mała wskazówka:</strong> Babcia i dziadek są na górze. Rodzice, ciocia i wujek w środku. Rodzeństwo i kuzynka na dole. To jedna wymyślona rodzina — inne mogą wyglądać zupełnie inaczej.</div>'+
 '<div class="actions">'+btn("detective","Teraz zabawa w detektywa →")+btn("discover","Wrócę do fiszek","minor-cta")+'</div>',
 "Klikaj fotografie na drzewie, aby odkryć, jak nazywają się po angielsku członkowie rodziny.")
}
function need(n){
 if(learned().length>=n)return learned();
 show(head("🌱 MAŁY KROK","Najpierw <em>odkrywamy.</em>","Do tej zabawy warto poznać przynajmniej "+n+" słówka.")+
 '<div class="welcome-layout"><div class="welcome-polaroid"><div class="welcome-emoji">📚</div><div class="polaroid-caption">Little steps first</div></div><div class="welcome-text"><h4>Wróćmy do fotografii</h4><p>Pipi nie będzie zadawała pytań o nieznane osoby. Najpierw poznamy je spokojnie, potem spróbujemy sami.</p>'+
 '<div class="actions">'+btn("discover","Poznaj słówka →")+btn("tree","Obejrzyj drzewo","minor-cta")+'</div></div></div>',
 "Najpierw poznajemy słówka, później ćwiczymy. Pomoc jest zawsze możliwa.");
 return null;
}
function prepareMatch(){
 const available=need(3);if(!available){activity=null;return}
 activity={type:"match",list:weakPractice(available,Math.min(4,available.length)),
  index:0,options:[],misses:0,hint:0,done:false,wrong:null,assisted:false};
 prepareOptions();renderMatch()
}
function prepareOptions(){
 if(!activity)return;
 const q=activity.list[activity.index];
 activity.options=shuffle([q,...shuffle(learned().filter(p=>p.en!==q.en)).slice(0,2)]);
 activity.misses=0;activity.hint=0;activity.done=false;activity.wrong=null;activity.assisted=false
}
function renderMatch(){
 if(!activity||activity.type!=="match")return;
 const q=activity.list[activity.index];
 const choices=activity.options.map(p=>
 '<button type="button" data-action="match-answer" data-value="'+p.en+'" '+(activity.done?"disabled":"")+
 ' class="choice-card '+(activity.done&&p.en===q.en?"correct":activity.wrong===p.en?"wrong":"")+
 (activity.hint>=2&&p.en===q.en?" glow":"")+'">'+
 '<span class="candidate-emoji" aria-hidden="true">'+p.icon+'</span><span class="candidate-name">'+p.who+'</span><span class="candidate-role">'+p.pl+'</span></button>'
 ).join("");
 const help=activity.hint===1?'<div class="hint-panel"><strong>Pierwsza wskazówka:</strong> '+q.en+' to '+q.pl+'. Poszukaj odpowiedniego podpisu na fotografii.</div>':
 activity.hint>=2?'<div class="hint-panel"><strong>Druga wskazówka:</strong> Pipi podświetliła właściwe zdjęcie. Możesz je kliknąć lub zobaczyć rozwiązanie.</div>':"";
 const result=activity.done?'<div class="feedback '+(activity.assisted?"known":"good")+'">'+
 (activity.assisted?"Odkryliśmy odpowiedź wspólnie! 💗 ":"Udało się samodzielnie! 🌟 ")+'<span lang="en">'+q.en+'</span> to '+q.pl+'. Na zdjęciu jest '+q.who+'.</div>':
 activity.wrong?'<div class="feedback try">Ta fotografia przedstawia: '+byWord(activity.wrong).pl+'. Spróbuj jeszcze raz — nic nie szkodzi!</div>':"";
 show(head("🔎 FOTO-DETEKTYW · "+(activity.index+1)+"/"+activity.list.length,"Odnajdź właściwe <em>zdjęcie!</em>","Pipi mówi angielskie słowo. Spośród trzech fotografii wybierz właściwą osobę z wymyślonej rodziny Neli.")+
 dots(activity.index,activity.list.length)+
 '<div class="question-box"><span class="question-icon" aria-hidden="true">🔎</span><div><span class="question-label">FIND THE FAMILY MEMBER</span>'+
 '<div class="question-word" lang="en">'+q.en+'</div>'+btn("say-question","♫ Posłuchaj","minor-cta")+'</div></div>'+
 '<div class="choice-grid">'+choices+'</div>'+result+help+
 '<div class="hint-actions">'+(activity.done?btn("next-task",activity.index===activity.list.length-1?"Czas na wywiad →":"Następne zdjęcie →"):
 btn("match-hint",activity.hint===0?"💡 Pierwsza podpowiedź":activity.hint===1?"💡 Druga podpowiedź":"✨ Pokaż rozwiązanie","minor-cta"))+
 btn("tree","Wrócę na drzewo","quiet-cta")+'</div>',
 "Spróbuj spokojnie. Jeśli wybierzesz inne zdjęcie, pomogę Ci odnaleźć właściwe.")
}
function answerMatch(value,forced=false){
 if(!activity||activity.done)return;
 const q=activity.list[activity.index];
 if(!forced&&value!==q.en){activity.misses++;activity.wrong=value;renderMatch();return}
 activity.done=true;activity.assisted=forced||activity.hint>0||activity.misses>0;
 update(q,activity.assisted?"helps":"recognise");renderMatch();
 if(!activity.assisted)speak("Great job!")
}
function prepareInterview(){
 const known=need(3);if(!known){activity=null;return}
 const practice=weakPractice(known,Math.min(4,known.length));
 activity={type:"interview",intro:true,index:0,misses:0,hint:0,done:false,wrong:null,assisted:false,
  list:practice.map((p,i)=>{
   const preferYes=i%2===0;
   const matching=PROFILES.filter(x=>x.roles.includes(p.en)===preferYes);
   const chosen=shuffle(matching.length?matching:PROFILES)[0];
   return {target:p,profile:chosen,yes:chosen.roles.includes(p.en)}
  })};
 renderInterview()
}
function renderInterview(){
 if(!activity||activity.type!=="interview")return;
 if(activity.intro){
 show(head("🎤 LEKCJA Z PIPI","Jak pytać o <em>rodzinę?</em>","Najpierw posłuchaj krótkiej rozmowy. Później spróbujesz zadań z wymyślonymi gośćmi.")+
 '<div class="interview-scene"><div class="journalist"><span class="journalist-emoji" aria-hidden="true">🦊🎤</span><strong>Pipi jest reporterką!</strong><small>Wywiad z fikcyjną osobą</small></div>'+
 '<div class="album-roles"><strong>Przykładowy album Mili</strong><p>Na zdjęciach są: mama i siostra.</p><div class="family-chips"><span class="family-chip">👩 mama</span><span class="family-chip">👧 siostra</span></div></div></div>'+
 '<div class="interview-question"><small>QUESTION / PYTANIE</small><h4 lang="en">Have you got a sister?</h4>'+
 '<div class="actions">'+btn("speak-example","♫ Posłuchaj przykładu","minor-cta")+'</div></div>'+
 '<div class="hint-panel"><strong>Odpowiedź „Tak”:</strong> <span lang="en">Yes, I have. I\'ve got a sister.</span><br>'+
 '<strong>Odpowiedź „Nie”:</strong> <span lang="en">No, I haven\'t. I haven\'t got a brother.</span><br>'+
 'Uwaga: przed <em>aunt</em> i <em>uncle</em> mówimy <em>an</em>, np. <em>an aunt</em>.</div>'+
 '<div class="actions">'+btn("begin-interview","Rozpocznij wywiad →")+btn("tree","Jeszcze pooglądam album","minor-cta")+'</div>',
 "W tym ćwiczeniu wcielasz się w wymyśloną postać. Odpowiadasz na podstawie jej albumu, nie swojej rodziny.");
 return;
 }
 const q=activity.list[activity.index];
 const roles=q.profile.roles.map(byWord).filter(p=>p&&stats(p).seen);
 const roster=roles.length?roles.map(p=>'<span class="family-chip">'+p.icon+" "+p.pl+"</span>").join(""):'<span class="family-chip">Brak zdjęć spośród poznanych osób</span>';
 const query="Have you got "+article(q.target.en)+"?";
 const correct=q.yes?"Yes, I have.":"No, I haven't.";
 const explanation=q.yes?"I've got "+article(q.target.en)+".":"I haven't got "+article(q.target.en)+".";
 const feedback=activity.done?'<div class="feedback '+(activity.assisted?"known":"good")+'">'+
 (activity.assisted?"Sprawdziliśmy to razem! ":"Znakomicie! ")+'<b lang="en">'+correct+" "+explanation+"</b>"+
 '<br>W albumie '+q.profile.name+(q.yes?" jest ":" nie ma ")+q.target.pl+'.</div>':
 activity.wrong?'<div class="feedback try">Sprawdź fotografie gościa jeszcze raz. Czy widzisz na nich '+q.target.pl+'?</div>':"";
 const hint=activity.hint===1?'<div class="hint-panel"><strong>Podpowiedź:</strong> Pytanie dotyczy: '+q.target.pl+'. Spójrz na podpisy w albumie.</div>':
 activity.hint>=2?'<div class="hint-panel"><strong>Wskazówka:</strong> '+(q.yes?'Ta osoba jest w albumie.':'Tej osoby nie ma w albumie.')+
 ' Możesz teraz odpowiedzieć albo zobaczyć rozwiązanie.</div>':"";
 show(head("🎤 WYWIAD · "+(activity.index+1)+"/"+activity.list.length,"Pipi pyta, Ty <em>odpowiadasz!</em>","Odgrywasz rolę fikcyjnego gościa. Odpowiadasz na podstawie jego albumu, nie swojej własnej rodziny.")+
 dots(activity.index,activity.list.length)+
 '<div class="interview-scene"><div class="journalist"><span class="journalist-emoji" aria-hidden="true">'+q.profile.icon+'</span>'+
 '<strong>Jesteś '+q.profile.name+'</strong><small>To Twoja fikcyjna postać w wywiadzie</small></div>'+
 '<div class="album-roles"><strong>W albumie '+q.profile.name+' są:</strong><p>Te fotografie przedstawiają osoby z wymyślonej opowieści.</p>'+
 '<div class="family-chips">'+roster+'</div></div></div>'+
 '<div class="interview-question"><small>PIPI ASKS YOU / PIPI PYTA</small><h4 lang="en">'+query+'</h4>'+
 btn("say-question","♫ Posłuchaj pytania","minor-cta")+'</div>'+
 '<div class="yesno-grid"><button type="button" '+(activity.done?"disabled":"")+' class="yesno-btn '+(activity.done&&q.yes?"correct":activity.wrong==="yes"?"wrong":"")+
 '" data-action="answer-interview" data-value="yes">👍 Yes, I have.</button>'+
 '<button type="button" '+(activity.done?"disabled":"")+' class="yesno-btn '+(activity.done&&!q.yes?"correct":activity.wrong==="no"?"wrong":"")+
 '" data-action="answer-interview" data-value="no">🙅 No, I haven\'t.</button></div>'+
 feedback+hint+'<div class="hint-actions">'+(activity.done?btn("next-task",activity.index===activity.list.length-1?"Stwórz własny album →":"Następne pytanie →"):
 btn("interview-hint",activity.hint===0?"💡 Poproszę podpowiedź":activity.hint===1?"💡 Jeszcze jedna wskazówka":"✨ Pokaż rozwiązanie","minor-cta"))+
 btn("tree","Obejrzę drzewo","quiet-cta")+'</div>',
 "Przypomnij sobie, o kogo pytam. Sprawdź, czy taka osoba znajduje się w albumie Twojej fikcyjnej postaci.")
}
function answerInterview(value,forced=false){
 if(!activity||activity.done||activity.type!=="interview")return;
 const q=activity.list[activity.index];
 if(!forced&&(value==="yes")!==q.yes){activity.misses++;activity.wrong=value;renderInterview();return}
 activity.done=true;activity.assisted=forced||activity.misses>0||activity.hint>0;
 update(q.target,activity.assisted?"helps":"interview");
 renderInterview();speak(q.yes?"Yes, I have.":"No, I haven't.")
}
function nextTask(){
 if(!activity||!activity.done)return;
 if(activity.index>=activity.list.length-1){go(activity.type==="match"?4:5);return}
 activity.index++;activity.misses=0;activity.hint=0;activity.done=false;activity.wrong=null;activity.assisted=false;
 if(activity.type==="match")prepareOptions();
 if(activity.type==="match")renderMatch();else renderInterview()
}
function sentenceForPhoto(){
 if(!photoChoices.length)return "I've got...";
 return "I've got "+englishList(photoChoices.map(en=>article(en)))+"."
}
function translationForPhoto(){
 if(!photoChoices.length)return"Dotknij zdjęć, aby stworzyć opowieść.";
 return "W tym fikcyjnym albumie są: "+photoChoices.map(en=>byWord(en).pl).join(", ")+"."
}
function renderStudio(){
 const pool=need(1);if(!pool)return;
 const eligible=pool.slice();
 const cards=eligible.map(p=>
 '<button type="button" class="studio-card '+(photoChoices.includes(p.en)?"selected":"")+
 '" data-action="toggle-person" data-value="'+p.en+'" '+(photoChoices.length>=3&&!photoChoices.includes(p.en)?"disabled":"")+
 ' aria-pressed="'+String(photoChoices.includes(p.en))+'"><span aria-hidden="true">'+p.icon+'</span>'+p.en+'</button>'
 ).join("");
 const preview=photoChoices.length?photoChoices.map(en=>{
 const p=byWord(en);return '<div class="preview-person"><span aria-hidden="true">'+p.icon+'</span>'+p.who+'</div>'
 }).join(""):'<div class="preview-person"><span aria-hidden="true">📷</span>Twój album</div>';
 const absentChoices=eligible.filter(p=>!photoChoices.includes(p.en));
 const negative=photoAbsent&&absentChoices.some(p=>p.en===photoAbsent)?"I haven't got "+article(photoAbsent)+".":null;
 const phrase=sentenceForPhoto(),pl=translationForPhoto();
 show(head("💌 STUDIO FOTO","Stwórz swoją <em>opowieść.</em>","Wymyśl nowy album! Wybierz od jednej do trzech osób, a Pipi pomoże ułożyć poprawne angielskie zdanie.")+
 '<div class="album-intro"><strong>To wyobraźnia, nie test.</strong> Nie opisujemy Twojej prawdziwej rodziny. Bawimy się wymyślonym albumem, w którym mogą wystąpić dowolne poznane postacie.</div>'+
 '<div class="studio-grid">'+cards+'</div>'+
 '<div class="photo-preview"><div class="preview-people">'+preview+'</div><div class="photo-signature">Our imaginary family album ♡</div></div>'+
 '<div class="sentence-panel"><span class="inline-label">YOUR STORY / TWOJA HISTORIA</span><strong lang="en">'+phrase+'</strong>'+
 '<small>'+pl+'</small>'+(negative?'<strong lang="en">'+negative+'</strong><small>Możesz również powiedzieć, że kogoś w tej historii nie ma.</small>':"")+'</div>'+
 '<div class="actions">'+(photoChoices.length?btn("say-story","♫ Posłuchaj zdania","minor-cta"):"")+
 (absentChoices.length&&photoChoices.length?btn("add-not",photoAbsent?"Zmień zdanie przeczące":"Dodaj zdanie „I haven't got…”","minor-cta"):"")+
 (photoChoices.length&&!photoSpoken?btn("mark-spoken","Spróbowałem(am) powiedzieć! →"):"")+
 (photoSpoken?btn("finish","Zamknij album i zobacz odkrycia →"):"")+'</div>'+
 '<div class="dialog-hint">'+(photoSpoken?"Brawo za próbę! 🌟 Nie oceniamy wymowy. Możesz ćwiczyć tyle, ile chcesz.":
 "Wybierz osoby, posłuchaj zdania i powiedz je na głos. Nikt nie nagrywa Twojego głosu.")+'</div>',
 "To Twoja własna wymyślona historia! Możesz tworzyć różne albumy z poznanych postaci.")
}
function finish(){
 const seen=learned().length,recognised=PEOPLE.filter(p=>stats(p).recognise>0).length,spoken=PEOPLE.filter(p=>stats(p).story>0).length;
 show('<div class="conclusion"><div class="conclusion-emoji" aria-hidden="true">📚✨</div>'+
 head("✿ NASZ ALBUM GOTOWY","What a lovely <em>adventure!</em>","Dzięki Tobie Pipi poznała kilka nowych osób. Nie musisz wszystkiego pamiętać od razu — będziemy wracać do tych słów.")+
 '<div class="conclusion-stats"><span><strong>'+seen+'/11</strong> słówek poznanych</span><span><strong>'+recognised+'</strong> samodzielnie odnalezionych</span>'+
 '<span><strong>'+spoken+'</strong> użytych w historii</span></div>'+
 '<p>Następnym razem pokażę Ci inne fotografie albo wrócimy do tych, z którymi potrzebna była pomoc. To nie sprawdzian — to nasza wspólna nauka. ♥</p>'+
 '<div class="actions">'+btn("new-trip","Nowa rodzinna opowieść ↗")+btn("tree","Jeszcze obejrzę drzewo","minor-cta")+'</div></div>',
 "Wspaniała wyprawa! Pamiętaj, że nauka języka to wiele małych przygód, nie jeden wynik.")
}
function newTrip(){
 data.visits++;trip=pickTrip();save();go(0);
 $("activities").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})
}
root.addEventListener("click",event=>{
 const el=event.target.closest("[data-action]");if(!el)return;
 const action=el.dataset.action,value=el.dataset.value;
 switch(action){
 case "discover":go(1);break;
 case "tree":go(2);break;
 case "detective":go(3);break;
 case "flip-card":flip=true;discover();break;
 case "hear-card":speak(trip[position].en);break;
 case "prev-card":position=Math.max(0,position-1);flip=false;discover();break;
 case "next-card":if(position>=trip.length-1)go(2);else{position++;flip=false;discover()}break;
 case "tree-person":{const p=byWord(value);if(!p)return;treeRevealed.add(p.en);if(!stats(p).seen)update(p,"seen");renderTree();speak(p.en);break}
 case "say-question":
   if(activity?.type==="match")speak(activity.list[activity.index].en);
   if(activity?.type==="interview"){const q=activity.list[activity.index];speak("Have you got "+article(q.target.en)+"?")}break;
 case "match-answer":answerMatch(value);break;
 case "match-hint":
   if(activity&&activity.type==="match"){if(activity.hint<2){activity.hint++;renderMatch()}else answerMatch(activity.list[activity.index].en,true)}break;
 case "next-task":nextTask();break;
 case "begin-interview":if(activity&&activity.type==="interview"){activity.intro=false;renderInterview()}break;
 case "speak-example":speak("Have you got a sister? Yes, I have. I've got a sister.");break;
 case "answer-interview":answerInterview(value);break;
 case "interview-hint":
   if(activity&&activity.type==="interview"){if(activity.hint<2){activity.hint++;renderInterview()}else answerInterview("",true)}break;
 case "toggle-person":
   if(photoChoices.includes(value)){photoChoices=photoChoices.filter(en=>en!==value)}
   else if(photoChoices.length<3&&stats(byWord(value)).seen){photoChoices.push(value)}
   if(photoAbsent&&photoChoices.includes(photoAbsent))photoAbsent=null;
   photoSpoken=false;renderStudio();break;
 case "say-story":if(photoChoices.length){speak(sentenceForPhoto());if(photoAbsent)speak("I haven't got "+article(photoAbsent)+".")}break;
 case "add-not":{
   const absent=learned().filter(p=>!photoChoices.includes(p.en));
   if(absent.length){const next=shuffle(absent.filter(p=>p.en!==photoAbsent));photoAbsent=(next[0]||absent[0]).en;renderStudio()}break}
 case "mark-spoken":if(photoChoices.length&&!photoSpoken){photoChoices.forEach(en=>update(byWord(en),"story"));photoSpoken=true;renderStudio()}break;
 case "finish":go(6);break;
 case "new-trip":newTrip();break;
 }
});
document.querySelectorAll(".lesson-pill").forEach(tab=>tab.addEventListener("click",()=>{
 go(Number(tab.dataset.step));
 $("stage").scrollIntoView({behavior:"smooth",block:"nearest"})
}));
document.querySelectorAll("[data-goto]").forEach(btn=>btn.addEventListener("click",()=>{
 go(Number(btn.dataset.goto));$("activities").scrollIntoView({behavior:"smooth",block:"start"})
}));
$("sound-toggle").addEventListener("click",()=>{
 data.sound=!data.sound;save();if(!data.sound&&speechAvailable)window.speechSynthesis.cancel();soundState()
});
$("speak-all").addEventListener("click",()=>{
 if(!data.sound){toast("Włącz dźwięk u góry strony.");return}
 if(!speechAvailable){toast("Ta przeglądarka nie obsługuje syntezatora mowy.");return}
 try{window.speechSynthesis.cancel();PEOPLE.forEach(p=>{const u=new SpeechSynthesisUtterance(p.en);u.lang="en-GB";u.rate=.8;window.speechSynthesis.speak(u)})}
 catch(e){toast("Nie udało się odczytać całej listy.")}
});
$("print-list").addEventListener("click",()=>window.print());
$("about-progress").addEventListener("click",()=>{
 const shown=$("parent-details").hidden;$("parent-details").hidden=!shown;
 $("about-progress").setAttribute("aria-expanded",String(shown));
 $("about-progress").textContent=shown?"Zwiń informacje ↑":"Jak zapisujemy naukę? ↓";
});
$("clear-progress").addEventListener("click",()=>{
 if(!window.confirm("Usunąć postępy krainy My family zapisane w tej przeglądarce?"))return;
 data={entries:{},sound:data.sound,visits:0};
 try{
  const prev=JSON.parse(localStorage.getItem(HOME_KEY)||"[]");
  if(Array.isArray(prev))localStorage.setItem(HOME_KEY,JSON.stringify(prev.filter(k=>!String(k).startsWith("2|"))))
 }catch(e){}
 save();trip=pickTrip();go(0);toast("Postępy tej krainy zostały wyczyszczone.");
});
window.EnglishAdventureUnit2=Object.freeze({
 wordCount:PEOPLE.length,words:PEOPLE.map(p=>p.en),
 patterns:["Have you got a/an...?","I've got...","I haven't got..."],
 inspect:()=>({seen:learned().map(p=>p.en),session:trip.map(p=>p.en),independent:PEOPLE.filter(p=>stats(p).recognise>0&&stats(p).interview>0).map(p=>p.en)}),
 newTrip
});
trip=pickTrip();renderGallery();renderProgress();soundState();go(0);
})();