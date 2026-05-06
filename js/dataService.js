/**
 * DataService — abstrakční vrstva nad úložištěm dat.
 *
 * Všechna public API jsou async. Interně teď běží nad localStorage,
 * takže výměna za fetch() na Supabase/Firebase vyžaduje změnu pouze
 * uvnitř _load() a _save() — veškerý volající kód zůstane beze změny.
 *
 * Migrace na backend: nahraď _load a _save za:
 *   _load:  async (key) => (await fetch(`/api/${key}`)).json()
 *   _save:  async (key, val) => fetch(`/api/${key}`, { method:'PUT', body:JSON.stringify(val) })
 */

const DataService = (() => {

  // ─── Výchozí hodnoty ───────────────────────────────────────────────────────

  const DEFAULTS = {
    hours: [
      { day: 'Pondělí', morning: '07:00 – 12:00', afternoon: '12:30 – 14:30' },
      { day: 'Úterý',   morning: '',               afternoon: '12:00 – 18:00' },
      { day: 'Středa',  morning: '07:00 – 12:00', afternoon: ''               },
      { day: 'Čtvrtek', morning: '07:00 – 12:00', afternoon: '12:30 – 14:30' },
      { day: 'Pátek',   morning: '07:00 – 12:00', afternoon: ''               },
    ],

    bloodDraw: 'Po, St, Čt, Pá · 07:00 – 08:00 · nutno objednat předem',

    cenik: [
      { id: 'posudky', name: 'Posudky a lékařská vyšetření', items: [
        { name: 'Posudek pro pracovní účely',                   price: '900 Kč'       },
        { name: 'Posudek o zdravotní způsobilosti k řízení',    price: '1 000 Kč'     },
        { name: 'Posudek k řízení vozidla (65+ let)',           price: '500 Kč'       },
        { name: 'Posudek pro zbrojní průkaz',                   price: '1 100 Kč'     },
        { name: 'Hodnocení sociálních dopadů pracovního úrazu', price: '700 Kč'       },
        { name: 'Hodnocení bolestného při pracovním úrazu',     price: '700 Kč'       },
        { name: 'Hodnocení bolestného (nepracovní úraz)',       price: '700 Kč'       },
        { name: 'Zpráva o pracovním omezení pro úřad práce',    price: '500 Kč'       },
        { name: 'Posudek pro přijetí do sociálního zařízení',   price: '300 Kč'       },
        { name: 'Způsobilost k výletu / rekreační aktivitě',    price: '300 Kč'       },
        { name: 'Způsobilost ke studiu / vzdělávací aktivitě',  price: '300 Kč'       },
        { name: 'Ostatní zdravotní posudky',                    price: '500 Kč'       },
        { name: 'Předoperační vyšetření + EKG',                 price: '350 + 250 Kč' },
        { name: 'Vyšetření osoby bez zdravotního pojištění',    price: '700 Kč'       },
      ]},
      { id: 'administrativa', name: 'Administrativa a dokumentace', items: [
        { name: 'Výpis ze zdravotní dokumentace',               price: '400 Kč' },
        { name: 'Administrativní úkony (za každých 10 minut)',  price: '150 Kč' },
        { name: 'Kopie zdravotní dokumentace (za stranu)',      price: '5 Kč'   },
      ]},
      { id: 'ostatni', name: 'Ostatní výkony', items: [
        { name: 'Aplikace očkování',           price: '300 Kč' },
        { name: 'FOB test (okultní krvácení)', price: '400 Kč' },
        { name: 'Záloha na FOB test',          price: '200 Kč' },
      ]},
    ],

    pojistovny: [
      { name: 'VZP',  url: 'http://www.vzp.cz',    img: './assets/images/pojistovny/vzp.png',  active: true },
      { name: 'ZPMV', url: 'http://www.zpmvcr.cz', img: './assets/images/pojistovny/ZPMV.png', active: true },
      { name: 'OZP',  url: 'http://www.ozp.cz',    img: './assets/images/pojistovny/OZP.png',  active: true },
      { name: 'ČPZP', url: 'http://www.cpzp.cz',   img: './assets/images/pojistovny/CPZP.png', active: true },
      { name: 'RBP',  url: 'http://www.rbp-zp.cz', img: './assets/images/pojistovny/RVP.png',  active: true },
      { name: 'VoZP', url: 'https://www.vozp.cz',  img: './assets/images/pojistovny/VoZP.png', active: true },
    ],

    kontakt: {
      address: 'Studentská 758, 436 01 Litvínov',
      phone:   '+420 770 696 990',
      email:   'esmedica.litvinov@gmail.com',
      nurse:   '',
    },

    aktuality: [
      { id: 1, active: true, type: 'info',   icon: 'syringe',
        title: 'Očkování 50+ proti klíšťové encefalitidě zdarma',
        text:  'Od 1. 1. 2022 pojišťovna hradí pacientům nad 50 let očkování proti klíšťové encefalitidě. Nutno se předem objednat.' },
      { id: 2, active: true, type: 'danger', icon: 'ban',
        title: 'Z kapacitních důvodů nové pacienty neregistrujeme.',
        text:  'Děkujeme za pochopení.' },
    ],

    faq: [
      { id: 1, active: true, color: '#1B67BF',
        question: 'Jak se objednat k lékaři?',
        answer:   'Objednat se lze přes aplikaci Medevio, telefonicky nebo osobně na recepci.' },
      { id: 2, active: true, color: '#10B981',
        question: 'Přijímáte nové pacienty?',
        answer:   'Z kapacitních důvodů momentálně nové pacienty neregistrujeme.' },
    ],

    poskytujeme: [
      { id: 'zakladni', icon: 'shield',
        name: 'Základní péče',
        subtitle: 'Každodenní lékařská péče a podpora',
        items: [
          { name: 'Preventivní prohlídky',              subtitle: 'Bezplatná prohlídka každé 2 roky'                  },
          { name: 'Telefonické a e-mailové konzultace', subtitle: 'Poradenství na dálku pro registrované pacienty'    },
          { name: 'Návštěvní služba',                   subtitle: 'Návštěvy v domácnosti pro imobilní pacienty'       },
          { name: 'Akutní ošetření neregistrovaných',  subtitle: 'Ošetření cizích pacientů v akutních případech'     },
        ],
      },
      { id: 'diagnostika', icon: 'clipboard',
        name: 'Diagnostika na místě',
        subtitle: 'Vyšetření přímo v ordinaci bez čekání',
        items: [
          { name: 'EKG',              subtitle: 'Elektrokardiografie'     },
          { name: 'CRP',              subtitle: 'Zánětlivý marker'        },
          { name: 'INR / Quick',      subtitle: 'Srážlivost krve'         },
          { name: 'Glykémie',         subtitle: 'Hladina cukru v krvi'    },
          { name: 'Pulzní oxymetrie', subtitle: 'Saturace kyslíkem'       },
          { name: 'Odběry krve',      subtitle: 'Po, St, Čt, Pá 7–8 hod' },
        ],
      },
      { id: 'specializovane', icon: 'building',
        name: 'Specializované služby',
        subtitle: 'Odborná péče a administrativní podpora',
        items: [
          { name: 'Očkování',                   subtitle: 'Povinná i nepovinná vakcinace'                            },
          { name: 'Pracovnělékařské služby',    subtitle: 'Kategorie I pro registrované, II–IV pro smluvní klienty' },
          { name: 'Předoperační vyšetření',     subtitle: 'Interní vyšetření před operačním zákrokem'               },
          { name: 'Péče o nepojištěné',         subtitle: 'Ošetření pacientů bez zdravotního pojištění'             },
        ],
      },
    ],
  };

  // ─── Úložiště (localStorage) — sem sáhni při migraci na backend ───────────

  const PREFIX = 'esmedica_';

  async function _load(key) {
    // Budoucí backend: return (await fetch(`/api/${key}`)).json();
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  async function _save(key, value) {
    // Budoucí backend: await fetch(`/api/${key}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(value) });
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }

  // ─── Migrace formátu ceníku ────────────────────────────────────────────────

  function _migrateCenik(data) {
    if (!data) return null;
    if (!Array.isArray(data)) return null;
    return data.map(sec => ({
      ...sec,
      items: Array.isArray(sec.items)
        ? sec.items.map(it => typeof it === 'string' ? { name: it, price: '' } : it)
        : [],
    }));
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  return {
    DEFAULTS,

    /** Vrátí true pokud byla data pro daný klíč uložena (ne výchozí).
     *  Při migraci na backend tuto metodu odstraň a podmíněné rendery
     *  v reader scriptech přepni na bezpodmínečné. */
    hasCustom(key) {
      return localStorage.getItem(PREFIX + key) !== null;
    },

    async getHours()            { return (await _load('hours'))       || DEFAULTS.hours; },
    async saveHours(data)       { await _save('hours', data); },

    async getBloodDraw()        { const v = await _load('blooddraw'); return v !== null ? v : DEFAULTS.bloodDraw; },
    async saveBloodDraw(text)   { await _save('blooddraw', text); },

    async getCenik()          { return _migrateCenik(await _load('cenik')) || DEFAULTS.cenik; },
    async saveCenik(data)     { await _save('cenik', data); },

    async getPojistovny()     { return (await _load('pojistovny'))   || DEFAULTS.pojistovny; },
    async savePojistovny(data){ await _save('pojistovny', data); },

    async getKontakt()        { return (await _load('kontakt'))      || DEFAULTS.kontakt; },
    async saveKontakt(data)   { await _save('kontakt', data); },

    async getAktuality()      { return (await _load('aktuality'))    || DEFAULTS.aktuality; },
    async saveAktuality(data) { await _save('aktuality', data); },

    async getPoskytujeme()    { return (await _load('poskytujeme'))  || DEFAULTS.poskytujeme; },
    async savePoskytujeme(data){ await _save('poskytujeme', data); },

    async getFaq()            { return (await _load('faq'))          || DEFAULTS.faq; },
    async saveFaq(data)       { await _save('faq', data); },
  };
})();
