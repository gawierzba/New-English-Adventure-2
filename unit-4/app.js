"use strict";
/* English Adventure 2 · Unit 4 · My room.
 * Original illustrated scene; curriculum from parent guide, WordCards
 * and Unit 4 worksheets. 10 objects; on, under, next to; numbers 16-20.
 * Unseen words never used as unassisted quiz targets. */
(()=>{
const WORDS=[
 ["armchair","fotel","🛋️"],["bath","wanna","🛁"],["bed","łóżko","🛏️"],
 ["box","pudełko","📦"],["carpet","dywan","🧶"],["cupboard","szafka","🗄️"],
 ["curtain","zasłona","🪟"],["floor","podłoga","🪵"],["lamp","lampa","💡"],
 ["mirror","lustro","🪞"]
].map(([en,pl,icon])=>({en,pl,icon}));
const NUMS=[["sixteen",16],["seventeen",17],["eighteen",18],["nineteen",19],["twenty",20]].map(([en,n])=>({en,n}));
const PREPS=[{id:"on",en:"on",pl:"na",icon:"⬆️"},{id:"under",en:"under",pl:"pod",icon:"⬇️"},{id:"next to",en:"next to",pl:"obok",icon:"↔️"}];
const $=id=>document.getElementById(id),root=$("lesson");
const KEY="ea2-myroom-v1",MAIN="nea2-learned-v1";
function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function rand(arr){return arr[Math.floor(Math.random()*arr.length)]}
const byWord=en=>WORDS.find(w=>w.en===en);
function empty(){return{words:{},sound:true,visits:0}}
function restore(){try{const d=JSON.parse(localStorage.getItem(KEY)||"null");if(d&&typeof d==="object"&&!Array.isArray(d))return{words:d.words&&typeof d.words==="object"?d.words:{},sound:d.sound!==false,visits:Number(d.visits)||0}}catch(e){}return empty()}
let data=restore(),step=0,session=[],card=0,flipped=false,location={item:"box",anchor:"bed",position:"on"},said=false;
let hunt=null,numberState=null,toastTimer=null;
function status(w){const p=data.words[w.en]||{};return {seen:!!p.seen,recognised:Number(p.recognised)||0,placed:Number(p.placed)||0,spoken:Number(p.spoken)||0,helped:Number(p.helped)||0,last:Number(p.last)||0}}
const known=en=>{const w=byWord(en);return !!w&&status(w).seen};
const seen=()=>WORDS.filter(w=>status(w).seen);
function syncMain(){try{const x=JSON.parse(localStorage.getItem(MAIN)||"[]"),set=new Set(Array.isArray(x)?x.filter(v=>typeof v==="string"):[]);WORDS.forEach(w=>{const p=status(w);if(p.seen&&p.recognised>0)set.add("4|"+w.en)});localStorage.setItem(MAIN,JSON.stringify([...set]))}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}syncMain();refresh()}
function mark(w,key){if(!w)return;const p=status(w);if(key==="seen")p.seen=true;else if(["recognised","placed","spoken","helped"].includes(key))p[key]++;p.last=Date.now();data.words[w.en]=p;save()}
function pickSession(){
 const todo=shuffle(WORDS.filter(w=>!status(w).seen));
 const front=[];
 for(const n of ["bed","box"]){const w=byWord(n);if(!status(w).seen)front.push(w)}
 const unseen=todo.filter(w=>!front.includes(w));
 const review=shuffle(seen()).sort((a,b)=>(status(a).recognised+status(a).placed)-(status(b).recognised+status(b).placed)||status(a).last-status(b).last);
 return [...front,...unseen,...review].slice(0,5)
}
function weak(arr,k,n){return shuffle(arr).map(w=>({w,score:status(w)[k]+Math.random()*1.5})).sort((a,b)=>a.score-b.score).slice(0,Math.min(n,arr.length)).map(x=>x.w)}
function refresh(){
 const n=seen().length,independent=WORDS.filter(w=>status(w).recognised>0||status(w).placed>0).length;
 $("nav-count").textContent=n+"/10";$("strip-count").textContent=n;$("seen").textContent=n;$("solved").textContent=independent;
 $("track-fill").style.width=(n/10*100)+"%";$("track").setAttribute("aria-valuenow",String(n));
 const list=$("word-grid");list.textContent="";
 WORDS.forEach(w=>{
 const item=document.createElement("article");item.className="word-item";
 const pic=document.createElement("span");pic.className="word-icon";pic.textContent=w.icon;pic.setAttribute("aria-hidden","true");
 const copy=document.createElement("div");copy.className="word-text";
 const h=document.createElement("strong");h.lang="en";h.textContent=w.en;
 const pl=document.createElement("small");pl.textContent=w.pl;
 const progress=document.createElement("em");progress.className=status(w).seen?"known":"";
 progress.textContent=status(w).recognised?"✓ PRZEĆWICZONE":status(w).seen?"✓ ODKRYTE":"DO ODKRYCIA";
 copy.append(h,pl,progress);
 const hear=document.createElement("button");hear.type="button";hear.className="word-audio";hear.textContent="♫";hear.setAttribute("aria-label","Posłuchaj: "+w.en);hear.addEventListener("click",()=>speak(w.en));
 item.append(pic,copy,hear);list.appendChild(item)
 })
}
const hasSpeech="speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove("visible"),3400)}
function speak(t){
 if(!data.sound){toast("Dźwięk jest wyłączony. Włącz go w górnym menu.");return}
 if(!hasSpeech){toast("Przeglądarka nie obsługuje odczytu słówek.");return}
 try{window.speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(t);utter.lang="en-GB";utter.rate=.82;const vs=window.speechSynthesis.getVoices();const best=vs.find(v=>/^en[-_]GB/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang));if(best)utter.voice=best;window.speechSynthesis.speak(utter)}
 catch(e){toast("Nie udało się odtworzyć wymowy.")}
}
function soundUI(){const b=$("sound");b.setAttribute("aria-pressed",String(data.sound));b.setAttribute("aria-label",data.sound?"Wyłącz wymowę":"Włącz wymowę");b.innerHTML=data.sound?'♫ <span>Wymowa</span>':'♪ <span>Wyciszono</span>'}
const btn=(action,label,cls="go-btn",attrs="")=>'<button type="button" data-action="'+action+'" class="'+cls+'" '+attrs+'>'+label+'</button>';
const title=(label,h,p)=>'<div class="stage-header"><span class="stage-label">'+label+'</span><h3>'+h+'</h3><p>'+p+'</p></div>';
const steps=(i,total)=>'<div class="mini-track" role="img" aria-label="Krok '+(i+1)+' z '+total+'">'+Array.from({length:total},(_,j)=>'<span class="'+(j<i?"past":j===i?"now":"")+'"></span>').join("")+'</div>';
function display(html,tip){root.innerHTML=html;if(tip)$("iskra-tip").textContent=tip}
function go(n){
 step=n;card=0;flipped=false;said=false;
 document.querySelectorAll(".tab").forEach(x=>{const on=Number(x.dataset.tab)===n;x.classList.toggle("active",on);x.setAttribute("aria-current",on?"step":"false")});
 if(n===0)welcome();if(n===1)learn();if(n===2)startArrange();if(n===3)startHunt();if(n===4)startNumbers();if(n===5)startSpeaking();if(n===6)finish()
}
function gate(n,kind){
 if(seen().length>=n)return true;
 display(title("🌱 NAJPIERW ODKRYJMY","Poznajmy kilka <em>słówek!</em>","Do "+kind+" przydadzą się przynajmniej "+n+" poznane przedmioty.")+
 '<div class="welcome"><div class="welcome-art"><span class="owl">🔍</span><span class="speech">I can help you!</span></div>'+
 '<div class="welcome-copy"><h4>Najpierw poznajemy, później próbujemy.</h4><p>Iskra nie będzie zadawać pytań o niepoznane rzeczy. Otwórzmy kilka kart.</p>'+
 '<div class="actions">'+btn("learn","Odkryj słówka →")+'</div></div></div>',
 "Nie trzeba niczego zgadywać bez przygotowania. Najpierw pokażę Ci nowe słowa.");
 return false
}
function welcome(){
 display(title("🌙 NOCNA PRZYGODA","Cześć! Jestem <em>Iskra!</em>","Zapraszam do mojego magicznego pokoju. Zniknęło z niego pudełko, a meble chyba zmieniają miejsca! Pomożesz mi?")+
 '<div class="welcome"><div class="welcome-art"><span class="owl" aria-hidden="true">🦉🌙</span><span class="speech">Hello, explorer! ✦</span></div>'+
 '<div class="welcome-copy"><h4>Co znajdziemy w pokoju?</h4><p>Poznamy nowe słowa, ustawimy rzeczy na łóżku i obok niego, sprawdzimy kryjówki, a na końcu policzymy gwiazdy.</p>'+
 '<ul class="welcome-list"><li><span>🔎</span> Odkrywanie</li><li><span>🛏️</span> Urządzanie pokoju</li><li><span>🔦</span> Poszukiwanie skarbów</li><li><span>✨</span> Liczby od 16 do 20</li></ul></div></div>'+
 '<div class="memo"><b>Ważne:</b> Iskra nigdy nie wystawi oceny. Możesz poprosić o wskazówkę, zobaczyć rozwiązanie i próbować tyle razy, ile chcesz.</div>'+
 '<div class="actions">'+btn("learn","Poznaj przedmioty ↗")+btn("arrange","Wolę urządzać pokój","soft-btn")+'</div>',
 "Podróż zaczyna się od kilku słówek. Potem wspólnie zobaczymy, gdzie mogą leżeć rzeczy.");
}
function learn(){
 const w=session[card];if(!w)return;if(!status(w).seen)mark(w,"seen");
 display(title("🔎 POZNAJĘ · "+(card+1)+"/"+session.length,"Co jest w <em>pokoju?</em>","Przyjrzyj się obrazkowi, posłuchaj angielskiego słowa i odkryj, co ono oznacza.")+steps(card,session.length)+
 '<div class="card-layout"><div class="card-visual"><span class="card-stamp">MY ROOM ✧</span><span class="object-emoji" role="img" aria-label="'+w.pl+'">'+w.icon+'</span></div>'+
 '<div class="card-content"><span class="tiny-heading">ENGLISH</span><h4 lang="en">'+w.en+'</h4>'+btn("hear-word","♫ Posłuchaj","play-word")+
 '<div class="translation">'+(flipped?'<span class="tiny-heading">PO POLSKU</span><strong>'+w.pl+'</strong>':btn("reveal","Odkryj znaczenie 👀",""))+'</div>'+
 '<p class="subtle">Możesz powiedzieć słowo razem z Iskrą. Nie oceniamy wymowy.</p></div></div>'+
 '<div class="actions">'+(card?btn("prev","← Poprzedni przedmiot","soft-btn"):"")+btn("next",card===session.length-1?"Znamy już kilka rzeczy! →":"Następne słówko →")+'</div>'+
 '<p class="subtle">„Odkryte” znaczy tylko tyle, że widziałeś słówko. Do zapamiętania wrócimy później.</p>',
 "To słowo po angielsku to "+w.en+". Posłuchaj go i spróbuj powtórzyć.");
}
function supportsRoom(){return known("bed")&&known("box")}
const ANCHORS=[{en:"bed",pl:"łóżko"},{en:"armchair",pl:"fotel"}];
const ITEMS=[{en:"box",pl:"pudełko"},{en:"lamp",pl:"lampa"}]; // only vocabulary already discovered in Unit 4
function activeAnchors(){return ANCHORS.filter(a=>known(a.en))}
function activeItems(){return ITEMS.filter(x=>known(x.en))}
function locateCoords(anchor,pos){
 if(anchor==="armchair"){if(pos==="on")return[663,284];if(pos==="under")return[671,404];return[560,379]}
 if(pos==="on")return[405,276];
 if(pos==="under")return[402,390];
 return[568,357]
}
function sceneSVG(place){
 const anchor=place.anchor,at=place.position,item=place.item;
 const [cx,cy]=locateCoords(anchor,at);
 const object=item==="lamp"?
 '<g transform="translate('+cx+" "+cy+')"><ellipse cx="0" cy="23" rx="30" ry="7" fill="#6b82aa" opacity=".2"/><rect x="-6" y="-13" width="12" height="33" rx="5" fill="#6387ae"/><ellipse cy="22" rx="22" ry="6" fill="#526d9c"/><path d="M-23-16H23L15-46H-15Z" fill="#fff1ce" stroke="#cfbfce" stroke-width="3"/><circle cy="-48" r="6" fill="#fff8d7"/></g>':
 '<g transform="translate('+cx+" "+cy+')"><ellipse cx="0" cy="19" rx="34" ry="8" fill="#38496e" opacity=".12"/><path d="M-25-18H25L31 20H-32Z" fill="#eab9ba" stroke="#b987a0" stroke-width="3"/><path d="M-25-18 0-31 25-18 0-4Z" fill="#fff0db" stroke="#b987a0" stroke-width="3"/><path d="M0-4V20" stroke="#ad7e9a" stroke-width="3"/><path d="M-13-19V4M13-19V4" stroke="#f6d3d1" stroke-width="3"/></g>';
 const onBed=anchor==="bed"&&at==="on",underBed=anchor==="bed"&&at==="under";
 const onChair=anchor==="armchair"&&at==="on",underChair=anchor==="armchair"&&at==="under";
 const before=(underBed||underChair)?object:"",after=!(underBed||underChair)?object:"";
 const focus='<circle cx="'+cx+'" cy="'+cy+'" r="45" fill="#c9f8eb" opacity=".22" stroke="#a3d7cc" stroke-width="2" stroke-dasharray="7 8"/>';
 return '<svg viewBox="0 0 780 466" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pokój: '+item+' '+at+' the '+anchor+'">'+
 '<defs><linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f1f1ff"/><stop offset="1" stop-color="#fceef6"/></linearGradient><linearGradient id="bedblue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#9aa8df"/><stop offset="1" stop-color="#b1a5d3"/></linearGradient></defs>'+
 '<rect width="780" height="466" fill="url(#wall)"/>'+
 '<path d="M0 314 398 285 780 315V466H0Z" fill="#e8dce9"/><path d="M0 315 398 285 780 316" fill="none" stroke="#d6c9df" stroke-width="5"/>'+
 '<rect x="310" y="55" width="145" height="171" rx="18" fill="#fff" stroke="#c9b9dd" stroke-width="7"/>'+
 '<rect x="320" y="66" width="125" height="149" rx="11" fill="#a9b9e7"/><circle cx="410" cy="103" r="28" fill="#f7f3cf"/><circle cx="421" cy="91" r="26" fill="#b1bfea"/>'+
 '<path d="M381 68v147M322 137h121" stroke="#fafafa" stroke-width="7"/>'+
 '<path d="M302 67q-32 77 1 162M461 67q32 77 0 162" fill="none" stroke="#e0b7d5" stroke-width="25"/>'+
 '<rect x="64" y="170" width="136" height="193" rx="13" fill="#a99bcc" stroke="#8875b4" stroke-width="5"/>'+
 '<rect x="80" y="190" width="104" height="154" rx="6" fill="#f1e9f7"/><path d="M83 265h99" stroke="#aca0cb" stroke-width="5"/>'+
 '<circle cx="172" cy="228" r="5" fill="#b2a3cf"/><circle cx="172" cy="300" r="5" fill="#b2a3cf"/>'+
 '<rect x="70" y="81" width="105" height="62" rx="10" fill="#fff" stroke="#cbb8df" stroke-width="7"/><ellipse cx="122" cy="112" rx="31" ry="20" fill="#b7b5e2"/>'+
 '<ellipse cx="406" cy="401" rx="201" ry="49" fill="#efb5cc"/><ellipse cx="406" cy="395" rx="187" ry="37" fill="#f8d4df"/>'+
 focus+
 before+
 '<rect x="291" y="339" width="279" height="63" rx="14" fill="#8e80b6"/><rect x="280" y="317" width="287" height="77" rx="17" fill="url(#bedblue)"/>'+
 '<rect x="298" y="299" width="87" height="32" rx="15" fill="#fff9f3"/><path d="M320 363q98 18 212 0" stroke="#d4c8f0" stroke-width="7" opacity=".7" fill="none"/>'+
 '<rect x="300" y="389" width="19" height="27" rx="5" fill="#7d74a8"/><rect x="537" y="389" width="19" height="27" rx="5" fill="#7d74a8"/>'+
 '<path d="M625 308Q614 267 635 259H706Q728 271 720 308L726 373H613Z" fill="#92c8c8" stroke="#6fa5ad" stroke-width="6"/>'+
 '<rect x="620" y="351" width="106" height="37" rx="13" fill="#8abebe" stroke="#6fa5ad" stroke-width="5"/>'+
 '<path d="M637 388v26M710 388v26" stroke="#608c9f" stroke-width="11" stroke-linecap="round"/>'+
 '<rect x="595" y="294" width="20" height="80" rx="6" fill="#83a5b0"/><path d="M580 292h48l-8-42h-32Z" fill="#faeecb"/>'+
 '<ellipse cx="674" cy="435" rx="62" ry="12" fill="#ad9dbd" opacity=".23"/>'+
 after+
 '</svg>';
}
function positions(selected,action){
 return '<div class="location-tabs">'+PREPS.map(p=>'<button type="button" data-action="'+action+'" data-value="'+p.id+'" class="location-btn '+(selected===p.id?"selected":"")+'"><span aria-hidden="true">'+p.icon+'</span>'+p.en+'<small>'+p.pl+'</small></button>').join("")+'</div>'
}
function startArrange(){
 if(!supportsRoom()){display(title("🌱 POKÓJ CZEKA","Najpierw poznajmy <em>łóżko i pudełko.</em>","Do urządzania pokoju potrzebujemy słówek „bed” i „box”. Są na pierwszych kartach naszej przygody.")+
 '<div class="welcome"><div class="welcome-art"><span class="owl">🛏️📦</span></div><div class="welcome-copy"><h4>Wszystko po kolei!</h4><p>Najpierw odkryj dwa słówka, potem zobaczysz, jak przedmioty naprawdę zmieniają położenie.</p>'+btn("learn","Poznaj słowa →")+'</div></div>',
 "Najpierw słowa bed i box. Potem urządzimy pokój.");return}
 const anchors=activeAnchors(),items=activeItems();
 location={item:items.some(x=>x.en===location.item)?location.item:items[0].en,anchor:anchors.some(x=>x.en===location.anchor)?location.anchor:anchors[0].en,position:location.position||"on"};
 renderArrange()
}
function renderArrange(){
 const anchors=activeAnchors(),items=activeItems(),pre=PREPS.find(x=>x.id===location.position),sentence="The "+location.item+" is "+location.position+" the "+location.anchor+".";
 const selects='<div class="choose-line"><label for="pick-item">Co przesuwamy?</label><select id="pick-item" data-setting="item">'+items.map(x=>'<option value="'+x.en+'" '+(x.en===location.item?"selected":"")+'>'+x.en+" — "+x.pl+'</option>').join("")+'</select>'+
 '<label for="pick-anchor">Obok czego?</label><select id="pick-anchor" data-setting="anchor">'+anchors.map(x=>'<option value="'+x.en+'" '+(x.en===location.anchor?"selected":"")+'>'+x.en+" — "+x.pl+'</option>').join("")+'</select></div>';
 display(title("🛏️ POKÓJ NA TWOICH ZASADACH","Urządź pokój <em>Iskry!</em>","Wybierz, gdzie schować pudełko. Patrz, jak naprawdę przesuwa się na łóżko, pod łóżko albo obok niego.")+
 '<div class="room-intro"><b>Najpierw spójrz:</b> <span lang="en">on</span> = na, <span lang="en">under</span> = pod, <span lang="en">next to</span> = obok. Właśnie tych trzech przyimków uczymy się w Unit 4.</div>'+
 '<div class="room-wrap"><div class="room-caption">MY ROOM ✧</div>'+sceneSVG(location)+'</div>'+
 selects+positions(location.position,"move")+
 '<div class="big-sentence"><span class="tiny-heading">THE MAGIC SENTENCE</span><strong lang="en">'+sentence+'</strong><p>'+pre.pl+' — '+location.item+" ("+byWord(location.item).pl+"), "+location.anchor+" ("+byWord(location.anchor).pl+")."+'</p></div>'+
 '<div class="actions">'+btn("hear-scene","♫ Posłuchaj zdania","soft-btn")+btn("hunt","Poszukajmy skarbów →")+btn("random-move","✧ Zaskocz mnie","soft-btn")+'</div>'+
 '<p class="subtle">Możesz przesuwać pudełko bez końca. Nie ma ani jednej „złej” lokalizacji — każda uczy innego zdania.</p>',
 "Widzisz, jak pudełko się przesuwa? Powiedz ze mną: on, under, next to.");
}
function startHunt(){
 if(!supportsRoom()){startArrange();return}
 const all=seen();if(all.length<3){gate(3,"zabawy w poszukiwanie");return}
 const objects=weak(all,3,"recognised").map(w=>({kind:"word",target:w,options:shuffle([w,...shuffle(all.filter(x=>x.en!==w.en)).slice(0,2)])}));
 const anchors=activeAnchors(),items=activeItems();
 const sceneTasks=[0,1,2].map((n)=>({kind:"place",target:items[n%items.length],anchor:rand(anchors).en,position:PREPS[n].id,options:shuffle(PREPS)}));
 hunt={intro:true,list:shuffle([...objects,...sceneTasks]),idx:0,hint:0,wrong:null,done:false,assisted:false};
 renderHunt()
}
function renderHunt(){
 if(!hunt)return;
 if(hunt.intro){display(title("🔦 ZANIM ZACZNIEMY","Gdzie chowa się <em>pudełko?</em>","Wspólnie obejrzymy trzy kryjówki. Dopiero potem Iskra zaprosi Cię do poszukiwania skarbów.")+
 '<div class="room-wrap"><div class="room-caption">THREE HIDING PLACES</div>'+sceneSVG({item:"box",anchor:"bed",position:"under"})+'</div>'+
 '<div class="memo"><b>Spójrz na ilustrację:</b> <span lang="en">on the bed</span> — na łóżku; <span lang="en">under the bed</span> — pod łóżkiem; <span lang="en">next to the bed</span> — obok łóżka.</div>'+
 '<div class="actions">'+btn("begin-hunt","Zaczynam szukać! →")+btn("arrange","Jeszcze poćwiczę ustawianie","soft-btn")+'</div>',
 "W tym pokoju zawsze możemy zajrzeć pod łóżko, na łóżko i obok niego.");return}
 const q=hunt.list[hunt.idx],isWord=q.kind==="word";
 let choices,prompt="",image="";
 if(isWord){
  prompt="Find the "+q.target.en+"!";
  image='<div class="memo"><b>Wskazówka:</b> Przyjrzyj się przedmiotom. Wybierz właściwy obrazek.</div>';
  choices=q.options.map(w=>'<button type="button" data-action="hunt-answer" data-value="'+w.en+'" '+(hunt.done?"disabled":"")+
   ' class="'+(hunt.done&&w.en===q.target.en?"correct":hunt.wrong===w.en?"wrong":"")+(hunt.hint>=2&&w.en===q.target.en?" recommend":"")+'" aria-label="Wybierz obrazek: '+w.pl+'"><span aria-hidden="true">'+w.icon+'</span><small>obrazek</small></button>').join("");
 }else{
  prompt="Where's the "+q.target.en+"?";
  image='<div class="room-wrap"><div class="room-caption">FIND THE PLACE ✧</div>'+sceneSVG({item:q.target.en,anchor:q.anchor,position:q.position})+'</div>';
  choices=q.options.map(p=>'<button type="button" data-action="hunt-answer" data-value="'+p.id+'" '+(hunt.done?"disabled":"")+
   ' class="'+(hunt.done&&p.id===q.position?"correct":hunt.wrong===p.id?"wrong":"")+(hunt.hint>=2&&p.id===q.position?" recommend":"")+'"><span aria-hidden="true">'+p.icon+'</span>'+p.en+'<small>'+p.pl+'</small></button>').join("");
 }
 const correct=isWord?q.target.en:q.position;
 const solved=hunt.done?'<div class="feedback '+(hunt.assisted?"helped":"good")+'">'+(hunt.assisted?"Odkryliśmy odpowiedź razem. 💜 ":"Wspaniale! Rozpoznałeś to samodzielnie. ✨ ")+
 (isWord?'<span lang="en">'+q.target.en+'</span> to '+q.target.pl+'.':'<span lang="en">It’s '+q.position+' the '+q.anchor+'.</span>')+'</div>':
 hunt.wrong!==null?'<div class="feedback retry">Ta odpowiedź jeszcze nie pasuje. Sprawdź obrazek lub poproś o podpowiedź.</div>':"";
 const hint=hunt.hint===1?'<div class="hint"><b>Wskazówka:</b> '+(isWord?q.target.en+" znaczy "+q.target.pl+".":PREPS.find(p=>p.id===q.position).en+" znaczy "+PREPS.find(p=>p.id===q.position).pl+".")+'</div>':
 hunt.hint>=2?'<div class="hint"><b>Rozwiązanie:</b> Iskra zaznaczyła właściwą odpowiedź. Możesz ją wybrać albo odkryć razem z nią.</div>':"";
 display(title("🔦 SZUKAM · "+(hunt.idx+1)+"/"+hunt.list.length,isWord?"Znajdź ten <em>przedmiot!</em>":"Gdzie jest <em>"+q.target.pl+"?</em>",isWord?
  "Iskra nazywa przedmiot. Który z obrazków przedstawia to słowo?":"Popatrz, gdzie leży przedmiot. Wybierz odpowiedni angielski przyimek.")+
 steps(hunt.idx,hunt.list.length)+
 '<div class="detect-prompt"><strong lang="en">'+prompt+'</strong>'+btn("hear-hunt","♫ Posłuchaj","soft-btn")+'</div>'+image+
 '<div class="answer-choices">'+choices+'</div>'+solved+hint+
 '<div class="actions">'+(hunt.done?btn("hunt-next",hunt.idx===hunt.list.length-1?"Liczmy gwiazdki →":"Następna zagadka →"):
  btn("hunt-hint",hunt.hint===0?"💡 Podpowiedź":hunt.hint===1?"💡 Jeszcze jedna wskazówka":"✨ Pokaż rozwiązanie","soft-btn"))+
 btn("arrange","Wróć do pokoju","text-btn")+'</div>',
 "Spokojnie, możesz spróbować jeszcze raz. Podpowiedź nigdy nie jest karą.");
}
function answerHunt(value,forced=false){
 if(!hunt||hunt.done||hunt.intro)return;
 const q=hunt.list[hunt.idx],correct=q.kind==="word"?q.target.en:q.position;
 if(!forced&&value!==correct){hunt.wrong=value;renderHunt();return}
 hunt.done=true;hunt.assisted=forced||hunt.hint>0||hunt.wrong!==null;
 mark(q.target,hunt.assisted?"helped":q.kind==="word"?"recognised":"placed");
 if(q.kind==="place"&&!hunt.assisted)mark(byWord(q.anchor),"placed");
 renderHunt();if(!hunt.assisted)speak("Great job!")
}
function nextHunt(){if(!hunt||!hunt.done)return;if(hunt.idx>=hunt.list.length-1){go(4);return}hunt.idx++;hunt.done=false;hunt.hint=0;hunt.wrong=null;hunt.assisted=false;renderHunt()}
function startNumbers(){numberState={intro:true,list:shuffle(NUMS).slice(0,3),idx:0,choices:[],done:false,hint:0,wrong:null,assisted:false};renderNumbers()}
function numberOptions(){const q=numberState.list[numberState.idx];numberState.choices=shuffle([q,...shuffle(NUMS.filter(x=>x.n!==q.n)).slice(0,2)]);numberState.done=false;numberState.hint=0;numberState.wrong=null;numberState.assisted=false}
function renderNumbers(){
 if(!numberState)return;
 if(numberState.intro){
  display(title("✨ LICZBY · ODKRYWANIE","Pięć <em>nowych liczb!</em>","W Unit 4 poznajemy liczby od sixteen do twenty. Najpierw posłuchaj wszystkich, dopiero potem zaczniemy liczyć gwiazdy.")+
  '<div class="number-learn">'+NUMS.map(n=>'<button type="button" class="number-tile" data-action="hear-number" data-value="'+n.en+'"><b>'+n.n+'</b><strong lang="en">'+n.en+'</strong><small>♫ Posłuchaj</small></button>').join("")+'</div>'+
  '<div class="memo"><b>Mały sposób na naukę:</b> Powiedz liczby na głos i pokaż je na palcach albo spróbuj ułożyć karteczki od 16 do 20.</div>'+
  '<div class="actions">'+btn("start-count","Zaczynam liczyć gwiazdy →")+btn("arrange","Wróćmy do pokoju","soft-btn")+'</div>',
  "Sixteen, seventeen, eighteen, nineteen, twenty. Możesz posłuchać jeszcze raz.");return
 }
 const q=numberState.list[numberState.idx];
 const field=Array.from({length:q.n},()=>'<span aria-hidden="true">✦</span>').join("");
 const choices=numberState.choices.map(n=>'<button type="button" data-action="num-answer" data-value="'+n.n+'" '+(numberState.done?"disabled":"")+
 ' class="'+(numberState.done&&n.n===q.n?"correct":numberState.wrong===String(n.n)?"wrong":"")+'"><span lang="en">'+n.en+'</span></button>').join("");
 const feedback=numberState.done?'<div class="feedback '+(numberState.assisted?"helped":"good")+'">'+(numberState.assisted?"Liczymy razem! ":"Świetne liczenie! ")+'<span lang="en">'+q.en+'</span> to '+q.n+'.</div>':
 numberState.wrong!==null?'<div class="feedback retry">Spróbuj policzyć jeszcze raz, powoli, po jednej gwiazdce.</div>':"";
 const hint=numberState.hint?'<div class="hint"><b>Podpowiedź:</b> Tu jest '+q.n+' gwiazdek, czyli <span lang="en">'+q.en+'</span>.</div>':"";
 display(title("✨ LICZĘ · "+(numberState.idx+1)+"/"+numberState.list.length,"Ile tu <em>gwiazdek?</em>","Policz małe światła w pokoju i wybierz angielską nazwę liczby.")+
 steps(numberState.idx,numberState.list.length)+
 '<div class="stars-field"><span class="tiny-heading">COUNT THE STARS</span><div class="stars-group" role="img" aria-label="Policz gwiazdki, liczba ukryta w zadaniu">'+field+'</div><p>How many stars?</p></div>'+
 '<div class="number-choices">'+choices+'</div>'+feedback+hint+
 '<div class="actions">'+(numberState.done?btn("num-next",numberState.idx===numberState.list.length-1?"Opowiedz swoją historię →":"Kolejne gwiazdki →"):
 btn("num-hint",numberState.hint?"✨ Pokaż rozwiązanie":"💡 Podpowiedź","soft-btn"))+
 btn("hear-current","♫ Posłuchaj liczby","text-btn")+'</div>',
 "Policz każdą gwiazdkę osobno. Jeśli się pomylisz, spróbuj ponownie.");
}
function answerNumber(v,forced=false){if(!numberState||numberState.intro||numberState.done)return;const q=numberState.list[numberState.idx];if(!forced&&Number(v)!==q.n){numberState.wrong=String(v);renderNumbers();return}numberState.done=true;numberState.assisted=forced||numberState.hint>0||numberState.wrong!==null;renderNumbers();speak(q.en)}
function nextNumber(){if(!numberState||!numberState.done)return;if(numberState.idx>=numberState.list.length-1){go(5);return}numberState.idx++;numberOptions();renderNumbers()}
function startSpeaking(){
 if(!supportsRoom()){startArrange();return}
 said=false;renderSpeaking()
}
function renderSpeaking(){
 const p=PREPS.find(x=>x.id===location.position),sentence="The "+location.item+" is "+location.position+" the "+location.anchor+".";
 display(title("💬 MÓWIĘ SAMODZIELNIE","Teraz Ty opowiesz <em>historię!</em>","Zmień położenie przedmiotu w pokoju. Iskra pomoże ułożyć i wypowiedzieć Twoje własne zdanie.")+
 '<div class="room-wrap"><div class="room-caption">YOUR STORY ✧</div>'+sceneSVG(location)+'</div>'+
 '<div class="room-intro"><b>Ty decydujesz:</b> gdzie umieścić przedmiot? Zmieniaj położenie tyle razy, ile zechcesz.</div>'+
 positions(location.position,"speak-move")+
 '<div class="big-sentence"><span class="tiny-heading">SAY IT YOURSELF</span><strong lang="en">'+sentence+'</strong><p>Po polsku: '+byWord(location.item).pl+' jest '+p.pl+' — '+byWord(location.anchor).pl+'.</p></div>'+
 '<div class="actions">'+btn("hear-scene","♫ Posłuchaj zdania","soft-btn")+
 (said?btn("finish","Zobacz odkrycia →"):btn("say-it","Spróbowałem(am) powiedzieć! →"))+
 btn("arrange","Jeszcze zmienię pokój","text-btn")+'</div>'+
 '<div class="speech-help">'+(said?"To była wspaniała próba! ❤️ Nie oceniamy wymowy. Ważne, że używasz angielskich zdań.":"Najpierw posłuchaj zdania. Potem spróbuj powiedzieć je samodzielnie. Nie nagrywamy Twojego głosu ani nie oceniamy wymowy.")+'</div>',
 "Twoja historia jest wyjątkowa. To Ty decydujesz, gdzie leży pudełko.");
}
function finish(){
 const n=seen().length,solved=WORDS.filter(w=>status(w).recognised||status(w).placed).length,spoken=WORDS.filter(w=>status(w).spoken).length;
 display('<div class="finish"><div class="finish-logo" aria-hidden="true">🌙🦉✨</div>'+
 title("✦ WYPRAWA ZAKOŃCZONA","Good night, <em>explorer!</em>","Iskra dziękuje Ci za pomoc! Odkryłeś przedmioty w pokoju, poznałeś miejsca ich ukrycia i ćwiczyłeś liczby.")+
 '<div class="finish-stats"><span><b>'+n+'/10</b> poznanych słów</span><span><b>'+solved+'</b> samodzielnie przećwiczonych</span><span><b>'+spoken+'</b> użytych w zdaniu</span></div>'+
 '<p>Kiedy wrócisz, Iskra pokaże inne przedmioty i przypomni te, które warto poćwiczyć. Bez pośpiechu i bez ocen!</p>'+
 '<div class="actions">'+btn("new-session","Nowa nocna przygoda ↗")+btn("arrange","Jeszcze pobawię się pokojem","soft-btn")+'</div></div>',
 "Każda próba się liczy. Do następnej nocnej wyprawy!");
}
function newSession(){data.visits++;session=pickSession();save();go(0);$("adventure").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}
root.addEventListener("click",event=>{
 const el=event.target.closest("[data-action]");if(!el)return;
 const a=el.dataset.action,v=el.dataset.value;
 switch(a){
 case "learn":go(1);break;case "arrange":go(2);break;case "hunt":go(3);break;
 case "reveal":flipped=true;learn();break;
 case "hear-word":speak(session[card].en);break;
 case "prev":card=Math.max(0,card-1);flipped=false;learn();break;
 case "next":if(card>=session.length-1)go(2);else{card++;flipped=false;learn()}break;
 case "move":location.position=v;said=false;renderArrange();break;
 case "speak-move":location.position=v;said=false;renderSpeaking();break;
 case "random-move":location.position=rand(PREPS).id;said=false;renderArrange();break;
 case "hear-scene":speak("The "+location.item+" is "+location.position+" the "+location.anchor+".");break;
 case "begin-hunt":hunt.intro=false;renderHunt();break;
 case "hear-hunt":if(hunt){const q=hunt.list[hunt.idx];speak(q.kind==="word"?"Find the "+q.target.en+"!":"Where's the "+q.target.en+"?")}break;
 case "hunt-answer":answerHunt(v);break;
 case "hunt-hint":if(hunt){if(hunt.hint<2){hunt.hint++;renderHunt()}else answerHunt("",true)}break;
 case "hunt-next":nextHunt();break;
 case "hear-number":speak(v);break;
 case "start-count":numberState.intro=false;numberOptions();renderNumbers();break;
 case "num-answer":answerNumber(v);break;
 case "num-hint":if(numberState){if(!numberState.hint){numberState.hint++;renderNumbers()}else answerNumber(numberState.list[numberState.idx].n,true)}break;
 case "num-next":nextNumber();break;
 case "hear-current":speak(numberState.list[numberState.idx].en);break;
 case "say-it":if(!said){mark(byWord(location.item),"spoken");said=true;renderSpeaking()}break;
 case "finish":go(6);break;
 case "new-session":newSession();break;
 }
});
root.addEventListener("change",event=>{
 const el=event.target.closest("[data-setting]");if(!el)return;
 const key=el.dataset.setting;if(key==="item"&&activeItems().some(x=>x.en===el.value))location.item=el.value;
 if(key==="anchor"&&activeAnchors().some(x=>x.en===el.value))location.anchor=el.value;
 said=false;renderArrange()
});
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{go(Number(b.dataset.tab));$("lesson").scrollIntoView({behavior:"smooth",block:"nearest"})}));
$("hero-build").addEventListener("click",()=>{go(2);$("adventure").scrollIntoView({behavior:"smooth",block:"start"})});
$("sound").addEventListener("click",()=>{data.sound=!data.sound;if(!data.sound&&hasSpeech)window.speechSynthesis.cancel();save();soundUI()});
$("all-audio").addEventListener("click",()=>{
 if(!data.sound){toast("Włącz dźwięk w górnym menu.");return}if(!hasSpeech){toast("Syntezator mowy jest niedostępny.");return}
 try{window.speechSynthesis.cancel();WORDS.forEach(w=>{let u=new SpeechSynthesisUtterance(w.en);u.lang="en-GB";u.rate=.82;window.speechSynthesis.speak(u)})}catch(e){toast("Nie udało się przeczytać słów.")}
});
$("print").addEventListener("click",()=>window.print());
$("info-toggle").addEventListener("click",()=>{const open=$("details").hidden;$("details").hidden=!open;$("info-toggle").setAttribute("aria-expanded",String(open));$("info-toggle").textContent=open?"Zwiń informacje ↑":"Jak działa losowość? ↓"});
$("reset").addEventListener("click",()=>{
 if(!window.confirm("Usunąć postępy czwartej krainy zapisane w tej przeglądarce?"))return;
 data=empty();try{const x=JSON.parse(localStorage.getItem(MAIN)||"[]");if(Array.isArray(x))localStorage.setItem(MAIN,JSON.stringify(x.filter(k=>!String(k).startsWith("4|"))))}catch(e){}
 save();session=pickSession();go(0);soundUI();toast("Postępy czwartej krainy wyczyszczone.");
});
window.EnglishAdventureUnit4=Object.freeze({vocabulary:WORDS.map(w=>w.en),numbers:NUMS.map(n=>n.n),prepositions:PREPS.map(p=>p.id),
 inspect:()=>({known:seen().map(w=>w.en),session:session.map(w=>w.en),solved:WORDS.filter(w=>status(w).recognised||status(w).placed).map(w=>w.en)}),
 nextAdventure:newSession});
session=pickSession();refresh();soundUI();go(0);
})();