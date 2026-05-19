/**
 * router.js — Hash-based SPA Router
 */

const Router = (() => {
  const routes = {};
  let currentPage = null;
  let history = [];

  function register(name, handler) {
    routes[name] = handler;
  }

  async function navigate(page, params = {}, pushHistory = true) {
    if (currentPage === page && JSON.stringify(params) === '{}') return;

    const handler = routes[page];
    if (!handler) {
      console.warn(`Route "${page}" tidak ditemukan, redirect ke home.`);
      return navigate('home');
    }

    // Animasi keluar
    const view = document.getElementById('app-view');
    view.classList.add('page-exit');

    await new Promise(r => setTimeout(r, 180));

    view.innerHTML = '';
    view.classList.remove('page-exit');
    view.classList.add('page-enter');

    currentPage = page;
    if (pushHistory) history.push({ page, params });

    // Update bottom nav
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.page === page);
    });

    await handler(view, params);

    requestAnimationFrame(() => {
      view.classList.remove('page-enter');
    });

    // Update hash
    window.location.hash = `#${page}`;
    view.scrollTop = 0;
  }

  function goBack() {
    if (history.length > 1) {
      history.pop();
      const prev = history[history.length - 1];
      navigate(prev.page, prev.params, false);
    } else {
      navigate('home', {}, false);
    }
  }

  function init() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1) || 'home';
      const mainPages = ['home', 'berita', 'pengumuman', 'layanan', 'profil', 'kontak'];
      if (mainPages.includes(hash)) navigate(hash);
    });
  }

  return { register, navigate, goBack, init, getCurrentPage: () => currentPage };
})();
