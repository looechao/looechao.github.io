function toggleTheme() {
  const html = document.documentElement;
  const current = html.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';

  html.dataset.theme = next;
  localStorage.setItem('theme', next);

  // Update giscus theme if present
  const giscus = document.querySelector('iframe.giscus-frame');
  if (giscus) {
    giscus.contentWindow.postMessage(
      { giscus: { setConfig: { theme: next === 'dark' ? 'dark' : 'light' } } },
      'https://giscus.app'
    );
  }
}
