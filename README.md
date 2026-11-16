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
Repozytorium zawiera workflow .github/workflows/pages.yml do publikowania wersji z gałęzi main poprzez GitHub Pages. Jeżeli to pierwsza publikacja w repozytorium, w **Settings → Pages** wybierz **Build and deployment → Source: GitHub Actions**. Następnie uruchom workflow „Publish English Adventure 2” lub wprowadź nowy commit.

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
