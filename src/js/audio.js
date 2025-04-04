document.addEventListener("DOMContentLoaded", function () {
  const audioModal = document.getElementById("audioModal");
  const audioOverlay = document.getElementById("audioOverlay");
  const openAudioModalButton = document.getElementById("audioButtonAddButton");
  const closeAudioModalButton = document.getElementById("closeAudioModal");
  const startRecordingButton = document.getElementById("startRecording");
  const stopRecordingButton = document.getElementById("stopRecording");
  const saveAudioButton = document.getElementById("saveAudio");
  const audioPlayback = document.getElementById("audioPlayback");
  const audioNameInput = document.getElementById("audioNameInput");

  let mediaRecorder;
  let audioChunks = [];
  let currentAudioBase64 = "";

  window.abrirModalAudio = function () {
    audioModal.classList.remove("hidden");
    audioOverlay.classList.remove("hidden");
    audioPlayback.classList.add("hidden");
    saveAudioButton.disabled = true;
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
  };

  window.salvarAudio = function(nome, base64) {
    const id = crypto.randomUUID();
    const novoAudio = {
      id,
      name: nome,
      audioBase64: base64,
      timestamp: new Date().toISOString(),
      isFavorite: false,
      asViewOnce: false,
      isPtv: false
    };

    chrome.storage.local.get(["audio"], (result) => {
      const lista = result.audio || [];
      lista.push(novoAudio);
      chrome.storage.local.set({ audio: lista }, () => {
        window.renderList?.("audio");
        alert("✅ Áudio salvo com sucesso!");
        saveAudioButton.disabled = true;
        audioNameInput.value = "";
        fecharModalAudio();
      });
    });
  }

  saveAudioButton.addEventListener("click", function () {
    const nome = audioNameInput.value.trim();
    if (!nome) {
      alert("Por favor, dê um nome ao áudio antes de salvar.");
      return;
    }
    if (!currentAudioBase64) {
      alert("Nenhum áudio para salvar.");
      return;
    }

    salvarAudio(nome, currentAudioBase64);
  });

  function fecharModalAudio() {
    if (document.activeElement) document.activeElement.blur();
    audioModal.classList.add("hidden");
    audioOverlay.classList.add("hidden");
    audioPlayback.classList.add("hidden");
  }

  openAudioModalButton.addEventListener("click", abrirModalAudio);
  closeAudioModalButton.addEventListener("click", fecharModalAudio);
  audioOverlay.addEventListener("click", fecharModalAudio);

  startRecordingButton.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/ogg; codecs=opus" // ✅ Formato compatível com WhatsApp
    });

    audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
      const reader = new FileReader();

      reader.onloadend = () => {
        currentAudioBase64 = reader.result;
        audioPlayback.src = URL.createObjectURL(audioBlob);
        audioPlayback.classList.remove("hidden");
        saveAudioButton.classList.remove("hidden");
        saveAudioButton.disabled = false;
      };

      reader.readAsDataURL(audioBlob);
    };

    mediaRecorder.start();
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
  });

  stopRecordingButton.addEventListener("click", () => {
    mediaRecorder.stop();
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
  });
});

// Upload via clique ou drag'n'drop
const uploadContainer = document.getElementById("audioUploadContainer");
const audioUploadInput = document.getElementById("audioUploadInput");

uploadContainer.addEventListener("click", () => audioUploadInput.click());

audioUploadInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) handleAudioFile(file);
});

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
  if (file && file.type.startsWith("audio/")) {
    handleAudioFile(file);
  } else {
    alert("Por favor, arraste somente arquivos de áudio.");
  }
});

function handleAudioFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result;
    salvarAudio(file.name, base64);
  };
  reader.onerror = () => alert("Ocorreu um erro ao ler o arquivo.");
  reader.readAsDataURL(file);
}

