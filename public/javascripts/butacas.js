
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
        const p = document.createElement("p");
        p.textContent = item.dataset.valuebutaca;
        infoContenedor.append(p);
    });
}

console.log(butacas)
/* formSelect.addEventListener("change", () => {
    const butacas = formSelect.querySelectorAll("input[type=checkbox]:not(#reservada)");
    const checkbox = formSelect.querySelectorAll("input[type=checkbox]:checked");
    const infoContenedor = document.getElementById("infoSeleccionadas");

    if (checkbox.length >= 3) {
        alert("No puedes seleccionar más de 3 entradas");

        // Cuando ya tenga las 3 butacas seleccionadas deshabilito las demas
        butacas.forEach(item => {
            if(item.checked == false){
                item.disabled = true;
            }
        });
    } else {
        // Si tenemos menos de 3 butacas selecciionadas, habilito todas
        butacas.forEach(item => {
            item.disabled = false
    });
    }

    // Muestro la información de la fila y butaca en este contenedor 👇
    infoContenedor.innerHTML = ""; 
    checkbox.forEach(item => {
        const info = item.value;
        const p = document.createElement("p");
        p.textContent = info;
        infoContenedor.append(p);
    });
}); */