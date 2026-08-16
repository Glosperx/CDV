// CDV Print - JavaScript pentru funcționalități site
class CDVPrintSite {
  constructor() {
    this.init()
  }

  init() {
    this.setupMobileMenu()
    this.setupSmoothScrolling()
    this.setupContactTracking()
    this.setupScrollEffects()
    this.updateCopyrightYear()
  }

  // Actualizare automată a anului în footer
  updateCopyrightYear() {
    const el = document.getElementById('copyright-year')
    if (el) {
      el.textContent = `© ${new Date().getFullYear()} CDV Print`
    }
  }

  // Gestionare meniu mobil
  setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn')
    const menu = document.getElementById('mobile-menu')
    if (!btn || !menu) return

    const icon = btn.querySelector('svg path')
    const ICON_OPEN = 'M6 18L18 6M6 6l12 12'
    const ICON_CLOSED = 'M4 6h16M4 12h16M4 18h16'

    const setOpen = (open) => {
      menu.classList.toggle('hidden', !open)
      btn.setAttribute('aria-expanded', String(open))
      btn.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul')
      if (icon) icon.setAttribute('d', open ? ICON_OPEN : ICON_CLOSED)
    }

    btn.addEventListener('click', () => {
      setOpen(menu.classList.contains('hidden'))
    })

    // Închide meniul după navigare
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false))
    })

    // Închide la click în afara meniului
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) setOpen(false)
    })

    // Închide cu Escape și readu focusul pe buton
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
        setOpen(false)
        btn.focus()
      }
    })
  }

  // Smooth scrolling pentru navigare
  setupSmoothScrolling() {
    const header = document.querySelector('header')

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href')

        // "#" singur sau ancoră inexistentă: lasă browserul să decidă,
        // altfel linkul ar rămâne mort după preventDefault().
        if (!targetId || targetId === '#') return

        const target = document.querySelector(targetId)
        if (!target) return

        e.preventDefault()
        const headerHeight = header ? header.offsetHeight : 0
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - headerHeight - 20,
          behavior: 'smooth',
        })
      })
    })
  }

  // Butoanele de contact sunt linkuri <a> obișnuite (funcționează fără JS).
  // Aici doar înregistrăm acțiunea pentru analytics.
  setupContactTracking() {
    const targets = {
      'whatsapp-btn': 'whatsapp',
      'email-btn': 'email',
      'email-secondary-btn': 'email_secondary',
      'phone-btn': 'phone',
    }

    Object.entries(targets).forEach(([id, action]) => {
      const el = document.getElementById(id)
      if (el) el.addEventListener('click', () => this.trackContactAction(action))
    })
  }

  // Efecte la scroll
  setupScrollEffects() {
    // Highlight pentru navigare activă
    const sections = document.querySelectorAll('section[id]')
    const navLinks = document.querySelectorAll('nav a[href^="#"]')

    if (sections.length && navLinks.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const currentId = entry.target.getAttribute('id')

            navLinks.forEach((link) => {
              link.classList.remove('text-primary-blue', 'font-bold')
              link.classList.add('text-gray-700')
            })

            const activeLink = document.querySelector(`nav a[href="#${currentId}"]`)
            if (activeLink) {
              activeLink.classList.remove('text-gray-700')
              activeLink.classList.add('text-primary-blue', 'font-bold')
            }
          })
        },
        { root: null, rootMargin: '-20% 0px -80% 0px', threshold: 0 }
      )

      sections.forEach((section) => observer.observe(section))
    }

    // Animație de intrare pentru carduri.
    //
    // Selectorul era `.bg-white`, care prindea și <body> și <header> (ambele au
    // clasa) și le punea opacity:0 — de aici flash-ul de pagină invizibilă și
    // riscul de ecran alb dacă scriptul se oprea înainte de observer.
    // Acum țintim explicit doar cardurile.
    const cards = document.querySelectorAll('[data-animate]')
    if (!cards.length) return

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
            cardObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    cards.forEach((card) => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(20px)'
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      cardObserver.observe(card)
    })
  }

  // Tracking pentru acțiuni de contact (dacă Google Analytics e prezent)
  trackContactAction(action) {
    if (window.gtag) {
      window.gtag('event', 'contact_action', {
        event_category: 'Contact',
        event_label: action,
        value: 1,
      })
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CDVPrintSite()
})

// Funcții utilitare globale
window.CDVPrint = {
  scrollToSection: (sectionId) => {
    const target = document.getElementById(sectionId)
    if (!target) return
    const header = document.querySelector('header')
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 20,
      behavior: 'smooth',
    })
  },
}
