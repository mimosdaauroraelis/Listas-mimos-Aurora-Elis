import { db } from "./firebase.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const lista = document.getElementById("listaReservas");

onSnapshot(collection(db, "reservas"), (snapshot) => {

    lista.innerHTML = "";

    snapshot.forEach((docItem) => {

        const dados = docItem.data();

        lista.innerHTML += `
            <div class="card">

                <h3>${dados.nome}</h3>

                <p><strong>Presente:</strong> ${dados.presenteId}</p>

                <p><strong>WhatsApp:</strong> ${dados.telefone || "-"}</p>

                <p><strong>Mensagem:</strong> ${dados.mensagem || "-"}</p>

            </div>
        `;

    });

});