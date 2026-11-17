"use strict";
(()=>{
 const source=window.EA2_TOWN_ART.town;
 const stars='<g class="storybook-stars" aria-hidden="true"><circle cx="120" cy="75" r="5"/><circle cx="218" cy="132" r="4"/><circle cx="348" cy="59" r="5"/><circle cx="752" cy="110" r="4"/><circle cx="961" cy="69" r="5"/><circle cx="1046" cy="147" r="4"/></g>';
 const gleam='<g class="storybook-star"><circle cx="572" cy="75" r="88" fill="#fff0ce" opacity=".18"/><path d="M572 5 594 50 645 58 607 89 620 136 572 108 524 136 537 89 499 58 550 50Z" fill="#b8aec5" stroke="#f7e8cf" stroke-width="7"/><circle cx="572" cy="73" r="20" fill="#d8c9d0"/></g>';
 const lumo='<g class="story-lumo" transform="translate(835 130)"><path d="m-38-22-13-40 34 16m54 24 13-40-34 16" fill="#8c85ba"/><ellipse rx="55" ry="60" fill="#8c85ba"/><ellipse cy="14" rx="39" ry="39" fill="#f8ddc9"/><circle cx="-18" cy="-11" r="19" fill="#fff"/><circle cx="17" cy="-11" r="19" fill="#fff"/><circle cx="-13" cy="-8" r="10" fill="#44536b"/><circle cx="23" cy="-8" r="10" fill="#44536b"/><path d="m0 9-11 11h22Z" fill="#e9af8a"/><path d="M-16 32q18 10 32 0" fill="none" stroke="#ad91a3" stroke-width="5" stroke-linecap="round"/></g>';
 const sparkle='<g class="story-fireflies" fill="#fae7aa"><circle cx="81" cy="335" r="6"/><circle cx="183" cy="415" r="5"/><circle cx="756" cy="286" r="6"/><circle cx="1019" cy="457" r="7"/><circle cx="650" cy="372" r="5"/></g>';
 function modify(svg,variant,color){
  const ending=variant!=="lost";
  const fill=ending?color:"#9b9cb4";
  const finalStar=gleam.replace('fill="#b8aec5"','fill="'+fill+'"').replace('fill="#d8c9d0"','fill="'+(ending?"#fff7df":"#d8c9d0")+'"');
  let result=svg.replace('class="map-illustration"','class="map-illustration story-illustration"');
  result=result.replace("</svg>",stars+finalStar+lumo+sparkle+"</svg>");
  result=result.replace('aria-label="Autorski bajkowy plan miasteczka','aria-label="Zaczarowane Miasteczko pod Chmurami i '+(ending?"odnaleziona gwiazda":"zaginiona gwiazda")+'. Autorski bajkowy plan miasteczka');
  return result
 }
 const endings={music:"#b4a0d9",feast:"#e1a5af",river:"#8ccad2",parade:"#efc68d"};
 const cover=modify(source,"lost","");
 function ending(id){return modify(source,id,endings[id]||"#e9c5a1")}
 window.EA2_TOWN_STORY_ART=Object.freeze({cover,ending})
})();