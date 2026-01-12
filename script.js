/* ==========================================================================
   1. GESTIONE NOTIZIE (MODIFICA QUI PER AGGIUNGERE NUOVI ARTICOLI)
   ========================================================================== */

const elencoNotizie = [
    {
        titolo: "Prima Notizia",
        data: "12 Gennaio 2026",
        categoria: "Ambiente",
        // L'anteprima è quella che si vede in Home Page
        anteprima: "Prima notizia, continua dopo..",
        // Il testo completo si vede solo nella pagina notizie (puoi usare tag HTML come <br>)
        testoCompleto: "Prima notizia"
    },
    {
        titolo: "Seconda Notizia",
        data: "11 Gennaio 2026",
        categoria: "Politica",
        // L'anteprima è quella che si vede in Home Page
        anteprima: "Seconda notizia, continua dopo..",
        // Il testo completo si vede solo nella pagina notizie (puoi usare tag HTML come <br>)
        testoCompleto: "Seconda notizia"
    }
];

/* --- LOGICA AUTOMATICA NOTIZIE (NON TOCCARE) --- */

// Funzione: Carica l'ultima notizia in Home Page
function caricaAnteprimaHome() {
    const container = document.getElementById("home-news-preview");
    if (!container) return; // Se non siamo in Home, esce

    const ultimaNews = elencoNotizie[0]; // Prende la prima della lista

    container.innerHTML = `
        <div class="preview-header">
            <span class="pulse-dot"></span>
            <span class="preview-label">ULTIM'ORA</span>
        </div>
        <h3>${ultimaNews.titolo}</h3>
        <span class="preview-date"><i class="far fa-clock"></i> ${ultimaNews.data}</span>
        <p>${ultimaNews.anteprima}</p>
        <a href="notizie.html" class="btn-read-more">Leggi tutto <i class="fas fa-arrow-right"></i></a>
    `;
}

// Funzione: Carica tutte le notizie nella pagina News
function caricaListaNotizie() {
    const container = document.getElementById("lista-news-completa");
    if (!container) return; // Se non siamo nella pagina News, esce

    container.innerHTML = ""; // Pulisce

    elencoNotizie.forEach(news => {
        const scheda = document.createElement("div");
        scheda.className = "card news-card-full";
        scheda.innerHTML = `
            <div class="news-header">
                <span class="news-date">${news.data}</span>
                <span class="news-tag">${news.categoria}</span>
            </div>
            <h3>${news.titolo}</h3>
            <p>${news.testoCompleto}</p>
        `;
        container.appendChild(scheda);
    });
}

// Avvia le funzioni notizie quando la pagina è pronta
document.addEventListener("DOMContentLoaded", () => {
    caricaAnteprimaHome();
    caricaListaNotizie();
});


/* ==========================================================================
   2. CONFIGURAZIONE FIREBASE E CHAT (NON TOCCARE)
   ========================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0CYOq216AqY1utez4YIvpKGMCKJkFV30",
  authDomain: "sito-test-dd57e.firebaseapp.com",
  projectId: "sito-test-dd57e",
  storageBucket: "sito-test-dd57e.firebasestorage.app",
  messagingSenderId: "494158775632",
  appId: "1:494158775632:web:4b0454d500630291a09855",
  measurementId: "G-3NNS2JR5LZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* --- MENU MOBILE E SCROLL --- */
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

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
});
document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

/* --- LOGICA CHAT --- */
async function sendMessage() {
    const nameInput = document.getElementById("username-input");
    const msgInput = document.getElementById("message-input");
    const btn = document.getElementById("send-btn");

    if(!nameInput || !msgInput) return; // Evita errori se siamo nella pagina notizie

    const name = nameInput.value.trim();
    const text = msgInput.value.trim();

    if(name === "" || text === "") {
        alert("Inserisci nome e messaggio!");
        return;
    }

    btn.textContent = "Invio...";
    btn.disabled = true;

    try {
        await addDoc(collection(db, "messaggi"), {
            nome: name,
            testo: text,
            data: Date.now()
        });
        msgInput.value = "";
    } catch (e) {
        console.error("Errore invio: ", e);
        alert("Errore nell'invio.");
    }
    btn.textContent = "Pubblica";
    btn.disabled = false;
}

const sendBtn = document.getElementById("send-btn");
if(sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}

// Ascolta i messaggi solo se esiste la chat nella pagina
const board = document.getElementById("message-board");
if(board) {
    const q = query(collection(db, "messaggi"), orderBy("data", "asc"), limit(50));
    onSnapshot(q, (snapshot) => {
        board.innerHTML = ""; 
        snapshot.forEach((doc) => {
            const msg = doc.data();
            renderMessage(msg.nome, msg.testo);
        });
        board.scrollTop = board.scrollHeight;
    });
}

function renderMessage(name, text) {
    const board = document.getElementById("message-board");
    if(!board) return;
    
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