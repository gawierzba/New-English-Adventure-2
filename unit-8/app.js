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
function startWardrobe(){
 if(!gate(1))return;
 if(!E.listParts(state.look).length){state.look=E.equip(state.look,learned()[0].en,"blue");save()}
 if(!selected||!known(selected))selected=learned()[0].en;
 const item=state.look.items[E.word(selected).slot];if(item&&item.en===selected)shade=item.color;
 renderWardrobe()
}
function renderWardrobe(){
 const look=E.cloneLook(state.look);
 const clothes=learned().map(w=>{
  const active=look.items[w.slot]&&look.items[w.slot].en===w.en;
  return '<button type="button" data-action="choose-item" data-value="'+w.en+'" class="'+(active?"selected ":"")+(selected===w.en?"current":"")+
  '" aria-pressed="'+String(!!active)+'"><span aria-hidden="true">'+w.icon+'</span>'+w.en+'</button>'
 }).join("");
 const palette=COLORS.map(c=>'<button type="button" data-action="choose-color" data-value="'+c.name+'" style="background:'+c.hex+
 '" class="'+(shade===c.name?"active":"")+'" aria-label="Kolor '+c.pl+'" title="'+c.pl+'" aria-pressed="'+(shade===c.name)+'"></button>').join("");
 show(head("🪄 MAGICZNA GARDEROBA","Zaprojektuj własny <em>strój!</em>","Kliknij ubranie, potem wybierz jego kolor. Postać zmienia się razem z Twoimi decyzjami.")+
 avatars(look.person,"choose-person")+
 '<div class="studio-layout">'+actor(look,"studio","MY FASHION STUDIO")+
 '<div class="cloth-panel"><span class="panel-title">1. POZNANE UBRANIA</span><div class="clothes-grid">'+clothes+'</div>'+
 '<span class="panel-title">2. TWOJE KOLORY</span><div class="swatches">'+palette+'</div>'+
 '<p class="color-note">Wybrany kolor: <strong>'+shade+'</strong>. Wybrane ubranie: '+selected+'.</p>'+
 btn("take-off","Zdejmij wybrane ubranie","soft")+'</div></div>'+
 sentenceBox(look)+
 '<div class="actions">'+btn("hear-look","♫ Posłuchaj zdania","soft")+btn("say-look","Spróbuję powiedzieć →")+
 btn("surprise","✧ Zaskocz mnie","soft")+btn("weather","Sprawdź pogodę →")+'</div>'+
 '<p class="tiny">Ubrania w jednej grupie zastępują się nawzajem. Dżinsy i krótkie spodenki nie nachodzą na siebie, podobnie jak kurtka i płaszcz.</p>',
 "Zmieniając strój, powiedz: He's wearing albo She's wearing.");
}
function chooseCloth(en){
 if(!known(en))return;
 selected=en;const w=E.word(en),current=state.look.items[w.slot];
 if(current&&current.en===en)shade=current.color;
 else state.look=E.equip(state.look,en,shade);
 save();renderWardrobe()
}
function changeColor(name){
 if(!COLORS.some(c=>c.name===name))return;shade=name;
 if(selected&&known(selected)){const w=E.word(selected),current=state.look.items[w.slot];
  if(current&&current.en===selected){state.look=E.equip(state.look,selected,name);save()}
 }
 renderWardrobe()
}
const WEATHER={
 sunny:{emoji:"☀️",label:"Słonecznie",en:"It's sunny!",tip:"Może kapelusz od słońca albo krótkie spodenki?",items:["sun hat","shorts","cap","trainers"]},
 rainy:{emoji:"🌧️",label:"Pada deszcz",en:"It's rainy!",tip:"Może płaszcz przeciwdeszczowy lub kalosze?",items:["raincoat","wellies","jacket","cap"]},
 cold:{emoji:"❄️",label:"Chłodno",en:"It's cold!",tip:"Może szalik lub kurtka?",items:["scarf","jacket","jeans","socks"]}
};
function startWeather(){
 if(!gate(1))return;
 weatherLook=E.cloneLook(state.look);
 if(!E.listParts(weatherLook).length)weatherLook=E.equip(weatherLook,learned()[0].en,"purple");
 renderWeather()
}
function renderWeather(){
 const t=WEATHER[weather];
 const types=Object.keys(WEATHER).map(k=>'<button type="button" data-action="weather-type" data-value="'+k+'" class="'+(weather===k?"active":"")+'">'+WEATHER[k].emoji+" "+WEATHER[k].label+'</button>').join("");
 let opts=t.items.filter(known);if(!opts.length)opts=learned().slice(0,3).map(w=>w.en);
 const suggestions=opts.map(en=>'<button type="button" data-action="weather-wear" data-value="'+en+'">'+E.word(en).icon+" "+en+'</button>').join("");
 show(head("🌦️ KOLOROWA POGODA","W co ubrać <em>bohatera?</em>","Wybierz pogodę i zaprojektuj ubiór postaci. Podpowiedzi są inspiracjami, a nie oceną Twojego pomysłu.")+
 '<div class="weather-row">'+types+'</div>'+avatars(weatherLook.person,"weather-person")+
 '<div class="weather-stage"><div class="weather-hero">'+actor(weatherLook,weather,"THE WEATHER TODAY")+
 '<div class="weather-tip"><span>WEATHER REPORT</span><h4 lang="en">'+t.en+'</h4><p>'+t.label+'. '+t.tip+'</p>'+
 '<div class="suggestions">'+suggestions+'</div>'+
 '<p>W poradniku pojawiają się też <b lang="en">rain</b> — deszcz oraz <b lang="en">umbrella</b> — parasolka.</p></div></div></div>'+
 sentenceBox(weatherLook)+
 '<div class="actions">'+btn("hear-weather","♫ Posłuchaj zdania","soft")+btn("keep-weather","Zachowaj ten strój","soft")+
 btn("detective","Zabawa w detektywa →")+'</div>'+
 '<p class="tiny">W tej zabawie nie ma ocen za wygląd ani za wybór ubrań. Każdy projekt jest ważny.</p>',
 "W deszczu możemy używać słowa raincoat, a w słońcu sun hat.");
}
function startQuiz(){
 if(!gate(3))return;
 const pool=shuffle(learned()).sort((a,b)=>progress(a).found-progress(b).found);
 const tasks=pool.slice(0,Math.min(4,pool.length)).map((w,k)=>{
  const outfit=E.equip(Object.assign(E.emptyLook(),{person:k%2}),w.en,pick(COLORS).name);
  let others=shuffle(learned().filter(x=>x.en!==w.en&&x.icon!==w.icon)).slice(0,2);
  if(others.length<2)others.push(...learned().filter(x=>x.en!==w.en&&!others.some(y=>y.en===x.en)).slice(0,2-others.length));
  return{w,outfit,choices:shuffle([w,...others])};
 });
 quiz={intro:true,tasks,index:0,hint:0,wrong:null,done:false,assisted:false};
 renderQuiz()
}
function renderQuiz(){
 const q=quiz.tasks[quiz.index];
 if(quiz.intro){
  show([
   head("🕵️ ZOBACZ PRZYKŁAD","What’s he <em>wearing?</em>","Zanim zaczniesz zgadywać, Fela pokaże Ci pytanie i przykładowe zdanie."),
   '<div class="quiz-look">',actor(q.outfit,"studio","LOOK AND LEARN"),
   '<div class="quiz-prompt"><span class="micro">LOOK & LISTEN</span>',
   '<h4 lang="en">What’s ',q.outfit.person===0?"she":"he",' wearing?</h4>',
   '<p>Co ',q.outfit.person===0?"ona":"on",' ma na sobie?</p>',
   '<div class="notice"><b>Przykładowa odpowiedź:</b> ',E.describe(q.outfit),'</div>',
   btn("quiz-demo","♫ Posłuchaj przykładu","soft"),'</div></div>',
   '<div class="actions">',btn("begin-quiz","Teraz zgaduję →"),btn("closet","Wróć do garderoby","soft"),'</div>'
  ].join(""),"Patrz i słuchaj. Pytamy: What's she wearing? Odpowiadamy: She's wearing…");
  return
 }
 const answers=q.choices.map(w=>{
  const right=quiz.done&&q.w.en===w.en,wrong=quiz.wrong===w.en,hinted=quiz.hint>=2&&q.w.en===w.en;
  return ['<button type="button" data-action="quiz-answer" data-value="',w.en,'" ',
   quiz.done?"disabled":"",' class="',right?"correct":wrong?"wrong":"",hinted?" glow":"",
   '"><span role="img" aria-label="',w.pl,'">',w.icon,'</span><small lang="en">',w.en,'</small></button>'].join("")
 }).join("");
 const result=quiz.done?'<div class="feedback '+(quiz.assisted?"assisted":"good")+'">'+
  (quiz.assisted?"Znaleźliśmy to razem. ":"Samodzielna odpowiedź — brawo! ")+E.describe(q.outfit)+'</div>':
  quiz.wrong!==null?'<div class="feedback retry">To inne ubranie. Popatrz jeszcze raz albo poproś o wskazówkę.</div>':"";
 const help=quiz.hint===1?'<div class="hint"><b>Podpowiedź:</b> To '+q.w.pl+'.</div>':
  quiz.hint>=2?'<div class="hint"><b>Wskazówka:</b> Poprawna odpowiedź jest podświetlona.</div>':"";
 show([
  head("🕵️ DETEKTYW · "+(quiz.index+1)+"/"+quiz.tasks.length,"W co jest <em>ubrana postać?</em>","Wskaż angielską nazwę ubrania, które widzisz."),
  dots(quiz.index,quiz.tasks.length),
  '<div class="quiz-look">',actor(q.outfit,"studio","MYSTERY OUTFIT"),
  '<div class="quiz-prompt"><span class="micro">LOOK & GUESS</span>',
  '<h4 lang="en">What’s ',q.outfit.person===0?"she":"he",' wearing?</h4>',
  '<p>Wybierz jeden z trzech obrazków.</p>',
  btn("quiz-question","♫ Posłuchaj pytania","soft"),
  '</div></div><div class="quiz-options">',answers,'</div>',result,help,
  '<div class="actions">',
  quiz.done?btn("quiz-next",quiz.index===quiz.tasks.length-1?"Czas na rozmowę →":"Kolejny strój →"):
  btn("quiz-hint",quiz.hint===0?"💡 Podpowiedź":quiz.hint===1?"💡 Podświetl ubranie":"✨ Odkryj rozwiązanie","soft"),
  '</div>'
 ].join(""),"Wszystkie odpowiedzi są z wcześniej poznanych słów. Pomoc jest zawsze dostępna.")
}
function quizAnswer(v,forced){
 if(!quiz||quiz.intro||quiz.done)return;
 const q=quiz.tasks[quiz.index];
 if(!forced&&v!==q.w.en){quiz.wrong=v;renderQuiz();return}
 quiz.done=true;quiz.assisted=!!forced||quiz.hint>0||quiz.wrong!==null;
 mark(q.w,quiz.assisted?"help":"found");renderQuiz()
}
function quizNext(){
 if(!quiz||!quiz.done)return;
 if(quiz.index===quiz.tasks.length-1){go(5);return}
 quiz.index++;quiz.hint=0;quiz.wrong=null;quiz.done=false;quiz.assisted=false;renderQuiz()
}
function startMirror(){
 if(!gate(1))return;
 mirrorLook=E.cloneLook(state.look);
 if(!E.listParts(mirrorLook).length)mirrorLook=E.randomLook(learned().map(w=>w.en),0,2);
 mirrorTried=false;mirrorHelp=false;renderMirror()
}
function renderMirror(){
 const line=E.describe(mirrorLook,true);
 const parts=[
  head("🪞 LUSTRO MOWY","What are you <em>wearing?</em>","Udawaj, że jesteś postacią ze swojego rysunku. Fela pyta, a Ty próbujesz odpowiedzieć po angielsku."),
  '<div class="mirror-scene"><div class="mirror-grid">',
  actor(mirrorLook,"studio","AN IMAGINARY OUTFIT"),
  '<div><div class="mirror-dialogue"><span class="who">FELA ASKS</span>',
  '<div class="bubble" lang="en">What are you wearing?</div>',
  '<p class="translation-small">Co masz na sobie?</p></div>',
  '<div class="mirror-dialogue"><span class="who">YOUR CHARACTER ANSWERS</span>',
  '<div class="bubble" lang="en">',line,'</div>',
  '<p class="translation-small">To zabawa w fikcyjną postać. Nie pytamy o Twoje prawdziwe ubranie.</p>',
  '</div></div></div></div>',
  '<div class="mirror-buttons">',
  btn("mirror-hear","♫ Posłuchaj rozmowy","soft"),
  btn("mirror-help",mirrorHelp?"Pomoc pokazana ✓":"💡 Pomóż mi","soft"),
  btn("mirror-try",mirrorTried?"Spróbowałem(am)! ✓":"Spróbuję powiedzieć →"),
  '</div>',
  mirrorHelp?'<div class="hint"><b>Pomoc:</b> <span lang="en">I’m wearing…</span> znaczy „Mam na sobie…”. Przykład: <span lang="en">'+line+'</span></div>':"",
  '<div class="actions">',
  btn("mirror-new","Inny strój do rozmowy ↻","soft"),
  btn("runway","Wielki pokaz →"),'</div>',
  '<p class="tiny">Nie nagrywamy głosu. Sam oznaczasz, czy spróbowałeś odpowiedzieć.</p>'
 ];
 show(parts.join(""),"Na pytanie What are you wearing? odpowiadamy I am wearing…")
}
function runway(){
 if(!gate(1))return;
 const look=E.listParts(state.look).length?E.cloneLook(state.look):E.randomLook(learned().map(w=>w.en),0,2);
 show([
  head("🌟 NASZ WIELKI FINAŁ","Witaj na <em>pokazie!</em>","Nie ma jury ani ocen. Pokaż własny strój, posłuchaj zdania i wydrukuj pamiątkę."),
  '<div class="runway-card"><div class="runway-top"><strong>THE LITTLE FASHION SHOW ✦</strong><span>UNIT 08</span></div>',
  actor(look,"studio","MY COLOURFUL LOOK"),
  '<div class="runway-bottom"><strong>Designed with imagination ✿</strong>',
  '<p lang="en">',E.describe(look),'</p><small>Every style tells a story. ♡</small></div></div>',
  '<div class="actions">',
  btn("runway-hear","♫ Posłuchaj stroju","soft"),
  btn("runway-print","🖨️ Wydrukuj projekt","soft"),
  btn("closet","Jeszcze coś zmienię","soft"),
  btn("finish","Finał ośmiu krain →"),'</div>',
  '<div class="notice"><b>Osiem krain!</b> W pierwszej odkrywaliśmy pojedyncze słowa. Teraz możemy tworzyć obrazy i całe angielskie zdania.</div>'
 ].join(""),"Nasz pokaz to kolejny sposób opowiadania po angielsku.")
}
function printRunway(){
 const l=E.listParts(state.look).length?E.cloneLook(state.look):E.randomLook(learned().map(w=>w.en),0,2);
 $("print-look-art").innerHTML=E.wearSVG(l);
 $("print-look-title").textContent=E.person(l.person).name+"'s outfit";
 $("print-look-sentence").textContent=E.describe(l);
 document.body.classList.add("print-look-mode");
 try{window.print()}catch(e){toast("Drukowanie jest niedostępne.")}
}
function finish(){
 const n=learned().length,ind=WORDS.filter(w=>{const p=progress(w);return p.found||p.said}).length,spoken=WORDS.filter(w=>progress(w).said).length;
 show([
  '<div class="finish"><div class="big">🦊🌟🎉</div><span class="stage-tag">✦ FINAŁ ÓSMEJ KRAINY</span>',
  '<h3>You are a <em>designer!</em></h3>',
  '<p>Poznałeś ubrania, zmieniałeś kolory, tworzyłeś stroje i próbowałeś mówić po angielsku. Najważniejsze są wszystkie próby!</p>',
  '<div class="finish-stats"><span><b>',n,'/13</b> poznanych słów</span>',
  '<span><b>',ind,'</b> samodzielnie ćwiczonych</span>',
  '<span><b>',spoken,'</b> próbowanych w mówieniu</span></div>',
  '<p>W kolejnej wyprawie wrócą nowe słowa i inne ubrania. Możesz odwiedzić też wszystkie wcześniejsze krainy.</p>',
  '<div class="actions">',btn("new-trip","Nowa wyprawa z Felą ↗"),
  btn("closet","Jeszcze jedna stylizacja","soft"),'</div></div>'
 ].join(""),"Gratulacje — nasze osiem światów jest gotowych na kolejne odkrycia!")
}
function newTrip(){
 state.visits++;session=chooseSession();save();go(0);
 $("adventure").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})
}
/* MODULES */
 root.addEventListener("click",e=>{
 const el=e.target.closest("[data-action]");if(!el)return;
 const a=el.dataset.action,v=el.dataset.value;
 switch(a){
 case "learn":go(1);break;
 case "closet":go(2);break;
 case "weather":go(3);break;
 case "detective":go(4);break;
 case "runway":go(6);break;
 case "reveal":reveal=true;discover();break;
 case "hear-word":speak(session[index].en);break;
 case "previous":index=Math.max(0,index-1);reveal=false;discover();break;
 case "next-card":if(index===session.length-1)go(2);else{index++;reveal=false;discover()}break;
 case "choose-person":
  if(v==="0"||v==="1"){state.look.person=Number(v);save();renderWardrobe()}
  break;
 case "choose-item":chooseCloth(v);break;
 case "choose-color":changeColor(v);break;
 case "take-off":if(selected&&known(selected)){state.look=E.remove(state.look,selected);save();renderWardrobe()}break;
 case "hear-look":if(E.describe(state.look))speak(E.describe(state.look));break;
 case "say-look":
  if(E.listParts(state.look).length){E.slots.forEach(s=>{const x=state.look.items[s];if(x)mark(E.word(x.en),"said")});toast("Brawo za próbę powiedzenia zdania!")}
  break;
 case "surprise":
  state.look=E.randomLook(learned().map(w=>w.en),state.look.person,4);save();renderWardrobe();break;
 case "weather-type":if(WEATHER[v]){weather=v;renderWeather()}break;
 case "weather-person":if(v==="0"||v==="1"){weatherLook.person=Number(v);renderWeather()}break;
 case "weather-wear":if(known(v)){weatherLook=E.equip(weatherLook,v,pick(COLORS).name);renderWeather()}break;
 case "hear-weather":if(E.describe(weatherLook))speak(E.describe(weatherLook));break;
 case "keep-weather":state.look=E.cloneLook(weatherLook);save();toast("Strój trafił do garderoby!");break;
 case "quiz-demo":speak(E.describe(quiz.tasks[0].outfit));break;
 case "begin-quiz":quiz.intro=false;renderQuiz();break;
 case "quiz-question":speak("What's "+(quiz.tasks[quiz.index].outfit.person===0?"she":"he")+" wearing?");break;
 case "quiz-answer":quizAnswer(v,false);break;
 case "quiz-hint":if(quiz){if(quiz.hint<2){quiz.hint++;renderQuiz()}else quizAnswer("",true)}break;
 case "quiz-next":quizNext();break;
 case "mirror-hear":speak("What are you wearing? "+E.describe(mirrorLook,true));break;
 case "mirror-help":mirrorHelp=true;renderMirror();break;
 case "mirror-try":
  if(!mirrorTried){mirrorTried=true;E.slots.forEach(s=>{const x=mirrorLook.items[s];if(x)mark(E.word(x.en),"said")});renderMirror()}
  break;
 case "mirror-new":mirrorLook=E.randomLook(learned().map(w=>w.en),mirrorLook.person,3);mirrorTried=false;mirrorHelp=false;renderMirror();break;
 case "runway-hear":{const l=E.listParts(state.look).length?state.look:E.randomLook(learned().map(w=>w.en),0,2);speak(E.describe(l));break}
 case "runway-print":printRunway();break;
 case "finish":go(7);break;
 case "new-trip":newTrip();break;
 }
});
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{go(Number(tab.dataset.step));$("lesson").scrollIntoView({behavior:"smooth",block:"nearest"})}));
$("hero-wardrobe").addEventListener("click",()=>{go(2);$("adventure").scrollIntoView({behavior:"smooth",block:"start"})});
$("sound").addEventListener("click",()=>{state.sound=!state.sound;if(!state.sound&&audioOK)window.speechSynthesis.cancel();save();soundUI()});
$("all-audio").addEventListener("click",()=>{if(!state.sound||!audioOK){toast("Sprawdź, czy wymowa jest dostępna.");return}try{window.speechSynthesis.cancel();WORDS.forEach(w=>{const u=new SpeechSynthesisUtterance(w.en);u.lang="en-GB";u.rate=.83;window.speechSynthesis.speak(u)})}catch(e){toast("Nie udało się odczytać listy słów.")}});
$("print-words").addEventListener("click",()=>{document.body.classList.remove("print-look-mode");window.print()});
$("about").addEventListener("click",()=>{const open=$("about-content").hidden;$("about-content").hidden=!open;$("about").setAttribute("aria-expanded",String(open));$("about").textContent=open?"Zwiń informacje ↑":"O nauce i postępach ↓"});
$("reset").addEventListener("click",()=>{
 if(!window.confirm("Wyczyścić postępy ósmej krainy w tej przeglądarce?"))return;
 state=empty();
 try{const a=JSON.parse(localStorage.getItem(HOME)||"[]");if(Array.isArray(a))localStorage.setItem(HOME,JSON.stringify(a.filter(x=>!String(x).startsWith("8|"))))}catch(e){}
 save();session=chooseSession();selected=null;go(0);soundUI();toast("Postępy ósmej krainy wyczyszczone.")
});
window.addEventListener("afterprint",()=>document.body.classList.remove("print-look-mode"));
window.EnglishAdventureUnit8=Object.freeze({
 wordCount:WORDS.length,coreCount:WORDS.filter(w=>w.core).length,
 guideExtra:WORDS.filter(w=>!w.core).map(w=>w.en),
 colors:COLORS.map(c=>c.name),
 phrasePart:E.phrasePart,describe:E.describe,
 inspect:()=>({known:learned().map(w=>w.en),session:session.map(w=>w.en),outfit:E.cloneLook(state.look),
  independent:WORDS.filter(w=>{const p=progress(w);return p.found||p.said}).map(w=>w.en),
  quiz:quiz?{index:quiz.index,done:quiz.done,hint:quiz.hint}:null}),
 newTrip
});
/* EVENTS */
session=chooseSession();counts();glossary();soundUI();go(0);
})();