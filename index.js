const express= require("express");
const sharp = require("sharp");
const path= require("path");
const fs = require("fs");
const pg= require("pg");
const sass = require("sass");

const Client=pg.Client;

client=new Client({
    database:"cdv",
    user:"glosper",
    password:"ciscosecpa55",
    host:"localhost",
    port:5432
})

client.connect()
client.query("select * from produse", function(err, rezultat ){
    console.log(err)    
    console.log("Rezultat query:", rezultat)
})
client.query("select * from unnest(enum_range(null::categ_produs))", function(err, rezultat ){
    console.log(err)    
    console.log(rezultat)
})

app= express();

v=[10,27,23,44,15]

nrImpar=v.find(function(elem){return elem % 100 == 1})
console.log(nrImpar)

console.log("Folderul proiectului:",__dirname);
console.log("Calea fisierului:",__filename);
console.log("Folderul curent de lucru:",process.cwd());

app.set("view engine", "ejs");

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname,"resurse/scss"),
    folderCss: path.join(__dirname,"resurse/css"),
    folderBackup: path.join(__dirname,"backup")
}

    
vect_foldere=["temp", "backup", "temp1"]
for (let folder of vect_foldere ){
    let caleFolder=path.join(__dirname,folder)
    if (! fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}

function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss){

        let numeFisExt=path.basename(caleScss); // "folder1/folder2/ceva.txt" -> "ceva.txt"
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css"; // output: a.css
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    

    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    // console.log("Compilare SCSS",rez);
}

//la pornirea serverului
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})


function initErori(){
    try {
        let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
        console.log(continut);
        obGlobal.obErori = JSON.parse(continut);
        
        obGlobal.obErori.eroare_default.imagine = path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine);
        for (let eroare of obGlobal.obErori.info_erori){
            eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
        }
        console.log("Erori inițializate cu succes!");
    } catch (err) {
        console.log("Eroare la inițializarea erorilor:", err);
        obGlobal.obErori = {
            eroare_default: {
                titlu: "Eroare",
                text: "A apărut o eroare!",
                imagine: "/resurse/imagini/erori/interzis.png"
            },
            info_erori: [
                {
                    identificator: 403,
                    status: true,
                    titlu: "Acces interzis",
                    text: "Nu aveți acces la această resursă!",
                    imagine: "/resurse/imagini/erori/interzis.png"
                },
                {
                    identificator: 400,
                    status: true,
                    titlu: "Cerere greșită",
                    text: "Serverul nu poate procesa cererea!",
                    imagine: "/resurse/imagini/erori/interzis.png"
                }
            ]
        }
    }
}
// Apelăm funcția initErori pentru a inițializa obiectul obErori
initErori();

// Funcție de procesare imagine pentru a preveni erorile
async function procesareImagine(caleSursa, caleDestinatie, latime) {
    try {
        if (!fs.existsSync(caleSursa)) {
            console.error(`Imaginea sursă nu există: ${caleSursa}`);
            return false;
        }
        
        // Creăm directorul de destinație dacă nu există
        const dirDestinatie = path.dirname(caleDestinatie);
        if (!fs.existsSync(dirDestinatie)) {
            fs.mkdirSync(dirDestinatie, { recursive: true });
        }
        
        // Procesăm imaginea doar dacă fișierul destinație nu există deja
        if (!fs.existsSync(caleDestinatie)) {
            await sharp(caleSursa)
                .resize(latime)
                .toFormat('webp')
                .toFile(caleDestinatie);
            console.log(`Imagine procesată: ${caleDestinatie}`);
        } else {
            console.log(`Imagine deja existentă: ${caleDestinatie}`);
        }
        
        return true;
    } catch (error) {
        console.error(`Eroare la procesarea imaginii ${caleSursa}:`, error);
        return false;
    }
}

function initImagini(){
    try {
        // Citim datele din JSON
        const continut = fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");
        obGlobal.obImagini = JSON.parse(continut);
        
        // Verificăm dacă structura JSON este validă
        if (!obGlobal.obImagini.cale_galerie || !Array.isArray(obGlobal.obImagini.imagini)) {
            throw new Error("Structură JSON invalidă pentru galerie");
        }
        
        // Construim calea absolută către directorul galeriei
        const caleGalerie = path.join(__dirname, obGlobal.obImagini.cale_galerie);
        if (!fs.existsSync(caleGalerie)) {
            fs.mkdirSync(caleGalerie, { recursive: true });
        }
        
        // Creăm directoarele pentru imagini redimensionate
        const caleMediu = path.join(caleGalerie, "mediu");
        const caleMic = path.join(caleGalerie, "mic");
        
        if (!fs.existsSync(caleMediu)) {
            fs.mkdirSync(caleMediu, { recursive: true });
        }
        
        if (!fs.existsSync(caleMic)) {
            fs.mkdirSync(caleMic, { recursive: true });
        }
        
        // Procesăm fiecare imagine
        for (const imag of obGlobal.obImagini.imagini) {
            // Determinăm numele fișierului și extensia
            let caleRelativa = imag.cale_relativa || imag.fisier || null;
            if (!caleRelativa) {
                console.warn("Imagine fără cale relativă sau fisier:", imag);
                continue;
            }
            
            // Extragem numele și extensia
            let numeFisier = path.basename(caleRelativa, path.extname(caleRelativa));
            let extensie = path.extname(caleRelativa);
            
            // Căile complete pentru imagini
            const caleSursa = path.join(caleGalerie, caleRelativa);
            const caleMediuDestinatie = path.join(caleMediu, `${numeFisier}.webp`);
            const caleMicDestinatie = path.join(caleMic, `${numeFisier}.webp`);
            
            // Verificăm dacă imaginea sursă există înainte de procesare
            if (fs.existsSync(caleSursa)) {
                // Procesăm pentru dimensiuni medii și mici
                procesareImagine(caleSursa, caleMediuDestinatie, 600);
                procesareImagine(caleSursa, caleMicDestinatie, 300);
                
                // Actualizăm calea în obiectul imaginii pentru folosire în pagină
                imag.cale_medie = path.join(obGlobal.obImagini.cale_galerie, "mediu", `${numeFisier}.webp`);
                imag.cale_mica = path.join(obGlobal.obImagini.cale_galerie, "mic", `${numeFisier}.webp`);
            } else {
                console.warn(`Imaginea sursă nu există: ${caleSursa}`);
            }
        }
        
        console.log("Inițializare imagini completă cu succes");
    } catch (error) {
        console.error("Eroare la inițializarea imaginilor:", error);
    }
}

// Inițializăm imaginile
initImagini();

function afisareEroare(res, identificator, titlu, text, imagine){
    // Verificăm dacă obGlobal.obErori există
    if (!obGlobal.obErori) {
        console.error("Eroare: obGlobal.obErori nu este inițializat!");
        return res.status(500).send("Eroare de server");
    }
    
    let eroare = obGlobal.obErori.info_erori.find(function(elem){ 
        return elem.identificator == identificator
    });
    
    if(eroare){
        if(eroare.status)
            res.status(identificator)
        var titluCustom = titlu || eroare.titlu;
        var textCustom = text || eroare.text;
        var imagineCustom = imagine || eroare.imagine;
    }
    else{
        var err = obGlobal.obErori.eroare_default
        var titluCustom = titlu || err.titlu;
        var textCustom = text || err.text;
        var imagineCustom = imagine || err.imagine;
    }
    
    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
    });
}

a={
    b:[10, {c: 17}, true,{vector:[1,23,{d:100}]}]
}

console.log(a.b[3].vector[2].d);

app.use("/resurse", express.static(path.join(__dirname,"resurse")))
app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"))
})

// Modificat handler pentru pagina principală - pasăm toate datele necesare
app.get(["/","/index","/home"], function(req, res){
    // Adăugăm toate parametrele care ar putea fi necesare în șabloane
    res.render("pagini/index", {
        ip: req.ip, 
        imagini: obGlobal.obImagini.imagini,
        afisareToate: req.query && req.query.toate === "true"  // Pentru eventualele fragmente care folosesc acest parametru
    });
})


app.get("/despre", function(req, res){
    // Modificat pentru a pasa parametrii necesari în șabloane 
    res.render("pagini/despre", {
        afisareToate: req.query && req.query.toate === "true" // Pentru eventualele fragmente care folosesc acest parametru
    });
})

// Ruta pentru pagina de galerie (poate afișa toate imaginile sau filtrate după oră)
app.get("/galerie", function(req, res) {
    const galerieData = {
        cale_galerie: "/resurse/imagini/galerie",
        imagini: obGlobal.obImagini.imagini
    };
    
    res.render("pagini/galerie", {
        imagini: galerieData.imagini,
        cale_galerie: galerieData.cale_galerie,
        afisareToate: req.query && req.query.toate === "true"  // Doar parametrul query relevant
    });
});


app.get("/index/a", function(req, res){
    // Modificat pentru a pasa parametrii necesari în șabloane
    res.render("pagini/index", {
        afisareToate: req.query && req.query.toate === "true" // Pentru eventualele fragmente care folosesc acest parametru
    });
})

app.get("/fisier2", function(req, res){
    res.sendFile(path.join(__dirname,"package.json"));
})

app.get("/cerere", function(req, res){
    res.send("<p style='color:blue'>Zalut!!</p>");
}) 

app.get("/cerere2", function(req, res){
    res.send("<p style='color:blue'>NU CREDD MA!!</p>");
}) 

app.get("/cerere3", function(req, res,next){
    res.write("Data curenta este: ");
    next();
})

app.get("/cerere3", function(req, res,next){
    res.write(new Date()+"");
    // res.end();
    next();
})

app.get("/cerere3", function(req, res,next){
    console.log("Cererea a fost procesata!");
    res.end();
})

app.get("/produse", function(req, res){
    client.query("SELECT MIN(pret) as min_pret, MAX(pret) as max_pret, MIN(gramaj) as min_gramaj, MAX(gramaj) as max_gramaj FROM produse", function(err, resultMinMax) {
        if (err) {
            console.log(err);
            renderError(res, 2);
            return;
        }
        
        client.query("SELECT * FROM produse", function(err, result) {
            if (err) {
                console.log(err);
                renderError(res, 2);
                return;
            }

            res.render("pagini/produse", {
                produse: result.rows,
                minPret: resultMinMax.rows[0].min_pret,
                maxPret: resultMinMax.rows[0].max_pret,
                minGramaj: resultMinMax.rows[0].min_gramaj,
                maxGramaj: resultMinMax.rows[0].max_gramaj
            });
        });
    });
});

app.get("/produs/:id", function(req, res){
    console.log(req.params)
    client.query(`select * from produse where id=${req.params.id}`, function(err, rez){
        if (err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else{
            if (rez.rowCount==0){
                afisareEroare(res, 404);
            }
            else{
                res.render("pagini/produs", {prod: rez.rows[0]})
            }
        }
    })
})


app.get(/^\/resurse\/[a-zA-Z0-9_\/]*$/, function(req, res, next){
        afisareEroare(res,403);
    })
    
    
app.get("/*ejs", function(req, res, next){
    afisareEroare(res, 400)
})
    
app.listen(8080);
console.log("Serverul ruleaza pe portul 8080");

// BONUS 1
app.get('/produse', function(req, res) {
    client.query("SELECT MIN(pret) as min_pret, MAX(pret) as max_pret, MIN(gramaj) as min_gramaj, MAX(gramaj) as max_gramaj FROM produse", function(err, result) {
        if (err) {
            console.log(err);
            res.render('pagini/produse', {produse: [], minPret: 0, maxPret: 1000, minGramaj: 0, maxGramaj: 1000});
            return;
        }
        let minPret = result.rows[0].min_pret;
        let maxPret = result.rows[0].max_pret;
        let minGramaj = result.rows[0].min_gramaj;
        let maxGramaj = result.rows[0].max_gramaj;

        client.query("SELECT * FROM produse", function(err, result) {
            if (err) {
                console.log(err);
                return;
            }
            res.render('pagini/produse', {
                produse: result.rows,
                minPret: minPret,
                maxPret: maxPret,
                minGramaj: minGramaj,
                maxGramaj: maxGramaj
            });
        });
    });
});