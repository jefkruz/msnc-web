(function () {
  function closeSidebar() {
    document.getElementById('app-shell')?.classList.remove('sidebar-open');
  }

  function openSidebar() {
    document.getElementById('app-shell')?.classList.add('sidebar-open');
  }

  /** Keep DataTables S/N as 1..n (never database ids). */
  window.renumberDataTableSerial = function (api, columnIndex) {
    if (!api) {
      return;
    }
    columnIndex = typeof columnIndex === 'number' ? columnIndex : 0;
    var start = api.page.info().start || 0;
    api.rows({ page: 'current' }).every(function (rowIdx, tableLoop, rowLoop) {
      var node = this.node();
      if (!node) {
        return;
      }
      var cell = node.querySelector('td.js-row-sn') || node.children[columnIndex];
      if (cell) {
        cell.textContent = String(start + rowLoop + 1);
      }
    });
  };

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-app-sidebar-open]')) {
      event.preventDefault();
      openSidebar();
      return;
    }

    if (event.target.closest('[data-app-sidebar-close]')) {
      event.preventDefault();
      closeSidebar();
      return;
    }

    var groupBtn = event.target.closest('[data-app-nav-group]');
    if (groupBtn) {
      event.preventDefault();
      groupBtn.closest('.app-nav-group')?.classList.toggle('is-open');
      return;
    }

    // Close the drawer after choosing a page link on mobile.
    var navLink = event.target.closest('.app-sidebar__nav a.app-nav-link');
    if (navLink && window.innerWidth < 992) {
      closeSidebar();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeSidebar();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 992) {
      closeSidebar();
    }
  });
})();
