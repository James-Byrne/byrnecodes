(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var header = document.getElementById('site-header');
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
  if (!header || !toggle || !nav) return;

  var isOpen = function () { return header.dataset.menu === 'open'; };

  var setOpen = function (open) {
    header.dataset.menu = open ? 'open' : 'closed';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', function () { setOpen(!isOpen()); });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !isOpen()) return;
    setOpen(false);
    if (toggle.focus) toggle.focus();
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('a')) setOpen(false);
  });
})();
