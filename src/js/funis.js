function validarRespostaGzappy(resposta) {
  return (
    resposta &&
    (
      resposta.status === "success" ||
      (typeof resposta.msg === "string" && resposta.msg.toLowerCase().includes("sent"))
    )
  );
}

let funnelModal, funnelOverlay, funnelsList, steps = [];

document.addEventListener("DOMContentLoaded", () => {
  funnelModal = document.getElementById("createFunnelModal");
  funnelOverlay = document.getElementById("createFunnelOverlay");
  funnelsList = document.getElementById("funnelsList");
  steps = [];

  window.abrirSeletorItem = function (category) {
    chrome.storage.local.get([category], (res) => {
      const data = res[category] || [];
      const overlay = document.getElementById("selectItemOverlay");
      overlay.classList.remove("hidden");
      overlay.innerHTML = "";

      const modal = document.createElement("div");
      modal.classList.add("seletor-modal");
      modal.innerHTML = `<h3>Selecionar ${category}</h3>`;

      data.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("seletor-item");
        itemDiv.innerHTML = `
          <span>${item.name || "Sem nome"}</span>
          <button>Selecionar</button>
        `;
        itemDiv.querySelector("button").addEventListener("click", () => {
          addStep(category, item);
          overlay.classList.add("hidden");
          overlay.innerHTML = "";
        });
        modal.appendChild(itemDiv);
      });

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "Fechar";
      closeBtn.style.marginTop = "10px";
      closeBtn.addEventListener("click", () => {
        overlay.classList.add("hidden");
        overlay.innerHTML = "";
      });

      modal.appendChild(closeBtn);
      overlay.appendChild(modal);
    });
  };

  window.abrirModalFunil = function () {
    funnelModal.classList.remove("hidden");
    funnelOverlay.classList.remove("hidden");
    steps.length = 0;
    renderStepsPreview();

    document.getElementById("addMessageStep").onclick = () => window.abrirSeletorItem("messages");
    document.getElementById("addAudioStep").onclick = () => window.abrirSeletorItem("audio");
    document.getElementById("addMediaStep").onclick = () => window.abrirSeletorItem("media");
    document.getElementById("addDocumentStep").onclick = () => window.abrirSeletorItem("documents");
  };

  document.getElementById("saveFunnel").addEventListener("click", () => {
    const name = document.getElementById("funnelNameInput").value.trim();
    const delay = parseInt(document.getElementById("funnelDelayInput").value);

    if (!name || isNaN(delay)) {
      alert("Preencha o nome do Funil.");
      return;
    }

    chrome.storage.local.get(["funnels"], (result) => {
      const funnels = result.funnels || [];
      funnels.push({ name, delay, steps });

      chrome.storage.local.set({ funnels }, () => {
        console.log("✅ Funil salvo no chrome.storage");
        window.funnelsFromStorage = funnels; // Torna visível para o inject
        window.renderList("funnels");
        renderFunnelsList();
        funnelModal.classList.add("hidden");
        funnelOverlay.classList.add("hidden");
        steps = [];
        renderStepsPreview();
      });
    });
  });

  document.getElementById("closeFunnelModal").addEventListener("click", () => {
    funnelModal.classList.add("hidden");
    funnelOverlay.classList.add("hidden");
    steps = [];
    renderStepsPreview();
  });

  funnelOverlay.addEventListener("click", () => {
    funnelModal.classList.add("hidden");
    funnelOverlay.classList.add("hidden");
    steps = [];
    renderStepsPreview();
  });

  renderFunnelsList();
});

function addStep(type, item) {
  steps.push({ type, item });
  renderStepsPreview();
}

window.renderStepsPreview = function () {
  const container = document.getElementById("funnelStepsContainer");
  container.innerHTML = "";

  if (steps.length === 0) {
    container.innerHTML = "<p>Ainda não há etapas neste funil.</p>";
    return;
  }

  steps.forEach((step, index) => {
    const stepDiv = document.createElement("div");
    stepDiv.classList.add("step-preview");
    stepDiv.innerHTML = `
      <span>➕ ${step.type}: ${step.item.name}</span>
      <button class="remove-step-btn">Remover</button>
    `;

    stepDiv.querySelector(".remove-step-btn").addEventListener("click", () => {
      steps.splice(index, 1);
      renderStepsPreview();
    });

    container.appendChild(stepDiv);
  });
};

window.removeStep = function (index) {
  steps.splice(index, 1);
  renderStepsPreview();
};

function renderFunnelsList() {
  if (!funnelsList) return;

  chrome.storage.local.get(["funnels"], (result) => {
    const funnels = result.funnels || [];

    // 🔁 ATUALIZA o window para o inject acessar
    window.funnelsFromStorage = funnels;

    funnelsList.innerHTML = "";

    funnels.forEach((funnel) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${funnel.name}</strong> - Delay: ${funnel.delay}s - Etapas: ${funnel.steps.length}
        <button style="margin-left: 10px;" onclick='executarFunil(${JSON.stringify(funnel)})'>Executar</button>
      `;
      funnelsList.appendChild(li);
    });
  });
}

window.executarFunil = function (funnel) {
  if (typeof window._executarFunilInject === "function") {
    window._executarFunilInject(funnel);
  } else {
    alert("❌ A função de envio automático ainda não foi carregada.");
  }
};
