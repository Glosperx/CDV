/* alert(1)

a=10
alert(a)
alert(window.a) */
window.onload = function() {
    // Găsește prețul maxim din produse
    let produse = document.getElementsByClassName("produs");
    let pretMaxim = Math.max(...Array.from(produse).map(prod => 
        parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML)
    ));

    // Setează range-ul cu prețul maxim găsit
    let inpPret = document.getElementById("inp-pret");
    if(inpPret) {
        inpPret.max = pretMaxim;
        inpPret.value = 0;
        // Actualizează și textul afișat pentru preț maxim
        let labelPret = document.querySelector('label[for="inp-pret"]');
        if(labelPret) {
            labelPret.innerHTML = `
                <span>0 RON</span>
                <span>Preț minim: <span id="infoRange">0</span> RON</span>
                <span>${pretMaxim} RON</span>
            `;
        }
    }

    // Adaugă funcția pentru diferența între șiruri
    function diferenteMax2(str1, str2) {
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();
        let diferente = 0;
        for(let i = 0; i < str1.length && i < str2.length; i++) {
            if(str1[i] !== str2[i]) diferente++;
            if(diferente > 2) return diferente;
        }
        diferente += Math.abs(str1.length - str2.length);
        return diferente;
    }

    function filtreazaProduse() {
        let inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
        let inpPret = parseFloat(document.getElementById("inp-pret").value);
        let inpGramaj = parseFloat(document.getElementById("inp-gramaj").value);
        let inpMateriale = document.getElementById("inp-materiale").value;
        
        document.getElementById("infoRange").innerHTML = `(${inpPret})`;
        document.getElementById("infoGramaj").innerHTML = `(${inpGramaj})`;
        
        let produse = document.getElementsByClassName("produs");
        //BONUS 3
        let produseVizibile = 0;
        
        for(let prod of produse) {
            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let gramaj = parseFloat(prod.getElementsByClassName("val-gramaj")[0].innerHTML);
            let materiale = prod.getElementsByClassName("val-materiale")[0].innerHTML;
            
            let cond1 = inpNume === "" || diferenteMax2(nume, inpNume) <= 2;
            let cond2 = isNaN(inpPret) || pret >= inpPret;
            let cond3 = isNaN(inpGramaj) || gramaj >= inpGramaj;
            let cond4 = inpMateriale === "" || materiale.includes(inpMateriale);
            
            if(cond1 && cond2 && cond3 && cond4) {
                prod.style.display = "block";
                produseVizibile++;
            } else {
                prod.style.display = "none";
            }
        }

        // BONUS 3 - Afișează mesaj când nu există produse conform filtrării
        let container = document.getElementById("grid-produse");
        
        // Creează containerul dacă nu există
        if (!container) {
            container = document.createElement("div");
            container.id = "grid-produse";
            container.className = "grid-produse";
            // Găsește un element părinte potrivit pentru container
            const mainContent = document.querySelector("main") || document.body;
            mainContent.appendChild(container);
        }

        let mesajNiciunProdus = document.getElementById("mesaj-niciun-produs");
        if (!mesajNiciunProdus) {
            mesajNiciunProdus = document.createElement("div");
            mesajNiciunProdus.id = "mesaj-niciun-produs";
            mesajNiciunProdus.className = "mesaj-niciun-produs";
            mesajNiciunProdus.innerHTML = "Nu există produse conform filtrării curente.";
            container.appendChild(mesajNiciunProdus);
        }
        
        mesajNiciunProdus.style.display = produseVizibile === 0 ? "block" : "none";
    }

    function sorteazaProduse(ascending = true) {
        let produse = Array.from(document.getElementsByClassName("produs"));
        
        produse.sort((a, b) => {
            let gramajA = parseFloat(a.getElementsByClassName("val-gramaj")[0].innerHTML);
            let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            let raportA = gramajA / pretA;

            let gramajB = parseFloat(b.getElementsByClassName("val-gramaj")[0].innerHTML);
            let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            let raportB = gramajB / pretB;

            let tipA = a.getElementsByClassName("val-tip")[0].innerHTML;
            let tipB = b.getElementsByClassName("val-tip")[0].innerHTML;

            if(raportA !== raportB) {
                return ascending ? raportA - raportB : raportB - raportA;
            }
            return ascending ? tipA.localeCompare(tipA) : tipB.localeCompare(tipA);
        });

        let container = document.getElementById("grid-produse");
        for(let prod of produse) {
            container.appendChild(prod);
        }
    }

    function calculeazaStatistici() {
        let produse = document.getElementsByClassName("produs");
        let preturi = Array.from(produse)
            .filter(prod => prod.style.display !== "none")
            .map(prod => parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML));

        let media = preturi.reduce((a, b) => a + b, 0) / preturi.length;

        let divStatistici = document.createElement("div");
        divStatistici.className = "alert alert-info position-fixed top-0 end-0 m-3";
        divStatistici.innerHTML = `Media prețurilor: ${media.toFixed(2)} RON`;

        document.body.appendChild(divStatistici);
        setTimeout(() => divStatistici.remove(), 2000);
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

    // Event listeners for sorting and statistics
    if(sortCrescBtn) sortCrescBtn.onclick = () => sorteazaProduse(true);
    if(sortDescBtn) sortDescBtn.onclick = () => sorteazaProduse(false);
    if(calcBtn) calcBtn.onclick = calculeazaStatistici;

    // BONUS 4 - Add onchange event listeners
    if(inpNumeElem) {
        inpNumeElem.onchange = filtreazaProduse;
        inpNumeElem.onkeyup = filtreazaProduse;
    }

    if(inpPretElem) {
        inpPretElem.onchange = function() {
            document.getElementById("infoRange").innerHTML = `(${this.value})`;
            filtreazaProduse();
        }
        inpPretElem.oninput = function() {
            document.getElementById("infoRange").innerHTML = `(${this.value})`;
            filtreazaProduse();
        }
    }

    if(inpGramajElem) {
        inpGramajElem.onchange = function() {
            document.getElementById("infoGramaj").innerHTML = `(${this.value})`;
            filtreazaProduse();
        }
        inpGramajElem.oninput = function() {
            document.getElementById("infoGramaj").innerHTML = `(${this.value})`;
            filtreazaProduse();
        }
    }

    if(inpMaterialeElem) {
        inpMaterialeElem.onchange = filtreazaProduse;
    }

    radioButtons.forEach(radio => {
        radio.onchange = filtreazaProduse;
    });

    // Hide the filter button since we're using onchange
    if(btnFiltrare) {
        btnFiltrare.style.display = "none";
    }

    // Reset button functionality
    if(resetBtn) {
        resetBtn.onclick = function() {
            if(confirm("Sigur doriți să resetați toate filtrele?")) {
                if(inpNumeElem) inpNumeElem.value = "";
                if(inpPretElem) inpPretElem.value = "0";
                if(inpGramajElem) inpGramajElem.value = "0";
                if(inpMaterialeElem) inpMaterialeElem.value = "";
                if(radioButtons[0]) radioButtons[0].checked = true;
                
                document.getElementById("infoRange").innerHTML = "(0)";
                document.getElementById("infoGramaj").innerHTML = "(0)";
                
                let produse = document.getElementsByClassName("produs");
                for(let prod of produse) {
                    prod.style.display = "block";
                }
            }
        }
    }
}