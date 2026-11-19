/* Family practice additions · original content; separate from the main test engine. */
(function () {
  'use strict';

  var familyMembers = [
    {en:'mum',pl:'mama',desc:'Mama Neli',emoji:'👩'},
    {en:'dad',pl:'tata',desc:'Tata Neli',emoji:'👨'},
    {en:'sister',pl:'siostra',desc:'Siostra Neli',emoji:'👧'},
    {en:'brother',pl:'brat',desc:'Brat Neli',emoji:'👦'},
    {en:'grandma',pl:'babcia',desc:'Babcia Neli',emoji:'👵'},
    {en:'granddad',pl:'dziadek',desc:'Dziadek Neli',emoji:'👴'},
    {en:'aunt',pl:'ciocia',desc:'Ciocia Neli',emoji:'👩‍🦰'},
    {en:'uncle',pl:'wujek',desc:'Wujek Neli',emoji:'👨‍🦱'},
    {en:'cousin',pl:'kuzyn lub kuzynka',desc:'Kuzynka Neli',emoji:'🧒'},
    {en:'family',pl:'rodzina',desc:'Cała rodzina Neli',emoji:'👨‍👩‍👧‍👦'},
    {en:'friend',pl:'przyjaciel lub przyjaciółka',desc:'Przyjaciółka Neli — nie należy do jej rodziny',emoji:'🤝'}
  ];

  /* "big brother" and "baby sister" are bonus reading examples, not compulsory spelling words. */
  var profiles = [
    {name:'Zoe',about:"Hello! I'm Zoe. I've got a mum and a dad. I've got a big brother. I haven't got a baby sister. I've got a grandma, an aunt and a cousin. I haven't got an uncle.",
      checks:[
        ["I've got a big brother.",true],["I've got a baby sister.",false],
        ["I haven't got an aunt.",false],["I've got a cousin.",true],
        ["I haven't got an uncle.",true],["I've got a grandma.",true],
        ["I haven't got a mum.",false],["I've got a dad.",true]
      ]},
    {name:'Leo',about:"Hi! I'm Leo. I've got a mum, a dad and a baby sister. I haven't got a big brother. I've got a granddad, an uncle and a cousin. I haven't got an aunt.",
      checks:[
        ["I've got a baby sister.",true],["I've got a big brother.",false],
        ["I've got an uncle.",true],["I haven't got an aunt.",true],
        ["I haven't got a granddad.",false],["I've got a cousin.",true],
        ["I haven't got a dad.",false],["I've got a mum.",true]
      ]},
    {name:'Mia',about:"Hello! I'm Mia. I've got a mum and a dad. I've got a sister. I haven't got a brother. I've got a granddad and a grandma. I've got an aunt. I haven't got an uncle.",
      checks:[
        ["I've got a sister.",true],["I haven't got a brother.",true],
        ["I've got an uncle.",false],["I've got an aunt.",true],
        ["I haven't got a grandma.",false],["I've got a granddad.",true],
        ["I haven't got a sister.",false],["I've got a dad.",true]
      ]}
  ];

  /* New, fictional letters; never replicas of the book's letter. */
  var letters = [
    {who:'Molly',body:"Dear Friend!\nHello! I'm Molly. I'm nine. I've got brown hair and green eyes.\nI've got a mum and a dad. I've got one brother. I haven't got a sister.\nI've got a cat. I like animals!\nHave you got a brother?\nLove,\nMolly",
      fields:[
        {id:'name',value:'Molly',accepted:['molly']},
        {id:'age',value:'nine',accepted:['nine','9']},
        {id:'hair',value:'brown',accepted:['brown','brown hair']},
        {id:'eyes',value:'green',accepted:['green','green eyes']},
        {id:'family',value:'mum, dad, brother',accepted:['mum dad brother','mum and dad and brother','mum dad one brother','mum and dad and one brother','mum dad a brother']},
        {id:'pets',value:'a cat',accepted:['a cat','cat','one cat']}
      ]},
    {who:'Oliver',body:"Dear Friend!\nHi! I'm Oliver. I'm eight. I've got blond hair and blue eyes.\nI've got a mum, a dad and two sisters. I haven't got a brother.\nI've got a dog and a rabbit. I love my pets!\nHave you got a sister?\nYour friend,\nOliver",
      fields:[
        {id:'name',value:'Oliver',accepted:['oliver']},
        {id:'age',value:'eight',accepted:['eight','8']},
        {id:'hair',value:'blond',accepted:['blond','blond hair','blonde','blonde hair']},
        {id:'eyes',value:'blue',accepted:['blue','blue eyes']},
        {id:'family',value:'mum, dad, two sisters',accepted:['mum dad two sisters','mum dad 2 sisters','mum and dad and two sisters','mum dad sisters','mum dad 2 sister']},
        {id:'pets',value:'a dog and a rabbit',accepted:['a dog and a rabbit','dog and rabbit','a rabbit and a dog','rabbit and dog','dog rabbit','rabbit dog']}
      ]},
    {who:'Sam',body:"Dear Friend!\nHello! I'm Sam. I'm seven. I've got red hair and brown eyes.\nI've got a mum and a dad. I've got a sister. I haven't got a brother.\nMy cousin's name is Ella. I've got a hamster.\nHow old are you?\nLove,\nSam",
      fields:[
        {id:'name',value:'Sam',accepted:['sam']},
        {id:'age',value:'seven',accepted:['seven','7']},
        {id:'hair',value:'red',accepted:['red','red hair']},
        {id:'eyes',value:'brown',accepted:['brown','brown eyes']},
        {id:'family',value:'mum, dad, sister',accepted:['mum dad sister','mum and dad and sister','mum dad a sister','mum dad one sister','mum dad sister cousin','mum and dad and sister cousin','mum dad a sister cousin']},
        {id:'pets',value:'a hamster',accepted:['hamster','a hamster','one hamster']}
      ]}
  ];

  var captions = [
    ['name','Imię','Name'],
    ['age','Wiek','How old?'],
    ['hair','Włosy','Hair'],
    ['eyes','Oczy','Eyes'],
    ['family','Rodzina','Family'],
    ['pets','Zwierzęta','Pets']
  ];

  var root = document.getElementById('stage');
  var home = document.getElementById('home');
  var play = document.getElementById('play');
  var progress = document.getElementById('progress');
  var bar = document.getElementById('progress-fill');
  var active = null;

  function shuffle(input){
    var list = input.slice();
    for(var i=list.length-1;i>0;i--){var k=Math.floor(Math.random()*(i+1));var t=list[i];list[i]=list[k];list[k]=t;}
    return list;
  }
  function safe(text){
    return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function norm(v){
    return String(v||'').toLowerCase().replace(/[’‘ʼ]/g,"'").replace(/\b(an|a|the)\b/g,' ').replace(/[,.!?;:]/g,' ').replace(/\s+/g,' ').trim();
  }
  function matches(value,field){
    return field.accepted.some(function(a){return norm(value)===norm(a);});
  }
  function progressTo(value){
    var pct=Math.max(0,Math.min(100,Math.round(value)));
    bar.style.width=pct+'%';
    progress.setAttribute('aria-valuenow',String(pct));
  }
  function speech(word){
    if(!window.speechSynthesis || !window.SpeechSynthesisUtterance)return;
    try{window.speechSynthesis.cancel();var line=new SpeechSynthesisUtterance(word);line.lang='en-GB';line.rate=.82;window.speechSynthesis.speak(line);}catch(err){}
  }
  function begin(mode){
    var collection;
    if(mode==='portraits')collection=shuffle(familyMembers);
    else if(mode==='truth')collection=[];
    else collection=shuffle(letters).slice(0,2);
    active={mode:mode,deck:collection,index:0,score:0,attempts:0,locked:false,profile:null};
    if(mode==='truth'){
      /* Keep all questions in a round tied to one clearly identified character. */
      var selected=shuffle(profiles)[0];
      active.profile=selected;
      active.deck=shuffle(selected.checks).map(function(q){return {phrase:q[0],correct:q[1]?'Yes':'No'};});
    }
    home.hidden=true;
    play.hidden=false;
    document.getElementById('play-tag').textContent=mode==='portraits'?'📷 Rodzinny album':mode==='truth'?'🔎 Czy zdanie jest prawdziwe?':'✉️ List i tabelka';
    render();
    play.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function toolButtons(showListen){
    return '<div class="family-extra-actions">'+(showListen?'<button type="button" class="secondary" data-extra-action="listen">🔊 Posłuchaj</button>':'')+
      '<button type="button" class="secondary" data-extra-action="reveal">💡 Odsłoń odpowiedź</button>'+
      '<button type="button" class="primary" data-extra-action="next" hidden>Idź dalej →</button></div>';
  }
  function common(n,total,title,desc){
    return '<div class="counter">Zadanie '+n+' z '+total+'</div><h2 class="question-title">'+safe(title)+'</h2><p class="question-sub">'+safe(desc)+'</p>';
  }
  function render(){
    if(!active)return;
    if(active.index>=active.deck.length){finish();return;}
    active.attempts=0;active.locked=false;
    var n=active.index+1,total=active.deck.length,task=active.deck[active.index];
    progressTo((n-1)/total*100);
    if(active.mode==='portraits'){
      var choices=shuffle([task.en].concat(shuffle(familyMembers.filter(function(m){return m.en!==task.en;})).slice(0,3).map(function(m){return m.en;})));
      root.innerHTML=common(n,total,'Kto jest na zdjęciu?','Spójrz na rodzinny podpis i wybierz angielskie słowo.')+
        '<div class="family-extra-portrait" role="group" aria-label="Zdjęcie z albumu"><span aria-hidden="true">'+task.emoji+'</span><div><small>FOTOGRAFIA Z ALBUMU NELI</small><strong>'+safe(task.desc)+'</strong><p>'+safe(task.pl)+'</p></div></div>'+
        '<div class="family-extra-choices">'+choices.map(function(x){return '<button type="button" data-extra-guess="'+safe(x)+'">'+safe(x)+'</button>';}).join('')+'</div>'+
        '<div class="family-extra-feedback" role="status" aria-live="polite"></div>'+toolButtons(true);
    }else if(active.mode==='truth'){
      root.innerHTML=common(n,total,'Yes or No?','Czy poniższe zdanie pasuje do opowieści o '+active.profile.name+'?')+
        '<div class="family-extra-person"><span aria-hidden="true">🧒</span><div><strong>'+safe(active.profile.name)+' przedstawia swoją rodzinę</strong><p lang="en">'+safe(active.profile.about)+'</p></div></div>'+
        '<div class="family-extra-phrase"><span>TO ZDANIE JEST…</span><strong lang="en">'+safe(task.phrase)+'</strong></div>'+
        '<div class="family-extra-choices two"><button type="button" data-extra-guess="Yes">✅ Yes</button><button type="button" data-extra-guess="No">❎ No</button></div>'+
        '<div class="family-extra-feedback" role="status" aria-live="polite"></div>'+toolButtons(false);
    }else{
      var fields=task.fields.map(function(f){
        var meta=captions.find(function(m){return m[0]===f.id;});
        return '<div class="family-extra-table-row"><label for="ex-'+safe(f.id)+'"><strong>'+safe(meta[2])+'</strong><small>'+safe(meta[1])+'</small></label>'+
          '<input required id="ex-'+safe(f.id)+'" data-extra-field="'+safe(f.id)+'" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Napisz po angielsku…">'+
          '<div class="family-extra-cell-status" data-extra-status="'+safe(f.id)+'" aria-live="polite"></div></div>';
      }).join('');
      root.innerHTML=common(n,total,'Przeczytaj list i uzupełnij tabelę','Znajdź informacje w liście. Wpisz krótkie odpowiedzi po angielsku, tak jak w ćwiczeniu z podręcznika.')+
        '<div class="family-extra-letter"><div class="family-extra-letter-heading">✉️ A letter from '+safe(task.who)+'</div><p lang="en">'+safe(task.body).replace(/\n/g,'<br>')+'</p></div>'+
        '<form id="family-extra-letter-form"><div class="family-extra-table" role="group" aria-label="Tabela do uzupełnienia">'+fields+'</div>'+
        '<div class="family-extra-actions"><button type="submit" class="primary">Sprawdź tabelkę ✓</button><button type="button" class="secondary" data-extra-action="reveal">💡 Pokaż uzupełnioną tabelę</button><button type="button" class="primary" data-extra-action="next" hidden>Kolejny list →</button></div></form>'+
        '<div class="family-extra-feedback" role="status" aria-live="polite"></div>'+
        '<div class="family-extra-booknote">Słowa <strong>hair, eyes, pets</strong> służą tutaj do rozumienia listu. Nie są dodane do 11 obowiązkowych słówek ze sprawdzianu.</div>';
    }
  }
  function message(text,isGood){
    var el=root.querySelector('.family-extra-feedback');
    if(el){el.textContent=text;el.className='family-extra-feedback visible '+(isGood?'good':'warn');}
  }
  function allNextButtons(show){
    root.querySelectorAll('[data-extra-action="next"]').forEach(function(b){b.hidden=!show;});
    root.querySelectorAll('[data-extra-action="reveal"]').forEach(function(b){b.hidden=show;});
  }
  function lockGuesses(correct){
    root.querySelectorAll('[data-extra-guess]').forEach(function(b){
      b.disabled=true;
      if(b.getAttribute('data-extra-guess')===correct)b.classList.add('correct');
    });
  }
  function choose(value,button){
    if(!active||active.locked||active.mode==='letter')return;
    var task=active.deck[active.index];
    var expected=active.mode==='portraits'?task.en:task.correct;
    var ok=value===expected;
    if(ok){
      if(!active.attempts)active.score++;
      active.locked=true;lockGuesses(expected);allNextButtons(true);
      message(active.attempts?'Dobrze! Udało się po kolejnej próbie.':'Świetnie! Odpowiedź jest poprawna. 🌟',true);
    }else{
      active.attempts++;button.disabled=true;button.classList.add('wrong');
      message('Jeszcze nie! Sprawdź podpis albo przeczytaj opis ponownie.',false);
    }
  }
  function checkLetter(ev){
    ev.preventDefault();
    if(!active||active.mode!=='letter'||active.locked)return;
    var letter=active.deck[active.index];
    var all=true;
    letter.fields.forEach(function(field){
      var inp=root.querySelector('[data-extra-field="'+field.id+'"]');
      var status=root.querySelector('[data-extra-status="'+field.id+'"]');
      var valid=matches(inp.value,field);
      inp.classList.toggle('correct',valid);
      inp.classList.toggle('wrong',!valid);
      status.textContent=valid?'✓ Dobrze':'✎ Spróbuj ponownie';
      all=all&&valid;
    });
    if(all){
      if(active.attempts===0)active.score++;
      active.locked=true;allNextButtons(true);
      root.querySelectorAll('[data-extra-field]').forEach(function(i){i.disabled=true;});
      root.querySelector('#family-extra-letter-form button[type="submit"]').disabled=true;
      message('Brawo! Wszystkie informacje udało się odczytać z listu. 🌟',true);
    }else{
      active.attempts++;message('Część pól wymaga poprawy. Zajrzyj do listu, możesz spróbować ponownie.',false);
    }
  }
  function reveal(){
    if(!active||active.locked)return;
    var task=active.deck[active.index];
    if(active.mode==='letter'){
      task.fields.forEach(function(field){
        var inp=root.querySelector('[data-extra-field="'+field.id+'"]');
        var status=root.querySelector('[data-extra-status="'+field.id+'"]');
        inp.value=field.value;inp.classList.remove('wrong');inp.classList.add('correct');inp.disabled=true;
        status.textContent='✓ Przykładowa odpowiedź';
      });
      root.querySelector('#family-extra-letter-form button[type="submit"]').disabled=true;
    }else{
      var correct=active.mode==='portraits'?task.en:task.correct;
      lockGuesses(correct);
      message('Podpowiedź: '+correct+'. Zapamiętaj na następną próbę.',false);
    }
    active.locked=true;
    allNextButtons(true);
    if(active.mode==='letter')message('To przykładowo wypełniona tabelka. Porównaj odpowiedzi z treścią listu.',false);
  }
  function finish(){
    var pct=Math.round(active.score/active.deck.length*100);
    progressTo(100);
    root.innerHTML='<div class="finish"><div class="medal" aria-hidden="true">🌷</div><h2>Dobra robota!</h2><div class="score">'+active.score+' / '+active.deck.length+'</div>'+
      '<p>To liczba zadań rozwiązanych samodzielnie za pierwszym razem, a nie ocena. Możesz przeczytać inny list lub wylosować nowe pytania.</p>'+
      '<div class="button-row" style="justify-content:center"><button type="button" class="primary" data-extra-action="repeat">Wylosuj ponownie ↻</button>'+
      '<button type="button" class="secondary" data-extra-action="return">Wróć do misji</button></div></div>';
  }
  document.querySelectorAll('[data-extra]').forEach(function(btn){
    btn.addEventListener('click',function(){begin(btn.getAttribute('data-extra'));});
  });
  root.addEventListener('submit',function(ev){if(ev.target.id==='family-extra-letter-form')checkLetter(ev);});
  root.addEventListener('click',function(ev){
    var b=ev.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-extra-guess')){choose(b.getAttribute('data-extra-guess'),b);return;}
    if(!b.hasAttribute('data-extra-action'))return;
    var action=b.getAttribute('data-extra-action');
    if(action==='next'&&active){active.index++;render();}
    if(action==='reveal')reveal();
    if(action==='repeat'&&active)begin(active.mode);
    if(action==='return'){active=null;document.getElementById('back').click();}
    if(action==='listen'&&active&&active.mode==='portraits')speech(active.deck[active.index].en);
  });
})();