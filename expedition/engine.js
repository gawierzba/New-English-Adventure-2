"use strict";
/* Stage 10 — Expedition Compass. All prompts from native course units,
   all choices from actual introduced vocabulary, no publisher graphics.
   Pure code: can be tested independently without the browser. */
(()=>{
const grammar={
 1:{title:"Wyspa Robota",short:"Szukamy śladu Robiego",scene:"🚀",sky:"#dbeff7",story:"Robi zostawił wiadomość w starej skrzyni. W środku są zabawki. Która z nich pasuje do wskazówki?",prep:"My favourite thing is",items:null,choice:en=>"a "+en},
 2:{title:"Aleja Rodzinnych Portretów",short:"Album z tajemniczym zdjęciem",scene:"🏡",sky:"#ffe8e1",story:"W rodzinnym albumie schowano kolejną część kompasu. Rozpoznaj podpis na fotografii.",prep:"I've got",items:null,choice:en=>(/^(aunt|uncle)\b/.test(en)?"an ":"a ")+en},
 3:{title:"Zwierciadło Stworków",short:"Przyjaciel o niezwykłym wyglądzie",scene:"🪞",sky:"#eee3ff",story:"Zwierciadło potrafi opowiadać o śmiesznych stworkach. Wybierz, co ma nasz bohater.",prep:"She's got",items:null,choice:en=>(/^(chin|neck|tail)$/.test(en)?"a ":"")+en},
 4:{title:"Pokój Sekretnych Drzwi",short:"Otwórz właściwą szufladę",scene:"🛏️",sky:"#e5edff",story:"Ukryta szuflada w pokoju czeka na znajomość angielskich nazw przedmiotów.",prep:"There is",items:["armchair","bath","bed","box","carpet","cupboard","curtain","lamp","mirror"],choice:en=>(/^[aeiou]/i.test(en)?"an ":"a ")+en},
 5:{title:"Dżungla Ruchu",short:"Tropem skaczących zwierząt",scene:"🌿",sky:"#e1f5e2",story:"Dżungla ożywa! Pokaż, co potrafisz zrobić, i pomóż znaleźć kompas.",prep:"I can",items:["climb","dance","fly","jump","ride a bike","ride a horse","run","sing","swim","walk"],choice:en=>en},
 6:{title:"Targ Pachnących Przysmaków",short:"Smaczna wiadomość",scene:"🍓",sky:"#fff0df",story:"Kucharz ukrył wskazówkę pomiędzy ulubionymi przysmakami. Rozpoznaj jedzenie.",prep:"He likes",items:null,choice:en=>en},
 7:{title:"Przystań Wielkiego Atlasu",short:"Podróż przez krajobrazy",scene:"⛵",sky:"#dff4fa",story:"Z pociągu widać góry i jeziora. Tola pokazuje miejsce z kolejnym fragmentem mapy.",prep:"There's",items:["boat","bus","car","field","forest","lake","lorry","mountain","plane","river","town","train","tractor"],choice:en=>(/^[aeiou]/i.test(en)?"an ":"a ")+en},
 8:{title:"Teatr Barwnych Kostiumów",short:"Finałowa garderoba",scene:"👗",sky:"#f7e5f6",story:"Fela przygotowała pokaz strojów. Ostatni fragment kompasu ukrył się w garderobie.",prep:"She's wearing",items:null,choice:en=>(/^(jeans|shorts|socks|trainers|wellies)$/.test(en)?"":/^[aeiou]/i.test(en)?"an ":"a ")+en}
};
const moduleInfo=u=>grammar[u];
const seedNumber=(a,b)=>((a*1103515245+b*12345+0xBEEF)>>>0);
const shuffle=(arr,rand=Math.random)=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const keyOf=w=>w.unit+"|"+w.en;
const seenWords=(snapshot,u)=>snapshot.all.filter(w=>w.unit===u&&w.seen);
const isEligible=(snapshot,u)=>seenWords(snapshot,u).length>=2;
function choosePhraseSet(words,info,rand=Math.random){
 const eligible=words.filter(w=>!info.items||info.items.includes(w.en));
 return shuffle(eligible,rand)
}
function meaningfulChoices(word,pool,n=3,rand=Math.random){
 const unique=[word],others=shuffle(pool.filter(w=>w.key!==word.key&&w.pl!==word.pl&&w.en!==word.en),rand);
 for(const w of others){if(unique.length>=n)break;if(unique.some(o=>o.pl===w.pl||o.en===w.en))continue;unique.push(w)}
 return shuffle(unique,rand)
}
function buildStop(snapshot,u,rand=Math.random){
 const info=moduleInfo(u),vocab=seenWords(snapshot,u);
 if(!info||vocab.length<2)return null;
 const first=shuffle(vocab,rand)[0];
 const canUse=choosePhraseSet(vocab,info,rand);
 const phraseWord=canUse.find(w=>w.key!==first.key)||canUse[0];
 const hasPhrase=!!phraseWord&&canUse.length>=2;
 // Task one is an ordinary meaning puzzle. Task two is a source-aligned
 // sentence frame, or a reverse meaning puzzle if only one template fits.
 const tasks=[
 {kind:"find",item:first,frame:null,options:meaningfulChoices(first,vocab,3,rand)},
 {kind:hasPhrase?"phrase":"reverse",item:hasPhrase?phraseWord:(vocab.find(w=>w.key!==first.key)||first),
   frame:hasPhrase?info.prep:null,options:meaningfulChoices(hasPhrase?phraseWord:(vocab.find(w=>w.key!==first.key)||first),hasPhrase?canUse:vocab,3,rand)}
 ];
 return{unit:u,info,known:vocab.length,tasks}
}
function optionText(task,word){
 if(task.kind==="phrase")return grammar[task.item.unit].choice(word.en);
 return task.kind==="reverse"?word.pl:word.en
}
function taskPrompt(task){
 if(task.kind==="find")return{tag:"ZAGADKA OBRAZKOWA",title:"Jak powiesz po angielsku?",main:task.item.pl,description:"Wybierz właściwą angielską nazwę, którą znasz z tej krainy."};
 if(task.kind==="reverse")return{tag:"ODWRÓCONA ZAGADKA",title:"Co oznacza angielskie słowo?",main:task.item.en,description:"Znajdź poprawne polskie znaczenie."};
 return{tag:"MOST ZDAŃ",title:"Dokończ zdanie po angielsku",main:task.frame+" …",description:"Wstaw poprawne wyrażenie dla: „"+task.item.pl+"”. Wszystkie odpowiedzi są z tej krainy."}
}
function phraseFor(task){return task.kind==="phrase"?task.frame+" "+optionText(task,task.item)+".":""}
function readJourney(storage){
 try{const o=JSON.parse(storage.getItem("nea2-expedition-v1")||"null");if(o&&typeof o==="object"&&!Array.isArray(o))return{visited:o.visited&&typeof o.visited==="object"?o.visited:{}}}catch(e){}
 return{visited:{}}
}
function writeJourney(storage,state){try{storage.setItem("nea2-expedition-v1",JSON.stringify(state));return true}catch(e){return false}}
function completeStop(state,u,assisted,time=Date.now()){
 const old=state.visited[u]||{};
 const newState={visited:{...state.visited,[u]:{
  visits:Math.max(0,Number(old.visits)||0)+1,
  independent:!assisted||!!old.independent,
  assisted:assisted||!!old.assisted,
  last:time
 }}};
 return newState
}
const allSeen=snapshot=>snapshot.all.filter(w=>w.seen);
function routeStatus(snapshot,state){
 return snapshot.worlds.map(w=>({id:w.id,world:w,info:grammar[w.id],
   known:w.seen,unlocked:isEligible(snapshot,w.id),
   finished:!!state.visited[w.id],independent:!!state.visited[w.id]?.independent
 }))
}
window.EA2_EXPEDITION_ENGINE=Object.freeze({
 grammar,moduleInfo,shuffle,seenWords,isEligible,buildStop,optionText,taskPrompt,phraseFor,
 readJourney,writeJourney,completeStop,routeStatus,keyOf,allSeen
});
})();