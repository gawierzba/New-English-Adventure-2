"use strict";
/* Stage 14: the Secret Postcards of Living Town.
   Discovery is exploration, never a fake language assessment.
   Independent additive storage: existing city, story and passport untouched. */
(()=>{
 const KEY="nea2-town-secrets-v1";
 const ITEMS=[
  {id:"shell",venue:"harbour",icon:"🐚",word:"boat",title:"Muszla Błękitnej Rzeki",label:"Przystań",hint:"Przyjrzyj się wodzie pod żaglówką.",x:65,y:88,
   line:"There's a boat.",letter:"B",message:"W muszli szumi melodia, którą słychać tylko o zmierzchu. Lumo ukryła tu pierwszy ślad zaginionej gwiazdy.",color:"#8bcbd5"},
  {id:"ticket",venue:"station",icon:"🎟️",word:"train",title:"Bilet bez Daty",label:"Dworzec",hint:"Sprawdź okolice semafora i peronu.",x:66,y:83,
   line:"There's a train.",letter:"T",message:"Stary bilet nie pokazuje godziny. W jego rogu błyszczy maleńka gwiazdka, jakby wskazywała nową podróż.",color:"#a6b9d4"},
  {id:"recipe",venue:"market",icon:"🍰",word:"cake",title:"Przepis na Światło",label:"Sklepik",hint:"Poszukaj karteczki przy słodkościach.",x:36,y:77,
   line:"Can I have cake, please?",letter:"C",message:"Na odwrocie starego przepisu ktoś narysował trzy promienie. Sprzedawczyni mówi, że światło lubi dzielić się radością.",color:"#e5b0ac"},
  {id:"leaf",venue:"park",icon:"🍃",word:"jump",title:"Listek Wiewiórki Tuli",label:"Park",hint:"Zajrzyj w koronę największego drzewa.",x:21,y:31,
   line:"I can jump.",letter:"J",message:"Listek nie opada na ziemię: tańczy w powietrzu! Tuli zna jego sekret i zaprasza do wspólnego skoku.",color:"#9ec8a4"},
  {id:"mask",venue:"theatre",icon:"🎭",word:"grandma",title:"Maska Złotej Sceny",label:"Teatr",hint:"Na scenie blisko kurtyny jest zapomniany rekwizyt.",x:16,y:61,
   line:"This is my grandma.",letter:"G",message:"Za teatralną maską znajduje się ciepły liścik o rodzinie. Nawet mała rola może odmienić wielką opowieść.",color:"#c2a3c8"},
  {id:"ribbon",venue:"atelier",icon:"🎀",word:"scarf",title:"Wstążka Sześciu Kolorów",label:"Pracownia",hint:"Spójrz na dolny koniec zwisającego szalika.",x:83,y:66,
   line:"She's wearing a scarf.",letter:"S",message:"Wstążka migocze przy świetle gwiazd. Z jej sześciu barw można utkać drogę do tajemnego obserwatorium.",color:"#d4a4bf"}
 ];
 const byId=id=>ITEMS.find(x=>x.id===id)||null;
 const byVenue=id=>ITEMS.find(x=>x.venue===id)||null;
 function read(storage){
  let x={};try{const z=JSON.parse(storage.getItem(KEY)||"null");if(z&&typeof z==="object"&&!Array.isArray(z))x=z}catch(e){}
  const raw=x.found&&typeof x.found==="object"&&!Array.isArray(x.found)?x.found:{};
  const found={};ITEMS.forEach(item=>{if(raw[item.id]===true)found[item.id]=true});
  const order=Array.isArray(x.order)?x.order.filter(id=>byId(id)&&found[id]).filter((id,i,a)=>a.indexOf(id)===i):[];
  ITEMS.forEach(item=>{if(found[item.id]&&order.indexOf(item.id)<0)order.push(item.id)});
  return{version:1,found,order,observatory:!!x.observatory&&ITEMS.every(i=>found[i.id])}
 }
 function save(storage,x){try{storage.setItem(KEY,JSON.stringify(x));return true}catch(e){return false}}
 function discover(state,id){
  if(!byId(id))return null;
  const found={...state.found,[id]:true};
  const order=state.order.indexOf(id)>=0?state.order.slice():state.order.concat(id);
  return{version:1,found,order,observatory:state.observatory&&ITEMS.every(i=>found[i.id])}
 }
 function count(state){return ITEMS.filter(i=>!!state.found[i.id]).length}
 function all(state){return count(state)===ITEMS.length}
 function routeState(state,route){
  const chosen=Array.isArray(route)?route.map(id=>byVenue(id)).filter(Boolean):[];
  const found=chosen.filter(i=>state.found[i.id]);
  return{total:chosen.length,found:found.length,items:found.map(x=>x.id),
   complete:chosen.length===3&&found.length===3}
 }
 function unlockObservatory(state){
  if(!all(state))return null;
  return{version:1,found:{...state.found},order:state.order.slice(),observatory:true}
 }
 function knownWord(snapshot,id){
  const item=byId(id);if(!item)return null;
  const venue=window.EA2_LIVING_TOWN_ENGINE.getVenue(item.venue);
  return snapshot.all.find(w=>w.unit===venue.unit&&w.en===item.word&&w.seen)||null
 }
 window.EA2_TOWN_SECRETS=Object.freeze({KEY,ITEMS,byId,byVenue,read,save,discover,count,all,routeState,unlockObservatory,knownWord})
})();