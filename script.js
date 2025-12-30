/* --- GESTIONE MENU MOBILE --- */
const hamburger = document.querySelector(".hamburger-menu");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

/* --- SCROLL ANIMATION OBSERVER --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } 
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

/* --- LOGICA CHAT SIMULATA --- */
function postMessage() {
    // 1. Prendo i valori
    const nameInput = document.getElementById("username-input");
    const msgInput = document.getElementById("message-input");
    const board = document.getElementById("message-board");
    
    const name = nameInput.value;
    const text = msgInput.value;

    // 2. Controllo se sono vuoti
    if(name.trim() === "" || text.trim() === "") {
        alert("Inserisci un nome e un messaggio!");
        return;
    }

    // 3. Creo l'iniziale per l'avatar
    const firstLetter = name.charAt(0).toUpperCase();

    // 4. Creo il nuovo elemento HTML
    const newMessageDiv = document.createElement("div");
    newMessageDiv.classList.add("message-item");
    
    newMessageDiv.innerHTML = `
        <div class="msg-header">
            <div class="avatar avatar-blue">${firstLetter}</div>
            <strong>${name}</strong>
            <span>Adesso</span>
        </div>
        <p>${text}</p>
    `;

    // 5. Aggiungo alla lista
    board.appendChild(newMessageDiv);

    // 6. Pulisco i campi e scrollo in basso
    nameInput.value = "";
    msgInput.value = "";
    board.scrollTop = board.scrollHeight;
}