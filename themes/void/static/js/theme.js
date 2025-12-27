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

document.addEventListener('keydown', (e) => {
  // Escape 关闭菜单
  if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
    document.body.classList.remove('menu-open');
  }

  // M 键切换菜单（仅移动端视口，非输入状态）
  if (e.key === 'm' && window.innerWidth <= 1024 && !e.target.closest('input, textarea, [contenteditable]')) {
    toggleMenu();
  }
});
