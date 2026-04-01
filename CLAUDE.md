# Esmedica Project Guide

## 🏗 Architektura
- **Typ:** Statický web pro ordinaci praktické lékařky.
- **Frontend:** HTML5, Vanilla JavaScript.
- **Styling:** Tailwind CSS (přes CDN), font Inter.
- **Ikony:** SVG přímo v HTML (žádná externí knihovna).
- **Data:** Obsah je dynamicky generován pomocí JavaScriptu z dat uložených v `localStorage` (objekt s předponou `esmedica_`).

## 💾 Správa dat (Admin)
- Soubor `admin.html` slouží jako administrační rozhraní.
- **Klíče v localStorage:**
  - `hours`: Ordinační hodiny.
  - `cenik`: Strukturovaný ceník (sekce a položky).
  - `pojistovny`: Seznam pojišťoven s možností aktivace (pro banner v patičce).
  - `aktuality`: Zprávy a upozornění (s možností toggle viditelnosti a barvy).
  - `kontakt`: Adresa, telefon a e-mail.
- **Formát dat:** Při úpravách datové struktury je nutné zachovat zpětnou kompatibilitu přes migrační funkce (např. `migrateCenik` v admin.html a na frontendu), aby stará data nerozbila zobrazení.
- Heslo do administrace je aktuálně natvrdo v JS kódu (`admin.html`).

## 🎨 Design & UI
- **Barvy:** Hlavní brandová barva je modrá (`#1B67BF`, v Tailwindu jako `brand`).
- **Dark Mode:** Plně podporován. Přepínání je uloženo v `localStorage` pod klíčem `theme`. Pro dark mode se používá class `dark` na elementu `<html>` a CSS styly v hlavičce (místo standardních `dark:` prefixů v HTML třídách z důvodu konzistence napříč soubory bez build stepu).
- **Responsivita:** "Mobile-first" přístup pomocí Tailwind breakpointů (`sm:`, `md:`).
- **Animace:** Např. `.book-pulse` pro pulzující tlačítka nebo `.ticker-track` pro posuvný pás pojišťoven.

## 🛠 Pravidla pro úpravy kódu
1. **DRY (Don't Repeat Yourself) u komponent:** Navigace a patička jsou momentálně duplikované v každém HTML souboru. Při změně v jednom souboru (např. `mapa.html`) je nutné změnu propsat do ostatních (`poskytujeme.html`, `cenik.html`, `medevio.html`).
2. **Bezpečnost (Admin):** Nepřidávej citlivá data. Heslo v `admin.html` je určeno jen pro základní omezení přístupu, nejedná se o bezpečný login.
3. **Záchranné mechanismy (Fallback):** HTML soubory by měly obsahovat statický (fallback) obsah v elementech s ID (např. `#hours-rows`), který se následně přepíše daty z `localStorage` přes JS skript na konci body.