# English Adventure 2 · Silnik małego odkrywcy

## Przeznaczenie

Wzorcowa kraina: **Unit 1 — My favourite things**.
Dostępna pod adresem \`/unit-1/index.html\`.

Materiał został ustalony na podstawie plików źródłowych projektu, przede wszystkim \`NEA_2_PORADNIK.pdf\` s. 5, \`NEA_2_WordCards.pdf\` s. 1–3 i kart ćwiczeń Unit 1. Nie reprodukujemy ilustracji, nagrań ani filmowych postaci z podręcznika. Robi jest autorską postacią.

## Zweryfikowana zawartość Unit 1

| Zabawki, ulubione rzeczy (9) | Liczby (5) | Struktury |
|---|---|---|
| bat, bike, computer, computer game, robot, scooter, spaceship, TV, watch | eleven, twelve, thirteen, fourteen, fifteen | It's a…; It isn't a…; Is it a…?; My favourite thing is… |

\`bat\` to w tym zakresie **rakietka do tenisa stołowego**, nie kij baseballowy czy krykietowy. To rozróżnienie jest uwzględnione w treści obu stron.

## Wzór lekcji

1. **Odkrywam:** pięć wybranych słówek z dziewięciu; obrazek, wymowa, tłumaczenie na życzenie. Tu nie ma punktów ani ocen.
2. **Szukam:** wybieranie obrazka na podstawie poznanego słowa. Wyłącznie wśród wcześniej pokazanych słów; podpowiedzi stopniowane, bez negatywnego punktowania.
3. **Zgaduję:** \`Is it a…?\` i \`Yes, it is / No, it isn't\`. Zmieniamy przedmioty i rodzaje pytań, nie poziom trudności gramatyki.
4. **Opowiadam:** \`My favourite thing is a…\`. Dziecko wybiera prawdziwie lubianą rzecz i próbuje wypowiedzieć zdanie. Nie udajemy, że mierzymy poprawność wymowy.
5. **Liczę:** przed losowaniem poznajemy wszystkie liczby 11–15; później trzy krótkie zabawy z gwiazdkami.
6. **Wracam:** następna wyprawa priorytetowo wybiera niepokazane słówka, następnie takie, które były mniej ćwiczone.

Na górze strony każda aktywność jest dostępna z osobnego przycisku — brak obowiązkowej ścieżki i blokad. Próba uruchomienia zadania bez znajomości trzech słów powoduje pokazanie łagodnej propozycji wcześniejszego odkrywania.

## Losowość kontrolowana

Wylosować wolno: które pięć słów z dziewięciu jest dziś poznawane; kolejność tych słów; układ trzech obrazków; obiekt i prawdziwość pytania \`Is it a…?\`; kolejność liczb, gwiazdek i możliwych odpowiedzi.

Wylosować **nie wolno**: wyrazów spoza lekcji w aktywności dla dziecka; nieznanych słów jako „pułapek”; nieprawidłowej gramatyki; wymagań spoza poziomu edukacyjnego; kar za błąd lub brak aktywności.

Po wyświetleniu jednego pytania jego opcje nie zmieniają położenia przy błędnej odpowiedzi — dziecko może spróbować ponownie bez dezorientacji.

## Podpowiedzi i śledzenie postępów

Każde słowo w lokalnej pamięci przeglądarki ma pola:
- \`seen\`: zostało wyświetlone jako fiszka;
- \`find\`: liczba rozpoznań od pierwszego razu bez pomocy;
- \`ask\`: liczba poprawnych odpowiedzi od pierwszego razu na pytanie \`Is it a…?\` bez pomocy;
- \`said\`: dziecko samodzielnie oznaczyło próbę wypowiedzenia zdania, **nie** wynik automatycznej oceny wymowy;
- \`helps\`: pomyłki rozwiązane przy wsparciu i wykorzystane wskazówki;
- \`last\`: czas ostatniego ćwiczenia, wykorzystywany przy doborze kolejnej wyprawy.

Pierwsze zobaczenie nie jest uznawane za opanowanie. Odpowiedzi po podpowiedzi nie zwiększają liczników \`find\` lub \`ask\`. Wyniki nie są ocenami szkolnymi.

Dla zgodności z istniejącą stroną główną znacznik słówka w \`nea2-learned-v1\` jest dodawany dopiero, gdy \`seen\` oraz \`find >= 1\` i \`ask >= 1\`. Wówczas „Szybka misja” może losować wyłącznie poznane wcześniej słówka.

## Dźwięk, prywatność i urządzenia

- Wymowa: dostępny w przeglądarce syntezator mowy \`SpeechSynthesis\` (język \`en-GB\`, alternatywnie inny \`en\`). To nie jest oryginalne nagranie kursu ani pomiar wymowy dziecka.
- Brak dostępu do mikrofonu, brak konta użytkownika, brak transmisji danych o postępach.
- Historia pozostaje w \`localStorage\` tego urządzenia i nie synchronizuje się pomiędzy przeglądarkami.
- Zaprojektowano osobne układy dla komputerów i telefonów, obsługę klawiatury, wersję do druku i redukcję animacji.
- Zerowanie postępów jest dostępne dopiero po potwierdzeniu.

## Wzór dla kolejnych krain

Każda nowa kraina powinna mieć trzy oddzielne warstwy:
1. **Dane programu:** słownictwo, konstrukcje, reguły odmiany, walidowane przykłady i media.
2. **Silnik uczenia:** poznawanie, losowość ograniczona poznanym materiałem, podpowiedzi, ponowne próby, powtórki.
3. **Świat opowieści:** własny bohater i odmienna interakcja dopasowana do tematu; nie kopiować tego samego quizu pod inną dekoracją.

Rozszerzenia wymagają ręcznej walidacji edukacyjnej. Nie generować bez nadzoru zdań z losowych słów.

## Minimalny protokół testów

- Nowa przeglądarka → 0/9 poznanych, brak losowania pytań z niepoznanych słów.
- Odkrywanie pięciu słów → 5/9; następna wyprawa dobiera najpierw pozostałe cztery.
- Zadanie rozwiązane bez wskazówki → zwiększa licznik samodzielnego rozpoznania.
- Zadanie rozwiązane po wskazówce → pokazuje wyjaśnienie, ale nie zwiększa licznika samodzielności.
- Pytanie fałszywe → \`No, it isn't\`; prawdziwe → \`Yes, it is\`.
- Zadanie z liczbami → najpierw demonstracja 11–15, potem liczenie.
- Odświeżenie strony → postępy zostają, zaczyna się nowa krótka wyprawa.
- Wyciszenie → brak automatycznego odczytu.
- Telefon, mały ekran, ograniczone animacje, brak syntezatora mowy → wszystkie etapy nadal obsługiwalne.
