let funnelModal, funnelOverlay, funnelsList, steps = [];

document.addEventListener("DOMContentLoaded", () => {
    funnelModal = document.getElementById("createFunnelModal");
    funnelOverlay = document.getElementById("createFunnelOverlay");
    funnelsList = document.getElementById("funnelsList");
    steps = [];

    // ---------------------
    // SELETOR DE ITENS
    // ---------------------
    window.abrirSeletorItem = function (category) {
        const data = JSON.parse(localStorage.getItem(category)) || [];
        const overlay = document.getElementById("selectItemOverlay");
        overlay.classList.remove("hidden");
    
        // Limpar overlay antes de adicionar o modal novo
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
    

    // ---------------------
    // ABRIR MODAL FUNIL
    // ---------------------
    window.abrirModalFunil = function () {
        funnelModal.classList.remove("hidden");
        funnelOverlay.classList.remove("hidden");
        steps.length = 0;
        renderStepsPreview();

        // Bind nos botões só após o modal estar visível
        document.getElementById("addMessageStep").onclick = () => window.abrirSeletorItem("messages");
        document.getElementById("addAudioStep").onclick = () => window.abrirSeletorItem("audio");
        document.getElementById("addMediaStep").onclick = () => window.abrirSeletorItem("media");
        document.getElementById("addDocumentStep").onclick = () => window.abrirSeletorItem("documents");
    };

    // ---------------------
    // SALVAR FUNIL
    // ---------------------
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

        window.renderList("funnels"); // <-- igual ao documents
        
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

// ---------------------
// ADD STEP E PREVIEW
// ---------------------
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

        // Adicionando o evento programaticamente
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

// ---------------------
// RENDER FUNIS
// ---------------------
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
