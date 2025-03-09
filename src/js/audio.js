// audio.js - Gerencia o modal e gravações de áudio
document.addEventListener("DOMContentLoaded", function () {
    const audioModal = document.getElementById("audioModal");
    const audioOverlay = document.getElementById("audioOverlay");
    const openAudioModalButton = document.getElementById("audioButtonAddButton");
    const closeAudioModalButton = document.getElementById("closeAudioModal");
    const startRecordingButton = document.getElementById("startRecording");
    const stopRecordingButton = document.getElementById("stopRecording");
    const saveAudioButton = document.getElementById("saveAudio");
    const audioPlayback = document.getElementById("audioPlayback");

    let mediaRecorder;
    let audioChunks = [];
    let currentCategory = "audio";

    // Função para abrir o modal de áudio
    window.abrirModalAudio = function () {
        audioModal.classList.remove("hidden");
        audioOverlay.classList.remove("hidden");
        audioPlayback.classList.add("hidden");
        saveAudioButton.disabled = true;
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
    };

    saveAudioButton.addEventListener("click", function () {
        const audioNameInput = document.getElementById("audioNameInput");
        const audioName = audioNameInput.value.trim();
    
        if (!audioNameInput.value.trim()) {
            alert("Por favor, dê um nome ao áudio antes de salvar.");
            return;
        }
    
        // Verifica se há um áudio disponível para salvar
        if (audioPlayback.src) {
            const newData = {
                name: audioNameInput,
                audioBase64: audioPlayback.src,
                timestamp: new Date().toISOString()
            };
    
            const data = JSON.parse(localStorage.getItem("audio")) || [];
            data.push(newData);
            localStorage.setItem("audio", JSON.stringify(data));
    
            window.renderList("audio"); // Atualiza a lista globalmente
            alert("Áudio salvo com sucesso!");
    
            saveAudioButton.disabled = true; // Desabilita após salvar
            audioNameInput.value = "";       // Limpa o campo
            fecharModalAudio();              // Fecha o modal após salvar
        }
    });
    
    // Função para fechar o modal de áudio
    function fecharModalAudio() {
        // Remove o foco do elemento atual
        if(document.activeElement) document.activeElement.blur();
    
        audioModal.classList.add("hidden");
        audioOverlay.classList.add("hidden");
        audioPlayback.classList.add("hidden");
    }

    // Eventos de abrir e fechar modal
    openAudioModalButton.addEventListener("click", abrirModalAudio);
    closeAudioModalButton.addEventListener("click", fecharModalAudio);
    audioOverlay.addEventListener("click", fecharModalAudio);

  
    startRecordingButton.addEventListener("click", async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const audioBase64 = reader.result;
        
                const audioNameInput = document.getElementById("audioNameInput");
                const audioName = audioNameInput.value.trim() || "Áudio sem nome";
        
                const newData = {
                    name: audioName,
                    audioBase64,
                    timestamp: new Date().toISOString()
                };
        
                const data = JSON.parse(localStorage.getItem("audio")) || [];
                data.push(newData);
                localStorage.setItem("audio", JSON.stringify(data));
        
                window.renderList("audio"); // <-- Atualiza a lista global
            };
        
            audioPlayback.src = URL.createObjectURL(audioBlob);
            audioPlayback.classList.remove("hidden");
            saveAudioButton.disabled = false;
        };        

        mediaRecorder.start();
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
    });

    stopRecordingButton.addEventListener("click", () => {
        mediaRecorder.stop();
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
        audioModal.classList.add("hidden");
        audioOverlay.classList.add("hidden");
        audioPlayback.classList.add("hidden");
    });

    // Fechar modal ao clicar fora
    audioOverlay.addEventListener("click", fecharModalAudio);
});
