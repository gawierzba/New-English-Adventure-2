"use strict";
(()=>{
const E=window.EA8ENGINE,WORDS=E.items,COLORS=E.colors;
const $=id=>document.getElementById(id),root=$("lesson");
const KEY="nea2-unit8-fashion-v1",HOME="nea2-learned-v1";
function empty(){return{words:{},sound:true,visits:0,look:E.emptyLook()}}
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||"null");if(v&&typeof v==="object"&&!Array.isArray(v))return{words:v.words||{},sound:v.sound!==false,visits:Number(v.visits)||0,look:E.cloneLook(v.look)}}catch(e){}return empty()}
let state=read(),session=[],index=0,reveal=false,selected=null,shade="blue";
let weather="rainy",weatherLook=E.emptyLook(),quiz=null,mirrorLook=E.emptyLook(),mirrorTried=false,mirrorHelp=false,toastTimer=null,step=0;
function progress(w){const x=state.words[w.en]||{};return{seen:!!x.seen,found:Number(x.found)||0,said:Number(x.said)||0,help:Number(x.help)||0,last:Number(x.last)||0}}
const known=en=>!!E.word(en)&&progress(E.word(en)).seen;
const learned=()=>WORDS.filter(w=>progress(w).seen);
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
const pick=a=>a[Math.floor(Math.random()*a.length)];
function chooseSession(){
 if(!learned().length)return["jacket","jeans","raincoat","wellies","sun hat"].map(E.word);
 const fresh=shuffle(WORDS.filter(w=>!known(w.en)));
 const repeat=shuffle(learned()).sort((a,b)=>(progress(a).found+progress(a).said)-(progress(b).found+progress(b).said)||progress(a).last-progress(b).last);
 return[...fresh,...repeat].slice(0,5)
}
function syncHome(){try{const old=JSON.parse(localStorage.getItem(HOME)||"[]"),set=new Set(Array.isArray(old)?old.filter(v=>typeof v==="string"):[]);WORDS.filter(w=>w.core).forEach(w=>{const p=progress(w);if(p.seen&&(p.found||p.said))set.add("8|"+w.en)});localStorage.setItem(HOME,JSON.stringify([...set]))}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}syncHome();counts();glossary()}
function mark(w,field){if(!w)return;const p=progress(w);if(field==="seen")p.seen=true;else p[field]++;p.last=Date.now();state.words[w.en]=p;save()}
function counts(){const n=learned().length,ind=WORDS.filter(w=>{const p=progress(w);return p.found||p.said}).length;
 $("nav-count").textContent=n+" / 13";$("strip-count").textContent=n;$("known-count").textContent=n;$("independent-count").textContent=ind;
 $("progress-fill").style.width=(n/13*100)+"%";$("progress").setAttribute("aria-valuenow",String(n))}
function glossary(){const list=$("word-grid");list.textContent="";WORDS.forEach(w=>{
 const tile=document.createElement("article");tile.className="word-card";
 const ico=document.createElement("span");ico.className="word-icon";ico.textContent=w.icon;
 const b=document.createElement("div");b.className="word-copy";const h=document.createElement("strong");h.lang="en";h.textContent=w.en;
 const p=document.createElement("small");p.textContent=w.pl;
 const status=document.createElement("em");status.className=known(w.en)?"seen":"";
 status.textContent=progress(w).found||progress(w).said?"✓ PRZEĆWICZONE":known(w.en)?"✓ POZNANE":w.core?"KARTA SŁOWA":"Z PORADNIKA";
 b.append(h,p,status);const audio=document.createElement("button");audio.type="button";audio.className="word-sound";audio.textContent="♫";audio.setAttribute("aria-label","Posłuchaj "+w.en);audio.addEventListener("click",()=>speak(w.en));
 tile.append(ico,b,audio);list.appendChild(tile)
})}
const audioOK=("speechSynthesis" in window&&"SpeechSynthesisUtterance" in window);
function toast(msg){const e=$("toast");e.textContent=msg;e.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove("show"),3100)}
function speak(text){if(!state.sound){toast("Wymowa jest wyłączona — włącz ją u góry.");return}if(!audioOK){toast("Przeglądarka nie obsługuje syntezatora mowy.");return}
 try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-GB";u.rate=.83;window.speechSynthesis.speak(u)}catch(e){toast("Nie udało się odczytać zdania.")}}
function soundUI(){const b=$("sound");b.setAttribute("aria-pressed",String(state.sound));b.setAttribute("aria-label",state.sound?"Wyłącz wymowę":"Włącz wymowę");b.innerHTML=state.sound?'♫ <span>Wymowa</span>':'♪ <span>Wyciszono</span>'}
const btn=(act,label,cl="action")=>'<button type="button" class="'+cl+'" data-action="'+act+'">'+label+'</button>';
const head=(tag,title,desc)=>'<div class="stage-head"><span class="stage-tag">'+tag+'</span><h3>'+title+'</h3><p>'+desc+'</p></div>';
const dots=(i,n)=>'<div class="dots">'+Array.from({length:n},(_,k)=>'<span class="'+(k<i?"past":k===i?"current":"")+'"></span>').join("")+'</div>';
function show(html,tip){root.innerHTML=html;if(tip)$("fela-tip").textContent=tip}
function avatars(current,act){return'<div class="avatar-row">'+E.people.map((p,i)=>'<button type="button" data-action="'+act+'" data-value="'+i+'" class="'+(current===i?"active":"")+'"><span>'+p.emoji+'</span> '+p.name+" — "+p.pronoun+'</button>').join("")+'</div>'}
function actor(look,scene="studio",caption="COLOURFUL LOOK"){return'<div class="studio-figure">'+E.wearSVG(look,scene)+'<span class="figure-caption">'+caption+'</span></div>'}
function sentenceBox(look,text){const line=text||E.describe(look);return'<div class="outfit-sentence"><span class="micro">YOUR ENGLISH SENTENCE</span><strong lang="en">'+(line||"Choose clothes to make a sentence.")+'</strong><p>'+(line?"Kolor pojawia się przed nazwą ubrania.":"Wybierz ubranie, aby stworzyć zdanie.")+'</p></div>'}
function go(n){step=n;index=0;reveal=false;document.querySelectorAll(".tab").forEach(t=>{const yes=Number(t.dataset.step)===n;t.classList.toggle("active",yes);t.setAttribute("aria-current",yes?"step":"false")});
 if(n===0)welcome();if(n===1)discover();if(n===2)startWardrobe();if(n===3)startWeather();if(n===4)startQuiz();if(n===5)startMirror();if(n===6)runway();if(n===7)finish()}
function gate(n){if(learned().length>=n)return true;
 show(head("🌱 UCZYMY SIĘ SPOKOJNIE","Najpierw poznajmy <em>ubrania!</em>","Do tej zabawy przydadzą się przynajmniej "+n+" poznane słowa.")+
 '<div class="welcome-grid"><div class="welcome-art"><span class="emoji">🔍🧥</span></div><div class="welcome-copy"><h4>Najpierw obrazki.</h4><p>Nie będziemy zgadywać nazw ubrań, zanim ich nie poznamy. Chodźmy do pierwszych kart!</p>'+btn("learn","Poznaj słówka →")+'</div></div>',
 "Najpierw poznamy słowa. Później będziemy je ćwiczyć.");return false}
function welcome(){show(head("🦊 MAGICZNA SZAFA FELI","Hej! Jestem <em>Fela!</em>","W moim studio możesz ubierać postacie, zmieniać kolory i mówić po angielsku o własnych pomysłach!")+
 '<div class="welcome-grid"><div class="welcome-art"><span class="emoji">🦊🎨</span><span class="tagline">Let’s dress up! ✿</span></div>'+
 '<div class="welcome-copy"><h4>Co dziś zaprojektujemy?</h4><p>Najpierw poznamy słówka. Potem ubierzemy dwie postacie, sprawdzimy pogodę, odkryjemy zagadki i porozmawiamy w lustrze.</p>'+
 '<ul><li><span>🔍</span> Poznaj ubrania</li><li><span>🪄</span> Ubierz postać</li><li><span>🌦️</span> Sprawdź pogodę</li><li><span>🪞</span> Powiedz zdanie</li></ul></div></div>'+
 '<div class="notice"><b>Każdy projekt jest dobry:</b> nie oceniamy wyglądu ani prawdziwych ubrań dzieci. Nasza garderoba jest wymyślona.</div>'+
 '<div class="actions">'+btn("learn","Odkryj ubrania ↗")+btn("closet","Otwórz garderobę","soft")+'</div>',
 "Najpierw poznajemy słowa, potem tworzymy z nich zdania.");}
function discover(){const w=session[index];if(!w)return;if(!known(w.en))mark(w,"seen");
 show(head("🔍 ODKRYJ · "+(index+1)+"/"+session.length,"Co jest w <em>szafie?</em>","Spójrz na obrazek, posłuchaj wymowy i odkryj polskie znaczenie.")+
 dots(index,session.length)+'<div class="flash-grid"><div class="flash-visual"><span class="flash-stamp">'+(w.core?"WORD CARD":"EXTRA WORD")+' ✿</span><span class="emoji" role="img" aria-label="'+w.pl+'">'+w.icon+'</span></div>'+
 '<div class="flash-copy"><span class="micro">ENGLISH</span><h4 lang="en">'+w.en+'</h4>'+btn("hear-word","♫ Posłuchaj","listen")+
 '<div class="translation">'+(reveal?'<span class="micro">PO POLSKU</span><strong>'+w.pl+'</strong>':btn("reveal","Pokaż znaczenie 👀",""))+'</div>'+
 '<p class="tiny">Możesz słuchać i powtarzać tyle razy, ile chcesz.</p></div></div>'+
 '<div class="actions">'+(index?btn("previous","← Poprzednia karta","soft"):"")+btn("next-card",index===session.length-1?"Zacznij projektowanie →":"Następne ubranie →")+'</div>',
 "To słowo po angielsku to "+w.en+". Spróbuj je powtórzyć.");}
/* MODULES */
 /* EVENTS */
session=chooseSession();counts();glossary();soundUI();go(0);
})();