/**
 * components.js — sdílené komponenty (nav, footer).
 * Nav je vložen přímo jako JS string (bez fetch) → funguje i na file://.
 * Footer se stále načítá přes fetch (vyžaduje server / Live Server).
 */

(function () {

  // ─── Nav HTML ─────────────────────────────────────────────────────────────
  const NAV_HTML = `
<nav style="background:white;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:50"
  class="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-50">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-1">

    <a href="./index.html" class="flex items-center flex-shrink-0 mr-2" id="nav-home-logo">
      <img src="./Logo/Gemini_Generated_Image_nzqnpnnzqnpnnzqn.png" alt="ESMEDICA" class="h-10 sm:h-12 w-auto">
    </a>

    <div class="hidden sm:flex items-center gap-1 text-sm font-medium ml-auto">
      <a href="./index.html" data-nav="home"
        class="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 tracking-wide transition-colors">Domů</a>
      <a href="./poskytujeme.html" data-nav="poskytujeme"
        class="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 tracking-wide transition-colors">Poskytujeme</a>
      <a href="./cenik.html" data-nav="cenik"
        class="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 tracking-wide transition-colors">Ceník</a>
      <a href="./medevio.html" data-nav="medevio"
        class="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex items-center medevio-logo-bg" style="background:white">
        <img src="./assets/images/medevio-logo.svg" alt="Medevio" class="h-4 w-auto">
      </a>
    </div>

    <button id="nav-dark-toggle"
      class="ml-auto sm:ml-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
      aria-label="Přepnout tmavý režim">
      <svg id="nav-icon-moon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
      <svg id="nav-icon-sun" class="w-5 h-5" style="display:none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"/>
      </svg>
    </button>

    <button id="nav-menu-btn"
      class="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
      aria-label="Otevřít menu" aria-expanded="false">
      <svg id="nav-hamburger" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
      <svg id="nav-close" class="w-5 h-5" style="display:none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>

  <div id="nav-mobile-menu" style="display:none"
    class="sm:hidden border-t border-gray-100 bg-white dark:bg-slate-800">
    <div class="max-w-5xl mx-auto px-4 pt-2 pb-4 flex flex-col gap-0.5">
      <a href="./index.html" data-nav-m="home"
        class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Domů</a>
      <a href="./poskytujeme.html" data-nav-m="poskytujeme"
        class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Poskytujeme</a>
      <a href="./cenik.html" data-nav-m="cenik"
        class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Ceník</a>
      <a href="./medevio.html" data-nav-m="medevio"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
        <img src="./assets/images/medevio-logo.svg" alt="" class="h-3.5 w-auto">
        <span>Medevio</span>
      </a>
      <div class="pt-2">
        <a href="https://my.medevio.cz/esmedica/" target="_blank" rel="noopener"
          class="book-btn flex items-center justify-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
          style="background:#1B67BF;display:flex">
          Objednat se online
          <svg class="w-4 h-4" style="opacity:.7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</nav>`;

  // ─── Vložení nav ──────────────────────────────────────────────────────────
  const navPlaceholder = document.getElementById('site-nav');
  if (navPlaceholder) {
    navPlaceholder.outerHTML = NAV_HTML;
  }

  // ─── Aktivní odkaz ────────────────────────────────────────────────────────
  const page = location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
  const navMap = {
    index: 'home', index2: 'home', index3: 'home',
    mapa: 'home', mapa2: 'home', mapa3: 'home',
    poskytujeme: 'poskytujeme', cenik: 'cenik', medevio: 'medevio',
  };
  const activeKey = navMap[page];
  if (activeKey) {
    const link = document.querySelector(`[data-nav="${activeKey}"]`);
    if (link) {
      link.classList.remove('text-gray-600', 'hover:text-gray-800', 'hover:bg-gray-100');
      link.classList.add('text-brand');
      link.style.background = 'rgba(27,103,191,0.08)';
    }
    const mobileLink = document.querySelector(`[data-nav-m="${activeKey}"]`);
    if (mobileLink) {
      mobileLink.classList.remove('text-gray-700', 'hover:bg-gray-100');
      mobileLink.classList.add('text-brand');
      mobileLink.style.background = 'rgba(27,103,191,0.08)';
    }
  }

  // ─── Dark mode toggle ─────────────────────────────────────────────────────
  const sunIcon    = document.getElementById('nav-icon-sun');
  const moonIcon   = document.getElementById('nav-icon-moon');
  const darkToggle = document.getElementById('nav-dark-toggle');

  function syncDarkIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    if (sunIcon)  sunIcon.style.display  = isDark ? '' : 'none';
    if (moonIcon) moonIcon.style.display = isDark ? 'none' : '';
  }
  syncDarkIcons();

  if (darkToggle) {
    darkToggle.addEventListener('click', function () {
      const nowDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', nowDark ? 'dark' : 'light');
      syncDarkIcons();
    });
  }

  // ─── Dark mode: nav styl ──────────────────────────────────────────────────
  function applyNavDark() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const isDark = document.documentElement.classList.contains('dark');
    nav.style.background     = isDark ? '#1e293b' : 'white';
    nav.style.borderColor    = isDark ? '#334155' : '#f3f4f6';
    const mobileMenu = document.getElementById('nav-mobile-menu');
    if (mobileMenu) mobileMenu.style.background = isDark ? '#1e293b' : 'white';
  }
  applyNavDark();

  if (darkToggle) {
    darkToggle.addEventListener('click', applyNavDark);
  }

  // ─── Hamburger menu ───────────────────────────────────────────────────────
  const menuBtn    = document.getElementById('nav-menu-btn');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const hamburger  = document.getElementById('nav-hamburger');
  const closeIcon  = document.getElementById('nav-close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.style.display !== 'none';
      mobileMenu.style.display = isOpen ? 'none' : 'block';
      if (hamburger) hamburger.style.display = isOpen ? '' : 'none';
      if (closeIcon) closeIcon.style.display = isOpen ? 'none' : '';
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // ─── Footer (fetch — vyžaduje server) ────────────────────────────────────
  (async function () {
    async function loadComponent(placeholderId, url) {
      const el = document.getElementById(placeholderId);
      if (!el) return;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status);
        el.outerHTML = await res.text();
      } catch (e) {
        console.warn('components.js: nelze načíst', url, e);
      }
    }

    await loadComponent('site-footer', './components/footer.html');

    if (typeof DataService !== 'undefined' && DataService.hasCustom('kontakt')) {
      const k = await DataService.getKontakt();
      const ftrAddr      = document.getElementById('ftr-address');
      const ftrPhoneLink = document.getElementById('ftr-phone-link');
      const ftrPhone     = document.getElementById('ftr-phone');
      const ftrEmailLink = document.getElementById('ftr-email-link');
      const ftrEmail     = document.getElementById('ftr-email');
      if (ftrAddr)      ftrAddr.textContent  = k.address;
      if (ftrPhoneLink) ftrPhoneLink.href     = 'tel:' + k.phone.replace(/\s/g, '');
      if (ftrPhone)     ftrPhone.textContent  = k.phone;
      if (ftrEmailLink) ftrEmailLink.href     = 'mailto:' + k.email;
      if (ftrEmail)     ftrEmail.textContent  = k.email;
    }
  })();

})();
