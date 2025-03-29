document.addEventListener("DOMContentLoaded", function () {
    const uploadContainer = document.getElementById("mediaUploadContainer");
    const mediaInput = document.getElementById("mediaUploadInput");
    const previewArea = document.getElementById("mediaPreview");


    window.abrirModalMedia = function () {
        const mediaModal = document.getElementById("mediaModal");
        const mediaOverlay = document.getElementById("mediaOverlay");
        const saveMediaButton = document.getElementById("saveMedia");

        mediaModal.classList.remove("hidden");
        mediaOverlay.classList.remove("hidden");

        document.getElementById("mediaPreview").innerHTML = "";
        saveMediaButton.disabled = true;
    };

    function fecharModalMedia() {
        document.getElementById("mediaModal").classList.add("hidden");
        document.getElementById("mediaOverlay").classList.add("hidden");
    }

    document.getElementById("closeMediaModal").addEventListener("click", fecharModalMedia);
    document.getElementById("mediaOverlay").addEventListener("click", fecharModalMedia);

    // Clique na área para abrir o seletor
    uploadContainer.addEventListener("click", () => {
        mediaInput.click();
    });

    // Drag & Drop
    uploadContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadContainer.classList.add("dragover");
    });

    uploadContainer.addEventListener("dragleave", () => {
        uploadContainer.classList.remove("dragover");
    });

    uploadContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadContainer.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // Upload pelo botão
    mediaInput.addEventListener("change", function () {
        const file = this.files[0];
        handleFile(file);
    });

    // Função para tratar o arquivo
    function handleFile(file) {
        if (!file) return;

        const fileType = file.type;

        // Verifica se é imagem ou vídeo
        if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
            const reader = new FileReader();
            reader.onload = () => {
                if (fileType.startsWith("image/")) {
                    previewArea.innerHTML = `<img src="${reader.result}" alt="Imagem" style="max-width: 100%;"/>`;
                } else if (fileType.startsWith("video/")) {
                    previewArea.innerHTML = `
                        <video controls style="max-width: 100%;">
                            <source src="${reader.result}" type="${fileType}">
                            Seu navegador não suporta vídeo.
                        </video>
                    `;
                }
                // Ativa o botão após carregar a mídia
                const saveMediaButton = document.getElementById("saveMedia");
                saveMediaButton.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            alert("❌ Apenas imagens e vídeos são permitidos.");
        }
    }

    const saveMediaButton = document.getElementById("saveMedia");

    saveMediaButton.addEventListener("click", () => {
        const nameInput = document.getElementById("mediaNameInput");
        const mediaName = nameInput.value.trim();

        if (!mediaName) {
            alert("⚠️ Por favor, dê um nome para a mídia antes de salvar.");
            return;
        }

        const mediaElements = previewArea.querySelector("img, video");

        if (!mediaElements) {
            alert("Nenhuma mídia para salvar!");
            return;
        }

        const isImage = mediaElements.tagName.toLowerCase() === "img";
        const src = isImage ? mediaElements.src : mediaElements.querySelector("source")?.src;

        if (!src) {
            alert("Erro ao capturar a mídia.");
            return;
        }

        const newData = {
            name: mediaName,
            type: isImage ? "image" : "video",
            src: src,
            timestamp: new Date().toISOString()
        };

        const data = JSON.parse(localStorage.getItem("media")) || [];
        data.push(newData);

        try {
            localStorage.setItem("media", JSON.stringify(data));

            // ✅ Somente executa se salvar com sucesso:
            window.renderList("media");
            alert("✅ Mídia salva com sucesso!");
            fecharModalMedia();

        } catch (e) {
            if (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                alert("❌ A mídia é muito grande para ser salva. Tente um arquivo menor (até 5MB).");
            } else {
                alert("❌ Erro ao salvar a mídia.");
                console.error(e);
            }
        }

        //  Atualiza a lista ao salvar sem precisar dar F5
        window.renderList("media");

        alert("✅ Mídia salva com sucesso!");

        fecharModalMedia();
    });

    window.abrirPreviewModal = function (item) {
        const modal = document.createElement("div");
        modal.className = "custom-preview-modal";

        const overlay = document.createElement("div");
        overlay.className = "custom-overlay";

        const content = document.createElement("div");
        content.className = "custom-preview-content";


        if (item.type === "image") {
            content.innerHTML = `<img src="${item.src}" style="max-width: 600px; max-height: 400px; object-fit: contain;">`;
        } else if (item.type === "video") {
            content.innerHTML = `
                <video controls style="max-width: 600px; max-height: 400px; object-fit: contain;">
                    <source src="${item.src}" type="video/mp4">
                </video>
            `;
        }

        modal.appendChild(overlay);
        modal.appendChild(content);
        document.body.appendChild(modal);

        overlay.addEventListener("click", () => document.body.removeChild(modal));
    };

});
