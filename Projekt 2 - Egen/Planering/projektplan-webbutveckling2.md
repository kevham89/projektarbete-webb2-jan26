# Projektplan: Webbutveckling 2 – Interaktiv Demo-hemsida

## 1. Idé & mål

Istället för att göra varje övning som en separat fil, samlar vi allt i **en enda hemsida** —
en "Lab-dashboard" med ett sidomeny/navigation där varje övning blir en egen sektion/modul.
Det gör att:

- Ni får ett samlat, presentabelt projekt (bra för portfolio/inlämning).
- Arbetet går lätt att dela upp i moduler → två personer kan jobba samtidigt utan att krocka i samma filer.
- Det blir enkelt att bygga vidare med Bootstrap, React och Ajax senare, eftersom strukturen redan är modulär.

**Grundstruktur:** En `index.html` med en navigationsmeny till vänster (eller topp), och ett innehållsområde
till höger där rätt modul visas/döljs med JavaScript (ingen sidomladdning behövs).

---

## 2. Filstruktur (för att undvika merge-konflikter i Git)

```
/webbutveckling2
│
├── index.html
├── MyCSS/
│   └── style.css     (Huvudfil för CSS)
│
├── MyJS/
│   ├── jQuery_v4.js  (Library för jQuery)
│   └── MyJQ.js       (Huvudfil för egna jQuerys)
│
├── MyCards
|   └── cards.html    (Huvudfil för innehållet i alla "cards")
│
└── MyList
    └── list.html     (Huvudfil för navigeringsmenyn)    
```

> Tips: Ni kan använda `<template>`-taggar eller separata `<section id="...">` i `index.html`
> för varje övning, så slipper ni krångla med att hämta externa HTML-filer via fetch (som kräver server).

---

## 3. Uppdelning av övningarna

### 🧑‍💻 Person A – "DOM & Interaktion"
1. Knapp som visar alert("Hej") vid klick
2. Byt bakgrundsfärg vid klick på text
3. Byt textfärg vid hover (och återgå vid mouseleave)
4. Ändra muspekare till "pointer" vid hover över text
5. Visa webbsidans titel + webbläsarnamn/version (`document.title`, `navigator.appName/appVersion`)
6. Visa alt-text för alla bilder på sidan
7. Räkna antal `<p>`-element med `getElementsByTagName` och visa resultatet
8. Visa aktuellt datum och tid

### 🧑‍💻 Person B – "Logik & Formulär"
1. Deklarera variabler (heltal, flyttal, sträng, booleskt värde) + skriv ut värden/datatyper
2. Boolesk jämförelse av två tal, visa resultat på sidan
3. `checkNumber`-funktion (positiv/negativ/noll) med if-satser
4. Switch-sats baserat på användarens inmatning
5. Språkval → hälsningsmeddelande beroende på språk (svenska/engelska/spanska + default)
6. Multiplicera två tal (prompt + alert)
7. Input-fält + knapp + `checkNumber` som skriver resultat på sidan (inte alert)
8. Multiplikationstabell för ett inmatat tal (1–10)

### 🤝 Gemensamt (byggs tillsammans i slutet, kräver båda delarna klara)
- Temaväxlare (ljust/mörkt läge) – kopplas till hela sidan
- Quiz med kontroll av svar
- jQuery: knapp som byter text/färg
- jQuery: inputfält → "Hej, [namn]. Välkommen."
- jQuery: Todo-lista (lägg till/ta bort uppgifter)
- jQuery: Todo-lista (markera som klar vid klick)

---

## 4. Steg-för-steg utvecklingsplan

**Fas 1 – Grundstruktur (gör tillsammans, ~30 min)**
- Skapa `index.html` med grundlayout: header, navigation, `<main>` innehållsarea
- Skapa `main.css` med gemensam styling (färger, typsnitt, spacing)
- Kom överens om namnkonvention för id/class (t.ex. `#section-checknumber`, `.lab-card`)
- Initiera Git-repo, skapa branches: `person-a`, `person-b`

**Fas 2 – Individuellt arbete (jobba parallellt)**
- Person A jobbar i `person-a` branch med sina filer (`person-a.js`, `person-a.css`)
- Person B jobbar i `person-b` branch med sina filer (`person-b.js`, `person-b.css`)
- Varje övning byggs som en egen `<section>` i sin del av `index.html` (eller egen HTML-snutt
  som klistras in centralt vid merge)
- Committa ofta med tydliga meddelanden, t.ex. `git commit -m "Lägg till checkNumber-funktion"`

**Fas 3 – Merge & integration**
- Skapa pull request / merge branches till `main`
- Lös eventuella konflikter i `index.html` tillsammans
- Testa att navigationen visar rätt sektion för varje övning

**Fas 4 – Gemensamma moduler**
- Bygg temaväxlare, quiz och jQuery-övningarna tillsammans (parprogrammering fungerar bra här)
- Lägg till jQuery via CDN i `index.html`

**Fas 5 – Polering**
- Konsekvent styling över alla sektioner (main.css som "tema-lager" ovanpå person-specifika css)
- Kommentarer i koden (gärna på svenska, som ni redan gör)
- Testa i olika webbläsare

**Fas 6 – Utbyggnad (kommande lektioner)**
- **Bootstrap:** byt ut/komplettera egen CSS med Bootstrap-komponenter (navbar, cards, grid)
- **Ajax:** lägg till en sektion som hämtar extern data (t.ex. ett enkelt API) och visar den dynamiskt
- **React:** som separat modul/fördjupning – t.ex. bygg om en av jQuery-övningarna (todo-listan) som React-komponent, för att jämföra vanilla JS/jQuery vs React

---

## 5. Git-arbetsflöde (rekommenderat)

```bash
git checkout -b person-a        # eller person-b
# ... jobba, commita ...
git push origin person-a
# Skapa pull request på GitHub, granska varandras kod, merga till main
git checkout main
git pull
```

---

## 6. Checklista innan inlämning

- [ ] Alla 16 individuella övningar fungerar var för sig
- [ ] Navigationen fungerar och visar rätt sektion
- [ ] Gemensamma moduler (tema, quiz, jQuery-delar) är klara
- [ ] Konsekvent styling och namngivning
- [ ] Koden är kommenterad
- [ ] Git-historik visar att båda personerna bidragit
