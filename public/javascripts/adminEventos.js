

let botonesCancelar = document.querySelectorAll(".botonCancelar")
let botonesActualizar = document.querySelectorAll(".botonActualizar")

let divFormularios = document.querySelector(".formularios")
let idEvento = ""
botonesCancelar.forEach(item => {
    item.addEventListener("click", () => {
        idEvento = item.value
        divFormularios.innerHTML = ""
        let formularioCancelar = `
        <section>
            <img src="/images/logoTFG.webp" alt="">
        </section>
        <h1>ESTAS SEGURO DE BORRAR ESTE EVENTO </h1>
        <hr>
            <form action='/admin/administrarEventos/cancelar/${item.value}'>
                <div>
                    <button class="cancelar" type="button">CANCELAR</button>
                    <button class="aceptarCancelacion" type="button">ACEPTAR</button>
                </div>
            </form>
    
        `
        divFormularios.innerHTML = formularioCancelar



    })
})
divFormularios.addEventListener("click", async (e) => {
    if (e.target.classList.contains("cancelar")) {
        divFormularios.innerHTML = ""
    }
    if (e.target.classList.contains("aceptarCancelacion")) {

        let objeto = { estado: false }
        let ruta = "/admin/administrarEventos/cancelar/" + idEvento
        let respuesta = await fetch(ruta, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(objeto)
        })

        if (respuesta.ok) {
            const eventoFinal = await respuesta.json()
            let evento = eventoFinal.event

            let botonID = document.querySelectorAll(`button[value='${idEvento}']`)
            botonID[0].disabled = true
            botonID[1].disabled = true
            let fila = botonID[0].closest("tr")
            let columnas = fila.querySelectorAll("td, th");
            columnas[2].innerHTML = "Cancelado"
            divFormularios.innerHTML = ""
        }
    }

    if (e.target.classList.contains("aceptarActualizar")) {

        let form = document.querySelector("#actualizar input")

        if (form.value == "") {
            alert("No puede hacer eso")
            divFormularios.innerHTML = ""
        } else {
            let objeto = { fecha:form.value}
            let ruta = "/admin/administrarEventos/actualizar/" + idEvento
            let respuesta = await fetch(ruta, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(objeto)
            })

            if (respuesta.ok) {
                const eventoFinal = await respuesta.json()
                let evento = eventoFinal.event

                let fecha = new Date(evento.fecha)
                const meses=["Ene", "Feb" , "Mar" , "Abr" , "May" , "Jun" , "Jul" , "Ago" , "Sep" , "Oct"
                , "Nov" , "Dic" ] 
                let mes=fecha.getMonth()
                let dia=fecha.getDate() 
                let año=fecha.getFullYear() 
                let hora=fecha.getHours() 
                let min=String(fecha.getMinutes()).padStart(2, "0" ); 

                let botonID = document.querySelectorAll(`button[value='${idEvento}']`)
            
                let fila = botonID[0].closest("tr")
                let columnas = fila.querySelectorAll("td, th");
                columnas[1].innerHTML = ` ${dia} ${meses[mes]} ${año} ${hora}:${min}`
                divFormularios.innerHTML = ""

            }else {
                let parrafo = document.querySelector(".error")
                const texto = await respuesta.text()
                parrafo.innerHTML = texto 
            }
        }
        console.log(form.value)



    }
})


botonesActualizar.forEach(item => {
    item.addEventListener("click", () => {
        idEvento = item.value
        divFormularios.innerHTML = ""
        let formularioCancelar = `
        <section>
            <img src="/images/logoTFG.webp" alt="">
        </section>
        <h1>ASIGNE LA NUEVA FECHA</h1>
        <hr>
        <p class="error"></p>
            <form action="/admin/administrarEventos/actualizar/${item.value}" id="actualizar">
                <input type="datetime-local" required>
                <div>
                    <button class="cancelar" type="button">CANCELAR</button>
                    <button class="aceptarActualizar" type="button">ACEPTAR</button>
                </div>
            </form>
    
        `
        divFormularios.innerHTML = formularioCancelar
    })
})
