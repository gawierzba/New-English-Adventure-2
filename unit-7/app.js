"use strict";
(()=>{
const C=window.EA7CORE,WORDS=C.WORDS,word=C.word,shuffle=C.shuffle,pick=C.pick,phrase=C.phrase,polish=C.polish,sceneSVG=C.sceneSVG;
const $=id=>document.getElementById(id),view=$("lesson"),KEY="nea2-unit7-atlas-v1",HOME="nea2-learned-v1";
const fresh=()=>({words:{},sound:true,visits:0});
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"null");if(x&&typeof x==="object"&&!Array.isArray(x))return{words:x.words||{},sound:x.sound!==false,visits:Number(x.visits)||0}}catch(e){}return fresh()}
let db=load(),session=[],step=0,index=0,translation=false,build={word:"river",count:1,said:false},postcard={word:"river",count:1,said:false},spy=null,ride=null,toastTimer=null;
function stat(w){const v=db.words[w.en]||{};return{seen:!!v.seen,found:Number(v.found)||0,grammar:Number(v.grammar)||0,spoken:Number(v.spoken)||0,help:Number(v.help)||0,last:Number(v.last)||0}}
const known=en=>!!word(en)&&stat(word(en)).seen,seen=()=>WORDS.filter(w=>stat(w).seen);
function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}syncHome();stats();glossary()}
function syncHome(){try{const a=JSON.parse(localStorage.getItem(HOME)||"[]"),s=new Set(Array.isArray(a)?a:[]);WORDS.forEach(w=>{const p=stat(w);if(p.seen&&(p.found||p.grammar))s.add("7|"+w.en)});localStorage.setItem(HOME,JSON.stringify([...s]))}catch(e){}}
function mark(w,k){if(!w)return;const p=stat(w);if(k==="seen")p.seen=true;else p[k]=(Number(p[k])||0)+1;p.last=Date.now();db.words[w.en]=p;save()}
function selectSession(){if(!seen().length)return["river","mountain","train","boat","field"].map(word);
 const unseen=shuffle(WORDS.filter(w=>!stat(w).seen)),review=shuffle(seen()).sort((a,b)=>stat(a).found+stat(a).grammar-stat(b).found-stat(b).grammar||stat(a).last-stat(b).last);
 return[...unseen,...review].slice(0,5)}
function weaker(pool,n,k){return shuffle(pool).map(w=>({w,v:stat(w)[k]+Math.random()*1.3})).sort((a,b)=>a.v-b.v).slice(0,Math.min(n,pool.length)).map(z=>z.w)}
function stats(){const n=seen().length,solved=WORDS.filter(w=>stat(w).found||stat(w).grammar).length;
 $("nav-count").textContent=n+" / 17";$("known-strip").textContent=n;$("known-count").textContent=n;$("independent-count").textContent=solved;$("progress-fill").style.width=(n*100/17)+"%";$("progress").setAttribute("aria-valuenow",String(n))}
function glossary(){const list=$("word-grid");list.textContent="";WORDS.forEach(w=>{const item=document.createElement("article");item.className="word-card";
 const icon=document.createElement("span");icon.className="word-icon";icon.textContent=w.icon;
 const body=document.createElement("div");body.className="word-copy";const en=document.createElement("strong");en.textContent=w.en;en.lang="en";
 const pl=document.createElement("small");pl.textContent=w.pl;const status=document.createElement("em");status.className=stat(w).seen?"known":"";
 status.textContent=stat(w).found||stat(w).grammar?"✓ PRZEĆWICZONE":stat(w).seen?"✓ POZNANE":w.card?"KARTA SŁOWA":"Z PORADNIKA";
 body.append(en,pl,status);const button=document.createElement("button");button.className="word-sound";button.type="button";button.textContent="♫";button.setAttribute("aria-label","Posłuchaj "+w.en);button.addEventListener("click",()=>speak(w.en));item.append(icon,body,button);list.appendChild(item)})}
const speechOK="speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;
function toast(text){const el=$("toast");el.textContent=text;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),3300)}
function speak(text){if(!db.sound){toast("Włącz wymowę w górnym menu.");return}if(!speechOK){toast("Syntezator mowy jest niedostępny w tej przeglądarce.");return}try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-GB";u.rate=.82;window.speechSynthesis.speak(u)}catch(e){toast("Nie udało się odtworzyć wymowy.")}}
function soundUI(){const b=$("sound");b.setAttribute("aria-pressed",String(db.sound));b.setAttribute("aria-label",db.sound?"Wyłącz wymowę":"Włącz wymowę");b.innerHTML=db.sound?'♫ <span>Wymowa</span>':'♪ <span>Wyciszono</span>'}
const btn=(action,label,cls="action")=>'<button type="button" class="'+cls+'" data-action="'+action+'">'+label+'</button>';
const heading=(k,h,p)=>'<div class="stage-head"><span class="stage-label">'+k+'</span><h3>'+h+'</h3><p>'+p+'</p></div>';
const dots=(i,n)=>'<div class="dots">'+Array.from({length:n},(_,k)=>'<span class="'+(k<i?"done":k===i?"now":"")+'"></span>').join("")+'</div>';
function show(html,tip){view.innerHTML=html;if(tip)$("tola-tip").textContent=tip}
function go(n){step=n;index=0;translation=false;document.querySelectorAll(".tab").forEach(el=>{const active=Number(el.dataset.step)===n;el.classList.toggle("active",active);el.setAttribute("aria-current",active?"step":"false")});if(n===0)welcome();if(n===1)discover();if(n===2)startBuilder();if(n===3)startSpy();if(n===4)startRide();if(n===5)startPostcard();if(n===6)finish()}
function gate(n){if(seen().length>=n)return true;show(heading("🌱 UCZYMY SIĘ STOPNIOWO","Odkryjmy najpierw <em>słowa!</em>","Do zabawy przyda się przynajmniej "+n+" poznanych słówek.")+'<div class="welcome-grid"><div class="welcome-picture"><span class="illustration">🔍🗺️</span></div><div class="welcome-copy"><h4>Zaczniemy od poznawania.</h4><p>Nie będziemy zgadywać nowych słów, zanim ich nie zobaczysz i nie usłyszysz.</p><div class="actions">'+btn("discover","Poznaj słowa →")+'</div></div></div>',"Najpierw poznamy słowa, później będziemy ich używać.");return false}
function welcome(){show(heading("🧭 WITAJ W ATLASIE","Hello! Jestem <em>Tola.</em>","Mój atlas jest niezwykły — widoki zmieniają się razem z Twoimi pomysłami. Chodź, odkryjemy świat!")+
 '<div class="welcome-grid"><div class="welcome-picture"><span class="illustration">🦊🌍</span><span class="bubble">Let’s explore! ✧</span></div>'+
 '<div class="welcome-copy"><h4>Dokąd dziś wyruszymy?</h4><p>Najpierw poznamy nowe słowa, potem sami zbudujemy krajobrazy, zagramy w lornetkę liter, pojedziemy pociągiem i napiszemy pocztówkę.</p>'+
 '<ul><li><span>🔍</span> Odkrywanie</li><li><span>🗺️</span> Żywy atlas</li><li><span>🚂</span> Podróż pociągiem</li><li><span>💌</span> Pocztówka</li></ul></div></div>'+
 '<div class="note"><b>Uczymy się bez ocen:</b> możesz korzystać z podpowiedzi, próbować jeszcze raz i wracać do tych samych słów w innych zabawach.</div>'+
 '<div class="actions">'+btn("discover","Poznajmy nowe słowa ↗")+btn("builder","Chcę zobaczyć mapę","soft")+'</div>',
 "Najpierw odkryj kilka słówek, potem wspólnie stworzymy mapę.");}
function discover(){const w=session[index];if(!w)return;if(!stat(w).seen)mark(w,"seen");
 show(heading("🔍 NOWE SŁOWO · "+(index+1)+"/"+session.length,"Co widzi <em>odkrywca?</em>","Oglądaj obrazek, słuchaj i sprawdź znaczenie. Bez pośpiechu!")+
 dots(index,session.length)+'<div class="flash-grid"><div class="flash-image"><span class="flash-stamp">'+(w.card?"NEW WORD":"EXTRA WORD")+' ✧</span><span class="flash-emoji">'+w.icon+'</span></div>'+
 '<div class="flash-info"><span class="micro">ENGLISH</span><h4 lang="en">'+w.en+'</h4>'+btn("hear-word","♫ Posłuchaj","listen")+
 '<div class="translation">'+(translation?'<span class="micro">PO POLSKU</span><strong>'+w.pl+'</strong>':btn("reveal","Pokaż znaczenie 👀",""))+'</div><p class="tiny">Powtarzaj z Tolą tyle razy, ile zechcesz.</p></div></div>'+
 '<div class="actions">'+(index?btn("previous","← Poprzednia karta","soft"):"")+btn("next-card",index===session.length-1?"Teraz zbudujemy świat →":"Następna karta →")+'</div>'+
 '<p class="tiny">Słowa, które dopiero poznałeś, pojawią się później w innych zadaniach.</p>',
 "To słowo po angielsku to "+w.en+". Posłuchaj go i spróbuj powiedzieć.");}
function sceneCard(w,n,title){return '<div class="atlas-scene"><span class="scene-label">'+title+' ✧</span>'+C.sceneSVG(w,n)+'</div>'}
function choiceOptions(current){return seen().map(w=>'<option value="'+w.en+'" '+(current===w.en?"selected":"")+'>'+w.en+' — '+w.pl+'</option>').join("")}
function numberChoices(w,n,action){return '<div class="count-buttons">'+[1,2,3,4].map(k=>'<button type="button" data-action="'+action+'" data-value="'+k+'" '+(w.en==="sky"&&k>1?"disabled":"")+
 ' class="'+(k===n?"selected":"")+'" aria-pressed="'+(k===n)+'">'+k+'</button>').join("")+'</div>'}
function startBuilder(){if(!gate(1))return;if(!known(build.word))build.word=seen()[0].en;if(build.word==="sky")build.count=1;build.said=false;renderBuilder()}
function renderBuilder(){const w=word(build.word);
 show(heading("🗺️ ŻYWY ATLAS","Zbuduj własny <em>świat!</em>","Wybierz element krajobrazu i jego liczbę. Na obrazku będzie dokładnie tyle obiektów, o ilu mówi zdanie.")+
 sceneCard(w,build.count,"MY LIVING WORLD")+
 '<div class="selector-line"><label for="atlas-item">Co widzisz?</label><select id="atlas-item" data-setting="builder">'+choiceOptions(w.en)+'</select><label>Ile?</label>'+numberChoices(w,build.count,"build-count")+'</div>'+
 '<div class="sentence-box"><span class="micro">LOOK AND SAY</span><strong lang="en">'+phrase(w,build.count)+'</strong><p>'+polish(w,build.count)+'</p></div>'+
 '<div class="actions">'+btn("build-listen","♫ Posłuchaj zdania","soft")+btn("build-say",build.said?"Spróbowałem(am)! ✓":"Spróbuję powiedzieć →")+
 btn("build-random","✧ Zaskocz mnie","soft")+btn("spy","Pora na lornetkę →","soft")+'</div>'+
 '<p class="tiny">Tola pamięta o gramatyce: an island, two buses i three lorries. Ze słowem sky pokazujemy The sky is blue.</p>',
 "Zmieniając liczbę obiektów, uczysz się rozróżniać There’s i There are.");}
function makeSpy(w,pool){const letters=[...new Set(w.en.replace(/[^a-z]/g,""))];
 const matches=letters.map(l=>({l,others:pool.filter(x=>x.en!==w.en&&!x.en.includes(l))})).filter(x=>x.others.length>=2);
 if(!matches.length)return null;const pickOne=C.pick(matches);return{w,letter:pickOne.l,options:shuffle([w,...shuffle(pickOne.others).slice(0,2)])}}
function startSpy(){if(!gate(3))return;const pool=seen(),questions=weaker(pool,4,"found").map(w=>makeSpy(w,pool)).filter(Boolean);if(!questions.length){show(heading("🔭 LORNETKA","Poznajmy <em>kolejne słowa.</em>","Gdy odkryjesz więcej słów, będziemy mogli porównywać zawarte w nich litery.")+btn("discover","Odkryj więcej słów →"));return}
 spy={intro:true,list:questions,index:0,hint:0,wrong:null,done:false,assisted:false};renderSpy()}
function renderSpy(){const q=spy.list[spy.index];if(spy.intro){show(heading("🔭 JAK DZIAŁA LORNETKA?","Wypatrujemy <em>liter!</em>","Tola podaje literę. Twoim zadaniem jest znaleźć obrazek, którego angielska nazwa ją zawiera.")+
 '<div class="spy-prompt"><span class="spy-symbol">🔭</span><div class="spy-copy"><span class="micro">I SPY WITH MY LITTLE EYE</span><strong>Find a word with '+q.letter.toUpperCase()+'!</strong>'+
 '<p>W przykładzie słowo <b lang="en">'+q.w.en+'</b> ma tę literę. Inne obrazki nie będą jej miały.</p></div></div>'+
 '<div class="note"><b>Możesz zapytać:</b> Is it a…? W razie potrzeby Tola pokaże polskie znaczenie i rozwiązanie.</div>'+
 '<div class="actions">'+btn("spy-start","Zaczynam wypatrywać →")+btn("builder","Jeszcze popatrzę na atlas","soft")+'</div>',
 "Szukamy słowa z literą podaną przez Tolę. Wszystkie obrazki wcześniej poznaliśmy.");return}
 const items=q.options.map(w=>'<button type="button" data-action="spy-answer" data-value="'+w.en+'" '+(spy.done?"disabled":"")+
 ' class="'+(spy.done&&w.en===q.w.en?"correct":spy.wrong===w.en?"wrong":"")+(spy.hint>=2&&w.en===q.w.en?" glow":"")+'"><span role="img" aria-label="'+w.pl+'">'+w.icon+'</span><small>OBRAZEK</small></button>').join("");
 const feedback=spy.done?'<div class="feedback '+(spy.assisted?"helped":"good")+'">'+(spy.assisted?"Wspólnie odkryliśmy odpowiedź! ":"Dobra robota! ")+
 '<span lang="en">'+q.w.en+'</span> ma literę '+q.letter.toUpperCase()+'.</div>':
 spy.wrong!==null?'<div class="feedback retry">Jeszcze jedna próba! Możesz poprosić o wskazówkę.</div>':"";
 const hint=spy.hint===1?'<div class="hint"><b>Wskazówka:</b> Szukamy słowa oznaczającego '+q.w.pl+'.</div>':
 spy.hint>=2?'<div class="hint"><b>Rozwiązanie:</b> Tola podświetliła właściwy obrazek.</div>':"";
 show(heading("🔭 LORNETKA · "+(spy.index+1)+"/"+spy.list.length,"Tajemnicza <em>litera!</em>","Która z trzech nazw zawiera podaną literę?")+
 dots(spy.index,spy.list.length)+'<div class="spy-prompt"><span class="spy-symbol">'+q.letter.toUpperCase()+'</span><div class="spy-copy"><span class="micro">LOOK FOR THE LETTER</span><strong lang="en">I spy the letter '+q.letter.toUpperCase()+'!</strong><p>Wybierz jeden z trzech obrazków.</p></div></div>'+
 '<div class="quiz-choices">'+items+'</div>'+feedback+hint+'<div class="actions">'+(spy.done?btn("spy-next",spy.index===spy.list.length-1?"Wsiadamy do pociągu →":"Następna litera →"):
 btn("spy-hint",spy.hint===0?"💡 Wskazówka":spy.hint===1?"💡 Podświetl obrazek":"✨ Pokaż rozwiązanie","soft"))+'</div>',
 "Spróbuj odnaleźć literę. Podpowiedź zawsze jest dostępna.");}
function spyAnswer(value,forced){if(!spy||spy.intro||spy.done)return;const q=spy.list[spy.index];if(!forced&&value!==q.w.en){spy.wrong=value;renderSpy();return}
 spy.done=true;spy.assisted=!!forced||spy.hint>0||spy.wrong!==null;mark(q.w,spy.assisted?"help":"found");renderSpy()}
function spyNext(){if(!spy||!spy.done)return;if(spy.index===spy.list.length-1){go(4);return}spy.index++;spy.hint=0;spy.wrong=null;spy.done=false;spy.assisted=false;renderSpy()}
function startRide(){if(!gate(3))return;const pool=seen().filter(w=>w.en!=="sky");
 const list=weaker(pool,Math.min(4,pool.length),"grammar").map((w,j)=>{const count=j===0?1:j===1?2:j===2?3:C.pick([1,2,4]);const correct=phrase(w,count),bad=phrase(w,count===1?2:1);return{w,count,correct,options:shuffle([correct,bad])}});
 ride={intro:true,list,index:0,hint:0,wrong:null,done:false,assisted:false};renderRide()}
function renderRide(){const q=ride.list[ride.index];
 if(ride.intro){show(heading("🚂 WSTĘP DO PODRÓŻY","Co widać za <em>oknem?</em>","Zobaczymy różnicę między jednym przedmiotem a kilkoma. Tola zawsze najpierw pokazuje przykład.")+
 sceneCard(q.w,1,"THE FIRST STOP")+
 '<div class="sentence-box"><span class="micro">ONE THING / MANY THINGS</span><strong lang="en">'+phrase(q.w,1)+'</strong><p>Jedna rzecz: There’s a… lub There’s an… Dwie lub więcej: There are two / three / four…</p></div>'+
 '<div class="actions">'+btn("ride-start","Pociąg rusza →")+btn("builder","Jeszcze poćwiczę na mapie","soft")+'</div>',
 "Gdy jest jedna rzecz, mówimy There’s. Gdy jest kilka rzeczy, mówimy There are.");return}
 const route='<div class="route">'+ride.list.map((item,j)=>'<span class="stop '+(j<ride.index?"done":j===ride.index?"current":"")+'">'+(j<ride.index?"✓":j===ride.index?"🚂":"✧")+'</span>'+(j===ride.list.length-1?"":'<span class="track"></span>')).join("")+'</div>';
 const opts=q.options.map((t,j)=>'<button type="button" data-action="ride-answer" data-value="'+j+'" '+(ride.done?"disabled":"")+
 ' class="'+(ride.done&&t===q.correct?"correct":ride.wrong===String(j)?"wrong":"")+(ride.hint>=2&&t===q.correct?" glow":"")+'" lang="en">'+t+'</button>').join("");
 const feedback=ride.done?'<div class="feedback '+(ride.assisted?"helped":"good")+'">'+(ride.assisted?"Razem znaleźliśmy zdanie. ":"Świetnie, samodzielna odpowiedź! ")+
 '<span lang="en">'+q.correct+'</span></div>':ride.wrong!==null?'<div class="feedback retry">Spójrz jeszcze raz: jedna rzecz czy więcej?</div>':"";
 const hint=ride.hint===1?'<div class="hint"><b>Wskazówka:</b> '+(q.count===1?"Widać jeden obiekt. Szukamy There’s…":"Widać "+q.count+" obiekty. Szukamy There are…")+'</div>':
 ride.hint>=2?'<div class="hint"><b>Rozwiązanie:</b> Podświetliłam poprawne zdanie.</div>':"";
 show(heading("🚂 STACJA · "+(ride.index+1)+"/"+ride.list.length,"W podróży przez <em>świat!</em>","Policz obiekty widoczne za oknem pociągu i wybierz odpowiednie zdanie.")+
 route+sceneCard(q.w,q.count,"VIEW FROM THE TRAIN")+
 '<div class="travel-options">'+opts+'</div>'+feedback+hint+
 '<div class="actions">'+(ride.done?btn("ride-next",ride.index===ride.list.length-1?"Czas na pocztówkę →":"Kolejna stacja →"):
 btn("ride-hint",ride.hint===0?"💡 Wskazówka":ride.hint===1?"💡 Podświetl zdanie":"✨ Odkryj rozwiązanie","soft"))+
 btn("builder","Mój atlas","quiet")+'</div>',
 "Najpierw policz, a potem zdecyduj, czy potrzebujesz There’s czy There are.");}
function rideAnswer(value,forced){if(!ride||ride.intro||ride.done)return;const q=ride.list[ride.index];if(!forced&&q.options[Number(value)]!==q.correct){ride.wrong=String(value);renderRide();return}
 ride.done=true;ride.assisted=!!forced||ride.hint>0||ride.wrong!==null;mark(q.w,ride.assisted?"help":"grammar");renderRide()}
function rideNext(){if(!ride||!ride.done)return;if(ride.index===ride.list.length-1){go(5);return}ride.index++;ride.hint=0;ride.wrong=null;ride.done=false;ride.assisted=false;renderRide()}
function startPostcard(){if(!gate(1))return;if(!known(postcard.word))postcard.word=seen()[0].en;if(postcard.word==="sky")postcard.count=1;postcard.said=false;renderPostcard()}
function renderPostcard(){const w=word(postcard.word),text=phrase(w,postcard.count);
 show(heading("💌 POCZTÓWKA ODKRYWCY","Wyślij swój <em>świat!</em>","Wybierz krajobraz i liczbę obiektów. Zdanie i obrazek zmienią się razem, a gotową pocztówkę można wydrukować.")+
 '<div class="postcard"><div class="postcard-top"><strong>GREETINGS FROM OUR WORLD ✧</strong><span>✉ POSTCARD 07</span></div>'+
 sceneCard(w,postcard.count,"A PLACE I VISITED")+
 '<div class="postcard-text"><div class="greeting">HELLO FROM MY WORLD!</div><h4 lang="en">'+text+'</h4><p>'+polish(w,postcard.count)+'</p><div class="sign">Love, a little explorer ♡</div></div></div>'+
 '<div class="selector-line"><label for="card-item">Wybierz widok</label><select id="card-item" data-setting="postcard">'+choiceOptions(w.en)+'</select><label>Ile?</label>'+numberChoices(w,postcard.count,"postcard-count")+'</div>'+
 '<div class="actions">'+btn("postcard-listen","♫ Posłuchaj zdania","soft")+btn("postcard-say",postcard.said?"Spróbowałem(am)! ✓":"Spróbuję powiedzieć →")+
 btn("postcard-print","🖨️ Wydrukuj pocztówkę","soft")+btn("finish","Zakończ wyprawę →")+'</div>'+
 '<p class="tiny">Twój krajobraz jest wymyślony. Możesz wydrukować pocztówkę albo pokazać ją komuś bliskiemu.</p>',
 "Pocztówka to pamiątka z własnej wyprawy. Powiedz o niej jedno angielskie zdanie.");}
function printPostcard(){const w=word(postcard.word);$("print-postcard-scene").innerHTML=C.sceneSVG(w,postcard.count);$("print-postcard-title").textContent="Hello from my world!";$("print-postcard-sentence").textContent=phrase(w,postcard.count);document.body.classList.add("print-postcard-mode");try{window.print()}catch(e){toast("Nie udało się uruchomić drukowania.")}}
function finish(){const n=seen().length,a=WORDS.filter(w=>stat(w).found||stat(w).grammar).length,s=WORDS.filter(w=>stat(w).spoken).length;
 show('<div class="final"><div class="big">🌍🦊✨</div><span class="stage-label">✧ PRZYGODA ZAKOŃCZONA</span><h3>What a wonderful <em>world!</em></h3>'+
 '<p>Odkrywałeś nowe słowa, tworzyłeś krajobrazy, odpowiadałeś na pytania i przygotowałeś własną pocztówkę. Brawo za wszystkie próby!</p>'+
 '<div class="final-stats"><span><b>'+n+'/17</b> poznanych słów</span><span><b>'+a+'</b> samodzielnie ćwiczonych</span><span><b>'+s+'</b> użytych w mówieniu</span></div>'+
 '<p>Przy następnej wizycie wrócą słowa wymagające utrwalenia, ale zobaczysz także nowe krajobrazy.</p>'+
 '<div class="actions">'+btn("new-trip","Nowa wyprawa z Tolą ↗")+btn("postcard","Jeszcze jedna pocztówka","soft")+'</div></div>',
 "Każda wyprawa to kolejna okazja do nauki.");}
function newTrip(){db.visits++;session=selectSession();save();go(0);$("adventure").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}
view.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const a=t.dataset.action,v=t.dataset.value;
 switch(a){
 case "discover":go(1);break;case "builder":go(2);break;case "spy":go(3);break;case "postcard":go(5);break;
 case "reveal":translation=true;discover();break;case "hear-word":speak(session[index].en);break;
 case "previous":index=Math.max(0,index-1);translation=false;discover();break;
 case "next-card":if(index===session.length-1)go(2);else{index++;translation=false;discover()}break;
 case "build-count":if([1,2,3,4].includes(Number(v))){build.count=build.word==="sky"?1:Number(v);build.said=false;renderBuilder()}break;
 case "build-random":{const w=C.pick(seen());build.word=w.en;build.count=w.en==="sky"?1:C.pick([1,2,3,4]);build.said=false;renderBuilder();break}
 case "build-listen":speak(phrase(word(build.word),build.count));break;
 case "build-say":if(!build.said){build.said=true;mark(word(build.word),"spoken");renderBuilder()}break;
 case "spy-start":spy.intro=false;renderSpy();break;case "spy-answer":spyAnswer(v,false);break;
 case "spy-hint":if(spy){if(spy.hint<2){spy.hint++;renderSpy()}else spyAnswer("",true)}break;
 case "spy-next":spyNext();break;
 case "ride-start":ride.intro=false;renderRide();break;case "ride-answer":rideAnswer(v,false);break;
 case "ride-hint":if(ride){if(ride.hint<2){ride.hint++;renderRide()}else rideAnswer("",true)}break;
 case "ride-next":rideNext();break;
 case "postcard-count":if([1,2,3,4].includes(Number(v))){postcard.count=postcard.word==="sky"?1:Number(v);postcard.said=false;renderPostcard()}break;
 case "postcard-listen":speak(phrase(word(postcard.word),postcard.count));break;
 case "postcard-say":if(!postcard.said){postcard.said=true;mark(word(postcard.word),"spoken");renderPostcard()}break;
 case "postcard-print":printPostcard();break;case "finish":go(6);break;case "new-trip":newTrip();break;
 }});
view.addEventListener("change",e=>{const t=e.target.closest("[data-setting]");if(!t||!known(t.value))return;
 if(t.dataset.setting==="builder"){build.word=t.value;if(t.value==="sky")build.count=1;build.said=false;renderBuilder()}
 if(t.dataset.setting==="postcard"){postcard.word=t.value;if(t.value==="sky")postcard.count=1;postcard.said=false;renderPostcard()}
});
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{go(Number(t.dataset.step));$("lesson").scrollIntoView({behavior:"smooth",block:"nearest"})}));
$("hero-map").addEventListener("click",()=>{go(2);$("adventure").scrollIntoView({behavior:"smooth",block:"start"})});
$("sound").addEventListener("click",()=>{db.sound=!db.sound;if(!db.sound&&speechOK)window.speechSynthesis.cancel();save();soundUI()});
$("read-all").addEventListener("click",()=>{if(!db.sound||!speechOK){toast("Włącz wymowę w przeglądarce.");return}window.speechSynthesis.cancel();WORDS.forEach(w=>{const u=new SpeechSynthesisUtterance(w.en);u.lang="en-GB";u.rate=.82;window.speechSynthesis.speak(u)})});
$("print-words").addEventListener("click",()=>{document.body.classList.remove("print-postcard-mode");window.print()});
$("info-toggle").addEventListener("click",()=>{const open=$("info-box").hidden;$("info-box").hidden=!open;$("info-toggle").setAttribute("aria-expanded",String(open));$("info-toggle").textContent=open?"Zwiń informacje ↑":"Jak uczymy? ↓"});
$("reset").addEventListener("click",()=>{if(!window.confirm("Wyczyścić postępy siódmej krainy?"))return;db=fresh();try{const a=JSON.parse(localStorage.getItem(HOME)||"[]");if(Array.isArray(a))localStorage.setItem(HOME,JSON.stringify(a.filter(x=>!String(x).startsWith("7|"))))}catch(e){}save();session=selectSession();go(0);soundUI();toast("Postępy wyczyszczone.")});
window.addEventListener("afterprint",()=>document.body.classList.remove("print-postcard-mode"));
window.EnglishAdventureUnit7=Object.freeze({wordCount:17,wordCardCount:WORDS.filter(w=>w.card).length,guideExtras:WORDS.filter(w=>!w.card).map(w=>w.en),
 words:WORDS.map(w=>w.en),plural:C.plural,sentence:(en,n)=>phrase(word(en),n),
 inspect:()=>({seen:seen().map(w=>w.en),session:session.map(w=>w.en),independent:WORDS.filter(w=>stat(w).found||stat(w).grammar).map(w=>w.en),spoken:WORDS.filter(w=>stat(w).spoken).map(w=>w.en)}),
 newTrip});
session=selectSession();stats();glossary();soundUI();go(0);
})();