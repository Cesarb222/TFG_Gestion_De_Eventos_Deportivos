
let butacas = document.querySelectorAll(".check:not(.reservada)")
const infoContenedor = document.querySelector("#infoSeleccionadas");
const butacasSeleccionada = []

infoContenedor.innerHTML = "<h3>No tienes entradas seleccionadas</h3>"
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
    infoContenedor.innerHTML = "<h3>Seleccionadas</h3>"; 
    butacas.forEach(item => {
        /* console.log(item.dataset.valuebutaca) */
        let datosSplit = item.dataset.valuebutaca.split(",")
        console.log(datosSplit)
        infoContenedor.innerHTML+=
        ` 
        <div class="butSeleccion">
            <input type="text" name="fila[]" readonly value="${datosSplit[0]}">
            <label>Butaca</label>
            <input type="number" name="numButaca[]" readonly value="${datosSplit[1]}">
            <input type="hidden" name="sector[]" readonly value="${datosSplit[2]}">
            <input type="hidden" name="evento[]" readonly value="${datosSplit[3]}">
        </div>
        `
    });
    if(butacas.length>0){
        let boton = document.createElement("button")
        boton.setAttribute("type","submit")
        boton.innerHTML="PROCESAR COMPRA"
        infoContenedor.append(boton)
    }
    if(butacas.length==0){
        infoContenedor.innerHTML = "<h3>No tienes entradas seleccionadas</h3>"
    }
}

console.log(butacas)