// CDV Print - Dark Mode Manager cu sincronizare între tab-uri
//
// Stilurile dark trăiau aici, într-un string de ~260 de linii injectat în <head>
// la DOMContentLoaded. Acum sunt în src/input.css și intră în bundle-ul CSS, deci
// sunt prezente înainte de prima pictare. Aplicarea clasei `.dark` se face din
// js/theme-init.js, încărcat sincron din <head>.

const STORAGE_KEY = 'cdv-theme'
const DARK_CLASS = 'dark'
const CHANNEL_NAME = 'cdv-theme-sync'

class DarkModeManager {
  constructor() {
    this.channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null
    this.init()
  }

  init() {
    this.loadTheme()
    this.setupToggleButton()
    this.setupSystemThemeListener()
    this.setupStorageListener()
    this.setupBroadcastListener()
  }

  loadTheme() {
    const saved = this.readStored()
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    this.applyTheme(saved === 'dark' || (!saved && systemPrefersDark) ? 'dark' : 'light')
  }

  // Butonul există în markup-ul fiecărei pagini (în header). Îl creăm dinamic
  // doar ca rezervă, dacă lipsește — altfel apărea un salt de layout la load.
  setupToggleButton() {
    let button = document.getElementById('dark-mode-toggle')

    if (!button) {
      button = document.createElement('button')
      button.id = 'dark-mode-toggle'
      button.type = 'button'
      button.className =
        'fixed bottom-4 right-4 z-40 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-600'
      button.setAttribute('aria-label', 'Comută între tema deschisă și întunecată')
      button.textContent = '◐'
      document.body.appendChild(button)
    }

    button.addEventListener('click', () => this.toggleTheme())
  }

  setupSystemThemeListener() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Doar dacă utilizatorul nu a ales manual o temă
      if (!this.readStored()) {
        this.applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  // Schimbări de temă din alte tab-uri. Evenimentul `storage` este, prin
  // specificație, cross-tab; nu îl mai declanșăm manual în fereastra curentă
  // (cum se făcea înainte), pentru că producea muncă dublă.
  setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key !== STORAGE_KEY) return
      if (e.newValue === 'dark' || e.newValue === 'light') {
        this.applyTheme(e.newValue)
      } else {
        this.loadTheme()
      }
    })
  }

  setupBroadcastListener() {
    if (!this.channel) return
    this.channel.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'theme-change') {
        this.applyTheme(event.data.theme)
      }
    })
  }

  toggleTheme() {
    const next = this.isDarkMode() ? 'light' : 'dark'
    this.setTheme(next)
  }

  isDarkMode() {
    return document.documentElement.classList.contains(DARK_CLASS)
  }

  applyTheme(theme) {
    const wantsDark = theme === 'dark'
    if (wantsDark === this.isDarkMode()) return // deja aplicată

    document.documentElement.classList.toggle(DARK_CLASS, wantsDark)
    document.dispatchEvent(
      new CustomEvent('themeChanged', { detail: { theme, isDark: wantsDark } })
    )
  }

  setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return
    this.applyTheme(theme)
    this.writeStored(theme)
    if (this.channel) {
      this.channel.postMessage({ type: 'theme-change', theme })
    }
  }

  getCurrentTheme() {
    return this.isDarkMode() ? 'dark' : 'light'
  }

  resetToSystemPreference() {
    this.writeStored(null)
    this.loadTheme()
    if (this.channel) {
      this.channel.postMessage({ type: 'theme-change', theme: this.getCurrentTheme() })
    }
  }

  // localStorage poate arunca în mod privat sau cu cookies blocate
  readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch (e) {
      return null
    }
  }

  writeStored(value) {
    try {
      if (value === null) localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, value)
    } catch (e) {
      // preferința nu persistă, dar tema curentă rămâne aplicată
    }
  }
}

let darkModeManager = null

document.addEventListener('DOMContentLoaded', () => {
  darkModeManager = new DarkModeManager()
})

window.DarkMode = {
  toggle: () => darkModeManager?.toggleTheme(),
  setTheme: (theme) => darkModeManager?.setTheme(theme),
  getCurrentTheme: () => darkModeManager?.getCurrentTheme(),
  resetToSystem: () => darkModeManager?.resetToSystemPreference(),
  isDark: () => darkModeManager?.isDarkMode(),
}
