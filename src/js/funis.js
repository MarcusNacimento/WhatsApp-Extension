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
        li.innerHTML = `<strong>${funnel.name}</strong> - Delay: ${funnel.delay}s - Etapas: ${funnel.steps.length}`;
        funnelsList.appendChild(li);
    });
}

window.executarFunil = async function(funnel) {
    if (!funnel || !funnel.steps || funnel.steps.length === 0) {
        alert("Funil vazio ou inválido!");
        return;
    }

    for (let i = 0; i < funnel.steps.length; i++) {
        const step = funnel.steps[i];
        console.log(`Executando etapa ${i + 1}:`, step);

        // Aqui você pode chamar as funções específicas para mensagem, audio, etc.
        if (step.type === "messages") {
            console.log("⚡ Enviando mensagem:", step.item.name);
            // sua lógica de envio de mensagem
        } else if (step.type === "audio") {
            console.log("🎧 Enviando áudio:", step.item.name);
            // sua lógica de envio de áudio
        } else if (step.type === "media") {
            console.log("🖼️ Enviando mídia:", step.item.name);
            // sua lógica de envio de mídia
        } else if (step.type === "documents") {
            console.log("📄 Enviando documento:", step.item.name);
            // sua lógica de envio de documento
        }

        // Delay entre as etapas
        await new Promise(resolve => setTimeout(resolve, funnel.delay * 1000));
    }

    alert("✅ Funil concluído com sucesso!");
};
