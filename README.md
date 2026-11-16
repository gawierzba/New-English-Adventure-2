# English Adventure 2 ✦

Autorska, interaktywna strona do nauki angielskiego w klasie 2, uporządkowana według tematów *New English Adventure 2*.

## Nowość: Kraina 01 — pełna przygoda

**https://gawierzba.github.io/New-English-Adventure-2/unit-1/**

Pierwsza kraina **My favourite things** jest już osobną interaktywną lekcją z własnym robotem Robim i mechaniką uczenia:

- pięć słów podczas krótkiej wyprawy (ze słownika 9 wyrazów z Unit 1),
- poznawanie i wymowa słówek, odnajdywanie zabawek oraz dialogi \`Is it a…?\`,
- samodzielnie wybierana ulubiona rzecz i zdanie \`My favourite thing is a…\`,
- liczby 11–15: najpierw pokaz i wymowa, później losowane zadania z gwiazdkami,
- podpowiedzi w kilku krokach, bez ocen i kar; pomyłka lub podpowiedź nie jest zaliczana jako samodzielna odpowiedź,
- losowanie zadań tylko spośród poznanych rzeczy i dobór słabiej ćwiczonych słów przy następnej wizycie,
- lokalny zapis postępów, obsługa urządzeń mobilnych, dostępny tryb oszczędnego druku.

**Ważne:** pozostałe siedem krain nadal udostępnia fiszki na stronie głównej; nie są jeszcze pełnymi interaktywnymi przygodami. Pierwsza kraina jest wzorem do dalszych etapów. Projekt zasad edukacyjnych i testów znajduje się w pliku **LEARNING_BLUEPRINT.md**.

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
