// Front-End Starter – Vanilla JS utilities
(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const modal = document.getElementById('demoModal');
  const openModalBtn = document.getElementById('openModal');
  const toast = document.getElementById('toast');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('navMenu');

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // THEME
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    root.setAttribute('data-theme', storedTheme);
  }
  function nextTheme(){
    const current = root.getAttribute('data-theme') || 'auto';
    if (current === 'light') return 'dark';
    if (current === 'dark') return 'light';
    // auto -> pick opposite of preferred
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'light' : 'dark';
  }
  function applyTheme(theme){
    if (theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  themeToggle?.addEventListener('click', () => applyTheme(nextTheme()));

  // NAV – mobile menu
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('is-open', !expanded);
    navMenu.setAttribute('aria-expanded', String(!expanded));
  });

  // MODAL
  function setupModal(){
    openModalBtn?.addEventListener('click', () => {
      try { modal.showModal(); } catch { modal.setAttribute('open',''); }
    });
    modal?.querySelector('[data-close-modal]')?.addEventListener('click', () => {
      try { modal.close(); } catch { modal.removeAttribute('open'); }
    });
  }

  // TOAST
  let toastTimer;
  function showToast(msg='Action completed'){
    if (!toast) return;
    toast.querySelector('span').textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toast.hidden = true, 2200);
  }
  document.getElementById('showToast')?.addEventListener('click', () => showToast('Here's your toast!'));

  // TABS (ARIA pattern)
  function setupTabs(){
    document.querySelectorAll('[data-tabs]').forEach(tabset => {
      const tabs = tabset.querySelectorAll('[role="tab"]');
      const panels = tabset.querySelectorAll('[role="tabpanel"]');
      function activate(idx){
        tabs.forEach((t, i) => {
          const selected = i === idx;
          t.setAttribute('aria-selected', String(selected));
          if (selected) t.focus();
        });
        panels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
      }
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => activate(i));
        t.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') activate((i+1)%tabs.length);
          if (e.key === 'ArrowLeft') activate((i-1+tabs.length)%tabs.length);
        });
      });
    });
  }

  // FORM VALIDATION
  function setupFormValidation(){
    const form = document.getElementById('contactForm');
    if (!form) return;
    const fields = Array.from(form.querySelectorAll('input, textarea'));
    function validateField(el){
      const msgEl = el.parentElement.querySelector('.error');
      let message = '';
      if (el.validity.valueMissing) message = 'This field is required.';
      else if (el.validity.tooShort) message = `Please enter at least ${el.getAttribute('minlength')} characters.`;
      else if (el.type === 'email' && el.validity.typeMismatch) message = 'Please enter a valid email address.';
      msgEl.textContent = message;
      return !message;
    }
    fields.forEach(el => {
      el.addEventListener('input', () => validateField(el));
      el.addEventListener('blur', () => validateField(el));
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = fields.every(validateField);
      if (ok) {
        showToast('Form submitted ✅');
        form.reset();
      }
    });
  }

  // INIT
  setupModal();
  setupTabs();
  setupFormValidation();

  // Export for inline code sample (no global leak)
  window.__starter = { applyTheme, nextTheme };
})();
