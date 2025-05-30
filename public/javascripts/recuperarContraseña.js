let formulario = document .querySelector("#recuperar")
let input = formulario.elements.correo
let boton = document .querySelector("#recuperar div button[type='submit']")

console.log(boton)
formulario.addEventListener("input",validarCorreo)
function validarCorreo(){
    let patron = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    let valor = input.value
    console.log(boton)
    
    if(valor.match(patron)){
        boton.style.cursor = "pointer"
        boton.style.background="linear-gradient(90deg, #ff6700, #ff8b2c)"
        boton.style.boxShadow="1px 1px 20px -5px #ff6700"
        boton.style.border="navajowhite"
        boton.style.color="#fff"
        boton.style.fontWeight="bolder"
        boton.disabled = false
    }else{
        boton.style.cursor = "initial"
        boton.style.background="#dddddb"
        boton.style.boxShadow="none"
        boton.style.border="none",
        boton.style.color="black"
        boton.style.fontWeight="normal"
        boton.disabled = true
    }
}