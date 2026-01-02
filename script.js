/* --- 1. IMPORTA FIREBASE (Versione Web) --- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* --- 2. LA TUA CONFIGURAZIONE (I tuoi dati reali) --- */
const firebaseConfig = {
  apiKey: "AIzaSyB0CYOq216AqY1utez4YIvpKGMCKJkFV30",
  authDomain: "sito-test-dd57e.firebaseapp.com",
  projectId: "sito-test-dd57e",
  storageBucket: "sito-test-dd57e.firebasestorage.app",
  messagingSenderId: "494158775632",
  appId: "1:494158775632:web:4b0454d500630291a09855",
  measurementId: "G-3NNS2JR5LZ"
};

// Inizializza l'App e il Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* --- 3. GESTIONE MENU MOBILE E SCROLL (Codice Grafico) --- */
const hamburger = document.querySelector(".hamburger-menu");
const navMenu = document.querySelector(".nav-menu");

if(hamburger) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
}

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Animazione Scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
});
document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));


/* --- 4. LOGICA CHAT REALE (Database) --- */

// Funzione INVIO MESSAGGIO
async function sendMessage() {
    const nameInput = document.getElementById("username-input");
    const msgInput = document.getElementById("message-input");
    const btn = document.getElementById("send-btn");

    const name = nameInput.value.trim();
    const text = msgInput.value.trim();

    if(name === "" || text === "") {
        alert("Inserisci nome e messaggio!");
        return;
    }

    // Effetto caricamento sul bottone
    btn.textContent = "Invio...";
    btn.disabled = true;

    try {
        // Salva su Firestore nella collezione "messaggi"
        await addDoc(collection(db, "messaggi"), {
            nome: name,
            testo: text,
            data: Date.now() // Serve per ordinarli cronologicamente
        });

        // Pulisce solo il campo messaggio (lascia il nome)
        msgInput.value = "";
        
    } catch (e) {
        console.error("Errore invio: ", e);
        alert("Errore nell'invio del messaggio. Controlla la Console.");
    }

    // Ripristina il bottone
    btn.textContent = "Pubblica";
    btn.disabled = false;
}

// Collega il bottone alla funzione
const sendBtn = document.getElementById("send-btn");
if(sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}

// Funzione RICEZIONE MESSAGGI (Tempo Reale)
// Ordina per data (dal più vecchio al più nuovo) e prende gli ultimi 50
const q = query(collection(db, "messaggi"), orderBy("data", "asc"), limit(50));

onSnapshot(q, (snapshot) => {
    const board = document.getElementById("message-board");
    if(!board) return;

    // Pulisce la lavagna prima di ridisegnare
    board.innerHTML = ""; 

    snapshot.forEach((doc) => {
        const msg = doc.data();
        renderMessage(msg.nome, msg.testo);
    });

    // Scrolla in basso automaticamente
    board.scrollTop = board.scrollHeight;
});

// Funzione che crea l'HTML del messaggio
function renderMessage(name, text) {
    const board = document.getElementById("message-board");
    const firstLetter = name.charAt(0).toUpperCase();

    const div = document.createElement("div");
    div.classList.add("message-item");
    div.innerHTML = `
        <div class="msg-header">
            <div class="avatar avatar-blue">${firstLetter}</div>
            <strong>${name}</strong>
        </div>
        <p>${text}</p>
    `;
    board.appendChild(div);
}