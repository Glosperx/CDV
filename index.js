const express= require("express");
const path= require("path");
const fs = require("fs");
const pg= require("pg");

app= express();

v=[10,27,23,44,15]

nrImpar=v.find(function(elem){return elem % 100 == 1})
console.log(nrImpar)

console.log("Folderul proiectului:",__dirname);
console.log("Calea fisierului:",__filename);
console.log("Folderul curent de lucru:",process.cwd());

app.set("view engine", "ejs");

obGlobal={
    obErori:null
}


function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    console.log(continut)
    obGlobal.obErori=JSON.parse(continut)
    console.log(obGlobal.obErori)
    
    obGlobal.obErori.eroare_default.imagine=path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    console.log(obGlobal.obErori)

}

initErori()

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare= obGlobal.obErori.info_erori.find(function(elem){ 
                        return elem.identificator==identificator
                    });
    if(eroare){
        if(eroare.status)
            res.status(identificator)
        var titluCustom=titlu || eroare.titlu;
        var textCustom=text || eroare.text;
        var imagineCustom=imagine || eroare.imagine;


    }
    else{
        var err=obGlobal.obErori.eroare_default
        var titluCustom=titlu || err.titlu;
        var textCustom=text || err.text;
        var imagineCustom=imagine || err.imagine;


    }
    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
})

}

// const Client =pg.Client;



// client=new Client({
//     database:"cti_2024",
//     user:"irina",
//     password:"irina",
//     host:"localhost",
//     port:5432
// })

// client.connect()
// client.query("select * from prajituri", function(err, rezultat ){
//     console.log(err)    
//     console.log(rezultat)
// })
// client.query("select * from unnest(enum_range(null::categ_prajitura))", function(err, rezultat ){
//     console.log(err)    
//     console.log(rezultat)
// })
// app.get("/produse", function(req, res){
//     console.log(req.query)
//     var conditieQuery=""; // TO DO where din parametri


//     queryOptiuni=""
//     client.query(queryOptiuni, function(err, rezOptiuni){
//         console.log(rezOptiuni)


//         queryProduse=""
//         client.query(queryProduse, function(err, rez){
//             if (err){
//                 console.log(err);
//                 afisareEroare(res, 2);
//             }
//             else{
//                 res.render("pagini/produse", {produse: rez.rows, optiuni:rezOptiuni.rows})
//             }
//         })
//     });
// })




// a={
//     b:[10, {c: 17}, true,{vector:[1,23,{d:100}]}]
// }

// console.log(a.b[3].vector[2].d);



app.get("/resurse/*", function(req, res, next) {
    if (req.url.endsWith('/')) {
        afisareEroare(res, 403);
    } else {
        next();
    }
});


app.use("/resurse", express.static(path.join(__dirname,"resurse")))
app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"))
})


app.get(["/","/index","/home"], function(req, res){
    res.render("pagini/index",{ip:req.ip});
})

app.get("/despre", function(req, res){
    
    res.render("pagini/despre");
})

app.get("/index/a", function(req, res){
    res.render("pagini/index");
})

// app.get("/fisier", function(req, res){
//     res.sendFile(__dirname+"/index.html");
// })

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



// app.get(/^\/resurse\/[a-zA-Z0-9_\/]*$/, function(req, res, next){
    //     afisareEroare(res,403);
    // })
    
    
    app.get("/*ejs", function(req, res, next){
        afisareEroare(res, 400)
    })
    
    // app.get("/resurse/*", function(req, res, next){
    //     afisareEroare(res, 403)
    // })
    
    // app.get("/favicon.ico", function(req, res, next){
    //     res.sendfile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"))
    // })
    
    app.get("/*", function(req, res, next){
        try{
            res.render("pagini"+req.url, function(err, rezultatRandare){
                if(err){
                    console.log(err)
                    if(err.message.startsWith("Failed to lookup view")){
                        afisareEroare(res, 404)
                    }
                }
                else{
                    afisareEroare(res)
                }
            });
        }
        catch(errRandare){
            if(err){
                console.log(err)
                if(err.message.startsWith("Cannot find module")){
                    afisareEroare(res, 404)
                }
            }
            else{
                afisareEroare(res)
            }
        }
    })
    
    
    vect_foldere=["temp", "backup", "temp1"]
    for (let folder of vect_foldere ){
        let caleFolder=path.join(__dirname,folder)
        if (! fs.existsSync(caleFolder)){
            fs.mkdirSync(caleFolder);
        }
    }
    
    app.listen(8080);
console.log("Serverul ruleaza pe portul 8080");