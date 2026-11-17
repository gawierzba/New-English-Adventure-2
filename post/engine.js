"use strict";
/* Lumo's Star Post — Stage 15.1–15.2
 * Sources: native unit records via passport's readSnapshot().
 * Receiving/reading a letter is exploration, not learning evidence.
 * A recognition answer joins the shared revision history only after a
 * correct answer, distinguished as independent or assisted. */
(()=>{
const P=window.EA2_PASSPORT_ENGINE;
const KEY="nea2-lumo-post-v1";
const LETTERS=Object.freeze([
 {id:"tuli",unit:5,venue:"park",name:"Tuli",from:"Park Tańczących Drzew",icon:"🐿️",seal:"🌿",color:"#91c3ad",paper:"#ecf7ef",
  title:"Pozdrowienia z zielonego parku",english:"A letter from Tuli",salutation:"Hello, Explorer!",
  story:"Tuli znalazła na łące magiczny listek. Chciałaby pokazać Ci, co potrafi zrobić. Czy pomożesz jej opowiedzieć to po angielsku?",
  words:["jump","run","dance","sing"],phrase:en=>"I can "+en+".",thanks:"Thank you, my friend! We can dance!",sign:"Your friend, Tuli",link:"../unit-5/"},
 {id:"captain",unit:7,venue:"harbour",name:"Kapitan Kropelka",from:"Błękitna Przystań",icon:"⛵",seal:"⚓",color:"#8bc4d6",paper:"#e7f5f8",
  title:"Tajemnicza wyprawa po rzece",english:"A letter from the harbour",salutation:"Ahoy, Explorer!",
  story:"Kapitan Kropelka wypatrzył pojazdy nad rzeką. Szuka małego odkrywcy, który odczyta jego mapę i pomoże mu nazwać to, co widzi.",
  words:["boat","train","bus","car"],phrase:en=>"There's a "+en+".",thanks:"Look! There's a boat. Thank you!",sign:"Captain Kropelka",link:"../unit-7/"},
 {id:"lila",unit:6,venue:"market",name:"Lila",from:"Sklepik Pod Truskawką",icon:"🦔",seal:"🍓",color:"#e7aaa4",paper:"#fff0e7",
  title:"Słodka wiadomość od Lili",english:"A letter from the berry shop",salutation:"Hello, dear friend!",
  story:"Jeżynka Lila szykuje podwieczorek dla przyjaciół. Brakuje jej kilku produktów i prosi, żebyś pomógł jej złożyć uprzejme zamówienie.",
  words:["bread","cake","strawberries","cheese"],phrase:en=>"Can I have "+en+", please?",thanks:"Here you are! Thank you very much!",sign:"Love, Lila",link:"../unit-6/"},
 {id:"fela",unit:8,venue:"atelier",name:"Fela",from:"Pracownia Barwnych Strojów",icon:"🦊",seal:"🎀",color:"#b7a1d0",paper:"#f4ecfb",
  title:"Wiadomość z pracowni Feli",english:"A letter from the little atelier",salutation:"Hi, my dear Designer!",
  story:"Fela przygotowała mały pokaz mody. Chciałaby opowiedzieć gościom, w co ubrana jest jej modelka. Pomóż jej dobrać angielskie opisy.",
  words:["scarf","jacket","raincoat","jeans"],phrase:en=>"She's wearing "+(en==="jeans"?"":/^[aeiou]/i.test(en)?"an ":"a ")+en+".",
  thanks:"What a lovely outfit! Thank you!",sign:"With love, Fela",link:"../unit-8/"}
]);
const letter=id=>LETTERS.find(l=>l.id===id)||null;
const obj=x=>x&&typeof x==="object"&&!Array.isArray(x)?x:{};
function read(storage){
 let x={};try{x=obj(JSON.parse(storage.getItem(KEY)||"null"))}catch(e){}
 const raw=obj(x.letters),cards={};
 LETTERS.forEach(l=>{
  const v=obj(raw[l.id]);
  cards[l.id]={opened:!!v.opened,completed:!!v.completed,
   independent:!!v.independent,visits:Math.max(0,Math.floor(Number(v.visits)||0)),
   firstAt:Number(v.firstAt)||0,lastAt:Number(v.lastAt)||0};
 });
 let a=obj(x.active),active=null;
 if(letter(a.id)&&Array.isArray(a.tasks)&&a.tasks.length>0&&a.tasks.length<=2
 &&Number.isInteger(a.index)&&a.index>=0&&a.index<=a.tasks.length){
   const tasks=a.tasks.map(t=>({key:String(t.key||""),choices:Array.isArray(t.choices)?t.choices.map(String).slice(0,4):[]}));
   const answers=Array.isArray(a.answers)?a.answers.filter(y=>y&&typeof y.key==="string").slice(0,2):[];
   if(answers.length>=a.index&&answers.length<=a.index+1&&tasks.every(t=>t.choices.length>=2&&t.choices.includes(t.key))){
    active={id:a.id,tasks,answers,index:a.index,hint:Math.max(0,Math.min(2,Math.floor(Number(a.hint)||0))),
     mistakes:Math.max(0,Math.min(99,Math.floor(Number(a.mistakes)||0)))};
   }
 }
 return{version:1,letters:cards,selected:letter(x.selected)?x.selected:null,active};
}
function save(storage,x){try{storage.setItem(KEY,JSON.stringify(x));return true}catch(e){return false}}
function words(snapshot,l){
 return snapshot.all.filter(w=>w.seen&&w.unit===l.unit&&l.words.includes(w.en));
}
function eligible(snapshot,l){return words(snapshot,l).length>=2}
function shuffle(input,rand=Math.random){
 const a=input.slice();
 for(let i=a.length-1;i>0;i--){const j=Math.min(i,Math.floor(rand()*(i+1)));const t=a[i];a[i]=a[j];a[j]=t}
 return a
}
function visit(state,id,at=Date.now()){
 const l=letter(id);if(!l)return null;
 const prev=state.letters[id],letters={...state.letters,
  [id]:{...prev,opened:true,firstAt:prev.firstAt||at,lastAt:at}};
 return{...state,selected:id,letters}
}
function buildTasks(snapshot,l,rand=Math.random){
 const available=words(snapshot,l);if(available.length<2)return[];
 const targets=shuffle(available,rand).slice(0,2);
 return targets.map(w=>({key:w.key,choices:shuffle(available,rand).slice(0,Math.min(4,available.length)).map(x=>x.key)}))
 .map((t,i)=>t.choices.includes(t.key)?t:{...t,choices:[t.key,...t.choices.filter(x=>x!==t.key)].slice(0,4)});
}
function start(state,snapshot,id,rand=Math.random){
 const l=letter(id),tasks=l&&buildTasks(snapshot,l,rand);
 if(!tasks||tasks.length!==2)return null;
 const next=visit(state,id);
 return{...next,active:{id,tasks,answers:[],index:0,hint:0,mistakes:0}}
}
function task(state,snapshot){
 const a=state.active;if(!a||a.index>=a.tasks.length)return null;
 const l=letter(a.id),record=a.tasks[a.index],all=words(snapshot,l);
 const target=all.find(w=>w.key===record.key),choices=record.choices.map(k=>all.find(w=>w.key===k));
 if(!target||choices.some(w=>!w)||!choices.some(w=>w.key===target.key))return null;
 return{letter:l,target,choices,mode:a.index===0?"listen":"reply",
  sentence:l.phrase(target.en)}
}
function answer(state,snapshot,key,at=Date.now()){
 const a=state.active,t=task(state,snapshot);
 if(!a||!t||a.answers.length>a.index)return null;
 if(key!==t.target.key)return{correct:false,state:{...state,active:{...a,mistakes:a.mistakes+1}}};
 const independent=a.hint===0&&a.mistakes===0;
 const record={key,independent,at};
 return{correct:true,independent,record,state:{...state,active:{...a,answers:a.answers.concat(record)}}}
}
function hint(state){
 const a=state.active;if(!a||a.index>=a.tasks.length||a.answers.length>a.index)return null;
 return{...state,active:{...a,hint:Math.min(2,a.hint+1)}}
}
function next(state){
 const a=state.active;if(!a||a.index>=a.tasks.length||a.answers.length<=a.index)return null;
 return{...state,active:{...a,index:a.index+1,hint:0,mistakes:0}}
}
function finish(state,at=Date.now()){
 const a=state.active;if(!a||a.index!==a.tasks.length||a.answers.length!==a.tasks.length)return null;
 const before=state.letters[a.id],independent=a.answers.every(x=>x.independent);
 const after={...before,opened:true,completed:true,independent:before.independent||independent,
  visits:before.visits+1,lastAt:at,firstAt:before.firstAt||at};
 return{...state,letters:{...state.letters,[a.id]:after},active:null,selected:a.id}
}
function stats(state,snapshot){
 return{total:LETTERS.length,opened:LETTERS.filter(l=>state.letters[l.id].opened).length,
 completed:LETTERS.filter(l=>state.letters[l.id].completed).length,
 independent:LETTERS.filter(l=>state.letters[l.id].independent).length,
 playable:LETTERS.filter(l=>eligible(snapshot,l)).length}
}
window.EA2_LUMO_POST_ENGINE=Object.freeze({KEY,LETTERS,letter,read,save,words,eligible,shuffle,visit,buildTasks,start,task,answer,hint,next,finish,stats});
})();