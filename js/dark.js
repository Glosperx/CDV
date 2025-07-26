// CDV Print - Dark Mode Manager cu sincronizare
// Aplică tema imediat pentru a evita flash-ul
(function() {
  const storageKey = 'cdv-theme';
  const savedTheme = localStorage.getItem(storageKey);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  }
})();

class DarkModeManager {
  constructor() {
    this.storageKey = 'cdv-theme'
    this.darkClass = 'dark'
    this.init()
  }

  init() {
    this.loadTheme()
    this.createToggleButton()
    this.setupSystemThemeListener()
    this.setupStorageListener()
    this.setupBroadcastListener()
  }

  // Încarcă tema salvată sau detectează preferința sistemului
  loadTheme() {
    const savedTheme = localStorage.getItem(this.storageKey)
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      this.enableDarkMode()
    } else {
      this.enableLightMode()
    }
  }

  // Creează butonul pentru toggle dark mode
  createToggleButton() {
    // Verifică dacă butonul există deja
    if (document.getElementById('dark-mode-toggle')) return

    const toggleButton = document.createElement('button')
    toggleButton.id = 'dark-mode-toggle'
    toggleButton.className = 'fixed top-20 right-4 z-[20] bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:scale-110'
    toggleButton.setAttribute('aria-label', 'Toggle dark mode')
    toggleButton.innerHTML = `
      <svg class="w-5 h-5 sun-icon hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
      <svg class="w-5 h-5 moon-icon block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
    `

    // Event listener pentru toggle
    toggleButton.addEventListener('click', () => {
      this.toggleTheme()
    })

    // Adaugă butonul în pagină
    document.body.appendChild(toggleButton)
  }

  // Ascultă pentru schimbări în preferința sistemului
  setupSystemThemeListener() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Doar dacă utilizatorul nu a setat manual o preferință
      if (!localStorage.getItem(this.storageKey)) {
        if (e.matches) {
          this.enableDarkMode()
        } else {
          this.enableLightMode()
        }
      }
    })
  }

  // Ascultă pentru schimbări în localStorage din alte tab-uri/ferestre
  setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        const newTheme = e.newValue
        if (newTheme === 'dark') {
          this.enableDarkMode()
        } else if (newTheme === 'light') {
          this.enableLightMode()
        } else if (newTheme === null) {
          // Tema a fost resetată, verifică preferința sistemului
          this.loadTheme()
        }
      }
    })
  }

  // Toggle între dark și light mode
  toggleTheme() {
    if (this.isDarkMode()) {
      this.enableLightMode()
      localStorage.setItem(this.storageKey, 'light')
    } else {
      this.enableDarkMode()
      localStorage.setItem(this.storageKey, 'dark')
    }
    
    // Sincronizează cu alte ferestre deschise
    this.broadcastThemeChange()
  }

  // Verifică dacă dark mode este activ
  isDarkMode() {
    return document.documentElement.classList.contains(this.darkClass)
  }

  // Activează dark mode
  enableDarkMode() {
    document.documentElement.classList.add(this.darkClass)
    this.injectDarkStyles()
    this.dispatchThemeChange('dark')
  }

  // Activează light mode
  enableLightMode() {
    document.documentElement.classList.remove(this.darkClass)
    this.removeDarkStyles()
    this.dispatchThemeChange('light')
  }

  // Broadcast tema către alte ferestre (pentru sincronizare imediată)
  broadcastThemeChange() {
    // Folosește BroadcastChannel pentru comunicare între tab-uri
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('cdv-theme-sync')
      channel.postMessage({
        type: 'theme-change',
        theme: this.getCurrentTheme()
      })
      channel.close()
    }
    
    // Fallback: trigger storage event manual pentru ferestre din același domeniu
    window.dispatchEvent(new StorageEvent('storage', {
      key: this.storageKey,
      newValue: localStorage.getItem(this.storageKey),
      url: window.location.href
    }))
  }

  // Ascultă pentru mesajele de broadcast
  setupBroadcastListener() {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('cdv-theme-sync')
      channel.addEventListener('message', (event) => {
        if (event.data.type === 'theme-change') {
          const newTheme = event.data.theme
          if (newTheme === 'dark' && !this.isDarkMode()) {
            this.enableDarkMode()
          } else if (newTheme === 'light' && this.isDarkMode()) {
            this.enableLightMode()
          }
        }
      })
    }
  }

  // Injectează stilurile pentru dark mode
  injectDarkStyles() {
    // Verifică dacă stilurile există deja
    if (document.getElementById('cdv-dark-styles')) return

    const darkStyles = document.createElement('style')
    darkStyles.id = 'cdv-dark-styles'
    darkStyles.textContent = `
      /* Dark Mode Styles pentru CDV Print */
      .dark {
        color-scheme: dark;
      }
      
      .dark body {
        background-color: #111827;
        color: #f9fafb;
      }
      
      /* Header */
      .dark header {
        background-color: #1f2937;
        border-bottom: 1px solid #374151;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      /* Backgrounds */
      .dark .bg-white {
        background-color: #1f2937;
        color: #f9fafb;
      }
      
      .dark .bg-gray-50 {
        background-color: #111827;
      }
      
      .dark .bg-gray-100 {
        background-color: #1f2937;
      }
      
      /* Text Colors */
      .dark .text-gray-700 {
        color: #d1d5db;
      }
      
      .dark .text-gray-600 {
        color: #9ca3af;
      }
      
      .dark .text-gray-800 {
        color: #f3f4f6;
      }
      
      .dark .text-gray-900 {
        color: #f9fafb;
      }
      
      .dark .text-gray-300 {
        color: #d1d5db;
      }
      
      .dark .text-gray-400 {
        color: #9ca3af;
      }
      
      .dark .text-blue-custom {
        color: #60a5fa;
      }
      
      /* Borders */
      .dark .border-gray-200 {
        border-color: #374151;
      }
      
      .dark .border-gray-300 {
        border-color: #4b5563;
      }
      
      /* Shadows */
      .dark .shadow-md {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
      }
      
      .dark .shadow-lg {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
      }
      
      .dark .shadow-xl {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
      }
      
      .dark .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }
      
      /* Hover Effects */
      .dark .hover\\:bg-gray-50:hover {
        background-color: #374151;
      }
      
      .dark .hover\\:bg-gray-100:hover {
        background-color: #4b5563;
      }
      
      .dark .hover\\:shadow-xl:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
      }
      
      .dark .hover\\:shadow-2xl:hover {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }
      
      /* Service Cards */
      .dark .service-card {
        background-color: #1f2937;
        border: 1px solid #374151;
      }
      
      .dark .service-card:hover {
        background-color: #374151;
        border-color: #4b5563;
      }
      
      /* Footer */
      .dark footer {
        background: linear-gradient(to right, #111827, #1f2937);
      }
      
      /* Gradients */
      .dark .bg-gradient-to-br {
        background: linear-gradient(to bottom right, #1f2937, #111827);
      }
      
      .dark .bg-gradient-to-r.from-gray-50.to-slate-100 {
        background: linear-gradient(to right, #1f2937, #111827);
      }
      
      .dark .bg-gradient-to-r.from-slate-50.to-gray-100 {
        background: linear-gradient(to right, #1f2937, #111827);
      }
      
      .dark .bg-gradient-to-r.from-slate-800.to-gray-900 {
        background: linear-gradient(to right, #0f172a, #111827);
      }
      
      /* Patterns */
      .dark .pattern-dots {
        background-image: radial-gradient(circle, rgba(156, 163, 175, 0.15) 1px, transparent 1px);
      }
      
      /* Forms */
      .dark input,
      .dark textarea,
      .dark select {
        background-color: #374151;
        border-color: #4b5563;
        color: #f9fafb;
      }
      
      .dark input:focus,
      .dark textarea:focus,
      .dark select:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        background-color: #4b5563;
      }
      
      .dark input::placeholder,
      .dark textarea::placeholder {
        color: #9ca3af;
      }
      
      /* Special backgrounds */
      .dark .bg-white.bg-opacity-95 {
        background-color: rgba(31, 41, 55, 0.95);
      }
      
      /* Hero section - păstrează culoarea albastră */
      .dark .hero-gradient {
        background: #3b82f6;
      }
      
      /* Service sections - background albastru consistent */
      .dark .service-section,
      .dark .services-text-section {
        background-color: #3b82f6;
        color: #ffffff;
      }

      .dark .service-section h3,
      .dark .services-text-section h3 {
        color: #ffffff;
      }

      .dark .service-section p,
      .dark .services-text-section p {
        color: #e5e7eb;
      }

      /* Pentru secțiunile cu text despre servicii */
      .dark .flyere-section,
      .dark .materiale-section,
      .dark .standuri-section {
        background-color: #3b82f6;
        color: #ffffff;
      }
      
      /* Buttons - păstrează culorile originale pentru butoanele colorate */
      .dark .bg-primary-blue {
        background-color: #3b82f6;
      }
      
      .dark .hover\\:bg-light-blue:hover {
        background-color: #60a5fa;
      }
      
      .dark .text-primary-blue {
        color: #60a5fa;
      }
      
      /* Mobile menu */
      .dark #mobile-menu {
        background-color: #1f2937;
        border-top: 1px solid #374151;
      }
      
      /* Animații smooth pentru tranziții */
      .dark * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }

      /* Produse suplimentare - păstrează background-ul albastru în dark mode */
      .dark .bg-gradient-to-br.from-primary-blue.to-light-blue,
      .dark .bg-gradient-to-br.from-light-blue.to-primary-blue,
      .dark .bg-gradient-to-br.from-primary-blue.to-dark-blue {
        background: linear-gradient(to bottom right, #3b82f6, #60a5fa);
        color: #ffffff;
      }

      .dark .bg-gradient-to-br.from-primary-blue.to-light-blue h4,
      .dark .bg-gradient-to-br.from-light-blue.to-primary-blue h4,
      .dark .bg-gradient-to-br.from-primary-blue.to-dark-blue h4 {
        color: #ffffff;
      }

      .dark .bg-gradient-to-br.from-primary-blue.to-light-blue p,
      .dark .bg-gradient-to-br.from-light-blue.to-primary-blue p,
      .dark .bg-gradient-to-br.from-primary-blue.to-dark-blue p {
        color: #e5e7eb;
      }

      /* Hover effects pentru produse suplimentare în dark mode */
      .dark .bg-gradient-to-br.from-primary-blue.to-light-blue:hover,
      .dark .bg-gradient-to-br.from-light-blue.to-primary-blue:hover,
      .dark .bg-gradient-to-br.from-primary-blue.to-dark-blue:hover {
        background: linear-gradient(to bottom right, #2563eb, #3b82f6);
        transform: scale(1.05);
      }

      /* Prevent flash of unstyled content */
      html:not(.dark) .dark\\:block {
        display: none !important;
      }
      
      html.dark .dark\\:hidden {
        display: none !important;
      }
    `
    
    document.head.appendChild(darkStyles)
  }

  // Elimină stilurile pentru dark mode
  removeDarkStyles() {
    const darkStyles = document.getElementById('cdv-dark-styles')
    if (darkStyles) {
      darkStyles.remove()
    }
  }

  // Dispatch event pentru schimbarea temei (pentru alte componente)
  dispatchThemeChange(theme) {
    const event = new CustomEvent('themeChanged', {
      detail: { theme, isDark: theme === 'dark' }
    })
    document.dispatchEvent(event)
  }

  // Metode publice pentru API
  getCurrentTheme() {
    return this.isDarkMode() ? 'dark' : 'light'
  }

  setTheme(theme) {
    if (theme === 'dark') {
      this.enableDarkMode()
      localStorage.setItem(this.storageKey, 'dark')
    } else if (theme === 'light') {
      this.enableLightMode()
      localStorage.setItem(this.storageKey, 'light')
    }
    this.broadcastThemeChange()
  }

  resetToSystemPreference() {
    localStorage.removeItem(this.storageKey)
    this.loadTheme()
    this.broadcastThemeChange()
  }
}

// Inițializare automată
let darkModeManager = null

document.addEventListener('DOMContentLoaded', () => {
  darkModeManager = new DarkModeManager()
})

// Export pentru utilizare în alte scripturi
window.DarkMode = {
  toggle: () => darkModeManager?.toggleTheme(),
  setTheme: (theme) => darkModeManager?.setTheme(theme),
  getCurrentTheme: () => darkModeManager?.getCurrentTheme(),
  resetToSystem: () => darkModeManager?.resetToSystemPreference(),
  isDark: () => darkModeManager?.isDarkMode()
}