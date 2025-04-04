document.addEventListener("DOMContentLoaded", function () {
    const uploadContainer = document.getElementById("documentUploadContainer");
    const documentInput = document.getElementById("documentUploadInput");
    const previewArea = document.getElementById("documentPreview");
    const saveButton = document.getElementById("saveDocument");
  
    window.abrirModalDocumento = function () {
      document.getElementById("documentsModal").classList.remove("hidden");
      document.getElementById("documentsOverlay").classList.remove("hidden");
    }
  
    function fecharModalDocumento() {
      document.getElementById("documentsModal").classList.add("hidden");
      document.getElementById("documentsOverlay").classList.add("hidden");
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
  
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
  
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
  
        chrome.storage.local.get(["documents"], (result) => {
          const data = result.documents || [];
          data.push(newData);
  
          chrome.storage.local.set({ documents: data }, () => {
            window.renderList("documents");
            alert("✅ Documento salvo com sucesso!");
            fecharModalDocumento();
          });
        });
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
      container.innerHTML = '';
  
      const fileType = item.fileBase64.split(';')[0];
  
      if (fileType.includes("application/pdf")) {
        container.innerHTML = `<iframe src="${item.fileBase64}" style="width:100%; height:500px;" frameborder="0"></iframe>`;
      } else {
        const blob = new Blob([atob(item.fileBase64.split(',')[1])], { type: item.type || 'application/octet-stream' });
        const blobUrl = URL.createObjectURL(blob);
  
        container.innerHTML = `
          <p>Arquivo: <strong>${item.fileName}</strong></p>
          <div style="margin-top: 10px;">
            <a href="${blobUrl}" target="_blank" class="btn-link">🔗 Abrir no navegador</a>
            <a href="${blobUrl}" download="${item.fileName}" class="btn-link" style="margin-left: 15px;">⬇️ Baixar</a>
          </div>
        `;
      }
    };
  
    document.getElementById("documentPreviewOverlay").addEventListener("click", () => {
      document.getElementById("documentPreviewModal").classList.add("hidden");
      document.getElementById("documentPreviewOverlay").classList.add("hidden");
      document.getElementById("documentPreviewContent").innerHTML = '';
    });
  });
  