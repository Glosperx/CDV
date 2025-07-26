// CDV Print - JavaScript pentru funcționalități site
class CDVPrintSite {
  constructor() {
    this.init()
  }

  init() {
    this.setupMobileMenu()
    this.setupSmoothScrolling()
    this.setupContactButtons()
    this.setupScrollEffects()
  }

  // Gestionare meniu mobil
  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn")
    const mobileMenu = document.getElementById("mobile-menu")

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden")

        // Schimbă iconița meniului
        const icon = mobileMenuBtn.querySelector("svg path")
        if (mobileMenu.classList.contains("hidden")) {
          icon.setAttribute("d", "M4 6h16M4 12h16M4 18h16")
        } else {
          icon.setAttribute("d", "M6 18L18 6M6 6l12 12")
        }
      })

      // Închide meniul când se dă click pe un link
      document.querySelectorAll("#mobile-menu a").forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.add("hidden")
          const icon = mobileMenuBtn.querySelector("svg path")
          icon.setAttribute("d", "M4 6h16M4 12h16M4 18h16")
        })
      })

      // Închide meniul când se dă click în afara lui
      document.addEventListener("click", (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenu.classList.add("hidden")
          const icon = mobileMenuBtn.querySelector("svg path")
          icon.setAttribute("d", "M4 6h16M4 12h16M4 18h16")
        }
      })
    }
  }

  // Smooth scrolling pentru navigare
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = anchor.getAttribute("href")
        const target = document.querySelector(targetId)

        if (target) {
          // Calculează offset pentru header sticky
          const headerHeight = document.querySelector("header").offsetHeight
          const targetPosition = target.offsetTop - headerHeight - 20

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  }

  // Configurare butoane de contact
  setupContactButtons() {
    // Datele de contact
    const contactData = {
      phone: "0723348280",
      email: "office@cdvprint.ro",
      whatsapp: "40723348280", // Codul de țară + numărul fără primul 0
    }

    // Buton WhatsApp
    const whatsappBtn = document.getElementById("whatsapp-btn")
    if (whatsappBtn) {
      whatsappBtn.addEventListener("click", () => {
        const message = encodeURIComponent(
          "Salut! Sunt interessat de serviciile CDV Print și aș dori să aflu mai multe detalii despre serviciile oferite.",
        )
        const whatsappUrl = `https://wa.me/${contactData.whatsapp}?text=${message}`
        window.open(whatsappUrl, "_blank")

        // Analytics tracking (opțional)
        this.trackContactAction("whatsapp")
      })
    }

    // Buton Email
    const emailBtn = document.getElementById("email-btn")
    if (emailBtn) {
      emailBtn.addEventListener("click", () => {
        const subject = encodeURIComponent("Solicitare informații - CDV Print")
        const body = encodeURIComponent(
          "Bună ziua,\n\nSunt interessat de serviciile CDV Print și aș dori să primesc mai multe detalii \nVă mulțumesc!\n\nCu stimă,",
        )
        const emailUrl = `mailto:${contactData.email}?cc=doru.cojoaca@gmail.com&subject=${subject}&body=${body}`
        window.location.href = emailUrl

        this.trackContactAction("email")
      })
    }

    // Buton Telefon
    const phoneBtn = document.getElementById("phone-btn")
    if (phoneBtn) {
      phoneBtn.addEventListener("click", () => {
        window.location.href = `tel:${contactData.phone}`
        this.trackContactAction("phone")
      })
    }

    // Buton Email secundar (doru.cojoaca@gmail.com)
    const emailSecondaryBtn = document.getElementById("email-secondary-btn")
    if (emailSecondaryBtn) {
      emailSecondaryBtn.addEventListener("click", () => {
        const subject = encodeURIComponent("Solicitare informații - CDV Print")
        const body = encodeURIComponent(
          "Bună ziua,\n\nSunt interessat de serviciile CDV Print și aș dori să aflu mai multe detalii despre un proiect.\n\nVă mulțumesc!\n\nCu stimă,",
        )
        const emailUrl = `mailto:doru.cojoaca@gmail.com?cc=office@cdvprint.ro&subject=${subject}&body=${body}`
        window.location.href = emailUrl

        this.trackContactAction("email_secondary")
      })
    }
  }

  // Efecte la scroll
  setupScrollEffects() {
    // Highlight pentru navigare activă
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll('nav a[href^="#"]')

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id")

          // Elimină clasa activă de la toate linkurile
          navLinks.forEach((link) => {
            link.classList.remove("text-primary-blue", "font-bold")
            link.classList.add("text-gray-700")
          })

          // Adaugă clasa activă la linkul curent
          const activeLink = document.querySelector(`nav a[href="#${currentId}"]`)
          if (activeLink) {
            activeLink.classList.remove("text-gray-700")
            activeLink.classList.add("text-primary-blue", "font-bold")
          }
        }
      })
    }, observerOptions)

    sections.forEach((section) => {
      observer.observe(section)
    })

    // Animații la scroll pentru carduri
    const cards = document.querySelectorAll(".bg-white")
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    cards.forEach((card) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(20px)"
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      cardObserver.observe(card)
    })
  }

  // Tracking pentru acțiuni de contact (opțional - pentru analytics)
  trackContactAction(action) {
    // Poți integra cu Google Analytics sau alt serviciu
    console.log(`Contact action: ${action}`)

    // Exemplu pentru Google Analytics (dacă îl folosești)
    if (window.gtag) {
      window.gtag("event", "contact_action", {
        event_category: "Contact",
        event_label: action,
        value: 1,
      })
    }
  }

  // Funcție pentru afișarea unui toast message (opțional)
  showToast(message, type = "info") {
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 transform translate-x-full ${
      type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
    }`
    toast.textContent = message

    document.body.appendChild(toast)

    // Animație de intrare
    setTimeout(() => {
      toast.classList.remove("translate-x-full")
    }, 100)

    // Eliminare automată după 3 secunde
    setTimeout(() => {
      toast.classList.add("translate-x-full")
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }
}

// Inițializare când DOM-ul este gata
document.addEventListener("DOMContentLoaded", () => {
  new CDVPrintSite()
})

// Funcții utilitare globale
window.CDVPrint = {
  // Funcție pentru scroll la o secțiune specifică
  scrollToSection: (sectionId) => {
    const target = document.querySelector(`#${sectionId}`)
    if (target) {
      const headerHeight = document.querySelector("header").offsetHeight
      const targetPosition = target.offsetTop - headerHeight - 20

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  },

  // Funcție pentru deschiderea WhatsApp cu mesaj personalizat
  openWhatsApp: (customMessage) => {
    const message = encodeURIComponent(customMessage || "Salut! Aș dori mai multe informații.")
    const whatsappUrl = `https://wa.me/40723348280?text=${message}`
    window.open(whatsappUrl, "_blank")
  },

  // Funcție pentru deschiderea email-ului cu subiect personalizat
  openEmail: (subject, body) => {
    const emailSubject = encodeURIComponent(subject || "Solicitare informații - CDV Print")
    const emailBody = encodeURIComponent(body || "Bună ziua,\n\nSunt interessat de serviciile CDV Print.\n\nCu stimă,")
    const emailUrl = `mailto:office@cdvprint.ro?cc=doru.cojoaca@gmail.com&subject=${emailSubject}&body=${emailBody}`
    window.location.href = emailUrl
  },
}