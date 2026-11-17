"use strict";
/* Original fashion SVG engine for Unit 8. Core words based on WordCards,
   the three guide extensions are marked separately. No publisher artwork. */
(()=>{
const items=[
["belt","pasek","👖","waist",false,true],
["cap","czapka z daszkiem","🧢","head",false,false],
["jacket","kurtka / marynarka","🧥","top",false,true],
["jeans","dżinsy","👖","bottom",true,true],
["raincoat","płaszcz przeciwdeszczowy","🌧️","top",false,true],
["scarf","szalik","🧣","neck",false,true],
["shorts","krótkie spodenki","🩳","bottom",true,true],
["socks","skarpety","🧦","socks",true,true],
["sun hat","kapelusz od słońca","👒","head",false,true],
["tie","krawat","👔","neck",false,false],
["trainers","buty sportowe","👟","shoes",true,true],
["uniform","mundurek","🎒","top",false,false],
["wellies","kalosze","🥾","shoes",true,true]
].map(a=>({en:a[0],pl:a[1],icon:a[2],slot:a[3],plural:a[4],core:a[5]}));
const colors=[
{name:"red",pl:"czerwony",hex:"#e66b77"},
{name:"blue",pl:"niebieski",hex:"#4c9ed9"},
{name:"yellow",pl:"żółty",hex:"#f1c953"},
{name:"green",pl:"zielony",hex:"#57bd9d"},
{name:"purple",pl:"fioletowy",hex:"#a588cc"},
{name:"pink",pl:"różowy",hex:"#e99ac2"},
{name:"orange",pl:"pomarańczowy",hex:"#f3a85f"},
{name:"white",pl:"biały",hex:"#fffaf1"},
{name:"grey",pl:"szary",hex:"#929bad"},
{name:"brown",pl:"brązowy",hex:"#af876e"}
];
const people=[
{name:"Mia",pronoun:"She",label:"ona",hair:"#684d5c",skin:"#f1c5a9",base:"#f5d6b3",emoji:"👧"},
{name:"Leo",pronoun:"He",label:"on",hair:"#765b54",skin:"#dfad90",base:"#f7dcc2",emoji:"👦"}
];
const slots=["head","top","neck","waist","bottom","socks","shoes"];
const word=en=>items.find(w=>w.en===en),color=en=>colors.find(c=>c.name===en)||colors[1],person=i=>people[i]||people[0];
function emptyLook(){return{person:0,items:{}}}
function cloneLook(look){const v=emptyLook();v.person=look&&look.person===1?1:0;if(look&&look.items)slots.forEach(s=>{const x=look.items[s];if(x&&word(x.en)&&word(x.en).slot===s){v.items[s]={en:x.en,color:color(x.color).name}}});return v}
function equip(look,en,shade){const w=word(en),l=cloneLook(look);if(!w)return l;l.items[w.slot]={en,color:color(shade).name};return l}
function remove(look,en){const l=cloneLook(look),w=word(en);if(w&&l.items[w.slot]&&l.items[w.slot].en===en)delete l.items[w.slot];return l}
function phrasePart(en,shade){const w=word(en);if(!w)return"";const c=color(shade).name;return(w.plural?"":/^[aeiou]/i.test(c)?"an ":"a ")+c+" "+en}
function listParts(look){const l=cloneLook(look);return slots.map(s=>l.items[s]).filter(Boolean).map(v=>phrasePart(v.en,v.color))}
function joinEnglish(parts){if(parts.length===0)return"";if(parts.length===1)return parts[0];if(parts.length===2)return parts.join(" and ");return parts.slice(0,-1).join(", ")+" and "+parts[parts.length-1]}
function describe(look,firstPerson=false){const p=listParts(look);if(!p.length)return"";return(firstPerson?"I'm":person(look.person).pronoun+"'s")+" wearing "+joinEnglish(p)+"."}
function randomLook(known,personIndex,limit=3){
 let l=emptyLook();l.person=personIndex===1?1:0;const available=shuffle(known.map(en=>word(en)).filter(Boolean));
 for(const w of available){if(Object.keys(l.items).length>=limit)break;if(!l.items[w.slot])l=equip(l,w.en,random(colors).name)}
 return l
}
function shuffle(arr){const a=arr.slice();for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a}
const random=arr=>arr[Math.floor(Math.random()*arr.length)];
const shirt=(fill,other)=>'<path d="M249 236Q273 219 296 218H318Q344 222 361 237L397 267 376 308 353 285V381H243V285L222 307 197 267Z" fill="'+fill+'" stroke="'+other+'" stroke-width="5" stroke-linejoin="round"/>';
function wearSVG(look,weather="studio"){
 const l=cloneLook(look),p=person(l.person),it=l.items;
 const h=s=>it[s]&&color(it[s].color).hex,who=s=>it[s]&&it[s].en;
 const block='<rect width="600" height="570" fill="#f4ecfa"/><path d="M0 433Q310 382 600 445V570H0Z" fill="#e9e2f1"/><rect x="24" y="18" width="551" height="530" rx="30" fill="none" stroke="#ffffffab" stroke-width="9"/>';
 const backdrop=weather==="sunny"?'<circle cx="493" cy="110" r="43" fill="#f6d37d"/><path d="M494 41v-19M494 178v20M425 110h-20M561 110h23M447 62l-13-15M539 153l14 15" stroke="#f1c878" stroke-width="7" stroke-linecap="round"/>':
 weather==="rainy"?'<g class="weather-fall" stroke="#80b6d9" stroke-width="6" stroke-linecap="round"><path d="M79 56l-15 32M150 84l-15 32M495 83l-15 32M544 160l-15 32M94 288l-15 32M532 322l-15 32"/></g><path d="M438 112Q468 71 510 103Q556 79 569 128" fill="none" stroke="#d7def2" stroke-width="28" stroke-linecap="round"/>':
 weather==="cold"?'<g fill="#fff" opacity=".88"><text x="95" y="120" font-size="43">❄</text><text x="505" y="213" font-size="36">❄</text><text x="463" y="83" font-size="29">✳</text><text x="110" y="353" font-size="36">❄</text></g>':
 '<g fill="#fff" opacity=".78"><path d="m108 118 8 17 18 7-18 7-8 19-8-19-19-7 19-7Z"/><path d="m501 94 7 16 19 6-19 7-7 18-6-18-19-7 19-6Z"/></g>';
 const torso='<g><path d="M243 249Q207 276 193 348" stroke="'+p.skin+'" stroke-width="28" fill="none" stroke-linecap="round"/>'+
 '<path d="M351 247Q388 285 404 350" stroke="'+p.skin+'" stroke-width="28" fill="none" stroke-linecap="round"/>'+
 '<path d="M267 369V492M334 369V492" stroke="'+p.skin+'" stroke-width="46" stroke-linecap="round"/>'+
 '<ellipse cx="300" cy="525" rx="88" ry="20" fill="#887199" opacity=".16"/>'+
 shirt("#fbf4ec","#eee1dc")+
 '<path d="M243 369h111v33h-41v-22h-28v22h-42Z" fill="#b9afca"/>'+
 '<path d="M262 478v32M336 478v32" stroke="#e4e9f8" stroke-width="29" stroke-linecap="round"/>'+
 '<ellipse cx="259" cy="519" rx="33" ry="17" fill="#f8fbfa" stroke="#d6dbe6" stroke-width="4"/>'+
 '<ellipse cx="338" cy="519" rx="33" ry="17" fill="#f8fbfa" stroke="#d6dbe6" stroke-width="4"/></g>';
 const legs=who("bottom")==="jeans"?'<g class="garment" data-garment="jeans"><path d="M241 367h113l-10 137h-35l-9-99-8 99h-36Z" fill="'+h("bottom")+'" stroke="#4f537b" stroke-width="5" stroke-linejoin="round"/><path d="M299 373v49" stroke="#fff" opacity=".3" stroke-width="4"/></g>':
 who("bottom")==="shorts"?'<g class="garment" data-garment="shorts"><path d="M241 366h113v65h-47l-7-35-8 35h-51Z" fill="'+h("bottom")+'" stroke="#8b6f8d" stroke-width="5" stroke-linejoin="round"/></g>':"";
 const top=(x=>{if(!x)return"";const fill=h("top");if(x==="raincoat")return '<g class="garment" data-garment="raincoat"><path d="M246 229Q295 204 352 230L401 266 381 328 364 312 376 433H220L234 312 218 329 197 267Z" fill="'+fill+'" stroke="#725b87" stroke-width="6" stroke-linejoin="round"/><path d="M296 226v204" stroke="#fff" stroke-width="8" opacity=".65"/><circle cx="296" cy="280" r="5" fill="#f5ede7"/><circle cx="296" cy="332" r="5" fill="#f5ede7"/><circle cx="296" cy="382" r="5" fill="#f5ede7"/></g>';
 if(x==="uniform")return '<g class="garment" data-garment="uniform">'+shirt(fill,"#645782")+'<path d="M270 238l30 42 27-42" fill="#fff7e9" stroke="#e9dfd9" stroke-width="4"/><path d="M262 251h-33M369 251h-32" stroke="#fff1ad" stroke-width="10" stroke-linecap="round"/><circle cx="300" cy="310" r="6" fill="#f6d47d"/><circle cx="300" cy="344" r="6" fill="#f6d47d"/></g>';
 return '<g class="garment" data-garment="jacket">'+shirt(fill,"#725d86")+'<path d="M299 226v153" stroke="#fff7f4" stroke-width="7" opacity=".82"/><path d="m273 229 26 53-38-18M327 229l-28 53 39-18" fill="#f2e5df" stroke="#fff5e8" stroke-width="3"/><circle cx="299" cy="322" r="5" fill="#fff"/></g>'})(who("top"));
 const socks=who("socks")?'<g class="garment" data-garment="socks"><path d="M241 465h35v44h-35ZM322 465h35v44h-35Z" fill="'+h("socks")+'" stroke="#7d708b" stroke-width="4"/><path d="M241 476h35M322 476h35" stroke="#fff" stroke-width="5" opacity=".8"/></g>':"";
 const shoes=who("shoes")==="wellies"?'<g class="garment" data-garment="wellies"><path d="M239 462h40v58q0 23-49 23h-28q-13-13 5-21l29-10Z" fill="'+h("shoes")+'" stroke="#676581" stroke-width="5"/><path d="M320 462h40v50l30 10q18 8 5 21h-29q-46 0-46-23Z" fill="'+h("shoes")+'" stroke="#676581" stroke-width="5"/><path d="M235 480h43M320 480h40" stroke="#fff" stroke-width="5" opacity=".6"/></g>':
 who("shoes")==="trainers"?'<g class="garment" data-garment="trainers"><path d="M241 506h37l12 24q-2 15-49 15h-41q-9-10 5-21Z" fill="'+h("shoes")+'" stroke="#6e6682" stroke-width="5"/><path d="M322 506h38l34 18q15 11 4 21h-41q-47 0-49-15Z" fill="'+h("shoes")+'" stroke="#6e6682" stroke-width="5"/><path d="M208 529h71M317 529h76" stroke="#fff" stroke-width="5"/></g>':"";
 const waist=who("waist")?'<g class="garment" data-garment="belt"><rect x="244" y="365" width="111" height="21" rx="5" fill="'+h("waist")+'" stroke="#7e6b85" stroke-width="4"/><rect x="288" y="365" width="23" height="21" rx="4" fill="#ffe7a8" stroke="#c39e67" stroke-width="4"/></g>':"";
 const neck=who("neck")==="scarf"?'<g class="garment" data-garment="scarf"><path d="M262 229q38 32 73 0" fill="none" stroke="'+h("neck")+'" stroke-width="29" stroke-linecap="round"/><path d="M328 245 343 344" fill="none" stroke="'+h("neck")+'" stroke-width="24" stroke-linecap="round"/><path d="M340 336l-12 8 22 8" fill="none" stroke="#fff" stroke-width="4" opacity=".6"/></g>':
 who("neck")==="tie"?'<g class="garment" data-garment="tie"><path d="M286 232h27l-10 20 12 83-16 17-15-17 11-83Z" fill="'+h("neck")+'" stroke="#7e6484" stroke-width="4"/></g>':"";
 const face='<g><ellipse cx="299" cy="152" rx="73" ry="78" fill="'+p.skin+'" stroke="#c69687" stroke-width="5"/>'+
 (l.person===0?'<path d="M226 151q-26-94 74-104q97 7 73 104l-20-52q-14-35-53-30q-40-4-56 36Z" fill="'+p.hair+'"/><path d="M227 145q-31 70 7 116" fill="none" stroke="'+p.hair+'" stroke-width="21"/><path d="M373 146q27 69-7 112" fill="none" stroke="'+p.hair+'" stroke-width="21"/>':
 '<path d="M226 139Q208 66 286 51Q381 35 373 130l-33-47q-36 32-96 19Z" fill="'+p.hair+'"/><path d="m257 68 31-24 27 19" stroke="'+p.hair+'" stroke-width="19" fill="none"/>')+
 '<ellipse cx="272" cy="153" rx="16" ry="21" fill="#fff"/><ellipse cx="329" cy="153" rx="16" ry="21" fill="#fff"/>'+
 '<circle cx="276" cy="154" r="8" fill="#42536b"/><circle cx="334" cy="154" r="8" fill="#42536b"/>'+
 '<circle cx="280" cy="149" r="3" fill="#fff"/><circle cx="338" cy="149" r="3" fill="#fff"/>'+
 '<path d="M294 183q8 7 14 0" fill="none" stroke="#ad7f79" stroke-width="4" stroke-linecap="round"/>'+
 '<path d="M277 199q24 20 48 0" fill="none" stroke="#946b7a" stroke-width="5" stroke-linecap="round"/>'+
 '<ellipse cx="248" cy="183" rx="13" ry="8" fill="#e9a69a" opacity=".55"/><ellipse cx="353" cy="183" rx="13" ry="8" fill="#e9a69a" opacity=".55"/></g>';
 const hat=who("head")==="cap"?'<g class="garment" data-garment="cap"><path d="M222 112Q231 49 300 52Q367 53 378 112Z" fill="'+h("head")+'" stroke="#716384" stroke-width="6"/><path d="M218 109q78-21 167 0q10 18-26 17H234q-36 0-16-17" fill="'+h("head")+'" stroke="#716384" stroke-width="5"/></g>':
 who("head")==="sun hat"?'<g class="garment" data-garment="sun hat"><path d="M239 96Q239 36 299 34Q361 35 362 96Z" fill="'+h("head")+'" stroke="#98748a" stroke-width="5"/><ellipse cx="300" cy="110" rx="124" ry="27" fill="'+h("head")+'" stroke="#98748a" stroke-width="5"/><path d="M246 87h112" stroke="#fbe3aa" stroke-width="12"/></g>':"";
 const weatherLabel=weather==="rainy"?"RAINY DAY":weather==="sunny"?"SUNNY DAY":weather==="cold"?"COLD DAY":"FASHION STUDIO";
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 570" role="img" aria-label="'+person(l.person).name+' w wybranym stroju. '+listParts(l).join(", ")+'">'+
 block+backdrop+'<ellipse cx="299" cy="551" rx="120" ry="13" fill="#87769a" opacity=".19"/>'+
 torso+legs+socks+top+waist+neck+shoes+face+hat+
 '<rect x="25" y="22" width="166" height="39" rx="18" fill="#fffaf4" opacity=".94"/>'+
 '<text x="108" y="47" text-anchor="middle" font-family="system-ui" font-size="15" font-weight="900" fill="#8067a6">'+weatherLabel+'</text></svg>'
}
window.EA8ENGINE=Object.freeze({items,colors,people,slots,word,color,person,emptyLook,cloneLook,equip,remove,phrasePart,describe,listParts,randomLook,wearSVG});
})();