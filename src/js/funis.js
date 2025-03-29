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
    const data = JSON.parse(localStorage.getItem(category)) || [];
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

    const funnels = JSON.parse(localStorage.getItem("funnels")) || [];
    funnels.push({ name, delay, steps });
    localStorage.setItem("funnels", JSON.stringify(funnels));

    window.renderList("funnels");
    renderFunnelsList();
    funnelModal.classList.add("hidden");
    funnelOverlay.classList.add("hidden");
    steps = [];
    renderStepsPreview();
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
  const funnels = JSON.parse(localStorage.getItem("funnels")) || [];
  funnelsList.innerHTML = "";

  funnels.forEach((funnel) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${funnel.name}</strong> - Delay: ${funnel.delay}s - Etapas: ${funnel.steps.length}
      <button style="margin-left: 10px;" onclick='executarFunil(${JSON.stringify(funnel)})'>Executar</button>
    `;
    funnelsList.appendChild(li);
  });
}

window.executarFunil = async function (funnel) {
  if (!funnel || !funnel.steps || funnel.steps.length === 0) {
    alert("Funil vazio ou inválido!");
    return;
  }

  const numero = prompt("Digite o número com DDI (ex: 5599999999999):");
  if (!numero || !numero.startsWith("55")) {
    alert("Número inválido.");
    return;
  }

  for (let i = 0; i < funnel.steps.length; i++) {
    const step = funnel.steps[i];
    const tipo = step?.type === "messages" ? "mensagem"
                : step?.type === "audio" ? "audio"
                : step?.type === "media" ? "midia"
                : step?.type === "documents" ? "documento"
                : step?.type;

    let conteudo = "";

    if (step?.type === "messages") {
      conteudo = step?.item?.content || step?.item?.name || "";
    } else if (step?.type === "audio") {
      conteudo = step?.item?.audioBase64 || "";
    } else if (step?.type === "documents") {
      conteudo = step?.item?.fileBase64 || "";
    } else if (step?.type === "media") {
      conteudo = step?.item?.src || "";

      // ✅ Verifica se a mídia é maior que 5MB
      const base64Length = conteudo.length - (conteudo.indexOf(',') + 1);
      const fileSizeInBytes = (base64Length * 3) / 4;
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (fileSizeInBytes > maxSize) {
        alert(`❌ A mídia da etapa ${i + 1} excede o limite de 5MB e não será enviada.`);
        continue;
      }
    }

    if (!tipo || !conteudo) {
      console.warn(`🚫 Etapa inválida na posição ${i + 1}:`, step);
      continue;
    }

    const etapa = {
      tipo,
      conteudo,
      delay: funnel.delay * 1000
    };

    console.log(`➡️ Etapa ${i + 1} montada para envio:`, etapa);

    const resposta = await window.gzappy.enviarEtapa(numero, etapa);
    console.log(`✅ Resposta da etapa ${i + 1}:`, resposta);

    if (!validarRespostaGzappy(resposta)) {
      alert(`Erro ao enviar a etapa ${i + 1}`);
      break;
    }

    await new Promise(resolve => setTimeout(resolve, funnel.delay * 1000));
  }

  alert("✅ Funil concluído com sucesso!");
};
