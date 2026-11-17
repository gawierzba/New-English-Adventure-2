"use strict";
/* Etap 13 · The Lost Star — independent, source-grounded story engine.
   Only source World records count as introduced words. Story choices are
   not assessed as English knowledge; review records are updated only
   when a known word is answered. All state stays on this device. */
(()=>{
const P=window.EA2_PASSPORT_ENGINE, T=window.EA2_LIVING_TOWN_ENGINE;
const KEY="nea2-town-story-v1";
const CHAPTERS=[
 {index:0,title:"Pierwszy promień",subtitle:"Którą drogą ruszamy?",question:"Lumo szuka drogi do zaginionej gwiazdy.",choices:[
  {id:"harbour",symbol:"⛵",short:"Szlak błękitnej wody",why:"Popłyń wzdłuż rzeki w świetle latarni",story:"Nad wodą kołysze się łódka. Przewoźnik słyszał nocą muzykę gwiazd.",storyEnd:"Wodne refleksy wskazują drogę do następnego znaku."},
  {id:"station",symbol:"🚂",short:"Szlak srebrnych torów",why:"Jedź pociągiem przez zielone doliny",story:"Na peronie błyska stary zegar. Konduktor ma mapę prowadzącą do gwiazdy.",storyEnd:"Zielone światło semafora ujawnia drugą część trasy."}]},
 {index:1,title:"Drugi promień",subtitle:"Kto pomoże nam teraz?",question:"W środku miasteczka czekają dwaj przyjaciele.",choices:[
  {id:"park",symbol:"🌳",short:"Pomóż wiewiórce Tuli",why:"Ruch, muzyka i śmiech w zielonym parku",story:"Tuli odnajduje srebrną nutę. Trzeba ożywić park i przypomnieć sobie, co potrafimy.",storyEnd:"Tuli odnajduje drugi promień gwiazdy i rusza z nami."},
  {id:"market",symbol:"🍓",short:"Odwiedź sklepik",why:"Przygotuj poczęstunek dla bohaterów",story:"W sklepie pachnie świeży chleb. Sprzedawczyni wie, gdzie ukrył się drugi promień.",storyEnd:"Kosz pełen smakołyków rozświetla dalszy szlak."}]},
 {index:2,title:"Trzeci promień",subtitle:"Jak rozświetlimy noc?",question:"Przed wielkim finałem możesz wybrać swoją rolę.",choices:[
  {id:"theatre",symbol:"🎭",short:"Zaproś przyjaciół do teatru",why:"Wspólne historie ogrzeją serce miasteczka",story:"Kurtyna unosi się powoli. Lumo chce opowiedzieć historię o przyjaźni.",storyEnd:"Pierwsze brawa zamieniają ostatni promień w jasną gwiazdę."},
  {id:"atelier",symbol:"👗",short:"Uszyj stroje na święto",why:"Niech całe miasto mieni się kolorami",story:"W pracowni czekają kokardy i kolorowe płaszcze. Wybierz ozdoby na paradę.",storyEnd:"Tkaniny błyszczą, a ostatni promień rozświetla miasteczko."}]}
];
const ENDINGS={
 music:{id:"music",title:"Koncert na Srebrnym Placu",subtitle:"The Concert of Stars",symbol:"🎶",color:"#b19bc8",
 text:"Tuli wskakuje na scenę. Sowa Lumo otwiera koncert, a wszystkie domy mrugają złocistymi światełkami. Gwiazda znów świeci nad Miasteczkiem pod Chmurami.",
 english:"We can sing! This is fun!",souvenir:"Muzyczna Gwiazda"},
 feast:{id:"feast",title:"Uczta pod Złotą Gwiazdą",subtitle:"The Starry Feast",symbol:"🍓",color:"#d6a1a8",
 text:"Przyjaciele zasiadają przy wielkim stole. W teatrze słychać śmiech, a Lumo rozdaje każdemu świąteczny kawałek ciasta. Światło wraca dzięki wspólnej radości.",
 english:"Can I have cake, please?",souvenir:"Gwiazda Przyjaźni"},
 river:{id:"river",title:"Latarnie nad Niebieską Rzeką",subtitle:"The River of Lanterns",symbol:"🏮",color:"#88bfcb",
 text:"Łódki płyną wzdłuż rzeki, a nowe stroje migoczą od światła małych lampionów. Tuli i Lumo wypuszczają ostatni promień gwiazdy prosto na niebo.",
 english:"There's a boat. Look!",souvenir:"Błękitny Lampion"},
 parade:{id:"parade",title:"Parada Sześciu Kolorów",subtitle:"The Colourful Parade",symbol:"🚂",color:"#e2bc86",
 text:"Z peronu rusza ozdobiony pociąg. Za nim maszerują przyjaciele w niezwykłych strojach, a gwiazda zapala sześć lamp na głównej ulicy.",
 english:"There's a train. This is fun!",souvenir:"Bilet Gwiezdnej Parady"}
};
const safe=o=>o&&typeof o==="object"&&!Array.isArray(o)?o:{};
const validRoute=(i,id)=>!!CHAPTERS[i]&&CHAPTERS[i].choices.some(x=>x.id===id);
function read(storage){
 let value;try{value=safe(JSON.parse(storage.getItem(KEY)||"null"))}catch(e){value={}}
 const runs=Array.isArray(value.runs)?value.runs.filter(r=>r&&Array.isArray(r.route)&&r.route.length===3&&r.route.every((id,i)=>validRoute(i,id))).slice(-12):[];
 let active=safe(value.active);
 if(!Number.isInteger(active.chapter)||active.chapter<0||active.chapter>3)active=null;
 else{
  const route=Array.isArray(active.route)?active.route.slice(0,3):[];
  if(route.some((id,i)=>!validRoute(i,id))||route.length>active.chapter+1)active=null;
  else{
   const tasks=Array.isArray(active.tasks)?active.tasks.slice(0,3):[];
   const answers=Array.isArray(active.answers)?active.answers.slice(0,3):[];
   active={chapter:active.chapter,route,started:Number(active.started)||Date.now(),
    tasks,answers,step:Math.min(Math.max(0,Number(active.step)||0),3),
    hints:Math.min(Math.max(0,Number(active.hints)||0),2),
    missed:Math.min(Math.max(0,Number(active.missed)||0),99),
    chapterLog:Array.isArray(active.chapterLog)?active.chapterLog.slice(0,3):[]};
  }
 }
 return{version:1,active:active||null,runs}
}
function write(storage,data){try{storage.setItem(KEY,JSON.stringify(data));return true}catch(e){return false}}
function begin(data,now=Date.now()){return{version:1,runs:data.runs.slice(),active:{chapter:0,route:[],tasks:[],answers:[],step:0,hints:0,missed:0,started:now,chapterLog:[]}}}
function choose(data,id){
 const a=data.active;
 if(!a||a.chapter>=3||!validRoute(a.chapter,id)||a.answers.length)return null;
 return{version:1,runs:data.runs.slice(),active:{...a,route:a.route.slice(0,a.chapter).concat(id),tasks:[],answers:[],step:0,hints:0,missed:0}}
}
function known(snapshot,id){
 const v=T.getVenue(id);if(!v)return[];
 return snapshot.all.filter(w=>w.seen&&w.unit===v.unit&&v.words.indexOf(w.en)>=0)
}
function shuffle(arr,rand=Math.random){
 const out=arr.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));const x=out[i];out[i]=out[j];out[j]=x}return out
}
function buildTasks(snapshot,id,chapter,rand=Math.random){
 if(!validRoute(chapter,id))return[];
 const words=known(snapshot,id);if(words.length<2)return[];
 return shuffle(words,rand).slice(0,Math.min(2,words.length)).map(w=>({
  key:w.key,options:shuffle([w,...shuffle(words.filter(x=>x.key!==w.key),rand).slice(0,2)],rand).map(x=>x.key)
 }))
}
function startTasks(data,snapshot,rand=Math.random){
 const a=data.active;if(!a||a.chapter>=3||!validRoute(a.chapter,a.route[a.chapter])||a.tasks.length||a.answers.length)return null;
 return{version:1,runs:data.runs.slice(),active:{...a,tasks:buildTasks(snapshot,a.route[a.chapter],a.chapter,rand),step:0,hints:0,missed:0}}
}
function taskView(a,snapshot){
 if(!a||a.chapter>=3||a.step>=a.tasks.length)return null;
 const t=a.tasks[a.step];if(!t)return null;
 const word=snapshot.all.find(w=>w.key===t.key&&w.seen);
 const options=t.options.map(k=>snapshot.all.find(w=>w.key===k&&w.seen));
 if(!word||options.some(x=>!x)||options.every(x=>x.key!==word.key))return null;
 return{word,options,mode:a.chapter===0?"find":a.chapter===1?"understand":"speak"}
}
function answer(data,snapshot,key){
 const a=data.active,task=taskView(a,snapshot);
 if(!task||a.answers.length>a.step)return null;
 if(key!==task.word.key){return{correct:false,data:{...data,active:{...a,missed:Math.min(99,a.missed+1)}}}}
 const independent=a.missed===0&&a.hints===0;
 const record={key,word:task.word.en,independent,at:Date.now()};
 return{correct:true,independent,record,data:{...data,active:{...a,answers:a.answers.concat(record)}}}
}
function hint(data){
 const a=data.active;
 if(!a||a.step>=a.tasks.length||a.answers.length>a.step)return null;
 return{...data,active:{...a,hints:Math.min(2,a.hints+1)}}
}
function next(data){
 const a=data.active;
 if(!a||a.step>=a.tasks.length||a.answers.length<=a.step)return null;
 return{...data,active:{...a,step:a.step+1,hints:0,missed:0}}
}
function chapterDone(data){
 const a=data.active;if(!a||a.chapter>=3||!validRoute(a.chapter,a.route[a.chapter]))return null;
 if(a.tasks.length&&a.answers.length!==a.tasks.length)return null;
 const log={chapter:a.chapter,venue:a.route[a.chapter],answers:a.answers.map(x=>({...x})),
  completed:Date.now(),unassessed:a.tasks.length===0};
 return{...data,active:{...a,chapter:a.chapter+1,chapterLog:a.chapterLog.concat(log),
  tasks:[],answers:[],step:0,hints:0,missed:0}}
}
function endingFor(route){
 if(!Array.isArray(route)||route.length!==3||!route.every((x,i)=>validRoute(i,x)))return null;
 if(route[2]==="theatre")return route[1]==="park"?ENDINGS.music:ENDINGS.feast;
 return route[0]==="harbour"?ENDINGS.river:ENDINGS.parade
}
function finish(data,now=Date.now()){
 const a=data.active;if(!a||a.chapter!==3)return null;
 const ending=endingFor(a.route);if(!ending||a.chapterLog.length!==3)return null;
 const answers=a.chapterLog.reduce((n,log)=>n+(log.answers||[]).length,0);
 const independent=a.chapterLog.reduce((n,log)=>n+(log.answers||[]).filter(x=>x.independent).length,0);
 const run={route:a.route.slice(),ending:ending.id,started:a.started,finished:now,
  answers,independent,chapters:a.chapterLog.map(x=>({venue:x.venue,unassessed:x.unassessed,answers:x.answers.length}))};
 return{version:1,runs:data.runs.concat(run).slice(-12),active:null,final:run}
}
function routeLabels(route){return route.map((id,i)=>CHAPTERS[i].choices.find(x=>x.id===id)).filter(Boolean)}
window.EA2_TOWN_STORY_ENGINE=Object.freeze({
 KEY,CHAPTERS,ENDINGS,read,write,begin,choose,known,shuffle,buildTasks,startTasks,taskView,answer,hint,next,chapterDone,endingFor,finish,routeLabels
})
})();