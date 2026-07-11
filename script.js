import { presentes } from "./presentes.js";
import { db } from "./firebase.js";

import {
  doc,
  setDoc,
  onSnapshot,
  collection
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ---------- ELEMENTOS ----------

const contador = document.getElementById("contador");
const pesquisa = document.getElementById("pesquisa");

const categorias = {
    higiene: document.getElementById("higiene"),
    acessorios: document.getElementById("acessorios"),
    roupinhas: document.getElementById("roupinhas"),
    calcados: document.getElementById("calcados"),
    quarto: document.getElementById("quarto"),
    amamentacao: document.getElementById("amamentacao"),
    passeio: document.getElementById("passeio")
};

let reservas = {};
// ---------- MODAL ----------

const modal = document.getElementById("modalReserva");

const nomeInput = document.getElementById("nomeConvidado");
const telefoneInput = document.getElementById("telefoneConvidado");
const mensagemInput = document.getElementById("mensagemConvidado");

const cancelarReserva = document.getElementById("cancelarReserva");
const confirmarReserva = document.getElementById("confirmarReserva");

let presenteSelecionado = null;

// ---------- CARD ----------

function criarCard(presente) {

    const card = document.createElement("div");
    card.className = "card";

    const reservado = reservas[presente.id] === true;

    let botaoShopee = "";

    if (presente.link) {
        botaoShopee = `
            <a
                href="${presente.link}"
                target="_blank"
                class="btn-link"
            >
                🛒 Ver produto
            </a>
        `;
    }

    card.innerHTML = `
        <div class="nome">${presente.nome}</div>

        <span class="status">
            ${reservado ? "💖 Reservado" : "💕 Disponível"}
        </span>

        ${botaoShopee}

        <button
            class="btn-reservar"
            data-id="${presente.id}"
            ${reservado ? "disabled" : ""}
        >
            ${reservado ? "Reservado" : "Reservar"}
        </button>
    `;

    return card;
}

// ---------- RENDER ----------

function renderizarLista(texto = "") {

    Object.values(categorias).forEach(secao => {
        secao.innerHTML = "";
    });

    const filtro = texto.toLowerCase().trim();

    presentes.forEach(presente => {

        if (
            filtro &&
            !presente.nome.toLowerCase().includes(filtro)
        ) {
            return;
        }

        const secao = categorias[presente.categoria];

        if (!secao) return;

        secao.appendChild(criarCard(presente));

    });

    atualizarContador();

}
// ---------- CONTADOR ----------

function atualizarContador() {

    const total = presentes.length;

    const reservados = Object.values(reservas)
        .filter(valor => valor === true)
        .length;

    contador.textContent =
        `🎁 ${reservados} de ${total} mimos reservados`;

}

// ---------- PESQUISA ----------

pesquisa.addEventListener("input", (e) => {

    renderizarLista(e.target.value);

});

// ---------- RESERVAR ----------

document.addEventListener("click", (e) => {

    console.log("Botão clicado!");

    if (!e.target.classList.contains("btn-reservar")) return;

    presenteSelecionado = e.target.dataset.id;

    nomeInput.value = "";
    telefoneInput.value = "";
    mensagemInput.value = "";

    modal.classList.remove("oculto");

    nomeInput.focus();

});

// ---------- CANCELAR ----------

cancelarReserva.addEventListener("click", () => {

    modal.classList.add("oculto");

});

// ---------- FIREBASE ----------

onSnapshot(collection(db, "reservas"), (snapshot) => {

    reservas = {};

    snapshot.forEach((docItem) => {

        reservas[docItem.id] = docItem.data().reservado === true;

    });

    renderizarLista(pesquisa.value);

});

// ---------- PRIMEIRA RENDERIZAÇÃO ----------

renderizarLista();