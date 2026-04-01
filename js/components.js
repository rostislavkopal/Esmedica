/**
 * components.js — načítání sdílených HTML komponent (nav, footer).
 *
 * Použití v HTML:
 *   <div id="site-nav"></div>
 *   <div id="site-footer"></div>
 *   <script src="./js/components.js"></script>
 *
 * Aktivní odkaz v navigaci se nastaví automaticky podle aktuálního souboru.
 * Kontaktní údaje ve footeru přepíše DataService (pokud je načten).
 */

(async function () {

  // ─── Pomocná funkce: fetch HTML fragmentu ─────────────────────────────────
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

  // ─── Navigace ─────────────────────────────────────────────────────────────
  await loadComponent('site-nav', './components/nav.html');

  // Nastav aktivní odkaz podle aktuálního souboru
  const page = location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
  const navMap = {
    index:        'home',
    index2:       'home',
    index3:       'home',
    mapa:         'home',
    mapa2:        'home',
    mapa3:        'home',
    poskytujeme:  'poskytujeme',
    cenik:        'cenik',
    medevio:      'medevio',
  };
  const activeKey = navMap[page];
  if (activeKey) {
    const link = document.querySelector(`[data-nav="${activeKey}"]`);
    if (link) {
      link.classList.remove('text-gray-600', 'dark:text-slate-400', 'hover:text-gray-800',
        'dark:hover:text-slate-200', 'hover:bg-gray-100', 'dark:hover:bg-slate-700');
      link.classList.add('bg-brand/10', 'dark:bg-brand/20', 'text-brand');
    }
  }

  // ─── Footer ───────────────────────────────────────────────────────────────
  await loadComponent('site-footer', './components/footer.html');

  // Aktualizuj kontaktní údaje z DataService (pokud je dostupný)
  if (typeof DataService !== 'undefined' && DataService.hasCustom('kontakt')) {
    const k = await DataService.getKontakt();
    const ftrAddr      = document.getElementById('ftr-address');
    const ftrPhoneLink = document.getElementById('ftr-phone-link');
    const ftrPhone     = document.getElementById('ftr-phone');
    const ftrEmailLink = document.getElementById('ftr-email-link');
    const ftrEmail     = document.getElementById('ftr-email');
    if (ftrAddr)      ftrAddr.textContent       = k.address;
    if (ftrPhoneLink) ftrPhoneLink.href          = 'tel:' + k.phone.replace(/\s/g, '');
    if (ftrPhone)     ftrPhone.textContent       = k.phone;
    if (ftrEmailLink) ftrEmailLink.href          = 'mailto:' + k.email;
    if (ftrEmail)     ftrEmail.textContent       = k.email;
  }

})();
