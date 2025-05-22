let codigosQr = document.querySelectorAll("#qr")

let estadoQr = true

codigosQr.forEach(item=>{
    item.addEventListener("mouseup",()=>{
        item.style.filter = "blur(4px)"
    })
    item.addEventListener("mousedown",()=>{
        item.style.filter = "none"
    })
})