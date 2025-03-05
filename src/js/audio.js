document.addEventListener("DOMContentLoaded", function () {
    const audioInput = document.getElementById("audioInput");
    const uploadButton = document.getElementById("uploadAudio");
    const audioList = document.getElementById("audioList");

    const openAudioModal = document.getElementById("openAudioModal");
    const closeAudioModal = document.getElementById("closeAudioModal");
    const audioModal = document.getElementById("audioModal");

    // 🔹 Carrega áudios ao iniciar
    loadAudios();

    // 🔹 Abre o modal ao clicar no botão
    openAudioModal.addEventListener("click", function () {
        audioModal.classList.remove("hidden");
        audioModal.style.display = "block";
    });

    // 🔹 Fecha o modal
    closeAudioModal.addEventListener("click", function () {
        audioModal.classList.add("hidden");
        audioModal.style.display = "none";
    });

    // 🔹 Evento para enviar o áudio
    uploadButton.addEventListener("click", function () {
        const file = audioInput.files[0];
        if (!file) {
            alert("Selecione um arquivo de áudio primeiro!");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const audioData = event.target.result;
            saveAudio(file.name, audioData);
            displayAudio(file.name, audioData);
            closeAudioModal.click(); // Fecha o modal após enviar
        };
        reader.readAsDataURL(file);
    });

    // 🔹 Salva áudio no localStorage
    function saveAudio(name, data) {
        let audios = JSON.parse(localStorage.getItem("audios")) || [];
        audios.push({ name, data });
        localStorage.setItem("audios", JSON.stringify(audios));
    }

    // 🔹 Carrega áudios do localStorage
    function loadAudios() {
        let audios = JSON.parse(localStorage.getItem("audios")) || [];
        audios.forEach(audio => {
            displayAudio(audio.name, audio.data);
        });
    }

    // 🔹 Exibe um áudio na lista
    function displayAudio(name, data) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${name}</span>
            <audio controls>
                <source src="${data}" type="audio/mp3">
                Seu navegador não suporta este áudio.
            </audio>
            <button class="deleteAudio">❌</button>
        `;
        audioList.appendChild(listItem);

        // 🔹 Botão para remover áudio
        listItem.querySelector(".deleteAudio").addEventListener("click", function () {
            deleteAudio(name, listItem);
        });
    }

    // 🔹 Remove áudio do localStorage e da lista
    function deleteAudio(name, listItem) {
        let audios = JSON.parse(localStorage.getItem("audios")) || [];
        audios = audios.filter(audio => audio.name !== name);
        localStorage.setItem("audios", JSON.stringify(audios));
        listItem.remove();
    }
});
