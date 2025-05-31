window.addEventListener("DOMContentLoaded", function(){
    console.log("Script loaded");
    
    // Verifică tema salvată la încărcare
    if(localStorage.getItem("tema") === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        console.log("Dark theme loaded from storage");
    }

    const btnTema = document.getElementById("schimba_tema");
    console.log("Button found:", btnTema);

    if(btnTema) {
        btnTema.onclick = function(){
            console.log("Button clicked");
            if (document.documentElement.getAttribute("data-theme") === "dark") {
                document.documentElement.removeAttribute("data-theme");
                localStorage.removeItem("tema");
                console.log("Switching to light theme");
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("tema", "dark");
                console.log("Switching to dark theme");
            }
        }
    }
});