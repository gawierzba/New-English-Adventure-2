"use strict";
/* English Adventure 2 · Stage 11 · Living Town
   A small independent learning engine. No third-party media. */
(()=>{
const venues=[
{id:"harbour",unit:7,name:"Przystań Lumo",english:"The Little Harbour",subtitle:"Łódki, pociągi i fale",icon:"⛵",badge:"Bilet na błękitną przystań",color:"#77bfc8",words:["boat","train","bus","river","car","plane"],entry:"Przy brzegu kołysze się łódka, a niedaleko widać stację. Wytropimy przedmiot, którego szuka Lumo?",phrase:en=>"There's "+(/^[aeiou]/i.test(en)?"an ":"a ")+en+".",cue:en=>"Find the "+en+"!",kind:"port"},
{id:"market",unit:6,name:"Sklepik Pod Truskawką",english:"The Berry Shop",subtitle:"Zakupy pełne kolorów",icon:"🍓",badge:"Pamiątkowy koszyk smaków",color:"#db9c96",words:["bread","cake","carrots","strawberries","grapes","cheese"],entry:"W sklepiku czekają przysmaki. Spróbuj wybrać je po angielsku i włóż do magicznego koszyka.",phrase:en=>"Can I have "+en+", please?",cue:en=>"Can I have "+en+", please?",kind:"food"},
{id:"atelier",unit:8,name:"Pracownia Barwnych Strojów",english:"The Little Atelier",subtitle:"Szyjemy bajkowe historie",icon:"👗",badge:"Kolorowa kokarda projektanta",color:"#b69fcd",words:["jacket","jeans","raincoat","scarf","sun hat","wellies"],entry:"W pracowni Feli wiszą ubrania na każdą pogodę. Znajdź właściwe części garderoby i stwórz opis wymyślonej postaci.",phrase:en=>"She's wearing "+((["jeans","wellies"].includes(en))?"":/^[aeiou]/i.test(en)?"an ":"a ")+en+".",cue:en=>"Find the "+en+"!",kind:"fashion"}
];
const KEY="nea2-living-town-v1";
const safeObject=o=>o&&typeof o==="object"&&!Array.isArray(o)?o:{};
function read(storage){
 try{const x=safeObject(JSON.parse(storage.getItem(KEY)||"null"));return {version:1,places:safeObject(x.places),night:!!x.night}}catch(e){return{version:1,places:{},night:false}}
}
function save(storage,x){try{storage.setItem(KEY,JSON.stringify(x));return true}catch(e){return false}}
function nextState(state,venue,independent,now=Date.now()){
 const old=safeObject(state.places[venue]),count=Math.max(0,Number(old.visits)||0);
 return{version:1,night:!!state.night,places:{...state.places,[venue]:{...old,visits:count+1,viewed:true,finished:true,independent:!!old.independent||!!independent,last:now}}}
}
function discovered(snapshot,venue){return snapshot.all.filter(w=>w.seen&&w.unit===venue.unit&&venue.words.includes(w.en))}
function status(snapshot,state){return venues.map(v=>{const found=discovered(snapshot,v),p=safeObject(state.places[v.id]);return{...v,known:found.length,total:v.words.length,playable:found.length>=2,viewed:!!p.viewed||!!p.finished,finished:!!p.finished,independent:!!p.independent,visits:Math.max(0,Number(p.visits)||0)}})}
function randomize(a,rand=Math.random){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function createMission(snapshot,venue,rand=Math.random){
 const words=discovered(snapshot,venue);
 if(words.length<2)return null;
 // Two or three distinct objects; no unknown word appears as a quiz target.
 const targets=randomize(words,rand).slice(0,Math.min(3,words.length));
 return{venue:venue.id,targets:targets.map(w=>({key:w.key,en:w.en,pl:w.pl,icon:w.icon,phrase:venue.phrase(w.en),cue:venue.cue(w.en)}))}
}
function isCorrect(task,name){return !!task&&task.en===name}
function canRewardTask(info){return !!info&&info.correct&&!info.hinted&&!info.missed}
const getVenue=id=>venues.find(v=>v.id===id)||null;
window.EA2_LIVING_TOWN_ENGINE=Object.freeze({venues,KEY,read,save,nextState,discovered,status,createMission,isCorrect,canRewardTask,getVenue,randomize})
})();