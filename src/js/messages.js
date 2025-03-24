document.addEventListener("DOMContentLoaded", () => {
    renderList("messages");

    // Exemplo: botão de adicionar nova mensagem
    document.getElementById("messagesButtonAddButton").addEventListener("click", () => {
        const name = prompt("Digite o nome da mensagem:");
        if (name) {
            addMessage({ name });
        }
    });
});


window.abrirMensagemModal = function (item) {
    const modal = document.getElementById("messagePreviewModal");
    const overlay = document.getElementById("messagePreviewOverlay");
    const container = document.getElementById("messagePreviewContent");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    container.innerHTML = '';

    container.innerHTML = `
        <h3>Mensagem</h3>
        <p><strong>Nome:</strong> ${item.name || 'Sem nome'}</p>
        <p><strong>Conteúdo:</strong> ${item.content || 'Sem conteúdo'}</p>
        <div style="margin-top: 10px;">
            <button id="fecharMensagemModal" class="close-btn">Fechar</button>
        </div>
    `;

    document.getElementById("fecharMensagemModal").addEventListener("click", () => {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    });
};

function addMessage(message) {
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push(message);
    localStorage.setItem("messages", JSON.stringify(messages));
    renderList("messages");
}

window.renderList = function (category) {
    const listElement = document.getElementById(`${category}List`);
    const countElement = document.getElementById(`count-${category}`);

    if (!listElement) return;

    const data = JSON.parse(localStorage.getItem(category)) || [];
    listElement.innerHTML = "";

    data.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name || "Sem nome"}
            <button class="remove-btn">Remover</button>
        `;
        li.querySelector(".remove-btn").addEventListener("click", () => {
            data.splice(index, 1);
            localStorage.setItem(category, JSON.stringify(data));
            renderList(category);
        });
        listElement.appendChild(li);
    });

    if (countElement) {
        countElement.textContent = data.length;
    }
};