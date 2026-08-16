// JavaScript pentru funcționalitatea galeriei
class Gallery {
  constructor() {
    this.modal = document.getElementById('imageModal')
    this.modalImage = document.getElementById('modalImage')
    this.modalTitle = document.getElementById('modalTitle')
    this.closeButton = document.getElementById('closeModal')
    this.lastFocused = null

    // Scriptul e inclus și pe pagini fără modal. Înainte, `closeModal.addEventListener`
    // arunca TypeError pe homepage; acum ieșim curat.
    if (!this.modal || !this.modalImage || !this.closeButton) return

    this.init()
  }

  init() {
    this.setupModal()
    this.setupTriggers()
  }

  setupModal() {
    this.closeButton.addEventListener('click', () => this.close())

    // Click pe fundal
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close()
    })

    document.addEventListener('keydown', (e) => {
      if (this.isOpen() && e.key === 'Escape') {
        this.close()
      }
    })

    // Focus trap: cât timp modalul e deschis, Tab rămâne pe butonul de închidere
    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        this.closeButton.focus()
      }
    })
  }

  setupTriggers() {
    document.querySelectorAll('.gallery-item button').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const img = trigger.querySelector('img')
        this.open({
          src: trigger.dataset.full || (img && img.currentSrc) || (img && img.src),
          alt: img ? img.alt : '',
          trigger,
        })
      })
    })
  }

  isOpen() {
    return !this.modal.classList.contains('hidden')
  }

  open({ src, alt, trigger }) {
    if (!src) return

    // Reținem elementul declanșator explicit, nu document.activeElement:
    // pe macOS Safari butoanele nu primesc focus la click, deci focusul
    // nu ar mai avea unde să se întoarcă la închidere.
    this.lastFocused = trigger || document.activeElement
    this.modalImage.src = src
    this.modalImage.alt = alt || ''
    if (this.modalTitle) this.modalTitle.textContent = alt || ''

    this.modal.classList.remove('hidden')
    this.modal.classList.add('flex')
    document.body.style.overflow = 'hidden'
    this.closeButton.focus()
  }

  close() {
    this.modal.classList.add('hidden')
    this.modal.classList.remove('flex')
    document.body.style.overflow = ''

    // Eliberează imaginea mare din memorie
    this.modalImage.removeAttribute('src')

    // Readu focusul pe imaginea din care s-a deschis modalul
    if (this.lastFocused && typeof this.lastFocused.focus === 'function') {
      this.lastFocused.focus()
    }
    this.lastFocused = null
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Gallery()
})
