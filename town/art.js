"use strict";
/* Entirely original vector scenery, hand-drawn for Living Town.
   No copyrighted characters or publisher assets. */
(()=>{
const defs='<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#93c8d3"/><stop offset="1" stop-color="#f0ece4"/></linearGradient>'+
'<linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#153954"/><stop offset="1" stop-color="#607d9e"/></linearGradient>'+
'<linearGradient id="water" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#a8e0dd"/><stop offset="1" stop-color="#659fb7"/></linearGradient>'+
'<linearGradient id="ground" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9e6c1"/><stop offset="1" stop-color="#a4ceaa"/></linearGradient>'+
'<linearGradient id="tile" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fdf4e5"/><stop offset="1" stop-color="#f1e2d6"/></linearGradient>'+
'<filter id="shade"><feDropShadow dx="0" dy="9" stdDeviation="8" flood-color="#395566" flood-opacity=".2"/></filter>'+
'<filter id="soft"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#32475e" flood-opacity=".15"/></filter>'+
'<pattern id="dots" width="55" height="55" patternUnits="userSpaceOnUse"><circle cx="25" cy="19" r="2" fill="#c6b6a8" opacity=".26"/></pattern></defs>';
const tree=(x,y,sc=1)=>'<g transform="translate('+x+' '+y+') scale('+sc+')"><path d="M0 0v56" stroke="#987e72" stroke-width="16" stroke-linecap="round"/><path d="M-43-17Q-54-51-20-67Q-13-101 21-94Q60-107 62-67Q94-48 62-18Q39 7 8-6Q-19 11-43-17Z" fill="#7db8a2" stroke="#5b9896" stroke-width="4"/><path d="M-31-33q15-15 32-13M27-75q19 7 23 24" stroke="#b8d7b4" stroke-width="9" stroke-linecap="round" opacity=".8"/></g>';
const cloud=(x,y,sc=1)=>'<g class="town-cloud" transform="translate('+x+' '+y+') scale('+sc+')"><path d="M-70 1q0-24 35-29q11-36 46-31q39-10 53 24q38-4 42 27q-5 31-45 29h-94q-40 1-37-20Z" fill="#fffdf6" opacity=".78"/></g>';
const lumo=(x,y,scale=1)=>'<g class="town-lumo" transform="translate('+x+' '+y+') scale('+scale+')"><path d="m-27-24-11-31 30 17m40 14 12-31-29 17" fill="#8a82ba"/><ellipse cx="0" cy="0" rx="43" ry="47" fill="#8983b7"/><ellipse cy="12" rx="30" ry="29" fill="#f8e1cd"/><ellipse cx="-15" cy="-9" rx="13" ry="15" fill="#fff"/><ellipse cx="15" cy="-9" rx="13" ry="15" fill="#fff"/><circle cx="-12" cy="-7" r="7" fill="#3f5169"/><circle cx="17" cy="-7" r="7" fill="#3f5169"/><path d="m-2 3-9 11 19 0Z" fill="#efb18f"/><path d="M-15 26q15 10 29-1" fill="none" stroke="#a1859c" stroke-width="4" stroke-linecap="round"/><path d="M-39 5q-28 4-42-14" fill="none" stroke="#8a83b9" stroke-width="18" stroke-linecap="round"/></g>';
const town='<svg class="map-illustration" viewBox="0 0 1200 680" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Autorski bajkowy plan miasteczka z rynkiem, sklepikiem, pracownią ubrań, przystanią, pociągiem, domami i drzewami">'+defs+
'<rect width="1200" height="680" fill="url(#sky)"/><g class="night-overlay"><rect width="1200" height="680" fill="url(#nightSky)"/></g>'+
'<path d="M0 187q95-74 197-35q128-96 255-20q109-79 220-26q131-67 248 5q113-33 180 10V453H0Z" fill="#a7cfca"/>'+
'<path d="M0 248q121-63 225-21q142-78 236-28q164-78 300 5q214-92 439 22v251H0Z" fill="#89bcb1"/>'+
cloud(118,95,1.1)+cloud(827,80,.85)+cloud(1090,155,.55)+
'<path d="M0 338Q235 285 472 312T877 285Q1100 261 1200 316V680H0Z" fill="url(#ground)"/>'+
'<path d="M1200 397Q1030 372 948 413Q842 462 919 513Q1014 582 884 680H1200Z" fill="url(#water)" stroke="#e8f9ed" stroke-width="11"/>'+
'<g class="water-sparkles" stroke="#effbf5" stroke-width="5" stroke-linecap="round" opacity=".8"><path d="m1039 432 37-4m-76 60 43 2m91 66 36-2m-198 55 44 4"/></g>'+
'<path d="M0 600Q182 496 350 524Q512 588 660 471Q764 403 937 440" fill="none" stroke="#d6c8b8" stroke-width="89" stroke-linecap="round"/>'+
'<path d="M0 600Q182 496 350 524Q512 588 660 471Q764 403 937 440" fill="none" stroke="#e9ddd1" stroke-width="73" stroke-linecap="round"/>'+
'<path d="M96 530Q263 448 419 466T765 385" fill="none" stroke="#f4efe2" stroke-width="13" stroke-dasharray="5 31" stroke-linecap="round" opacity=".8"/>'+
'<ellipse cx="564" cy="456" rx="137" ry="80" fill="#e8d6c4" stroke="#f5e5d4" stroke-width="16"/>'+
'<ellipse cx="564" cy="456" rx="90" ry="49" fill="#f5e4d6"/>'+
'<g filter="url(#soft)"><ellipse cx="564" cy="447" rx="28" ry="13" fill="#9ecfc8"/><path d="M544 441q18-43 39 0" fill="#8bb0b7"/><path d="M550 428q9-30 28 0" fill="#b2d8d2"/><circle cx="564" cy="406" r="8" fill="#f5f4ec"/></g>'+
'<g class="clock-tower" filter="url(#shade)"><path d="M535 175h83l-10 205h-69Z" fill="#eee0d1" stroke="#b7a8ae" stroke-width="5"/><path d="m514 184 64-69 60 69Z" fill="#857da0"/><path d="M548 215h56v58h-56Z" fill="#faf8e9" stroke="#c7b2b1" stroke-width="7"/><circle cx="576" cy="244" r="23" fill="#fff" stroke="#c7b5b0" stroke-width="4"/><path d="M576 229v16l13 9" stroke="#867f9f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M558 308h34v71h-34Z" fill="#9eaeaf"/><g class="map-light"><path d="M543 199h20v23h-20Z" fill="#ffe3a5"/><path d="M591 199h20v23h-20Z" fill="#ffe3a5"/></g></g>'+
'<g class="market-house" filter="url(#shade)"><path d="M337 282H500v149H337Z" fill="#f3e8db" stroke="#bb9ba5" stroke-width="5"/><path d="m319 297 102-85 101 85Z" fill="#cf9296" stroke="#e4c4ad" stroke-width="6"/><rect x="354" y="316" width="127" height="35" rx="6" fill="#f7f5ed" stroke="#b5a7ac" stroke-width="4"/><path d="M354 340h127l-11 41h-105Z" fill="#e4a0a0"/><path d="M357 341v37m27-38v39m25-39v39m27-39v39m28-39v39" stroke="#fff4e8" stroke-width="13"/><rect x="365" y="392" width="45" height="40" rx="5" fill="#9bc5bf"/><rect x="425" y="389" width="46" height="42" rx="5" fill="#a8c1ca"/><g class="map-light"><rect x="366" y="391" width="44" height="39" rx="4" fill="#ffe4ac" opacity=".55"/></g><text x="418" y="335" text-anchor="middle" fill="#987a83" font-size="17" font-weight="900" font-family="system-ui">BERRY SHOP</text></g>'+
'<g class="atelier-house" filter="url(#shade)"><path d="M735 254h177v167H735Z" fill="#f4ecf0" stroke="#b3a5bb" stroke-width="5"/><path d="m716 276 106-78 108 78Z" fill="#8f9bbd" stroke="#d3c3cb" stroke-width="6"/><path d="M765 293h119v41H765Z" fill="#fffaf0" stroke="#c6b9cb" stroke-width="4"/><text x="822" y="321" text-anchor="middle" font-family="system-ui" font-weight="900" fill="#817a9d" font-size="20">ATELIER</text><rect x="758" y="352" width="42" height="67" rx="7" fill="#d4cadf"/><rect x="808" y="348" width="41" height="70" rx="7" fill="#9fc7ca"/><rect x="858" y="351" width="40" height="67" rx="7" fill="#bfa2b6"/><path d="M825 348v72" stroke="#f9f1e6" stroke-width="5"/><g class="map-light"><rect x="858" y="351" width="40" height="67" rx="7" fill="#ffe6a5" opacity=".42"/></g></g>'+
'<g filter="url(#shade)"><path d="M205 414h127v106H205Z" fill="#ebddcf"/><path d="m189 426 77-62 80 62Z" fill="#9d9cb2"/><rect x="219" y="450" width="97" height="32" rx="5" fill="#f5f2e7"/><text x="268" y="472" font-family="system-ui" font-size="15" text-anchor="middle" fill="#7f859c" font-weight="900">STATION</text><path d="M244 489h46v32h-46Z" fill="#9cbec4"/></g>'+
'<path d="M-30 567Q169 524 370 617" fill="none" stroke="#9897a5" stroke-width="12"/><path d="M-30 581Q169 538 370 631" fill="none" stroke="#9897a5" stroke-width="12"/><path d="M-30 574Q169 531 370 624" fill="none" stroke="#d5c8b8" stroke-width="6" stroke-dasharray="8 21"/>'+
'<g class="map-train"><rect x="38" y="537" width="111" height="47" rx="16" fill="#d58e99" stroke="#8d7e99" stroke-width="5"/><rect x="48" y="543" width="32" height="22" rx="6" fill="#e5f7f3"/><rect x="89" y="543" width="36" height="22" rx="6" fill="#e5f7f3"/><circle cx="70" cy="587" r="13" fill="#616d8a" stroke="#f4d8c2" stroke-width="5"/><circle cx="119" cy="587" r="13" fill="#616d8a" stroke="#f4d8c2" stroke-width="5"/></g>'+
'<g class="map-boat" transform="translate(1011 524)"><path d="M-76 12h160l-30 42H-47Z" fill="#f6ebe0" stroke="#7e91a3" stroke-width="7"/><path d="M3-93v102" stroke="#6b7d96" stroke-width="8"/><path d="M-7-84-62 7H-7Z" fill="#fff7ec"/><path d="M10-74 68 6H10Z" fill="#e8a8aa"/><path d="M-52 68q22 9 46 0M29 70q19 7 36 0" fill="none" stroke="#ecfffb" stroke-width="6" stroke-linecap="round"/></g>'+
tree(93,358,1.05)+tree(1095,322,.75)+tree(684,384,.58)+tree(1075,216,.52)+tree(139,222,.65)+
'<g class="lamp"><path d="M631 408v-81" stroke="#8f92ab" stroke-width="9" stroke-linecap="round"/><path d="M611 327h39l-6-30h-26Z" fill="#fff2d9" stroke="#a4a1b4" stroke-width="6"/><circle cx="630" cy="299" r="8" fill="#aaa6b1"/><g class="map-light"><path d="M613 322h34l-6-20h-22Z" fill="#ffe2a2"/></g></g>'+
lumo(660,185,.7)+
'<g fill="#fcf4d9"><path d="m112 52 7 20 21 8-21 8-7 21-8-21-20-8 20-8Z"/><path d="m1066 86 7 18 19 7-19 8-7 19-8-19-18-8 18-7Z"/></g>'+
'</svg>';
const harbour='<svg class="scene-svg" viewBox="0 0 900 530" role="img" aria-label="Bajkowa przystań z żaglówką, rzeką, pociągiem, autobusem i samochodem" xmlns="http://www.w3.org/2000/svg">'+defs+
'<rect width="900" height="530" fill="#cfe8e6"/><path d="M0 170Q202 70 409 175Q617 100 900 164V330H0Z" fill="#a6d0bf"/>'+
cloud(134,91,.65)+cloud(757,72,.6)+
'<path d="M0 287Q270 225 548 276Q725 245 900 252V530H0Z" fill="#b6d9b6"/>'+
'<path d="M0 310Q230 256 436 315Q620 330 900 296V530H0Z" fill="url(#water)"/>'+
'<path d="M0 300Q230 247 436 306Q620 322 900 289" fill="none" stroke="#eafbf0" stroke-width="12"/>'+
'<g class="scene-ripples" stroke="#effff8" stroke-width="6" stroke-linecap="round" opacity=".8"><path d="m310 375 70-9m150 45 70-8m118 55 58 4m-540 10 50 4"/></g>'+
'<path d="M0 298q93-19 156 20l64 83-38 129H0Z" fill="#e9d8c6" stroke="#f9ede4" stroke-width="10"/>'+
'<path d="M0 454q89-22 182 30" fill="none" stroke="#9d9ca6" stroke-width="9"/><path d="M0 470q89-22 182 30" fill="none" stroke="#9d9ca6" stroke-width="9"/>'+
'<g class="scene-train"><rect x="62" y="236" width="228" height="81" rx="22" fill="#c17f91" stroke="#997a99" stroke-width="7"/><path d="M82 241h57v46H82ZM156 241h56v46h-56ZM229 241h39v46h-39Z" fill="#ecfbf6"/><rect x="34" y="278" width="40" height="37" rx="9" fill="#b3b1c1"/><circle cx="116" cy="314" r="18" fill="#6a708f" stroke="#e2d2c5" stroke-width="6"/><circle cx="237" cy="314" r="18" fill="#6a708f" stroke="#e2d2c5" stroke-width="6"/></g>'+
'<g class="scene-boat" transform="translate(597 341)"><path d="M-147 36h304l-63 70H-83Z" fill="#f9f0e5" stroke="#819bb1" stroke-width="11"/><path d="M5-199V32" stroke="#6b879d" stroke-width="12"/><path d="M-5-194-135 24H-5Z" fill="#fffdf0" stroke="#c1bac0" stroke-width="4"/><path d="M17-177 127 27H17Z" fill="#df9eaa" stroke="#c18a9b" stroke-width="4"/><path d="m-132 126 45-4M39 136l78-3" stroke="#e9fff8" stroke-width="9" stroke-linecap="round"/></g>'+
'<g class="scene-bus"><rect x="184" y="405" width="186" height="84" rx="24" fill="#e3bd7f" stroke="#a99b92" stroke-width="6"/><rect x="200" y="414" width="57" height="39" rx="7" fill="#e8f8f2"/><rect x="266" y="414" width="78" height="39" rx="7" fill="#e8f8f2"/><circle cx="229" cy="490" r="18" fill="#686d84" stroke="#e8ded0" stroke-width="6"/><circle cx="329" cy="490" r="18" fill="#686d84" stroke="#e8ded0" stroke-width="6"/></g>'+
'<g><path d="M60 418h95l11 43H49Z" fill="#a4b8c7" stroke="#7f899d" stroke-width="7"/><path d="M84 383h48l20 35H61Z" fill="#e8ede6" stroke="#a4b8c7" stroke-width="7"/><circle cx="75" cy="462" r="13" fill="#626e84"/><circle cx="142" cy="462" r="13" fill="#626e84"/></g>'+
'<g class="plane-fly" transform="translate(712 100)"><path d="m-67 17 57-17 20-44 18 4-8 42 73 10 5 19-77 7-24 33-16-4 8-38-55-1Z" fill="#f6f8ee" stroke="#7f9fb1" stroke-width="5"/></g>'+
'<g fill="#f9f8e6"><circle cx="373" cy="215" r="6"/><circle cx="390" cy="211" r="4"/></g>'+
'</svg>';
const market='<svg class="scene-svg" viewBox="0 0 900 530" role="img" aria-label="Sklepik z koszami pieczywa, ciasta, marchewek, truskawek, winogron i sera" xmlns="http://www.w3.org/2000/svg">'+defs+
'<rect width="900" height="530" fill="#f1e8e0"/><path d="M0 0h900v133H0Z" fill="#e6d2cf"/><path d="M0 134h900v396H0Z" fill="#f5e9d8"/>'+
'<rect x="62" y="71" width="776" height="89" rx="15" fill="#f7f5e8" stroke="#cbb3aa" stroke-width="8"/>'+
'<text x="450" y="130" text-anchor="middle" font-size="45" font-family="Georgia,serif" font-style="italic" fill="#997984">The Little Berry Shop</text>'+
'<path d="M32 168h837l-19 97H51Z" fill="#fff3e9" stroke="#d6aaa7" stroke-width="5"/>'+
'<g fill="#cf8d94"><path d="M46 173h72l-10 92H54Z"/><path d="M188 173h72l-4 92h-65Z"/><path d="M329 173h72v92h-72Z"/><path d="M473 173h70l11 92h-70Z"/><path d="M617 173h72l9 92h-72Z"/><path d="M760 173h72l17 92h-71Z"/></g>'+
'<path d="M63 340h778v116H63Z" fill="#aa8484" stroke="#8f7881" stroke-width="9"/>'+
'<path d="M42 334h817v34H42Z" fill="#f2e0cc" stroke="#c6a8a4" stroke-width="7"/>'+
'<g filter="url(#soft)"><path d="M81 349h149l-17 86H96Z" fill="#cba987" stroke="#a98278" stroke-width="6"/>'+
'<g fill="#dfab71" stroke="#b88772" stroke-width="3"><path d="M114 340q-27-46 6-73q43 7 33 71"/><path d="M153 339q-20-53 21-75q36 26 15 75"/></g><g stroke="#f5deb4" stroke-width="5"><path d="m115 294 26-13m17 17 24-14"/></g></g>'+
'<g filter="url(#soft)"><path d="M254 350h140l-13 93H266Z" fill="#dbacb2" stroke="#b98b9b" stroke-width="6"/><path d="M275 336h103v-45q-6-33-53-32q-45 2-50 33Z" fill="#f2d7b0" stroke="#c6a08a" stroke-width="5"/><path d="M273 296q55-33 107 0" fill="none" stroke="#fff0ec" stroke-width="17"/><circle cx="326" cy="260" r="10" fill="#da8794"/></g>'+
'<g filter="url(#soft)"><path d="M424 351h128l-16 92H439Z" fill="#d2b39a" stroke="#ac8c88" stroke-width="6"/>'+
'<g fill="#edac69" stroke="#be9671" stroke-width="4"><path d="m460 338-12-64q23-17 34 3l6 60Z"/><path d="m482 342 12-78q28 1 28 21l-10 53Z"/></g><path d="m449 272-19-14m19 12 7-24m37 19 10-23" stroke="#83b390" stroke-width="8" stroke-linecap="round"/></g>'+
'<g filter="url(#soft)"><path d="M571 350h140l-14 92H589Z" fill="#bb9eb2" stroke="#947f98" stroke-width="6"/>'+
'<g fill="#d98283" stroke="#b36d75" stroke-width="3"><path d="M603 330q-16-42 18-40q34 6 16 40Z"/><path d="M649 329q-18-37 13-37q34 5 16 36Z"/></g><path d="m617 289-11-12 18 0 8-11 8 15m24 7 10-13" fill="#77a888" stroke="#77a888" stroke-width="5"/></g>'+
'<g filter="url(#soft)"><path d="M720 353h135l-13 88H733Z" fill="#d2bb9a" stroke="#ae9483" stroke-width="6"/><g fill="#9881b1"><circle cx="766" cy="323" r="21"/><circle cx="793" cy="313" r="19"/><circle cx="820" cy="325" r="21"/><circle cx="790" cy="340" r="20"/></g></g>'+
'<path d="M355 492h178" stroke="#c9b2a5" stroke-width="8" stroke-linecap="round"/>'+
'<g><path d="M706 462l-2-62h90v61Z" fill="#efdc9f" stroke="#beac93" stroke-width="7"/><path d="M719 402q24-28 61 0" stroke="#beac93" stroke-width="7" fill="none"/></g>'+
'</svg>';
const atelier='<svg class="scene-svg" viewBox="0 0 900 530" role="img" aria-label="Pracownia strojów z kurtką, dżinsami, płaszczem, szalikiem, kapeluszem i kaloszami" xmlns="http://www.w3.org/2000/svg">'+defs+
'<rect width="900" height="530" fill="#e8e7ed"/><rect x="0" y="0" width="900" height="370" fill="#f0eaf0"/>'+
'<path d="M0 370h900v160H0Z" fill="#e0d4ce"/><path d="M0 372h900" stroke="#c6b7be" stroke-width="8"/>'+
'<path d="M54 40h262v249H54Z" fill="#cee4e3" stroke="#b5b3cb" stroke-width="16"/><path d="M182 40v247M54 160h263" stroke="#ece9f0" stroke-width="12"/>'+
'<path d="M60 248q113-70 253 2" fill="#a9caba"/>'+
cloud(185,104,.45)+
'<path d="M352 137H837" stroke="#a5a4bb" stroke-width="14" stroke-linecap="round"/><path d="m368 137 0-28m0 28 17 18m-17-18-16 18m143-18 0-28m0 28 17 18m-17-18-16 18m140-18 0-28m0 28 17 18m-17-18-16 18m150-18v-28m0 28 17 18m-17-18-16 18" stroke="#b4adc0" stroke-width="6" fill="none" stroke-linecap="round"/>'+
'<g class="garment-jacket" filter="url(#soft)"><path d="M345 174q36-21 64 0l43 23 15 86-38 9-14-48v102h-77V244l-14 48-37-9 15-86Z" fill="#92adc8" stroke="#708da7" stroke-width="7"/><path d="m346 174 32 42-17 33m47-75-32 42 17 33" fill="#d7e6f1" stroke="#f6f3eb" stroke-width="5"/><path d="M376 216v129" stroke="#f1e9e6" stroke-width="6"/></g>'+
'<g class="garment-jeans" filter="url(#soft)"><path d="M448 170h91l-9 176h-34l-4-101-13 101h-36Z" fill="#6985aa" stroke="#5d769e" stroke-width="7"/><path d="M456 207h72M495 171v80" stroke="#c4d6e9" stroke-width="4"/></g>'+
'<g class="garment-raincoat" filter="url(#soft)"><path d="M579 172q33-21 67 0l39 23 18 98-38 12-15-46 18 106H555l17-106-15 46-40-12 17-98Z" fill="#d79ea6" stroke="#b98b9f" stroke-width="7"/><path d="M581 169q-15-40 30-53q50 7 38 53" fill="#d79ea6" stroke="#b98b9f" stroke-width="7"/><path d="M612 175v190" stroke="#f7e7dc" stroke-width="6"/><circle cx="614" cy="225" r="6" fill="#f7ece1"/><circle cx="614" cy="267" r="6" fill="#f7ece1"/></g>'+
'<g class="garment-scarf"><path d="M702 170q-20 31 3 49q19 17 32-6q12-29-5-42" fill="none" stroke="#ab91b6" stroke-width="18" stroke-linecap="round"/><path d="M732 223 716 346" stroke="#ab91b6" stroke-width="26" stroke-linecap="round"/><path d="m715 340 24 6" stroke="#e4c9e9" stroke-width="5"/></g>'+
'<g class="garment-hat" transform="translate(771 104)"><path d="M-49 16Q-48-40 0-46Q49-41 48 16Z" fill="#efdda9" stroke="#b8a89b" stroke-width="7"/><ellipse cy="20" rx="72" ry="19" fill="#efdda9" stroke="#b8a89b" stroke-width="6"/><path d="M-43 8h84" stroke="#d6a6ab" stroke-width="11"/></g>'+
'<g class="garment-boots" transform="translate(714 396)"><path d="M-67 0h40v61q30 0 23 35h-95q-11-24 32-38Z" fill="#78b5ac" stroke="#669d9f" stroke-width="7"/><path d="M24 0h41v58q40 16 28 38H-2q-10-23 27-35Z" fill="#78b5ac" stroke="#669d9f" stroke-width="7"/><path d="M-67 21h40M24 21h41" stroke="#f5e7db" stroke-width="9"/></g>'+
'<path d="M320 388H857" stroke="#c8aab0" stroke-width="13" stroke-linecap="round"/>'+
'<g class="light-bulb"><path d="M180 0v31" stroke="#b7a8c0" stroke-width="5"/><ellipse cx="180" cy="51" rx="19" ry="25" fill="#fff3d4" stroke="#d3c2bd" stroke-width="5"/></g>'+
'<g><rect x="60" y="416" width="196" height="75" rx="15" fill="#ac96ad"/><rect x="83" y="402" width="150" height="48" rx="12" fill="#d6c5db"/><path d="M84 470h151" stroke="#ede2eb" stroke-width="9"/></g>'+
'</svg>';
window.EA2_TOWN_ART=Object.freeze({town,harbour,market,atelier,lumo});
})();