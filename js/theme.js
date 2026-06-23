/**
 * BHAR India – Theme Manager
 * Handles dark/light mode toggle with localStorage persistence
 * File: js/theme.js
 */

const ThemeManager = (() => {
  // v2 starts every existing visitor with the new light-mode default once.
  // Any theme they choose manually after that is remembered normally.
  const STORAGE_KEY = 'bhar-theme-v2';
  const DARK = 'dark';
  const LIGHT = 'light';

  // Icons for toggle button
  const MOON_ICON = '🌙';
  const SUN_ICON  = '☀️';

  /** Get saved preference, fallback to the website's light theme */
  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return LIGHT;
  }

  /** Apply theme to <html> element */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update all toggle buttons on page
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === DARK ? SUN_ICON : MOON_ICON;
      btn.setAttribute('aria-label', theme === DARK ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.title = theme === DARK ? 'Light Mode' : 'Dark Mode';
    });
    localStorage.setItem(STORAGE_KEY, theme);
  }

  /** Toggle between dark and light */
  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    applyTheme(current === DARK ? LIGHT : DARK);
  }

  /** Init: apply saved theme and bind click events */
  function init() {
    applyTheme(getSavedTheme());
    // Bind toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle, applyTheme };
})();

// Auto-init
document.addEventListener('DOMContentLoaded', ThemeManager.init);
