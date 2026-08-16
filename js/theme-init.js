// Aplică tema înainte de prima pictare, ca să nu apară flash alb pe dark mode.
//
// Trebuie să ruleze din <head>, sincron. Înainte, acest cod era un IIFE la
// începutul lui dark.js — care e încărcat la sfârșitul lui <body>, deci rula
// după ce pagina fusese deja pictată și nu putea preveni flash-ul.
//
// Fișier separat (nu inline) ca CSP-ul din .htaccess să rămână `script-src 'self'`,
// fără 'unsafe-inline'.
;(function () {
  try {
    var saved = localStorage.getItem('cdv-theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    }
  } catch (e) {
    // localStorage poate fi blocat (mod privat, cookies dezactivate) — rămâne light
  }
})()
