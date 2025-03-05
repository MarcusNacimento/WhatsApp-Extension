const filterAndAdd = document.getElementById("filterAndAdd");

function showFilterAndAdd(buttonLabel) {
    const filterInput = filterAndAdd.querySelector("#filterInput");
    const clearFilter = filterAndAdd.querySelector("#clearFilter");

    filterInput.placeholder = `Buscar em ${buttonLabel}...`;
    filterAndAdd.classList.remove("hidden");

    // Esconde o botão de limpar ao trocar de categoria
    clearFilter.style.display = "none";

    // Se já houver texto no input, exibe o botão de limpar
    if (filterInput.value.trim() !== "") {
        clearFilter.style.display = "block";
    }
}

const username = "Marcus";
document.getElementById("username").innerText = `Olá, ${username}!`;

const cellnumber = "55 999686600";
document.getElementById("cellnumber").innerText = `${cellnumber}!`;

// Primeiro bloco: Gerencia os menus e alterna entre o "home" e as outras seções
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link"); // Links do menu
    const container = document.querySelector(".container"); // Contêiner principal
    const filterAndAdd = document.getElementById("filterAndAdd"); // Filtro e Adicionar
    const itemList = document.getElementById("itemList"); // Contêiner da lista
    let currentCategory = ""; // Categoria atual

    if (!container) {
        console.error("Elemento .container não foi encontrado.");
        return;
    }

    container.classList.add("visible");
    container.classList.remove("hidden");

    filterAndAdd.style.display = "none"; // Esconde o filtro e adicionar inicialmente

    // Navegação entre categorias
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            const buttonId = link.id;
            const category = buttonId.replace("Button", ""); // Extrai a categoria com base no botão

            if (buttonId === "homeButton") {
                // Para o botão Home, exibe o container principal e esconde o filtro e a lista
                container.classList.remove("hidden");
                container.classList.add("visible");
                filterAndAdd.style.display = "none";
                itemList.classList.add("hidden"); // Esconde a lista
                itemList.innerHTML = "";
                currentCategory = ""; // Reseta a categoria
            } else {
                // Para outros menus
                container.classList.add("hidden");
                container.classList.remove("visible");
                filterAndAdd.style.display = "block"; // Exibe filtro e adicionar
                itemList.classList.remove("hidden"); // Exibe a lista
                currentCategory = category; // Atualiza a categoria atual
                renderList(category); // Renderiza a lista ao entrar na categoria
            }
        });
    });

    // Função para renderizar a lista de itens
    function renderList(category) {
        const itemList = document.getElementById("itemList");

        // Adiciona estilos para permitir rolagem dentro da lista
        itemList.style.maxHeight = "600px"; // Define uma altura máxima
        itemList.style.overflowY = "auto"; // Permite rolagem vertical
        itemList.style.border = "1px solid #ccc"; // Apenas para visualização
        itemList.style.padding = "10px";
        itemList.style.border = "none";


        itemList.innerHTML = ""; // Limpa a lista antes de renderizar

        const data = JSON.parse(localStorage.getItem(category)) || []; // Recupera os dados

        if (data.length === 0) {
            itemList.innerHTML = "<p style='text-align: center;'>Nenhum item adicionado ainda.</p>";
            return;
        }

        data.forEach((item, index) => {
            const listItem = document.createElement("div");
            listItem.classList.add("list-item"); // Adiciona classe para estilização

            // Nome do item
            const itemName = document.createElement("span");
            itemName.classList.add("item-name");
            itemName.textContent = item.name;

            // Data do item
            const itemDate = document.createElement("span");
            itemDate.classList.add("item-date");
            itemDate.textContent = new Date(item.timestamp).toLocaleString();

            // Container de botões
            const itemActions = document.createElement("div");
            itemActions.classList.add("item-actions");

            // Botão Editar
            const editButton = document.createElement("button");
            editButton.classList.add("edit-btn");
            editButton.textContent = "Editar";
            editButton.addEventListener("click", function () {
                openEditModal(category, index, item.name);
            });

            // Botão Excluir
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn");
            deleteButton.textContent = "Deletar";
            deleteButton.addEventListener("click", function () {
                deleteItem(category, index);
            });

            // Monta os elementos na div principal
            itemActions.appendChild(editButton);
            itemActions.appendChild(deleteButton);
            listItem.appendChild(itemName);
            listItem.appendChild(itemDate);
            listItem.appendChild(itemActions);

            itemList.appendChild(listItem);
        });
    }

    // Configura o botão de "Salvar" no formulário
    const addForm = document.getElementById("addForm");
    addForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInputElement = document.getElementById("nameInput");
        const nameInput = nameInputElement.value.trim();


        // Verifica se está editando ou adicionando um novo item
        const isEditing = addForm.getAttribute("data-editing");
        const category = addForm.getAttribute("data-category");
        const index = addForm.getAttribute("data-index");

        if (isEditing && category !== null && index !== null) {
            // Atualiza um item existente
            let data = JSON.parse(localStorage.getItem(category)) || [];
            data[index].name = nameInput; // Atualiza o nome do item editado
            localStorage.setItem(category, JSON.stringify(data));

            renderList(category); // Atualiza a lista na tela
        } else {
            // Adiciona um novo item
            const timestamp = new Date().toISOString();
            const newData = { name: nameInput, timestamp };

            if (currentCategory) {
                let data = JSON.parse(localStorage.getItem(currentCategory)) || [];
                data.push(newData);
                localStorage.setItem(currentCategory, JSON.stringify(data));
                renderList(currentCategory);
            } else {
                console.error("Categoria não configurada!");
            }
        }

        nameInputElement.value = "";
        addModal.classList.add("hidden"); // Fecha o modal

        // Remove os atributos de edição
        addForm.removeAttribute("data-editing");
        addForm.removeAttribute("data-category");
        addForm.removeAttribute("data-index");
    });

    function openEditModal(category, index, currentName) {
        const modalTitle = document.getElementById("modalTitle");
        const nameInput = document.getElementById("nameInput");
        const addModal = document.getElementById("addModal");
        const addForm = document.getElementById("addForm");

        modalTitle.innerText = "Editar Item"; // Muda o título do modal para "Editar"
        nameInput.value = currentName; // Preenche o campo com o valor atual
        addModal.classList.remove("hidden"); // Exibe o modal

        // Remove evento anterior para evitar acúmulo
        addForm.onsubmit = null;

        // Define os atributos para identificar a edição
        addForm.setAttribute("data-editing", "true");
        addForm.setAttribute("data-category", category);
        addForm.setAttribute("data-index", index);
    }

    // Função para excluir itens
    function deleteItem(category, index) {

        const data = JSON.parse(localStorage.getItem(category)) || [];
        data.splice(index, 1); // Remove o item
        localStorage.setItem(category, JSON.stringify(data)); // Atualiza o localStorage
        updateCategoryCounts(); // Atualiza a contagem após adicionar um item
        renderList(category); // Atualiza a lista
    }


});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
    }
}

// Segundo bloco: Alterna visibilidade e configura os botões "Adicionar"
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const filterAndAdd = document.getElementById("filterAndAdd");
    const container = document.querySelector(".container");

    if (!container || !filterAndAdd) {
        console.error("Elementos necessários não encontrados.");
        return;
    }

    // Inicializa a interface
    toggleVisibility(container, true);
    toggleVisibility(filterAndAdd, false);

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            const buttonId = link.id;
            const addButtonId = `${buttonId}AddButton`;

            if (buttonId === "homeButton") {
                // Para o menu Home, esconde tudo
                toggleVisibility(container, true);
                toggleVisibility(filterAndAdd, false);
                hideAllAddButtons(); // Esconde todos os botões
            } else {
                // Para outros menus
                toggleVisibility(container, false);
                toggleVisibility(filterAndAdd, true);
                updateFilterPlaceholder(link.innerText); // Atualiza o placeholder
                showSpecificAddButton(addButtonId); // Mostra o botão específico
            }
        });
    });

    // Atualiza o placeholder do input de filtro
    function updateFilterPlaceholder(label) {
        const filterInput = document.getElementById("filterInput");
        if (filterInput) {
            filterInput.placeholder = `Buscar em ${label}...`;
        }
    }

    // Esconde todos os botões de "Adicionar"
    function hideAllAddButtons() {
        const addButtons = document.querySelectorAll("#filterAndAdd button");
        addButtons.forEach(button => button.classList.add("hidden"));
    }

    // Mostra apenas o botão de "Adicionar" correspondente
    function showSpecificAddButton(addButtonId) {
        hideAllAddButtons(); // Esconde todos primeiro
        const addButton = document.getElementById(addButtonId);
        if (addButton) {
            addButton.classList.remove("hidden");
        } else {
            console.warn(`Botão "Adicionar" não encontrado: ${addButtonId}`);
        }
    }
});

// Função para alternar visibilidade de elementos
function toggleVisibility(element, isVisible) {
    if (element) {
        if (isVisible) {
            element.classList.remove("hidden");
            element.classList.add("visible");
        } else {
            element.classList.remove("visible");
            element.classList.add("hidden");
        }
    }
}

// Terceiro bloco: Gerencia o modal e o formulário de adicionar itens
document.addEventListener("DOMContentLoaded", function () {
    const addModal = document.getElementById("addModal");
    const modalTitle = document.getElementById("modalTitle");
    const closeModalButton = document.getElementById("closeModal");
    const addForm = document.getElementById("addForm");

    // Função para abrir o modal com um título dinâmico
    function openAddModal(title) {
        modalTitle.innerText = `Adicionar em ${title}`;
        addModal.classList.remove("hidden");
    }

    // Função para fechar o modal
    function closeAddModal() {
        addModal.classList.add("hidden");
    }

    // Configura evento para fechar o modal
    closeModalButton.addEventListener("click", closeAddModal);

    // Configura evento de submit no formulário
    addForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o reload da página
        const name = document.getElementById("nameInput").value;
        console.log(`Nome salvo: ${name}`);
        closeAddModal();
    });

    // Vincula os botões "Adicionar" ao modal
    // const addButtons = document.querySelectorAll("#filterAndAdd button");
    // addButtons.forEach(button => {
    //     button.addEventListener("click", function () {
    //         const title = button.innerText.replace("Adicionar nos ", "").replace("Adicionar nas ", "");
    //         openAddModal(title);
    //     });
    // });
});

// Quarto bloco: Gerencia dados no localStorage
document.addEventListener("DOMContentLoaded", function () {
    const audioModal = document.getElementById("audioModal");
    const addModal = document.getElementById("addModal");
    const modalTitle = document.getElementById("modalTitle");
    const closeModalButton = document.getElementById("closeModal");
    const addForm = document.getElementById("addForm");
    const itemList = document.getElementById("itemList");
    let currentCategory = "";

    // 🔹 Verifica se os elementos do DOM foram encontrados
    if (!addModal || !modalTitle || !addForm || !audioModal) {
        console.error("❌ Elementos necessários não foram encontrados no DOM.");
        return;
    }

    console.log("✅ Elementos encontrados, inicializando eventos...");

    // 🔹 Abrir modal de adicionar item
    function openAddModal(title, category) {
        modalTitle.innerText = `Adicionar em ${title}`;
        currentCategory = category;
        addModal.classList.remove("hidden");
    }

    // 🔹 Fechar modal de adicionar item
    function closeAddModal() {
        addModal.classList.add("hidden");
        addForm.reset();
    }

    // 🔹 Abrir modal de gravação de áudio
    function abrirModalAudio() {
        const audioModal = document.getElementById("audioModal");
        const overlay = document.getElementById("audioOverlay");
    
        console.log(audioModal);
        if (!audioModal || !overlay) {
            console.error("❌ Modal de áudio ou overlay não encontrado!");
            return;
        }
    
        console.log("🎤 Abrindo modal de áudio...");
        audioModal.classList.add("show");
        overlay.classList.add("show");
    }
    
    function fecharModalAudio() {
        const audioModal = document.getElementById("audioModal");
        const overlay = document.getElementById("audioOverlay");
    
        if (!audioModal || !overlay) {
            console.error("❌ Modal de áudio ou overlay não encontrado!");
            return;
        }
    
        console.log("❌ Fechando modal de áudio...");
        audioModal.classList.remove("show");
        overlay.classList.remove("show");
    }

    let mediaRecorder;
    let audioChunks = [];

    // 🔹 Captura os botões do modal de áudio e verifica se existem
    const startRecordingButton = document.getElementById("startRecording");
    const stopRecordingButton = document.getElementById("stopRecording");
    const audioPlayback = document.getElementById("audioPlayback");
    const downloadButton = document.getElementById("downloadAudio");

    if (!startRecordingButton || !stopRecordingButton || !audioPlayback || !downloadButton) {
        console.error("❌ Um ou mais botões do modal de áudio não foram encontrados!");
    } else {
        // 🔹 Iniciar gravação
        startRecordingButton.addEventListener("click", () => {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    audioChunks = [];

                    mediaRecorder.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                        const audioUrl = URL.createObjectURL(audioBlob);

                        console.log("🎙️ Gravação concluída:", audioUrl);

                        // Exibir o áudio no player
                        audioPlayback.src = audioUrl;
                        audioPlayback.style.display = "block";

                        // Ativar botão de download
                        downloadButton.style.display = "block";
                        downloadButton.onclick = () => {
                            const a = document.createElement("a");
                            a.href = audioUrl;
                            a.download = "gravacao.webm";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        };
                    };

                    mediaRecorder.start();
                    console.log("🎙️ Gravação iniciada...");
                    startRecordingButton.disabled = true;
                    stopRecordingButton.disabled = false;
                })
                .catch(error => {
                    alert("Erro ao acessar o microfone. Verifique as permissões.");
                    console.error("❌ Erro ao acessar o microfone:", error);
                });
        });

        // 🔹 Parar gravação
        stopRecordingButton.addEventListener("click", () => {
            if (mediaRecorder) {
                mediaRecorder.stop();
                startRecordingButton.disabled = false;
                stopRecordingButton.disabled = true;
            }
        });
    }

    // 🔹 Função para salvar dados no localStorage
    function saveDataToLocalStorage(category, value) {
        let data = JSON.parse(localStorage.getItem(category)) || [];
        data.push(value);
        localStorage.setItem(category, JSON.stringify(data));
        updateCategoryCounts();
    }

    // 🔹 Recuperar dados do localStorage
    function getDataFromLocalStorage(category) {
        return JSON.parse(localStorage.getItem(category)) || [];
    }

    // 🔹 Evento para fechar o modal de adicionar item
    addForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInput = document.getElementById("nameInput").value.trim();
        const timestamp = new Date().toISOString();
        const newData = { name: nameInput, timestamp };

        if (currentCategory) {
            saveDataToLocalStorage(currentCategory, newData);
        } else {
            console.error("❌ Categoria não configurada!");
        }

        closeAddModal();
    });

    // 🔹 Vincular botões "Adicionar" ao modal
    const addButtons = document.querySelectorAll("#filterAndAdd button");

    addButtons.forEach(button => {
        if (button.id === "audioButtonAddButton") {
            console.log("🎤 Botão de áudio encontrado!");
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                abrirModalAudio();
            });
        } else {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                const title = button.innerText.replace("Adicionar nos ", "").replace("Adicionar nas ", "");
                const category = button.id.replace("AddButton", "");
                console.log(`📝 Abrindo modal para adicionar: ${title} (${category})`);
                openAddModal(title, category);
            });
        }
    });
});


// document.getElementById("clearStorageButton").addEventListener("click", function () {
//     if (confirm("Tem certeza que deseja limpar todos os dados do LocalStorage?")) {
//         localStorage.clear(); // Limpa tudo
//         alert("LocalStorage foi limpo!");
//         location.reload(); // Recarrega a página para aplicar as alterações
//     }
// });

function updateCategoryCounts() {
    const categories = {
        chat: "count-chat",
        audio: "count-audio",
        media: "count-media",
        documents: "count-documents",
        funnels: "count-funnels",
        triggers: "count-triggers"
    };

    Object.keys(categories).forEach(category => {
        const data = JSON.parse(localStorage.getItem(category)) || [];
        const countElement = document.getElementById(categories[category]);

        if (countElement) {
            countElement.textContent = data.length;
        }
    });
}

document.addEventListener("DOMContentLoaded", updateCategoryCounts);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("addModal").classList.add("hidden");
});

document.getElementById("filterInput").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase(); // Obtém o valor do input e converte para minúsculas
    const items = document.querySelectorAll(".list-item"); // Seleciona todos os itens da lista

    items.forEach(item => {
        const itemName = item.querySelector(".item-name").textContent.toLowerCase(); // Pega o nome do item
        if (itemName.includes(searchTerm)) {
            item.style.display = "flex"; // Mostra o item se corresponder à busca
        } else {
            item.style.display = "none"; // Esconde se não corresponder
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link"); // Links do menu
    const filterAndAdd = document.getElementById("filterAndAdd"); // Seção de filtros e adicionar
    const addButtons = document.querySelectorAll("#filterAndAdd button"); // Todos os botões de adicionar

    // Função para esconder todos os botões
    function hideAllAddButtons() {
        addButtons.forEach(button => button.classList.add("hidden"));
    }

    // Evento de clique nos menus
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            const category = link.id.replace("Button", ""); // Obtém a categoria (ex: 'audio', 'chat', etc.)
            const addButton = document.getElementById(category + "ButtonAddButton"); // Encontra o botão correspondente

            // Exibe a área de adicionar
            filterAndAdd.classList.remove("hidden");

            // Esconde todos os botões e mostra só o correto
            hideAllAddButtons();
            if (addButton) {
                addButton.classList.remove("hidden");
            }
        });
    });

    // Vincula os botões de "Adicionar" ao modal
    // addButtons.forEach(button => {
    //     button.addEventListener("click", function () {
    //         const title = button.innerText.replace("Adicionar nos ", "").replace("Adicionar nas ", "");
    //         openAddModal(title);
    //     });
    // });
});
