// JavaScript pentru funcționalitatea galeriei
class Gallery {
    constructor() {
        this.init()
    }

    init() {
        this.setupModal()
        this.setupImageClick()
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
                modalImage.src = img.src
                modalImage.alt = img.alt
                
                // Folosește alt-ul imaginii ca titlu, sau lasă gol
                modalTitle.textContent = img.alt || ""
                modalDescription.textContent = ""
                
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