
let butacas = document.querySelectorAll(".check:not(.reservada)")
const infoContenedor = document.querySelector("#infoSeleccionadas");
const butacasSeleccionada = []

butacas.forEach(item => {
    item.addEventListener("click", () => {
        const seleccionada = item.classList.contains("seleccionada");
        const maxButacas = document.querySelectorAll(".seleccionada");

        if (seleccionada) {
            item.classList.remove("seleccionada");
        } else {
            if (maxButacas.length >= 3) {
                alert("No puedes guardar más de 3 butacas");
                return;
            }
            item.classList.add("seleccionada");
        }

        infoButaca();
    });
});

function infoButaca(){
    let butacas = document.querySelectorAll(".seleccionada");
    infoContenedor.innerHTML = ""; 
    butacas.forEach(item => {
        /* console.log(item.dataset.valuebutaca) */
        let datosSplit = item.dataset.valuebutaca.split(",")
        console.log(datosSplit)
        infoContenedor.innerHTML+=
        ` <input type="text" name="fila[]" readonly value="${datosSplit[0]}">
        <label>Butaca</label>
        <input type="number" name="numButaca[]" readonly value="${datosSplit[1]}">
        <input type="hidden" name="sector[]" readonly value="${datosSplit[2]}">
        <input type="hidden" name="evento[]" readonly value="${datosSplit[3]}">
        `
    });
    if(butacas.length>0){
        let boton = document.createElement("button")
        boton.setAttribute("type","submit")
        boton.innerHTML="Procesar Compra"
        infoContenedor.append(boton)
    }
}

console.log(butacas)