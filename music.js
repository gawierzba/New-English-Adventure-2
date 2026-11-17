"use strict";
/* English Adventure 2: original, softly synthesized instrumental score.
   The entire piece is written for this project: 16 gentle measures in C,
   with a 3/4? No: 4 beats per measure, at 82 BPM.
   No remote audio, media files, copyrighted songs, ads or trackers.
   Browser policy: sound requires a first real tap/click/key press.
   One localStorage preference is shared by all 14 pages. */
(function(){
  var KEY="nea2-background-music-v1";
  var TEMPO=82, BEAT=60/TEMPO, BARS=16, LOOK_AHEAD=.36;
  var MIDI_A4=440;
  var MELODY=[
    [[0,72,1.5],[1.75,67,.7],[2.5,64,1.1]],
    [[0,69,1],[1.25,72,.9],[2.5,67,1.2]],
    [[0,67,1.4],[1.7,64,.8],[2.75,62,1]],
    [[0,67,.8],[1,69,.8],[2,74,1.7]],
    [[0,76,1],[1.3,74,.8],[2.4,72,1.3]],
    [[0,69,1.4],[1.8,72,.8],[2.8,76,1]],
    [[0,74,.8],[1,72,1.2],[2.5,69,1.1]],
    [[0,67,1],[1.5,72,2.1]],
    [[0,72,.9],[1.2,76,.8],[2.4,79,1.2]],
    [[0,76,1.2],[1.6,72,.8],[2.7,69,1]],
    [[0,74,1.3],[1.7,72,.7],[2.7,67,1]],
    [[0,69,.8],[1.1,74,.8],[2.4,76,1.3]],
    [[0,72,1.5],[1.9,69,.8],[2.8,67,1]],
    [[0,64,1],[1.4,67,.8],[2.5,72,1.2]],
    [[0,74,1],[1.4,69,.8],[2.6,67,1]],
    [[0,64,1],[1.4,67,.8],[2.4,72,1.5]]
  ];
  /* Cmaj9, Am7, Fmaj7, Gsus2, Em7, Am7, Fmaj7, Gsus2,
     Cmaj9, Am7, Dm7, Gsus2, Fmaj7, Em7, Dm7, Cmaj9 */
  var CHORDS=[
    [48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,57,62],
    [40,47,50,55],[45,52,55,60],[41,48,52,57],[43,50,57,62],
    [48,55,59,64],[45,52,55,60],[50,57,60,65],[43,50,57,62],
    [41,48,52,57],[40,47,50,55],[50,57,60,65],[48,55,59,64]
  ];
  var AC=window.AudioContext||window.webkitAudioContext;
  var wanted=true,ctx=null,master=null,interval=null,bar=0,nextBar=0;
  var button=null,statusText=null;
  function stored(){
    try{return window.localStorage.getItem(KEY)!=="off"}catch(e){return true}
  }
  function remember(value){
    try{window.localStorage.setItem(KEY,value?"on":"off")}catch(e){}
  }
  wanted=stored();
  function playing(){return !!(wanted&&ctx&&interval!==null&&ctx.state==="running")}
  function setUI(){
    if(!button)return;
    var status=!AC?"unsupported":!wanted?"off":playing()?"playing":"waiting";
    button.setAttribute("data-state",status);
    button.setAttribute("aria-pressed",wanted&&AC?"true":"false");
    if(status==="unsupported"){
      button.disabled=true;
      button.setAttribute("aria-label","Ta przeglądarka nie obsługuje muzyki w tle");
      button.title="Brak obsługi Web Audio w tej przeglądarce";
      statusText.textContent="—";
    }else if(status==="off"){
      button.setAttribute("aria-label","Włącz spokojną muzykę w tle");
      button.title="Włącz delikatną melodię na stronie";
      statusText.textContent="WYŁ.";
    }else if(status==="playing"){
      button.setAttribute("aria-label","Wyłącz muzykę w tle");
      button.title="Muzyka gra cicho w tle. Kliknij, aby wyłączyć.";
      statusText.textContent="GRA";
    }else{
      button.setAttribute("aria-label","Wyłącz muzykę w tle (gotowa po pierwszym dotknięciu strony)");
      button.title="Melodia uruchomi się po pierwszym dotknięciu strony. Kliknij, aby ją wyłączyć.";
      statusText.textContent="AUTO";
    }
  }
  function freq(midi){return MIDI_A4*Math.pow(2,(midi-69)/12)}
  function voice(midi,start,seconds,volume,wave,slow){
    if(!ctx||!master)return;
    var o=ctx.createOscillator(),gain=ctx.createGain(),attack=slow?.27:.025;
    o.type=wave;
    o.frequency.setValueAtTime(freq(midi),start);
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.linearRampToValueAtTime(volume,start+attack);
    gain.gain.exponentialRampToValueAtTime(slow?volume*.55:volume*.38,start+Math.max(attack+.08,seconds*.65));
    gain.gain.exponentialRampToValueAtTime(.0001,start+seconds+(slow?.45:.24));
    o.connect(gain);gain.connect(master);
    o.start(start);o.stop(start+seconds+(slow?.5:.30))
  }
  function measure(start,i){
    var chord=CHORDS[i],notes=MELODY[i],n;
    /* Warm, subdued arpeggiated strings behind the little bell melody. */
    for(n=0;n<chord.length;n++){
      voice(chord[n],start+n*.055,3.5*BEAT,.010,"sine",true)
    }
    voice(chord[0]-12,start,3.55*BEAT,.022,"triangle",true);
    for(n=0;n<notes.length;n++){
      var p=notes[n];
      voice(p[1],start+p[0]*BEAT,p[2]*BEAT,.073,"sine",false);
      /* A very quiet octave overtone adds softness, not percussion. */
      voice(p[1]+12,start+p[0]*BEAT,p[2]*BEAT*.7,.010,"triangle",false)
    }
  }
  function tick(){
    if(!ctx||!wanted||interval===null||ctx.state!=="running")return;
    var now=ctx.currentTime;
    var speech=false;
    try{speech=!!(window.speechSynthesis&&window.speechSynthesis.speaking)}catch(e){}
    /* Lower music substantially while a vocabulary word is spoken. */
    master.gain.setTargetAtTime(speech?.13:.55,now,.17);
    var count=0;
    while(nextBar<now+LOOK_AHEAD&&count<3){
      measure(nextBar,bar);
      bar=(bar+1)%BARS;
      nextBar+=4*BEAT;
      count++;
    }
  }
  function startClock(){
    if(!ctx||!wanted||document.hidden||interval!==null||ctx.state!=="running"){
      setUI();return
    }
    nextBar=ctx.currentTime+.07;
    master.gain.setValueAtTime(.0001,ctx.currentTime);
    master.gain.setTargetAtTime(.55,ctx.currentTime,.24);
    interval=window.setInterval(tick,145);
    tick();
    setUI();
  }
  function startFromGesture(){
    if(!wanted||!AC||document.hidden)return;
    if(interval!==null){setUI();return}
    try{
      if(!ctx){
        ctx=new AC();
        master=ctx.createGain();
        master.gain.value=.0001;
        master.connect(ctx.destination);
      }
      if(ctx.state==="running"){startClock();return}
      if(ctx.resume){
        var result=ctx.resume();
        if(result&&typeof result.then==="function"){
          result.then(function(){if(wanted)startClock()}).catch(function(){setUI()})
        }else{
          if(ctx.state==="running")startClock();else setUI()
        }
      }else if(ctx.state==="running")startClock();
      setUI()
    }catch(e){
      setUI()
    }
  }
  function stop(){
    if(interval!==null){window.clearInterval(interval);interval=null}
    if(ctx){
      var old=ctx,oldMaster=master;
      ctx=null;master=null;
      try{oldMaster.gain.setTargetAtTime(0,old.currentTime,.055)}catch(e){}
      window.setTimeout(function(){try{if(old.close)old.close()}catch(e){}},240)
    }
    setUI()
  }
  function pauseHidden(){
    if(interval!==null){window.clearInterval(interval);interval=null}
    if(ctx&&ctx.state==="running"&&ctx.suspend){try{ctx.suspend()}catch(e){}}
    setUI()
  }
  function toggle(){
    if(!AC)return;
    wanted=!wanted;
    remember(wanted);
    if(wanted)startFromGesture();else stop();
    setUI()
  }
  function isToggleTarget(target){
    var node=target;
    while(node&&node!==document){
      if(node.id==="ea2-music-toggle")return true;
      node=node.parentNode
    }
    return false
  }
  function initialGesture(e){
    if(wanted&&!isToggleTarget(e.target))startFromGesture()
  }
  function mount(){
    if(button||!document.body)return;
    button=document.createElement("button");
    button.id="ea2-music-toggle";
    button.type="button";
    button.innerHTML='<span aria-hidden="true" class="ea2-music-icon">♫</span>'+
      '<span class="ea2-music-caption">Muzyka</span>'+
      '<span aria-hidden="true" class="ea2-music-badge">AUTO</span>';
    statusText=button.querySelector(".ea2-music-badge");
    button.addEventListener("click",toggle);
    document.body.appendChild(button);
    setUI();
  }
  /* Do not intercept clicks, submit actions or form fields. */
  document.addEventListener("pointerdown",initialGesture,true);
  document.addEventListener("touchstart",initialGesture,true);
  document.addEventListener("click",initialGesture,true);
  document.addEventListener("keydown",function(e){
    if(e.key==="Tab"||e.key==="Shift"||e.key==="Control"||e.key==="Alt"||e.key==="Meta")return;
    initialGesture(e)
  },true);
  document.addEventListener("visibilitychange",function(){
    if(document.hidden)pauseHidden();else if(wanted&&ctx)startFromGesture()
  });
  window.addEventListener("pageshow",function(){
    wanted=stored();setUI()
  });
  window.addEventListener("pagehide",function(){
    if(interval!==null){window.clearInterval(interval);interval=null}
    if(ctx){try{if(ctx.close)ctx.close()}catch(e){}ctx=null;master=null}
  });
  window.addEventListener("storage",function(e){
    if(e.key!==KEY)return;
    wanted=stored();
    if(!wanted)stop();else setUI()
  });
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);
  else mount();
  window.EA2BackgroundMusic=Object.freeze({
    KEY:KEY,tempo:TEMPO,measures:BARS,
    enabled:function(){return wanted},
    playing:playing,
    toggle:toggle,
    startFromGesture:startFromGesture,
    stop:function(){wanted=false;remember(false);stop()}
  })
})();