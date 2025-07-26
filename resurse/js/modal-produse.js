document.addEventListener('DOMContentLoaded', () => {
    const produse = document.querySelectorAll('.produs');
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-produse';
    modalContainer.className = 'modal-produse';
    document.body.appendChild(modalContainer);

    // Funcție pentru crearea conținutului modalului
    function createModalContent(produs) {
        const nume = produs.querySelector('.val-nume').textContent;
        const pret = produs.querySelector('.val-pret').textContent;
        const gramaj = produs.querySelector('.val-gramaj').textContent;
        const dimensiune = produs.querySelector('.val-dimensiune').textContent;
        const tip = produs.querySelector('.val-tip').textContent;
        const materiale = produs.querySelector('.val-materiale').textContent;
        const categorie = produs.querySelector('.val-categorie').textContent;
        const imagine = produs.querySelector('img').src;

        return `
            <div class="modal-content">
                <span class="modal-close">×</span>
                <h3>${nume}</h3>
                <div class="modal-body">
                    <figure>
                        <img src="${imagine}" alt="${nume}" />
                    </figure>
                    <div class="modal-info">
                        <p><strong>Preț:</strong> ${pret} RON</p>
                        <p><strong>Gramaj:</strong> ${gramaj} g/m²</p>
                        <p><strong>Dimensiune:</strong> ${dimensiune}</p>
                        <p><strong>Tip:</strong> ${tip}</p>
                        <p><strong>Materiale:</strong> ${materiale}</p>
                        <p><strong>Categorie:</strong> ${categorie}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Adaugă event listener pentru fiecare produs
    produse.forEach(produs => {
        produs.addEventListener('click', (e) => {
            // Evită declanșarea modalului la click pe checkbox sau link
            if (e.target.closest('.selecteaza-cos') || e.target.closest('.product-link')) {
                return;
            }
            e.preventDefault(); // Previne orice comportament implicit
            modalContainer.innerHTML = createModalContent(produs);
            modalContainer.classList.add('show');
        });
    });

    // Închide modalul la click pe butonul de închidere
    modalContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-produse')) {
            modalContainer.classList.remove('show');
            modalContainer.innerHTML = '';
        }
    });

    // Închide modalul la apăsarea tastei Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('show')) {
            modalContainer.classList.remove('show');
            modalContainer.innerHTML = '';
        }
    });
});