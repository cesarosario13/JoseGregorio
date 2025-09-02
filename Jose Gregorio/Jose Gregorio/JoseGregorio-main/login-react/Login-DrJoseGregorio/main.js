const container = document.querySelector(".container");
const btnRegistrate = document.getElementById("btn-registrate");
const btnSingUp = document.getElementById("btn-sing-up");

btnRegistrate.addEventListener("click", ()=>{
    container.classList.add("toggle");
});
btnSingUp.addEventListener("click", ()=>{
    container.classList.remove("toggle");
});