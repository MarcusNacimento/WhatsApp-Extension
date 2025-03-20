document.addEventListener("DOMContentLoaded", function () {
    const uploadContainer = document.getElementById("documentUploadContainer");
    const documentInput = document.getElementById("documentUploadInput");
    const previewArea = document.getElementById("documentPreview");
    const saveButton = document.getElementById("saveDocument");

    window.abrirModalDocumento = function () {
        const modal = document.getElementById("documentsModal");
        const overlay = document.getElementById("documentsOverlay");

        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");
    }

    function fecharModalDocumento() {
        const modal = document.getElementById("documentsModal");
        const overlay = document.getElementById("documentsOverlay");

        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    }

    document.getElementById("closeDocumentsModal").addEventListener("click", fecharModalDocumento);
    document.getElementById("documentsOverlay").addEventListener("click", fecharModalDocumento);

    uploadContainer.addEventListener("click", () => documentInput.click());

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

    documentInput.addEventListener("change", function () {
        const file = this.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (!file) return;

        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

        if (allowedTypes.includes(file.type)) {
            previewArea.innerHTML = `<p>📄 Arquivo: ${file.name}</p>`;
            saveButton.disabled = false;

            saveButton.onclick = () => salvarDocumento(file);
        } else {
            alert("❌ Apenas PDF, DOC, DOCX, XLS ou XLSX são permitidos.");
        }
    }

    function salvarDocumento(file) {
        const nameInput = document.getElementById("documentNameInput");
        const docName = nameInput.value.trim();

        if (!docName) {
            alert("⚠️ Dê um nome ao documento.");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const newData = {
                name: docName,
                fileBase64: reader.result,
                fileName: file.name,
                timestamp: new Date().toISOString()
            };

            const data = JSON.parse(localStorage.getItem("documents")) || [];
            data.push(newData);
            localStorage.setItem("documents", JSON.stringify(data));

            window.renderList("documents"); // Atualiza a lista

            alert("✅ Documento salvo com sucesso!");
            fecharModalDocumento();
        };
    }

    window.baixarDocumento = function (item) {
        const link = document.createElement("a");
        link.href = item.fileBase64;
        link.download = item.fileName || "documento";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    window.abrirDocumentoModal = function (item) {
        const modal = document.getElementById("documentPreviewModal");
        const overlay = document.getElementById("documentPreviewOverlay");
        const container = document.getElementById("documentPreviewContent");

        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");

        // Limpa o modal antes
        container.innerHTML = '';

        if (item.fileBase64.startsWith("data:application/pdf")) {
            // Mostra o PDF direto no modal
            container.innerHTML = `<iframe src="${item.fileBase64}" style="width:100%; height:500px;" frameborder="0"></iframe>`;
        } else {
            container.innerHTML = `<p>Visualização não disponível para este formato. Use o botão de download.</p>`;
        }
    }

    document.getElementById("documentPreviewOverlay").addEventListener("click", () => {
        fecharDocumentoModal();
    });

    // Função de fechar
    function fecharDocumentoModal() {
        const modal = document.getElementById("documentsModal");
        const overlay = document.getElementById("documentsOverlay");
    
        // Limpar campos do modal de upload
        document.getElementById("documentNameInput").value = '';
        document.getElementById("documentUploadInput").value = '';
        document.getElementById("documentPreview").innerHTML = '';
        document.getElementById("saveDocument").disabled = true;
    
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    }

    function fecharDocumentoPreviewModal() {
        const modal = document.getElementById("documentPreviewModal");
        const overlay = document.getElementById("documentPreviewOverlay");
        document.getElementById("documentPreviewContent").innerHTML = ''; // Limpa o iframe
    
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    }
    
    document.getElementById("documentPreviewOverlay").addEventListener("click", fecharDocumentoPreviewModal);

});
