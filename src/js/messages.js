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
  chrome.storage.local.get(["messages"], (result) => {
    const data = result.messages || [];
    data.push(message);
    chrome.storage.local.set({ messages: data }, () => {
      renderList("messages");
    });
  });
}



window.abrirMensagemModal = function (item) {
  const nome = item?.name || "";
  const conteudo = item?.content || "";

  document.getElementById("previewMessageName").textContent = nome;
  document.getElementById("previewMessageContent").textContent = conteudo;

  document.getElementById("messagePreviewModal").classList.remove("hidden");
  document.getElementById("messagePreviewOverlay").classList.remove("hidden");
};
