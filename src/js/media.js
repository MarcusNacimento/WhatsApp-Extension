document.addEventListener("DOMContentLoaded", function () {
    const uploadContainer = document.getElementById("mediaUploadContainer");
    const mediaInput = document.getElementById("mediaUploadInput");
    const previewArea = document.getElementById("mediaPreview");
  
    window.abrirModalMedia = function () {
      document.getElementById("mediaModal").classList.remove("hidden");
      document.getElementById("mediaOverlay").classList.remove("hidden");
      previewArea.innerHTML = "";
      document.getElementById("saveMedia").disabled = true;
    };
  
    function fecharModalMedia() {
      document.getElementById("mediaModal").classList.add("hidden");
      document.getElementById("mediaOverlay").classList.add("hidden");
    }
  
    document.getElementById("closeMediaModal").addEventListener("click", fecharModalMedia);
    document.getElementById("mediaOverlay").addEventListener("click", fecharModalMedia);
  
    uploadContainer.addEventListener("click", () => mediaInput.click());
  
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
  
    mediaInput.addEventListener("change", function () {
      const file = this.files[0];
      handleFile(file);
    });
  
    function handleFile(file) {
      if (!file) return;
  
      const fileType = file.type;
  
      if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
        const reader = new FileReader();
        reader.onload = () => {
          if (fileType.startsWith("image/")) {
            previewArea.innerHTML = `<img src="${reader.result}" alt="Imagem" style="max-width: 100%;"/>`;
          } else {
            previewArea.innerHTML = `
              <video controls style="max-width: 100%;">
                <source src="${reader.result}" type="${fileType}">
                Seu navegador não suporta vídeo.
              </video>
            `;
          }
          document.getElementById("saveMedia").disabled = false;
        };
        reader.readAsDataURL(file);
      } else {
        alert("❌ Apenas imagens e vídeos são permitidos.");
      }
    }
  
    document.getElementById("saveMedia").addEventListener("click", () => {
      const nameInput = document.getElementById("mediaNameInput");
      const mediaName = nameInput.value.trim();
  
      if (!mediaName) {
        alert("⚠️ Por favor, dê um nome para a mídia antes de salvar.");
        return;
      }
  
      const mediaElement = previewArea.querySelector("img, video");
      if (!mediaElement) {
        alert("Nenhuma mídia para salvar!");
        return;
      }
  
      const isImage = mediaElement.tagName.toLowerCase() === "img";
      const src = isImage ? mediaElement.src : mediaElement.querySelector("source")?.src;
  
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
  
      chrome.storage.local.get(["media"], (result) => {
        const data = result.media || [];
        data.push(newData);
  
        chrome.storage.local.set({ media: data }, () => {
          window.renderList("media");
          alert("✅ Mídia salva com sucesso!");
          fecharModalMedia();
        });
      });
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
      } else {
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
  