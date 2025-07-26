// JavaScript pentru funcționalitatea galeriei
class Gallery {
  constructor() {
    this.init()
  }

  init() {
    this.setupFilters()
    this.setupModal()
    this.setupImageClick()
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn")
    const galleryItems = document.querySelectorAll(".gallery-item")

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter")

        // Actualizează butoanele active
        filterButtons.forEach((btn) => {
          btn.classList.remove("active", "bg-primary-blue", "text-white")
          btn.classList.add("bg-white", "text-gray-700")
        })

        button.classList.add("active", "bg-primary-blue", "text-white")
        button.classList.remove("bg-white", "text-gray-700")

        // Filtrează elementele
        galleryItems.forEach((item) => {
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            item.style.display = "block"
            item.style.opacity = "0"
            setTimeout(() => {
              item.style.opacity = "1"
            }, 100)
          } else {
            item.style.opacity = "0"
            setTimeout(() => {
              item.style.display = "none"
            }, 300)
          }
        })
      })
    })
  }

  setupModal() {
    const modal = document.getElementById("imageModal")
    const modalImage = document.getElementById("modalImage")
    const modalTitle = document.getElementById("modalTitle")
    const modalDescription = document.getElementById("modalDescription")
    const closeModal = document.getElementById("closeModal")

    // Închide modalul
    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden")
      document.body.style.overflow = "auto"
    })

    // Închide modalul la click pe fundal
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden")
        document.body.style.overflow = "auto"
      }
    })

    // Închide modalul cu ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden")
        document.body.style.overflow = "auto"
      }
    })
  }

  setupImageClick() {
    const galleryItems = document.querySelectorAll(".gallery-item img")
    const modal = document.getElementById("imageModal")
    const modalImage = document.getElementById("modalImage")
    const modalTitle = document.getElementById("modalTitle")
    const modalDescription = document.getElementById("modalDescription")

    galleryItems.forEach((img) => {
      img.addEventListener("click", () => {
        const title = img.closest(".gallery-item").querySelector("h3").textContent
        const description = img.closest(".gallery-item").querySelector("p").textContent

        modalImage.src = img.src
        modalImage.alt = img.alt
        modalTitle.textContent = title
        modalDescription.textContent = description

        modal.classList.remove("hidden")
        document.body.style.overflow = "hidden"
      })
    })
  }
}

// Inițializează galeria când DOM-ul este gata
document.addEventListener("DOMContentLoaded", () => {
  new Gallery()
})
