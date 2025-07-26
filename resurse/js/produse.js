window.onload = function() {
    // Find maximum price from products
    let produse = document.getElementsByClassName("produs");
    if (produse.length === 0) {
        console.error("No products found with class 'produs'");
        return;
    }

    let pretMaxim = Math.max(...Array.from(produse).map(prod => {
        let pretElement = prod.getElementsByClassName("val-pret")[0];
        if (!pretElement) {
            console.error("Element with class 'val-pret' not found");
            return 0;
        }
        return parseFloat(pretElement.innerHTML) || 0;
    }));

    // Set range with the found maximum price
    let inpPret = document.getElementById("inp-pret");
    if(inpPret) {
        inpPret.max = pretMaxim;
        inpPret.value = 0;
        // Update displayed text for maximum price
        let labelPret = document.querySelector('label[for="inp-pret"]');
        if(labelPret) {
            labelPret.innerHTML = `
                <span>0 RON</span>
                <span>Preț minim: <span id="infoRange">0</span> RON</span>
                <span>${pretMaxim} RON</span>
            `;
        }
    }

// BONUS 7 - Function to remove diacritics (CORRECTED)
function eliminaDiacritice(text) {
    const diacritice = {
        'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
        'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T',
        'á': 'a', 'à': 'a', 'ä': 'a', 'ã': 'a',
        'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e',
        'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i',
        'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o',
        'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u',
        'ç': 'c', 'ñ': 'n',
        'Á': 'A', 'À': 'A', 'Ä': 'A', 'Ã': 'A',
        'É': 'E', 'È': 'E', 'Ë': 'E', 'Ê': 'E',
        'Í': 'I', 'Ì': 'I', 'Ï': 'I', 'Î': 'I',
        'Ó': 'O', 'Ò': 'O', 'Ö': 'O', 'Ô': 'O',
        'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Û': 'U',
        'Ç': 'C', 'Ñ': 'N'
    };
    
    return text.split('').map(char => diacritice[char] || char).join('');
}

function diferenteMax2(str1, str2) {
    if (!str1 || !str2) return 999; // Returnăm o valoare mare dacă unul din șiruri e invalid

    // Normalizare șiruri: elimină diacriticele și transformă în litere mici
    str1 = eliminaDiacritice(str1.toLowerCase().trim());
    str2 = eliminaDiacritice(str2.toLowerCase().trim());

    // Dacă șirul de căutare este gol sau unul este conținut în celălalt, returnăm 0
    if (str2 === "" || str1.includes(str2) || str2.includes(str1)) {
        console.log(`Match: "${str1}" includes "${str2}" or vice versa`);
        return 0; // Potrivire perfectă
    }

    // Lungimile șirurilor
    const len1 = str1.length;
    const len2 = str2.length;

    // Dacă diferența de lungime este prea mare, returnăm 999
    if (Math.abs(len1 - len2) > 3) {
        return 999;
    }

    // Numără diferențele de caractere
    let diferente = 0;
    const minLen = Math.min(len1, len2);

    // Verificăm caracterele poziție cu poziție
    for (let i = 0; i < minLen; i++) {
        if (str1[i] !== str2[i]) {
            diferente++;
        }
    }

    // Adaugă diferența de lungime
    diferente += Math.abs(len1 - len2);

    // Creștem toleranța la 3 diferențe (inclusiv înlocuiri sau lungime)
    console.log(`Comparing "${str1}" with "${str2}": differences = ${diferente}`);
    return diferente <= 3 ? diferente : 999;
}

   function filtreazaProduse() {
    console.log("Filtering started...");

    let inpNumeElem = document.getElementById("inp-nume");
    let inpPretElem = document.getElementById("inp-pret");
    let inpGramajElem = document.getElementById("inp-gramaj");
    let inpMaterialeElem = document.getElementById("inp-materiale");

    if (!inpNumeElem || !inpPretElem || !inpGramajElem || !inpMaterialeElem) {
        console.error("One or more input elements not found");
        return;
    }

    let inpNume = inpNumeElem.value.toLowerCase().trim();
    let inpPret = parseFloat(inpPretElem.value) || 0;
    let inpGramaj = parseFloat(inpGramajElem.value) || 0;
    let inpMateriale = inpMaterialeElem.value;

    let infoRange = document.getElementById("infoRange");
    let infoGramaj = document.getElementById("infoGramaj");
    if (infoRange) infoRange.innerHTML = `${inpPret}`;
    if (infoGramaj) infoGramaj.innerHTML = `${inpGramaj}`;

    let produse = document.getElementsByClassName("produs");
    let produseVizibile = 0;
    let produsePeCategorii = {};

    console.log(`Filter: name="${inpNume}", price=${inpPret}, weight=${inpGramaj}, materials="${inpMateriale}"`);

    for (let prod of produse) {
        prod.classList.remove('cel-mai-ieftin');
        try {
            let numeElem = prod.getElementsByClassName("val-nume")[0];
            let pretElem = prod.getElementsByClassName("val-pret")[0];
            let gramajElem = prod.getElementsByClassName("val-gramaj")[0];
            let materialeElem = prod.getElementsByClassName("val-materiale")[0];
            let categorieElem = prod.getElementsByClassName("val-categorie")[0];

            if (!numeElem || !pretElem || !gramajElem || !materialeElem || !categorieElem) {
                console.error("Missing elements in product:", prod);
                continue;
            }

            let nume = numeElem.innerHTML.toLowerCase();
            let pret = parseFloat(pretElem.innerHTML) || 0;
            let gramaj = parseFloat(gramajElem.innerHTML) || 0;
            let materiale = materialeElem.innerHTML;
            let categorie = categorieElem.innerHTML;

            // Condiție pentru nume: suport pentru căutare parțială și toleranță la greșeli
            let cond1 = inpNume === "" || 
                        eliminaDiacritice(nume).includes(eliminaDiacritice(inpNume)) || 
                        diferenteMax2(nume, inpNume) <= 3;
            let cond2 = inpPret === 0 || pret >= inpPret;
            let cond3 = inpGramaj === 0 || gramaj >= inpGramaj;
            let cond4 = inpMateriale === "" || 
                        eliminaDiacritice(materiale.toLowerCase()).includes(eliminaDiacritice(inpMateriale.toLowerCase()));

            console.log(`Product: "${nume}", Conditions: cond1=${cond1} (diff=${diferenteMax2(nume, inpNume)}), cond2=${cond2}, cond3=${cond3}, cond4=${cond4}`);

            if (cond1 && cond2 && cond3 && cond4) {
                prod.style.display = "block";
                produseVizibile++;
                if (!produsePeCategorii[categorie]) {
                    produsePeCategorii[categorie] = [];
                }
                produsePeCategorii[categorie].push({ element: prod, pret: pret });
            } else {
                prod.style.display = "none";
            }
        } catch (error) {
            console.error("Error processing product:", error);
        }
    }

    // BONUS 14: Marchează cel mai ieftin produs pe categorie
    for (let categorie in produsePeCategorii) {
        let produseCategorie = produsePeCategorii[categorie];
        if (produseCategorie.length > 0) {
            let celMaiIeftin = produseCategorie.reduce((min, prod) => 
                prod.pret < min.pret ? prod : min, produseCategorie[0]);
            celMaiIeftin.element.classList.add('cel-mai-ieftin');
            let marcaj = celMaiIeftin.element.querySelector('.marcaj-ieftin');
            if (marcaj) {
                marcaj.textContent = "Cel mai ieftin!";
            }
        }
    }

    console.log(`Visible products: ${produseVizibile}`);

    // BONUS 3: Mesaj când nu există produse
    let container = document.getElementById("grid-produse") || document.querySelector(".grid-produse");
    let mesajNiciunProdus = document.getElementById("mesaj-niciun-produs");
    if (!mesajNiciunProdus) {
        mesajNiciunProdus = document.createElement("div");
        mesajNiciunProdus.id = "mesaj-niciun-produs";
        mesajNiciunProdus.className = "mesaj-niciun-produs";
        mesajNiciunProdus.innerHTML = "Nu există produse conform filtrării curente.";
        mesajNiciunProdus.style.cssText = "display: none; padding: 20px; text-align: center; color: #666; font-style: italic;";
        container.appendChild(mesajNiciunProdus);
    }
    
    mesajNiciunProdus.style.display = produseVizibile === 0 ? "block" : "none";
}

    function sorteazaProduse(ascending = true) {
        let produse = Array.from(document.getElementsByClassName("produs"));
        
        produse.sort((a, b) => {
            let gramajA = parseFloat(a.getElementsByClassName("val-gramaj")[0].innerHTML) || 0;
            let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML) || 1;
            let raportA = gramajA / pretA;

            let gramajB = parseFloat(b.getElementsByClassName("val-gramaj")[0].innerHTML) || 0;
            let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML) || 1;
            let raportB = gramajB / pretB;

            let tipA = a.getElementsByClassName("val-tip")[0].innerHTML;
            let tipB = b.getElementsByClassName("val-tip")[0].innerHTML;

            if(raportA !== raportB) {
                return ascending ? raportA - raportB : raportB - raportA;
            }
            return ascending ? tipA.localeCompare(tipB) : tipB.localeCompare(tipA);
        });

        let container = document.getElementById("grid-produse") || 
                       document.querySelector(".grid-produse") ||
                       document.querySelector("main") ||
                       document.body;
        
        for(let prod of produse) {
            container.appendChild(prod);
        }

        // BONUS 14: Reapply cheapest product marking after sorting
        filtreazaProduse();
    }

    // BONUS 8 - Custom sorting with two customizable keys
    function sorteazaProdusePersonalizat() {
        let cheie1Select = document.getElementById("cheie-sortare-1");
        let cheie2Select = document.getElementById("cheie-sortare-2");
        let directieSelect = document.getElementById("directie-sortare");
        
        if (!cheie1Select || !cheie2Select || !directieSelect) {
            console.error("Custom sorting elements not found");
            return;
        }
        
        let cheie1 = cheie1Select.value;
        let cheie2 = cheie2Select.value;
        let ascending = directieSelect.value === "crescator";
        
        console.log(`Sorting: Key1=${cheie1}, Key2=${cheie2}, Ascending=${ascending}`);
        
        let produse = Array.from(document.getElementsByClassName("produs"));
        
        produse.sort((a, b) => {
            let valA1 = getValueByKey(a, cheie1);
            let valB1 = getValueByKey(b, cheie1);
            
            let comp1 = compareValues(valA1, valB1, cheie1);
            
            if (comp1 !== 0) {
                return ascending ? comp1 : -comp1;
            }
            
            let valA2 = getValueByKey(a, cheie2);
            let valB2 = getValueByKey(b, cheie2);
            let comp2 = compareValues(valA2, valB2, cheie2);
            
            return ascending ? comp2 : -comp2;
        });

        let container = document.getElementById("grid-produse") || 
                       document.querySelector(".grid-produse") ||
                       document.querySelector("main") ||
                       document.body;
        
        for(let prod of produse) {
            container.appendChild(prod);
        }
        
        // BONUS 14: Reapply cheapest product marking after sorting
        filtreazaProduse();
        
        console.log("Custom sorting complete");
    }
    
    // Helper function to get product value by key
    function getValueByKey(produs, cheie) {
        try {
            switch(cheie) {
                case 'nume':
                    return eliminaDiacritice(produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim());
                case 'pret':
                    return parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML) || 0;
                case 'gramaj':
                    return parseFloat(produs.getElementsByClassName("val-gramaj")[0].innerHTML) || 0;
                case 'tip':
                    return eliminaDiacritice(produs.getElementsByClassName("val-tip")[0].innerHTML.toLowerCase().trim());
                case 'materiale':
                    return eliminaDiacritice(produs.getElementsByClassName("val-materiale")[0].innerHTML.toLowerCase().trim());
                case 'raport':
                    let gramaj = parseFloat(produs.getElementsByClassName("val-gramaj")[0].innerHTML) || 0;
                    let pret = parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML) || 1;
                    return gramaj / pret;
                default:
                    return "";
            }
        } catch (error) {
            console.error(`Error getting value for key ${cheie}:`, error);
            return "";
        }
    }
    
    // Helper function for comparing values
    function compareValues(val1, val2, cheie) {
        if (cheie === 'pret' || cheie === 'gramaj' || cheie === 'raport') {
            return val1 - val2;
        }
        
        if (typeof val1 === 'string' && typeof val2 === 'string') {
            return val1.localeCompare(val2);
        }
        
        return val1 < val2 ? -1 : val1 > val2 ? 1 : 0;
    }

    function calculeazaStatistici() {
        let produse = document.getElementsByClassName("produs");
        let preturi = Array.from(produse)
            .filter(prod => prod.style.display !== "none")
            .map(prod => parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML))
            .filter(pret => !isNaN(pret));

        if (preturi.length === 0) {
            alert("No visible products for statistics calculation");
            return;
        }

        let media = preturi.reduce((a, b) => a + b, 0) / preturi.length;

        let divStatistici = document.createElement("div");
        divStatistici.className = "alert alert-info position-fixed top-0 end-0 m-3";
        divStatistici.style.cssText = "z-index: 9999; background: #d1ecf1; border: 1px solid #bee5eb; padding: 10px; border-radius: 5px;";
        divStatistici.innerHTML = `Media prețurilor: ${media.toFixed(2)} RON`;

        document.body.appendChild(divStatistici);
        setTimeout(() => divStatistici.remove(), 3000);
    }

    // Initialize all buttons and inputs once
    let btnFiltrare = document.getElementById("filtrare");
    let inpPretElem = document.getElementById("inp-pret");
    let inpNumeElem = document.getElementById("inp-nume");
    let inpMaterialeElem = document.getElementById("inp-materiale");
    let inpGramajElem = document.getElementById("inp-gramaj");
    let resetBtn = document.getElementById("resetare");
    let calcBtn = document.getElementById("calculeaza");
    let sortCrescBtn = document.getElementById("sortare-cresc");
    let sortDescBtn = document.getElementById("sortare-desc");
    let radioButtons = document.getElementsByName("gr_rad");
    
    // BONUS 8 - Elements for custom sorting
    let btnSortarePersonalizata = document.getElementById("sortare-personalizata");

    // Event listeners for sorting and statistics
    if(sortCrescBtn) sortCrescBtn.onclick = () => sorteazaProduse(true);
    if(sortDescBtn) sortDescBtn.onclick = () => sorteazaProduse(false);
    if(calcBtn) calcBtn.onclick = calculeazaStatistici;
    
    // BONUS 8 - Event listener for custom sorting
    if(btnSortarePersonalizata) {
        btnSortarePersonalizata.onclick = sorteazaProdusePersonalizat;
    }
    
    // BONUS 8 - Create interface for custom sorting if it doesn't exist
    function creeazaInterfataSortarePersonalizata() {
        if (document.getElementById("cheie-sortare-1")) {
            return;
        }
        
        let containerSortare = document.createElement("div");
        containerSortare.id = "container-sortare-personalizata";
        containerSortare.className = "mb-3 p-3 border rounded";
        containerSortare.style.cssText = "background-color: #f8f9fa; margin: 10px 0;";
        
        containerSortare.innerHTML = `
            <h6 class="mb-3">🔧 Sortare Personalizată (Bonus 8)</h6>
            <div class="row g-2 align-items-center">
                <div class="col-md-3">
                    <label for="cheie-sortare-1" class="form-label">Prima cheie:</label>
                    <select id="cheie-sortare-1" class="form-select form-select-sm">
                        <option value="nume">Nume</option>
                        <option value="pret">Preț</option>
                        <option value="gramaj">Gramaj</option>
                        <option value="tip">Tip</option>
                        <option value="materiale">Materiale</option>
                        <option value="raport">Raport Gramaj/Preț</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="cheie-sortare-2" class="form-label">A doua cheie:</label>
                    <select id="cheie-sortare-2" class="form-select form-select-sm">
                        <option value="nume">Nume</option>
                        <option value="pret" selected>Preț</option>
                        <option value="gramaj">Gramaj</option>
                        <option value="tip">Tip</option>
                        <option value="materiale">Materiale</option>
                        <option value="raport">Raport Gramaj/Preț</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label for="directie-sortare" class="form-label">Direcție:</label>
                    <select id="directie-sortare" class="form-select form-select-sm">
                        <option value="crescator">Crescător</option>
                        <option value="descrescator">Descrescător</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label"> </label>
                    <button id="sortare-personalizata" class="btn btn-primary btn-sm d-block w-100">
                        🔄 Sortează
                    </button>
                </div>
            </div>
            <small class="text-muted d-block mt-2">
                <strong>Exemplu:</strong> Prima cheie = "Tip", A doua cheie = "Preț" → sortează mai întâi după tip, apoi după preț
            </small>
        `;
        
        let insertLocation = document.querySelector(".container") || 
                           document.querySelector("main") || 
                           document.body.firstElementChild ||
                           document.body;
        
        if (insertLocation.firstElementChild) {
            insertLocation.insertBefore(containerSortare, insertLocation.firstElementChild);
        } else {
            insertLocation.appendChild(containerSortare);
        }
        
        let btnSortarePersonalizata = document.getElementById("sortare-personalizata");
        if(btnSortarePersonalizata) {
            btnSortarePersonalizata.onclick = sorteazaProdusePersonalizat;
        }
        
        console.log("Custom sorting interface created");
    }

    // BONUS 4 - Add onchange event listeners
    if(inpNumeElem) {
        inpNumeElem.onchange = filtreazaProduse;
        inpNumeElem.onkeyup = filtreazaProduse;
        inpNumeElem.oninput = filtreazaProduse;
    }

    if(inpPretElem) {
        inpPretElem.onchange = filtreazaProduse;
        inpPretElem.oninput = filtreazaProduse;
    }

    if(inpGramajElem) {
        inpGramajElem.onchange = filtreazaProduse;
        inpGramajElem.oninput = filtreazaProduse;
    }

    if(inpMaterialeElem) {
        inpMaterialeElem.onchange = filtreazaProduse;
    }

    if (radioButtons && radioButtons.length > 0) {
        Array.from(radioButtons).forEach(radio => {
            radio.onchange = filtreazaProduse;
        });
    }

    if(btnFiltrare) {
        btnFiltrare.style.display = "none";
    }

    if(resetBtn) {
        resetBtn.onclick = function() {
            if(confirm("Sigur doriți să resetați toate filtrele?")) {
                if(inpNumeElem) inpNumeElem.value = "";
                if(inpPretElem) inpPretElem.value = "0";
                if(inpGramajElem) inpGramajElem.value = "0";
                if(inpMaterialeElem) inpMaterialeElem.value = "";
                if(radioButtons && radioButtons[0]) radioButtons[0].checked = true;
                
                let infoRange = document.getElementById("infoRange");
                let infoGramaj = document.getElementById("infoGramaj");
                if (infoRange) infoRange.innerHTML = "0";
                if (infoGramaj) infoGramaj.innerHTML = "0";
                
                let produse = document.getElementsByClassName("produs");
                for(let prod of produse) {
                    prod.style.display = "block";
                }
                
                let mesajNiciunProdus = document.getElementById("mesaj-niciun-produs");
                if (mesajNiciunProdus) {
                    mesajNiciunProdus.style.display = "none";
                }
                
                // BONUS 14: Reapply marking after reset
                filtreazaProduse();
            }
        }
    }

    // Run initial filtering to set correct state
    setTimeout(filtreazaProduse, 100);
    
    // BONUS 8 - Create custom sorting interface
    setTimeout(creeazaInterfataSortarePersonalizata, 200);
    
    console.log("Script initialized successfully!");
}