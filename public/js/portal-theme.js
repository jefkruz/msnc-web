(function () {
  var STORAGE_KEY = 'mca_theme';

  function preferredTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (e) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.colorScheme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var material = btn.querySelector('.material-symbols-outlined');
      if (material) {
        material.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
      } else {
        var icon = btn.querySelector('i');
        if (icon) {
          icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
      }
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = theme === 'dark' ? 'Light mode' : 'Dark mode';
    });
  }

  function currentTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  window.MCATheme = {
    apply: applyTheme,
    toggle: function () {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    },
    hydrate: function () {
      applyTheme(preferredTheme());
    },
  };

  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-theme-toggle]');
    if (toggle) {
      event.preventDefault();
      window.MCATheme.toggle();
    }

    var menuBtn = event.target.closest('[data-public-menu]');
    if (menuBtn) {
      event.preventDefault();
      var panel = document.querySelector('[data-public-mobile-nav]');
      if (panel) {
        panel.classList.toggle('open');
      }
    }
  });
})();
