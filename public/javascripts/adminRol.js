let form = document.querySelector("#actualizarRol")

let divResultados = document.querySelector(".resultados")

form.addEventListener("input", async function (e) {
    let input = this.elements.correo
    console.log(input.value)
    if (input.value == "") {
        divResultados.innerHTML = ""
        return
    }

    let ruta = "/admin/verCorreos?email=" + input.value
    console.log(ruta)
    let respuesta = await fetch(ruta)
    const usuarios = await respuesta.json()

    let html = `
        <thead>
            <tr>
                <th>EMAIL</th>
                <th>ROL</th>
                <th>OPCIÓN</th>
            </tr>
        </thead>
        <tbody class="usuario">
`;

    usuarios.usuario.forEach(item => {
        html += `
        <tr>
            <td>${item.correo}</td>
            <td>${item.rol}</td>
            <td>
                <button class="botonAscender" value="${item._id}" data-rol="admin">ASCENDER</button>
                <button class="botonDegradar" value="${item._id}" data-rol="usuario">DEGRADAR</button>
            </td>
        </tr> `;
    });

    html += `
        </tbody>`;

    divResultados.innerHTML = html;
    divResultados.addEventListener("click", async (e) => {
        let idUsuario;
        let rol;
        if (e.target.classList.contains("botonAscender")) {
            idUsuario = e.target.value
            rol = e.target.dataset.rol
        }
        if (e.target.classList.contains("botonDegradar")) {
            idUsuario = e.target.value
            rol = e.target.dataset.rol
        }
        if (idUsuario != null && rol != null) {
            let ruta = "/admin/actualizarRol/" + idUsuario
            let objeto = {
                idUser: idUsuario,
                rol: rol
            }
            const resultado2 = await fetch(ruta, {
                method: "PATCH",
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(objeto)
            })

            if (resultado2.ok) {
                let boton = divResultados.querySelectorAll(`button[value="${idUsuario}"]`)
                let container = boton[0].closest("tr")
                let parrafo = container.querySelectorAll("td, th")
                
                parrafo[1].innerHTML = `${rol}`
            }
        }
    })
    console.log(usuarios)
})

