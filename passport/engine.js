"use strict";
/* Stage 09: pure progress adapter + gentle spaced-repetition scheduler.
   Source of evidence: existing world-specific records; homepage manual
   checkmarks are intentionally excluded. One record per "unit|word".
   Passport owns only its separate review history. */
(()=>{
const CATALOG=window.EA2_PASSPORT_CATALOG;
const HISTORY_KEY="nea2-passport-revision-v1";
const DAY=24*60*60*1000;
const SPACING=[1,3,7,14,30];
const asNum=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
function safeObject(v){return v&&typeof v==="object"&&!Array.isArray(v)?v:{}}
function parseJSON(storage,key){try{return JSON.parse(storage.getItem(key)||"null")}catch(e){return null}}
function readHistory(storage){
 const raw=safeObject(parseJSON(storage,HISTORY_KEY));
 const attempts=safeObject(raw.attempts);
 return{version:1,attempts}
}
function readWorld(storage,u){
 const obj=safeObject(parseJSON(storage,u.storage.key));
 return safeObject(obj[u.storage.bucket])
}
function normalizeReview(v){
 const o=safeObject(v);
 return{
   successes:Math.floor(asNum(o.successes)),
   assisted:Math.floor(asNum(o.assisted)),
   streak:Math.min(5,Math.floor(asNum(o.streak))),
   lastAt:asNum(o.lastAt),
   dueAt:asNum(o.dueAt)
 }
}
function readSnapshot(storage,now=Date.now()){
 const history=readHistory(storage).attempts,worlds=[],all=[];
 CATALOG.forEach(u=>{
  const dict=readWorld(storage,u);
  let seen=0,recognized=0,reviewed=0,due=0;
  u.words.forEach(w=>{
   const key=u.id+"|"+w.en,n=safeObject(dict[w.en]),review=normalizeReview(history[key]);
   const isSeen=n.seen===true;
   const nativeRecognized=isSeen&&asNum(n[u.storage.recognition])>0;
   const usage=isSeen&&u.storage.usage?asNum(n[u.storage.usage]):0;
   const speaking=isSeen&&u.storage.speaking?asNum(n[u.storage.speaking]):0;
   const helped=isSeen&&u.storage.hint?asNum(n[u.storage.hint]):0;
   const independently=isSeen&&(nativeRecognized||review.successes>0);
   const reviewDone=isSeen&&review.successes>0;
   const needsReview=isSeen&&(!review.lastAt||review.dueAt<=now);
   if(isSeen)seen++;
   if(independently)recognized++;
   if(reviewDone)reviewed++;
   if(needsReview)due++;
   all.push({
    key,unit:u.id,unitTitle:u.title,unitIcon:u.icon,
    en:w.en,pl:w.pl,icon:w.icon,
    seen:isSeen,nativeRecognized,independent:independently,reviewDone,
    nativeUsage:usage,nativeSpeaking:speaking,nativeHelp:helped,nativeLast:isSeen?asNum(n.last):0,
    review,needsReview
   })
  });
  worlds.push({id:u.id,title:u.title,pl:u.pl,icon:u.icon,color:u.palette,description:u.description,total:u.words.length,seen,recognized,reviewed,due})
 });
 const total=all.length;
 return{all,worlds,history:readHistory(storage),totals:{
  total,seen:all.filter(w=>w.seen).length,recognized:all.filter(w=>w.independent).length,
  reviewed:all.filter(w=>w.reviewDone).length,visited:worlds.filter(w=>w.seen>0).length,due:all.filter(w=>w.needsReview).length
 }}
}
function priority(w){
 const missingPractice=w.nativeRecognized?1:0;
 const assistedEarlier=w.review.assisted>0&&w.review.streak===0?0:1;
 const next=w.review.lastAt?w.review.dueAt:0;
 return [missingPractice,assistedEarlier,next,w.nativeLast,w.en]
}
function compareRows(a,b){
 const x=priority(a),y=priority(b);
 for(let i=0;i<x.length;i++){if(x[i]<y[i])return-1;if(x[i]>y[i])return 1}
 return 0
}
function selectReviewItems(snapshot,now=Date.now(),limit=6,force=false){
 let possible=snapshot.all.filter(w=>w.seen&&(force||w.needsReview));
 if(possible.length===0)return[];
 const perWorld=new Map();
 possible.sort(compareRows).forEach(w=>{if(!perWorld.has(w.unit))perWorld.set(w.unit,[]);perWorld.get(w.unit).push(w)});
 const groups=[...perWorld.entries()].sort((a,b)=>compareRows(a[1][0],b[1][0]));
 const output=[];
 while(output.length<Math.min(limit,possible.length)&&groups.some(x=>x[1].length)){
  for(const g of groups){if(g[1].length&&output.length<limit)output.push(g[1].shift())}
 }
 return output
}
function uniqueChoices(target,rows,count=4){
 const pool=rows.filter(w=>w.seen&&w.key!==target.key&&w.en!==target.en&&w.pl!==target.pl);
 const near=pool.filter(w=>w.unit===target.unit),far=pool.filter(w=>w.unit!==target.unit);
 function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
 let options=[target],picks=[...shuffle(near),...shuffle(far)];
 for(const w of picks){if(options.length>=count)break;if(options.some(q=>q.en===w.en||q.pl===w.pl))continue;options.push(w)}
 return shuffle(options)
}
/* Only use pictures when the course icon is an unambiguous depiction.
   Several inherited cards use the same emoji (e.g. belt and jeans)
   or a generic person glyph; those remain text questions. */
const PICTURE_SAFE=new Set([
 "1|bat","1|bike","1|computer","1|computer game","1|robot","1|scooter","1|spaceship","1|TV","1|watch",
 "3|eyes","3|glasses","3|teeth",
 "4|armchair","4|bath","4|bed","4|box","4|lamp","4|mirror",
 "5|bear","5|bird","5|elephant","5|monkey","5|snake","5|tiger",
 "6|bread","6|cake","6|carrots","6|cheese","6|chocolate","6|fish","6|grapes","6|ice cream","6|mushrooms","6|onions","6|peas","6|salad","6|strawberries","6|tomatoes",
 "7|boat","7|bus","7|car","7|field","7|forest","7|lake","7|lorry","7|mountain","7|plane","7|river","7|town","7|train","7|tractor",
 "8|scarf","8|shorts","8|socks","8|sun hat","8|trainers","8|wellies"
]);
function makeQuestion(item,snapshot,index){
 const options=uniqueChoices(item,snapshot.all,Math.min(4,snapshot.totals.seen));
 const wantPicture=index%3===2;
 const distinctPictures=options.length>=2&&new Set(options.map(w=>w.icon)).size===options.length;
 const isPicture=wantPicture&&PICTURE_SAFE.has(item.key)&&distinctPictures;
 const mode=isPicture?"picture-to-english":index%3===1?"english-to-polish":"polish-to-english";
 return{item,mode,options,answerKey:item.key}
}
function applyAnswer(history,key,independent,now=Date.now()){
 const next={version:1,attempts:{...safeObject(history.attempts)}};
 const prev=normalizeReview(next.attempts[key]);
 const streak=independent?Math.min(5,prev.streak+1):0;
 const dueAt=independent?now+SPACING[Math.min(streak-1,SPACING.length-1)]*DAY:now+12*60*60*1000;
 const record={
  successes:prev.successes+(independent?1:0),
  assisted:prev.assisted+(independent?0:1),
  streak,lastAt:now,dueAt
 };
 next.attempts[key]=record;
 return{history:next,record}
}
function saveHistory(storage,history){try{storage.setItem(HISTORY_KEY,JSON.stringify(history));return true}catch(e){return false}}
function readNext(snapshot,now=Date.now(),max=5){
 return snapshot.all.filter(w=>w.seen&&w.review.lastAt&&w.review.dueAt>now)
  .sort((a,b)=>a.review.dueAt-b.review.dueAt).slice(0,max)
}
window.EA2_PASSPORT_ENGINE=Object.freeze({
 CATALOG,HISTORY_KEY,DAY,SPACING,
 readHistory,readSnapshot,selectReviewItems,uniqueChoices,makeQuestion,applyAnswer,saveHistory,readNext
});
})();