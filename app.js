"use strict";
/* Autorska interaktywna mapa i ćwiczenia oparte na zakresie słownictwa
   New English Adventure 2. Nie zawiera skanów, grafik ani nagrań wydawcy. */
(function(){
  var units=[
    {id:1,title:"My favourite things",pl:"Moje ulubione rzeczy",desc:"Zabawki, gry i wielkie odkrycia",icon:"🚀",extra1:"🎮",extra2:"⭐",words:[
      ["bat","kij do gry","🏏"],["bike","rower","🚲"],["computer","komputer","💻"],["computer game","gra komputerowa","🎮"],["robot","robot","🤖"],["scooter","hulajnoga","🛴"],["spaceship","statek kosmiczny","🚀"],["TV","telewizor","📺"],["watch","zegarek","⌚"]
    ]},
    {id:2,title:"My family",pl:"Moja rodzina",desc:"Poznaj angielską rodzinkę",icon:"🏡",extra1:"💛",extra2:"🌼",words:[
      ["aunt","ciocia","👩"],["baby sister","młodsza siostrzyczka","👶"],["big brother","starszy brat","🧑"],["brother","brat","👦"],["cousin","kuzyn lub kuzynka","🧒"],["dad","tata","👨"],["granddad","dziadek","👴"],["grandma","babcia","👵"],["mum","mama","👩"],["sister","siostra","👧"],["uncle","wujek","👨‍🦱"]
    ]},
    {id:3,title:"My body and face",pl:"Moje ciało i twarz",desc:"Oczy, włosy i zabawne miny",icon:"👀",extra1:"🪞",extra2:"✨",words:[
      ["blond hair","blond włosy","👱"],["chin","podbródek","🙂"],["dark hair","ciemne włosy","🧑"],["eyes","oczy","👀"],["glasses","okulary","👓"],["neck","szyja","🧣"],["tail","ogon","🐈"],["teeth","zęby","🦷"]
    ]},
    {id:4,title:"My room",pl:"Mój pokój",desc:"Domowe skarby i meble",icon:"🛏️",extra1:"🪄",extra2:"🧸",words:[
      ["armchair","fotel","🪑"],["bath","wanna","🛁"],["bed","łóżko","🛏️"],["box","pudełko","📦"],["carpet","dywan","🧶"],["cupboard","szafka","🚪"],["curtain","zasłona","🪟"],["floor","podłoga","🏠"],["lamp","lampa","💡"],["mirror","lustro","🪞"]
    ]},
    {id:5,title:"I can jump!",pl:"Potrafię skakać!",desc:"Dżungla, ruch i supermoce",icon:"🐒",extra1:"🌿",extra2:"🐾",words:[
      ["bear","niedźwiedź","🐻"],["bird","ptak","🐦"],["boy","chłopiec","👦"],["climb","wspinać się","🧗"],["dance","tańczyć","💃"],["elephant","słoń","🐘"],["fly","latać","🕊️"],["jump","skakać","🤸"],["monkey","małpa","🐒"],["ride a bike","jeździć na rowerze","🚲"],["ride a horse","jeździć konno","🐎"],["run","biegać","🏃"],["sing","śpiewać","🎤"],["snake","wąż","🐍"],["swim","pływać","🏊"],["walk","chodzić","🚶"],["tiger","tygrys","🐯"]
    ]},
    {id:6,title:"He likes cheese!",pl:"On lubi ser!",desc:"Pyszności z całego świata",icon:"🍓",extra1:"🧀",extra2:"🥕",words:[
      ["bread","chleb","🍞"],["cake","ciasto","🍰"],["carrots","marchewki","🥕"],["cheese","ser","🧀"],["chocolate","czekolada","🍫"],["fish","ryba","🐟"],["grapes","winogrona","🍇"],["ice cream","lody","🍦"],["mushrooms","grzyby","🍄"],["onions","cebule","🧅"],["peas","groszek","🫛"],["salad","sałatka","🥗"],["strawberries","truskawki","🍓"],["tomatoes","pomidory","🍅"]
    ]},
    {id:7,title:"Our world",pl:"Nasz świat",desc:"Góry, jeziora i podróże",icon:"🌍",extra1:"✈️",extra2:"🌈",words:[
      ["boat","łódka","⛵"],["bus","autobus","🚌"],["car","samochód","🚗"],["field","pole","🌾"],["forest","las","🌲"],["lake","jezioro","🏞️"],["lorry","ciężarówka","🚚"],["mountain","góra","⛰️"],["plane","samolot","✈️"],["river","rzeka","🏞️"],["sky","niebo","🌤️"],["town","miasto","🏘️"],["tractor","traktor","🚜"],["train","pociąg","🚆"]
    ]},
    {id:8,title:"What's he wearing?",pl:"W co jest ubrany?",desc:"Ubrania w każdym kolorze",icon:"👟",extra1:"🧥",extra2:"🧢",words:[
      ["belt","pasek","👖"],["jacket","kurtka","🧥"],["jeans","dżinsy","👖"],["raincoat","płaszcz przeciwdeszczowy","🧥"],["scarf","szalik","🧣"],["shorts","krótkie spodenki","🩳"],["socks","skarpetki","🧦"],["sun hat","kapelusz przeciwsłoneczny","👒"],["trainers","buty sportowe","👟"],["wellies","kalosze","🥾"]
    ]}
  ];
  var allWords=units.flatMap(function(u){return u.words.map(function(w){return{unit:u.id,en:w[0],pl:w[1],emoji:w[2]}})});
  var keys={learned:"nea2-learned-v1",sound:"nea2-sound-v1"};
  var learned=new Set();
  try{var saved=JSON.parse(localStorage.getItem(keys.learned)||"[]");if(Array.isArray(saved)){saved.forEach(function(v){if(typeof v==="string")learned.add(v)})}}catch(e){}
  var soundOn=true;
  try{soundOn=localStorage.getItem(keys.sound)!=="off"}catch(e){}
  var currentUnit=null;
  var currentIndex=0;
  var quizQuestions=[];
  var quizIndex=0;
  var quizScore=0;
  var quizAnswered=false;
  var hasSpeech=("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
  function $(id){return document.getElementById(id)}
  function wordKey(unit,word){return String(unit)+"|"+word}
  function saveLearned(){try{localStorage.setItem(keys.learned,JSON.stringify(Array.from(learned)))}catch(e){}}
  function speak(word){
    if(!soundOn){setSpeechNote("Dźwięk jest wyłączony. Możesz go włączyć przyciskiem w górnym menu.");return}
    if(!hasSpeech){setSpeechNote("Twoja przeglądarka nie udostępnia syntezatora mowy.");return}
    try{
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(word);
      u.lang="en-GB";u.rate=.83;u.pitch=1.03;
      var voice=window.speechSynthesis.getVoices().find(function(v){return/^en[-_](GB|US)/i.test(v.lang)})||
        window.speechSynthesis.getVoices().find(function(v){return/^en/i.test(v.lang)});
      if(voice)u.voice=voice;
      window.speechSynthesis.speak(u)
    }catch(e){setSpeechNote("Nie udało się uruchomić wymowy w tej przeglądarce.")}
  }
  function setSpeechNote(msg){var el=$("speech-note");if(el)el.textContent=msg}
  function updateSound(){
    var toggle=$("sound-toggle");toggle.setAttribute("aria-pressed",String(soundOn));
    toggle.setAttribute("aria-label",soundOn?"Wyłącz odczytywanie słówek":"Włącz odczytywanie słówek");
    toggle.querySelector(".sound-label").textContent=soundOn?"Dźwięk":"Wyciszono";
    toggle.querySelector("span").textContent=soundOn?"♫":"♪";
  }
  function unitProgress(u){return u.words.filter(function(w){return learned.has(wordKey(u.id,w[0]))}).length}
  function updateProgress(){
    $("learned-counter").textContent=String(learned.size);
    units.forEach(function(u){
      var bar=document.querySelector('[data-progress="'+u.id+'"]');
      if(bar)bar.style.width=String(100*unitProgress(u)/u.words.length)+"%";
      var amount=document.querySelector('[data-learned-count="'+u.id+'"]');
      if(amount)amount.textContent=unitProgress(u)+"/"+u.words.length;
    })
  }
  function renderWorlds(){
    var grid=$("world-grid");grid.textContent="";
    units.forEach(function(u){
      var btn=document.createElement("button");btn.type="button";btn.className="world-card";
      btn.setAttribute("aria-label","Odkryj krainę "+u.id+": "+u.title+" — "+u.words.length+" słówek");
      btn.innerHTML='<div class="world-scene u'+u.id+'"><span class="world-number">KRAINA 0'+u.id+'</span><span class="world-floating one" aria-hidden="true">'+u.extra1+'</span><span class="world-emoji" aria-hidden="true">'+u.icon+'</span><span class="world-floating two" aria-hidden="true">'+u.extra2+'</span></div>'+
        '<div class="world-detail"><span class="world-tag">UNIT '+u.id+'</span><h3>'+u.title+'</h3><p>'+u.pl+' · '+u.desc+'</p><div class="world-card-footer"><span class="word-count">✦ '+u.words.length+' słówek <span aria-hidden="true">·</span> <span data-learned-count="'+u.id+'">0/'+u.words.length+'</span></span><span class="world-cta" aria-hidden="true">↗</span></div><div class="world-progress"><span data-progress="'+u.id+'"></span></div></div>';
      btn.addEventListener("click",function(){openUnit(u.id)});
      grid.appendChild(btn)
    });
    updateProgress()
  }
  function openDialog(dlg){
    if(typeof dlg.showModal==="function"){dlg.showModal()}
    else{dlg.setAttribute("open","")}
    document.body.classList.add("dialog-open")
  }
  function closeDialog(dlg){
    if(dlg.open && typeof dlg.close==="function")dlg.close();
    else dlg.removeAttribute("open");
    if(hasSpeech)window.speechSynthesis.cancel();
    document.body.classList.remove("dialog-open")
  }
  function openUnit(id){
    currentUnit=units.find(function(u){return u.id===id});
    if(!currentUnit)return;
    currentIndex=0;
    $("learning-unit-tag").textContent="KRAINA 0"+id+" · "+currentUnit.title.toUpperCase();
    $("learning-heading").textContent=currentUnit.pl;
    $("learning-intro").textContent="Dotknij fiszki, poznaj znaczenie i posłuchaj wymowy.";
    showFlashcard();
    openDialog($("learning-dialog"));
    if(soundOn)speak(currentUnit.words[0][0])
  }
  function showFlashcard(){
    if(!currentUnit)return;
    var w=currentUnit.words[currentIndex];var card=$("flashcard");card.classList.remove("flipped");
    $("flashcard-emoji").textContent=w[2];$("flashcard-emoji-back").textContent=w[2];
    $("flashcard-word").textContent=w[0];$("flashcard-translation").textContent=w[1];
    $("learning-count").textContent=(currentIndex+1)+" / "+currentUnit.words.length;
    $("learning-progress-fill").style.width=String(100*(currentIndex+1)/currentUnit.words.length)+"%";
    var marked=learned.has(wordKey(currentUnit.id,w[0]));
    $("mark-known").classList.toggle("known",marked);
    $("mark-known").innerHTML=marked?'✓ <span>Umiem to słowo!</span>':'☆ <span>Już umiem!</span>';
    $("flashcard").setAttribute("aria-label","Fiszka: "+w[0]+". Kliknij, żeby zobaczyć tłumaczenie");
    setSpeechNote("Wskazówka: strzałki zmieniają słowa, spacja odwraca kartę.")
  }
  function moveFlashcard(dir){
    if(!currentUnit)return;
    currentIndex=(currentIndex+dir+currentUnit.words.length)%currentUnit.words.length;
    showFlashcard();
    if(soundOn)speak(currentUnit.words[currentIndex][0])
  }
  function markCurrent(){
    if(!currentUnit)return;
    var k=wordKey(currentUnit.id,currentUnit.words[currentIndex][0]);
    if(learned.has(k))learned.delete(k);else learned.add(k);
    saveLearned();showFlashcard();updateProgress()
  }
  function shuffle(items){
    var arr=items.slice();
    for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var temp=arr[i];arr[i]=arr[j];arr[j]=temp}
    return arr
  }
  function startQuiz(){
    quizQuestions=shuffle(allWords).slice(0,5);
    quizIndex=0;quizScore=0;quizAnswered=false;
    $("quiz-finished").hidden=true;$("quiz-playing").hidden=false;
    openDialog($("quiz-dialog"));renderQuestion()
  }
  function renderQuestion(){
    quizAnswered=false;
    var current=quizQuestions[quizIndex];
    $("quiz-progress").textContent="PYTANIE "+(quizIndex+1)+" / "+quizQuestions.length;
    $("quiz-progress-fill").style.width=String(100*quizIndex/quizQuestions.length)+"%";
    $("quiz-heading").textContent=current.en;
    $("quiz-feedback").textContent="";$("quiz-feedback").className="quiz-feedback";
    $("quiz-next").hidden=true;
    var decoys=shuffle(allWords.filter(function(w){return w.pl!==current.pl && w.en!==current.en})).slice(0,2);
    var options=shuffle([current].concat(decoys));
    var root=$("quiz-options");root.textContent="";
    options.forEach(function(w,i){
      var opt=document.createElement("button");opt.type="button";opt.className="quiz-option";
      var letter=document.createElement("span");letter.textContent=["A","B","C"][i];opt.appendChild(letter);
      opt.appendChild(document.createTextNode(w.pl));
      opt.addEventListener("click",function(){answerQuiz(w.pl,opt)});
      root.appendChild(opt)
    });
  }
  function answerQuiz(answer,el){
    if(quizAnswered)return;
    quizAnswered=true;
    var current=quizQuestions[quizIndex];
    var right=answer===current.pl;
    if(right)quizScore++;
    $("quiz-options").querySelectorAll(".quiz-option").forEach(function(btn){
      btn.disabled=true;
      var text=btn.textContent.substring(1);
      if(text===current.pl)btn.classList.add("correct");
      else if(btn===el)btn.classList.add("wrong")
    });
    $("quiz-feedback").textContent=right?"Świetnie! That's right! ✨":"Prawidłowa odpowiedź: "+current.pl+" 💜";
    $("quiz-feedback").classList.add(right?"good":"bad");
    $("quiz-next").hidden=false;
    $("quiz-next").textContent=quizIndex===quizQuestions.length-1?"Zobacz wynik →":"Następne pytanie →";
    $("quiz-progress-fill").style.width=String(100*(quizIndex+1)/quizQuestions.length)+"%";
  }
  function nextQuestion(){
    if(!quizAnswered)return;
    quizIndex++;
    if(quizIndex>=quizQuestions.length){showResult();return}
    renderQuestion()
  }
  function showResult(){
    $("quiz-playing").hidden=true;$("quiz-finished").hidden=false;
    $("final-score").textContent=quizScore+"/"+quizQuestions.length;
    $("finish-heading").textContent=quizScore===5?"WOW! Perfekcyjna misja!":quizScore>=3?"Brawo, Odkrywco!":"Każda próba to postęp!";
    $("finish-message").textContent=quizScore===5?"Wszystkie odpowiedzi poprawne! Masz prawdziwy talent do odkrywania słów.":quizScore>=3?"Świetna wyprawa! Zajrzyj też do fiszek, żeby utrwalić nowe słówka.":"Spróbuj jeszcze raz albo poćwicz fiszki. Z każdym podejściem będzie łatwiej.";
  }
  function renderPrintSheet(){
    var root=$("print-sheet");
    var h=document.createElement("h1");h.textContent="ENGLISH ADVENTURE 2 — LISTA SŁÓWEK";root.appendChild(h);
    var intro=document.createElement("p");intro.className="print-intro";intro.textContent="93 słówka z ośmiu rozdziałów. Zaznaczaj poznane słowa i ćwicz je w domu.";root.appendChild(intro);
    var grid=document.createElement("div");grid.className="print-grid";root.appendChild(grid);
    units.forEach(function(u){
      var s=document.createElement("section");var h2=document.createElement("h2");h2.textContent="Unit "+u.id+" — "+u.title;s.appendChild(h2);
      var ul=document.createElement("ul");
      u.words.forEach(function(w){var li=document.createElement("li");li.textContent=w[0]+" — "+w[1];ul.appendChild(li)});
      s.appendChild(ul);grid.appendChild(s)
    });
    var foot=document.createElement("footer");foot.textContent="Autorska lista ćwiczeniowa · English Adventure 2 · wersja do oszczędnego druku";root.appendChild(foot)
  }
  function bind(){
    $("menu-toggle").addEventListener("click",function(){
      var open=$("mobile-nav").hidden;
      $("mobile-nav").hidden=!open;
      $("menu-toggle").setAttribute("aria-expanded",String(open));
      $("menu-toggle").setAttribute("aria-label",open?"Zamknij menu":"Otwórz menu")
    });
    $("mobile-nav").querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){
      $("mobile-nav").hidden=true;$("menu-toggle").setAttribute("aria-expanded","false")
    })});
    $("sound-toggle").addEventListener("click",function(){
      soundOn=!soundOn;try{localStorage.setItem(keys.sound,soundOn?"on":"off")}catch(e){}
      if(!soundOn&&hasSpeech)window.speechSynthesis.cancel();
      updateSound()
    });
    document.querySelectorAll("[data-quiz]").forEach(function(btn){btn.addEventListener("click",startQuiz)});
    document.querySelectorAll("[data-close]").forEach(function(btn){btn.addEventListener("click",function(){closeDialog($(btn.getAttribute("data-close")))})});
    ["learning-dialog","quiz-dialog"].forEach(function(id){
      var dlg=$(id);
      dlg.addEventListener("click",function(e){if(e.target===dlg)closeDialog(dlg)});
      dlg.addEventListener("close",function(){if(hasSpeech)window.speechSynthesis.cancel();document.body.classList.remove("dialog-open")})
    });
    $("flashcard").addEventListener("click",function(){$("flashcard").classList.toggle("flipped")});
    $("previous-word").addEventListener("click",function(){moveFlashcard(-1)});
    $("next-word").addEventListener("click",function(){moveFlashcard(1)});
    $("mark-known").addEventListener("click",markCurrent);
    $("say-word").addEventListener("click",function(){if(currentUnit)speak(currentUnit.words[currentIndex][0])});
    $("quiz-say-word").addEventListener("click",function(){if(quizQuestions.length)speak(quizQuestions[quizIndex].en)});
    $("quiz-next").addEventListener("click",nextQuestion);
    $("quiz-again").addEventListener("click",function(){closeDialog($("quiz-dialog"));startQuiz()});
    $("print-words").addEventListener("click",function(){window.print()});
    document.addEventListener("keydown",function(e){
      if(!$("learning-dialog").open || ["INPUT","TEXTAREA"].includes(document.activeElement.tagName))return;
      if(e.key==="ArrowLeft"){e.preventDefault();moveFlashcard(-1)}
      if(e.key==="ArrowRight"){e.preventDefault();moveFlashcard(1)}
      if(e.key===" " && document.activeElement.tagName!=="BUTTON"){e.preventDefault();$("flashcard").classList.toggle("flipped")}
    })
  }
  updateSound();renderWorlds();renderPrintSheet();bind();
})();