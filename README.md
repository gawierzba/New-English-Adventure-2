# English Adventure 2 ✦

Autorska, interaktywna strona do nauki angielskiego w klasie 2, uporządkowana według tematów *New English Adventure 2*.

## Co działa
- kolorowa, responsywna mapa **8 krain** odpowiadających rozdziałom kursu,
- **93 autorskie fiszki** ze słowem angielskim, polskim tłumaczeniem i ilustracją emoji,
- głosowe odczytywanie słów przez syntezator mowy przeglądarki (gdy jest dostępny),
- zaznaczanie poznanych słówek i zapisywanie postępów lokalnie w przeglądarce,
- **szybka misja:** 5 losowych pytań z automatyczną oceną,
- czarno-biała, oszczędna w tuszu lista słówek do wydrukowania,
- obsługa telefonu, tabletu, komputera, klawiatury i ograniczenia animacji.

## Witryna
Po aktywowaniu GitHub Pages w repozytorium:
https://gawierzba.github.io/New-English-Adventure-2/

Strona nie wymaga frameworków, serwera, konta ani instalowania zależności — wystarczy index.html, style.css i app.js.

## Publikacja
W repozytorium wybierz **Settings → Pages → Build and deployment**. Ustaw **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)** i kliknij **Save**. To jednorazowy krok administracyjny wykonywany przez właściciela repozytorium. Od tej chwili GitHub Pages publikuje zmiany automatycznie przy każdym zapisie na gałęzi main. Nie jest potrzebny własny workflow.

## Materiały i prawa
Strona jest **nieoficjalnym, niezależnym projektem edukacyjnym**. Nie zawiera skanów podręcznika, wydawniczych grafik ani nagrań. Zakres 93 słów wynika z list kart wyrazowych przekazanych przez właściciela projektu; ilustracje w interfejsie są emoji, a tłumaczenia i ćwiczenia opracowano na nowo. Nie jest to projekt powiązany z Pearson ani innymi właścicielami znaków lub materiałów kursowych.

## Prywatność
Nie ma kont użytkowników ani analityki. Oznaczenia poznanych słów oraz ustawienie dźwięku pozostają w localStorage danego urządzenia i przeglądarki. Nie są synchronizowane między urządzeniami.

## Struktura
- index.html — układ strony i okna z ćwiczeniami,
- style.css — pełna responsywna oprawa graficzna + styl drukowania,
- app.js — słownictwo, fiszki, quiz, wymowa i postępy,
- favicon.svg — ikona strony,
- preview.svg — grafika podglądu dla udostępnianych linków.
