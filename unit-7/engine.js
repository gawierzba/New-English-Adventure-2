"use strict";
(()=>{
const raw=[
["boat","łódka","łódki","⛵","transport",true],
["bus","autobus","autobusy","🚌","transport",true],
["car","samochód","samochody","🚗","transport",true],
["field","pole","pola","🌾","land",true],
["forest","las","lasy","🌲","land",true],
["island","wyspa","wyspy","🏝️","land",false],
["lake","jezioro","jeziora","🏞️","land",true],
["lorry","ciężarówka","ciężarówki","🚚","transport",true],
["mountain","góra","góry","⛰️","land",true],
["plane","samolot","samoloty","✈️","transport",true],
["rainforest","las tropikalny","lasy tropikalne","🌴","land",false],
["river","rzeka","rzeki","🏞️","land",true],
["sky","niebo","niebo","☁️","sky",true],
["town","miasto","miasta","🏘️","land",true],
["tractor","traktor","traktory","🚜","transport",true],
["train","pociąg","pociągi","🚂","transport",true],
["van","furgonetka","furgonetki","🚐","transport",false]
];
const WORDS=raw.map(x=>({en:x[0],pl:x[1],many:x[2],icon:x[3],kind:x[4],card:x[5]}));
const word=en=>WORDS.find(w=>w.en===en);
function shuffle(a){const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
const pick=a=>a[Math.floor(Math.random()*a.length)];
function plural(en){return en==="bus"?"buses":en==="lorry"?"lorries":en+"s"}
function phrase(w,count){
 if(w.en==="sky")return"The sky is blue.";
 if(count===1)return"There's "+(w.en==="island"?"an ":"a ")+w.en+".";
 return"There are "+({2:"two",3:"three",4:"four"}[count])+" "+plural(w.en)+"."
}
function polish(w,count){
 return w.en==="sky"?"Niebo jest niebieskie.":count===1?"Widzimy: jedna "+w.pl+".":"Widzimy: "+count+" × "+w.many+"."
}
function vector(w,x,y,i){
 const pos='translate('+x+' '+y+')';
 const open='<g class="scene-emoji" transform="'+pos+'" style="animation-delay:'+(i*.06)+'s">';
 if(w.en==="mountain")return open+'<path d="M-77 65 0-92 78 65Z" fill="#7c9fb4"/><path d="M-32-26 0-92 34-25 14-38-3-15-20-31Z" fill="#fff9ed"/></g>';
 if(w.en==="forest"||w.en==="rainforest"){
  const tree=w.en==="rainforest"?'<ellipse cx="-40" cy="-32" rx="43" ry="36" fill="#42a287"/><ellipse cx="0" cy="-62" rx="48" ry="45" fill="#257e76"/><ellipse cx="43" cy="-29" rx="42" ry="37" fill="#4aaf8d"/>':
  '<path d="m-80 45 40-95 39 95Z" fill="#4aa187"/><path d="M-36 47 2-89 39 47Z" fill="#368d7b"/><path d="m9 47 35-98 35 98Z" fill="#58ae91"/>';
  return open+'<path d="M-40 62V-23M0 62V-50M43 62V-19" stroke="#80785c" stroke-width="11"/>'+tree+'</g>'
 }
 if(w.en==="lake")return open+'<ellipse cy="24" rx="78" ry="39" fill="#68bed2" stroke="#d6f4e5" stroke-width="6"/><path d="M-39 18q20-11 40 1t41-1" stroke="#b8eff1" stroke-width="5" fill="none"/></g>';
 if(w.en==="river")return open+'<path d="M-32-70Q39-19-21 15Q-60 41-10 90" stroke="#5db7cf" stroke-width="37" fill="none" stroke-linecap="round"/><path d="M-32-70Q39-19-21 15Q-60 41-10 90" stroke="#b6e7f0" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="18 18"/></g>';
 if(w.en==="field")return open+'<path d="M-76 52-49-44H63L81 52Z" fill="#eed18b" stroke="#cfb172" stroke-width="5"/><path d="M-53 47-32-41M-25 48-11-41M5 47 8-41M36 47 30-41M62 47 49-41" stroke="#d7b16b" stroke-width="3"/></g>';
 if(w.en==="island")return open+'<ellipse cy="35" rx="83" ry="42" fill="#7ed1d1"/><ellipse cy="28" rx="60" ry="26" fill="#f8db9e"/><path d="M0 25V-43" stroke="#8c7868" stroke-width="10"/><path d="M0-40Q-39-66-62-36Q-24-26 0-40ZM0-40Q39-70 62-39Q27-25 0-40Z" fill="#3ca582"/></g>';
 if(w.en==="town")return open+'<rect x="-68" y="-3" width="60" height="70" rx="5" fill="#f6d7ad"/><path d="M-78-3-38-40 1-3Z" fill="#e49d92"/><rect x="-3" y="-28" width="68" height="96" rx="5" fill="#b5d7dc"/><path d="M-11-28 32-69 75-28Z" fill="#93afd2"/><rect x="-39" y="28" width="17" height="39" fill="#93c9c8"/><rect x="12" y="-1" width="22" height="25" fill="#fff5e5"/></g>';
 if(w.en==="sky")return open+'<circle cy="-26" r="44" fill="#ffe4a5"/><path d="M-90 56q13-30 44-14q15-51 61-23q33-12 53 26q19-5 24 11Z" fill="#fff"/></g>';
 return open+'<ellipse cy="62" rx="56" ry="10" fill="#437d92" opacity=".17"/><text text-anchor="middle" y="34" font-size="96" font-family="system-ui,Apple Color Emoji,Segoe UI Emoji">'+w.icon+'</text></g>'
}
function sceneSVG(w,count){
 const xs=count===1?[465]:count===2?[306,624]:count===3?[213,464,716]:[137,354,567,780];
 const wet=["boat","river","lake","island"].includes(w.en),air=["plane","sky"].includes(w.en),y=air?164:wet?328:310;
 const water=wet?'<path d="M0 376Q215 337 444 376Q710 416 930 366V490H0Z" fill="#76c6d6"/><path class="scene-wave" d="M0 416Q214 366 447 414Q685 447 930 406" fill="none" stroke="#d4f7f1" stroke-width="8"/>':
 '<path d="M0 397Q210 370 441 395Q705 364 930 389V490H0Z" fill="#90cfa6"/>';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 930 490" role="img" aria-label="Atlas: '+count+' razy '+w.pl+'">'+
 '<defs><linearGradient id="skycolor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a3daea"/><stop offset="1" stop-color="#e5f8f3"/></linearGradient></defs>'+
 '<rect width="930" height="490" fill="url(#skycolor)"/><circle cx="810" cy="78" r="47" fill="#ffdfa5" class="ray"/>'+
 '<g class="cloud" fill="#fff" opacity=".85"><ellipse cx="153" cy="97" rx="84" ry="17"/><ellipse cx="496" cy="107" rx="69" ry="14"/></g>'+
 '<path d="M0 325Q178 270 333 315Q524 257 704 312Q812 276 930 310V490H0Z" fill="#a8d9b4"/>'+water+
 xs.map((x,i)=>vector(w,x,y,i)).join("")+'</svg>';
}
window.EA7CORE=Object.freeze({WORDS,word,shuffle,pick,plural,phrase,polish,sceneSVG});
})();