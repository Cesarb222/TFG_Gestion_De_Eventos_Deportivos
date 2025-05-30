let botonIndexFutbol = document.querySelector("#futbol")
let botonIndexRugby = document.querySelector("#rugby")
let botonIndexOtro = document.querySelector("#otros")

if(botonIndexFutbol){
botonIndexFutbol.addEventListener("click",()=>{
    window.location = "http://localhost:3000/eventos/futbol"
})
}
if(botonIndexRugby){
    botonIndexRugby.addEventListener("click",()=>{
    window.location = "http://localhost:3000/eventos/rugby"
})
}
if(botonIndexOtro){
    botonIndexOtro.addEventListener("click",()=>{
    window.location = "http://localhost:3000/eventos/otro"
}) 
}




let botonRegistro = document.querySelector("#registro")
let botonLogin = document.querySelector("#login")
if(botonRegistro){
    botonRegistro.addEventListener("click",()=>{
        window.location = "http://localhost:3000/users/signup"
    })
}
if(botonLogin){
    botonLogin.addEventListener("click",()=>{
        window.location = "http://localhost:3000/users/signin"
    })
}
