"use strict";
/* Hand-authored night observatory and six-star constellation illustrations. */
(()=>{
const nebula='<defs><linearGradient id="sssky" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#183458"/><stop offset=".57" stop-color="#506890"/><stop offset="1" stop-color="#9bc3c6"/></linearGradient>'+
 '<radialGradient id="sshalo"><stop stop-color="#fff1c7" stop-opacity=".75"/><stop offset="1" stop-color="#fff1c7" stop-opacity="0"/></radialGradient>'+
 '<filter id="ssshine"><feGaussianBlur stdDeviation="11"/></filter></defs>';
const dots=[[61,72,2],[139,45,3],[247,113,3],[391,69,2],[553,43,3],[684,118,2],[813,56,3],[929,97,2],[1103,44,3],[1023,212,2],[114,227,2],[311,196,3],[755,234,2]].map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+p[2]+'" fill="#fff3db"/>').join("");
const tower='<g class="observatory-tower"><ellipse cx="612" cy="516" rx="288" ry="65" fill="#819cb0" opacity=".43"/>'+
 '<path d="M399 520V258h403v262Z" fill="#e9dcda" stroke="#b4acc0" stroke-width="12"/>'+
 '<path d="M382 294Q404 82 600 92Q797 80 828 294Z" fill="#9c9aba" stroke="#d2c3d0" stroke-width="13"/>'+
 '<path d="M600 104v-41" stroke="#e1d9d5" stroke-width="15"/><path d="M561 60h79" stroke="#e1d9d5" stroke-width="12"/>'+
 '<ellipse cx="604" cy="265" rx="156" ry="53" fill="#f1e4df" stroke="#b5b8c7" stroke-width="11"/>'+
 '<path d="M516 333q0-86 84-85q85 0 87 85v165H516Z" fill="#6f93a9" stroke="#c6c6cb" stroke-width="11"/>'+
 '<path d="M545 338q17-64 55-66q42 7 60 66" fill="none" stroke="#a9c7c9" stroke-width="15"/>'+
 '<path d="M600 271v227" stroke="#c4d5cf" stroke-width="9"/>'+
 '<rect x="429" y="341" width="54" height="102" rx="19" fill="#f9e1b8" stroke="#c7b5ba" stroke-width="9"/>'+
 '<rect x="717" y="341" width="54" height="102" rx="19" fill="#f9e1b8" stroke="#c7b5ba" stroke-width="9"/>'+
 '<path d="M353 520h501" stroke="#f9eddd" stroke-width="18" stroke-linecap="round"/></g>';
const coordinates=[[271,177],[402,88],[579,131],[738,75],[893,169],[1031,89]];
const lines=coordinates.slice(1).map((p,i)=>'<path d="M'+coordinates[i][0]+' '+coordinates[i][1]+'L'+p[0]+' '+p[1]+'" stroke="#f9ecbc" stroke-width="4" stroke-dasharray="10 10" opacity=".8"/>').join("");
const star=(x,y)=>'<g transform="translate('+x+' '+y+')"><circle r="38" fill="url(#sshalo)"/><path d="M0-26 7-7 27-6 11 6 16 25 0 14-16 25-11 6-27-6-7-7Z" fill="#ffedb8" stroke="#fff8d6" stroke-width="3"/></g>';
const stars=coordinates.map(([x,y])=>star(x,y)).join("");
const observatory='<svg class="secret-observatory-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" role="img" aria-label="Autorska nocna ilustracja obserwatorium z sześcioma gwiazdami połączonymi na niebie, kopułą, lunetą i świetlistymi oknami">'+
 nebula+'<rect width="1200" height="600" fill="url(#sssky)"/>'+dots+
 '<path d="M0 460q195-102 393-61q202-107 405-42q222-99 402-43v286H0Z" fill="#789ba6"/>'+
 '<path d="M0 533q169-78 375-31q182-92 405-53q233-59 420-25v176H0Z" fill="#8eb4ae"/>'+
 lines+stars+tower+
 '<g><path d="M80 550q139-99 285-40m464 6q160-98 296-22" stroke="#d5c9b7" stroke-width="28" fill="none" stroke-linecap="round"/></g>'+
 '<g class="secret-telescope" transform="translate(930 408) rotate(-19)"><path d="m-22 40 3-100h35l12 100Z" fill="#d2b8aa"/><path d="m-65-130h116v37H-65Z" fill="#e5c8b5" stroke="#9eb4b6" stroke-width="8"/><path d="M-8-93v100" stroke="#b5a1ae" stroke-width="11"/></g>'+
 '<g fill="#fff1c5"><circle cx="139" cy="375" r="6"/><circle cx="1056" cy="324" r="4"/><circle cx="230" cy="295" r="5"/></g>'+
 '</svg>';
window.EA2_TOWN_SECRET_ART=Object.freeze({observatory})
})();