// messages.js
let messages = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("messagesButtonAddButton").addEventListener("click", () => {
    document.getElementById("messageModal").classList.remove("hidden");
    document.getElementById("messageModalOverlay").classList.remove("hidden");
  });

  document.getElementById("saveMessage").addEventListener("click", () => {
    const name = document.getElementById("messageNameInput").value.trim();
    const content = document.getElementById("messageTextInput").value.trim();

    if (name && content) {
      addMessage({ name, content });
      document.getElementById("messageNameInput").value = "";
      document.getElementById("messageTextInput").value = "";
      document.getElementById("messageModal").classList.add("hidden");
      document.getElementById("messageModalOverlay").classList.add("hidden");
    } else {
      alert("Preencha todos os campos.");
    }
  });

  document.getElementById("closeMessageModal").addEventListener("click", () => {
    document.getElementById("messageModal").classList.add("hidden");
    document.getElementById("messageModalOverlay").classList.add("hidden");
  });

  document.getElementById("fecharMensagemModal").addEventListener("click", () => {
    document.getElementById("messagePreviewModal").classList.add("hidden");
    document.getElementById("messagePreviewOverlay").classList.add("hidden");
  });
});

function addMessage(message) {
  const data = JSON.parse(localStorage.getItem("messages")) || [];
  data.push(message);
  localStorage.setItem("messages", JSON.stringify(data));
  renderList("messages");
}

window.renderList = function (category) {
  const listElement = document.getElementById("itemList");
  const countElement = document.getElementById(`count-${category}`);

  if (!listElement) return;

  const data = JSON.parse(localStorage.getItem(category)) || [];
  listElement.innerHTML = "";

  data.forEach((item, index) => {
    const listItem = document.createElement("div");
    listItem.classList.add("list-item");

    const name = document.createElement("span");
    name.textContent = item.name || "Sem nome";

    const actions = document.createElement("div");
    actions.classList.add("item-actions");

    const viewButton = document.createElement("button");
    viewButton.textContent = "👁 Visualizar";
    viewButton.addEventListener("click", () => window.abrirMensagemModal(item));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑 Remover";
    deleteButton.addEventListener("click", () => {
      data.splice(index, 1);
      localStorage.setItem(category, JSON.stringify(data));
      renderList(category);
    });

    actions.appendChild(viewButton);
    actions.appendChild(deleteButton);
    listItem.appendChild(name);
    listItem.appendChild(actions);
    listElement.appendChild(listItem);
  });

  if (countElement) {
    countElement.textContent = data.length;
  }
};

window.abrirMensagemModal = function (item) {
  const nome = item?.name || "";
  const conteudo = item?.content || "";

  document.getElementById("previewMessageName").textContent = nome;
  document.getElementById("previewMessageContent").textContent = conteudo;

  document.getElementById("messagePreviewModal").classList.remove("hidden");
  document.getElementById("messagePreviewOverlay").classList.remove("hidden");
};