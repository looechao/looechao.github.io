function toggleTheme() {
  const html = document.documentElement;
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';

  html.dataset.theme = next;
  html.style.colorScheme = next;
  localStorage.setItem('theme', next);

  // Update giscus theme if present
  const giscus = document.querySelector('iframe.giscus-frame');
  if (giscus) {
    giscus.contentWindow.postMessage(
      { giscus: { setConfig: { theme: next } } },
      'https://giscus.app'
    );
  }
}

function toggleMenu() {
  document.body.classList.toggle('menu-open');
}
