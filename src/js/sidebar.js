const filterAndAdd = document.getElementById("filterAndAdd");

// Primeiro bloco: Gerencia os menus e alterna entre o "home" e as outras seções
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link"); // Links do menu
    const container = document.querySelector(".container"); // Contêiner principal
    const filterAndAdd = document.getElementById("filterAndAdd"); // Filtro e Adicionar
    const itemList = document.getElementById("itemList"); // Contêiner da lista
    let currentCategory = ""; // Categoria atual

    filterAndAdd.style.display = "none"; // Esconde o filtro de pesquisa na tela HOME

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            const buttonId = link.id;
            const category = buttonId.replace("Button", ""); // Extrai a categoria com base no botão

            // 🔹 Fecha o modal ao trocar de menu
            closeDetailsModal();

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
    window.openDetailsModal = function (item, category) {
        const detailsContainer = document.getElementById("detailsContainer");

        if (!detailsContainer) {
            console.error("❌ ERRO: O elemento #detailsContainer não foi encontrado no DOM.");
            return;
        }

        detailsContainer.innerHTML = `
          <h3>${item.name}</h3>
          <p>Data: ${item.timestamp ? new Date(item.timestamp).toLocaleString() : "Sem data"}</p>
          <p>Categoria: ${category}</p>
        `;

        detailsContainer.classList.remove("hidden");
        detailsContainer.classList.add("visible");
        detailsContainer.style.display = "block";

        // ✅ Ouve clique fora apenas uma vez
        setTimeout(() => {
            document.addEventListener(
                "click",
                function handleClickOutside(event) {
                    if (!detailsContainer.contains(event.target)) {
                        closeDetailsModal();
                    }
                },
                { once: true }
            );
        }, 10); // espera o modal abrir antes de ativar o ouvinte
    };


    function closeDetailsModal() {
        let detailsContainer = document.getElementById("detailsContainer");

        if (detailsContainer) {
            detailsContainer.classList.remove("visible");
            detailsContainer.classList.add("hidden");
            detailsContainer.style.display = "none"; // Esconde corretamente
        }
    }


    window.renderList = function (category) {
        const itemList = document.getElementById("itemList");
    
        itemList.style.maxHeight = "600px";
        itemList.style.overflowY = "auto";
        itemList.style.padding = "10px";
        itemList.innerHTML = "";
    
        chrome.storage.local.get([category], (result) => {
            const data = result[category] || [];
    
            if (data.length === 0) {
                itemList.innerHTML = "<p style='text-align: center;'>Nenhum item adicionado ainda.</p>";
                return;
            }
    
            data.forEach((item, index) => {
                const listItem = document.createElement("div");
                listItem.classList.add("list-item");
    
                const itemName = document.createElement("span");
                itemName.classList.add("item-name");
                itemName.textContent = item.name;
    
                const itemActions = document.createElement("div");
                itemActions.classList.add("item-actions");
    
                const editButton = document.createElement("button");
                editButton.classList.add("edit-btn");
                editButton.textContent = "Editar";
                editButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openEditModal(category, index, item.name);
                });
    
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("delete-btn");
                deleteButton.textContent = "Deletar";
                deleteButton.addEventListener("click", (e) => {
                    e.stopPropagation();
    
                    data.splice(index, 1);
                    chrome.storage.local.set({ [category]: data }, () => {
                        renderList(category);
                    });
                });
    
                listItem.appendChild(itemName);
                itemActions.appendChild(editButton);
                itemActions.appendChild(deleteButton);
                listItem.appendChild(itemActions);
                console.log(category);
    
                if (category === "messages") {
                    const messageBox = document.createElement("span");
                    messageBox.classList.add("message-box");
                    listItem.appendChild(messageBox);
    
                    const viewButton = document.createElement("button");
                    viewButton.textContent = "👁 Visualizar";
                    viewButton.addEventListener("click", () => {
                        window.abrirMensagemModal(item);
                    });
    
                    listItem.appendChild(viewButton);
                }
                
                else if (category === "audio" && item.audioBase64) {
                    const audioIcon = document.createElement("span");
                    audioIcon.textContent = "🎧 Áudio";
                  
                    const audioPlayer = document.createElement("audio");
                    audioPlayer.controls = true;
                    audioPlayer.src = item.audioBase64;
                    audioPlayer.style.display = "block";
                    audioPlayer.style.marginTop = "8px";
                  
                    const downloadButton = document.createElement("button");
                    downloadButton.textContent = "⬇️ Baixar";
                    downloadButton.style.marginLeft = "10px";
                    downloadButton.addEventListener("click", (e) => {
                      e.stopPropagation();
                      const a = document.createElement("a");
                      a.href = item.audioBase64;
                      a.download = item.name || "audio.webm";
                      a.click();
                    });
                  
                    const favoriteButton = document.createElement("button");
                    favoriteButton.textContent = item.isFavorite ? "⭐ Desfavoritar" : "☆ Favoritar";
                    favoriteButton.style.marginLeft = "10px";
                    favoriteButton.addEventListener("click", (e) => {
                      e.stopPropagation();
                      item.isFavorite = !item.isFavorite;
                      chrome.storage.local.get(["audio"], (res) => {
                        const lista = res.audio || [];
                        lista[index] = item;
                        chrome.storage.local.set({ audio: lista }, () => renderList(category));
                      });
                    });
                  
                    listItem.appendChild(audioIcon);
                    listItem.appendChild(audioPlayer);
                    listItem.appendChild(downloadButton);
                    listItem.appendChild(favoriteButton);
                  }
                  
    
                else if (category === "media" && item.src) {
                    const mediaIcon = document.createElement("span");
                    mediaIcon.textContent = item.type === "image" ? "📷 Imagem" : "🎥 Vídeo";
    
                    const viewButton = document.createElement("button");
                    viewButton.textContent = "👁 Ver mídia";
                    viewButton.style.marginLeft = "10px";
    
                    viewButton.addEventListener("click", (e) => {
                        e.stopPropagation();
                        abrirPreviewModal(item);
                    });
    
                    listItem.appendChild(mediaIcon);
                    listItem.appendChild(viewButton);
                }
    
                else if (category === "documents" && item.fileBase64) {
                    const docIcon = document.createElement("span");
                    docIcon.textContent = "📄 Documento";
    
                    const docName = document.createElement("strong");
                    docName.textContent = ` ${item.name || "Sem Nome"}`;
    
                    const viewButton = document.createElement("button");
                    viewButton.textContent = "📄 Visualizar";
                    viewButton.style.marginLeft = "10px";
    
                    viewButton.addEventListener("click", (e) => {
                        e.stopPropagation();
                        abrirDocumentoModal(item);
                    });
    
                    const downloadButton = document.createElement("button");
                    downloadButton.textContent = "⬇️ Baixar";
                    downloadButton.style.marginLeft = "10px";
    
                    downloadButton.addEventListener("click", (e) => {
                        e.stopPropagation();
                        baixarDocumento(item);
                    });
    
                    listItem.appendChild(viewButton);
                    listItem.appendChild(downloadButton);
                }
    
                else if (category === "funnels" && item.steps) {
                    const funnelIcon = document.createElement("span");
                    funnelIcon.textContent = "🧩 Funil";
    
                    const funilName = document.createElement("strong");
                    funilName.textContent = ` ${item.name}`;
    
                    const stepsCount = document.createElement("span");
                    stepsCount.textContent = ` (${item.steps.length} etapas)`;
    
                    const startButton = document.createElement("button");
                    startButton.textContent = "▶️ Executar Funil";
                    startButton.classList.add("btn-primary");
                    startButton.style.marginLeft = "10px";
    
                    startButton.addEventListener("click", () => {
                        const modal = document.getElementById("executarFunnelModal");
                        document.getElementById("destinoFunnelInput").value = "";
                        window.funilSelecionado = item;
                        modal.classList.remove("hidden");
                    });
    
                    listItem.appendChild(funnelIcon);
                    listItem.appendChild(funilName);
                    listItem.appendChild(stepsCount);
                }
    
                listItem.addEventListener("click", function (e) {
                    e.stopPropagation();
                    window.openDetailsModal(item, category);
                });
    
                itemList.appendChild(listItem);
            });
        });
    };
    
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

        modalTitle.innerText = "Editar Item";
        nameInput.value = currentName; // Preenche o campo com o valor atual
        addModal.classList.remove("hidden"); // Exibe o modal

        // Remove evento anterior para evitar acúmulo
        addForm.onsubmit = null;

        // Define os atributos para identificar a edição
        addForm.setAttribute("data-editing", "true");
        addForm.setAttribute("data-category", category);
        addForm.setAttribute("data-index", index);
    }

    function deleteItem(category, index) {

        const data = JSON.parse(localStorage.getItem(category)) || [];
        data.splice(index, 1); // Remove o item
        localStorage.setItem(category, JSON.stringify(data)); // Atualiza o localStorage
        updateCategoryCounts(); // Atualiza a contagem após adicionar um item
        renderList(category); // Atualiza a lista
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const filterAndAdd = document.getElementById("filterAndAdd");
    const container = document.querySelector(".container");

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

document.addEventListener("DOMContentLoaded", function () {
    const addModal = document.getElementById("addModal");
    const closeModalButton = document.getElementById("closeModal");
    const addForm = document.getElementById("addForm");

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
        closeAddModal();
    });

});

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link"); // Links do menu

    // Seleciona os modais fora do loop para evitar reprocessamento
    const addModal = document.getElementById("addModal");
    const modalTitle = document.getElementById("modalTitle");
    let currentCategory = "";

    // 🔹 Abrir modal de adicionar item
    function openAddModal(title, category) {
        modalTitle.innerText = `Adicionar em ${title}`;
        currentCategory = category;
        addModal.classList.remove("hidden");
    }

    // 🔹 Vincular botões "Adicionar" ao modal
    const addButtons = document.querySelectorAll("#filterAndAdd button");

    addButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation();

            if (button.id === "messagesButtonAddButton") {
            }
            else if (button.id === "audioButtonAddButton") {
                abrirModalAudio();
            }
            else if (button.id === "mediaButtonAddButton") {
                abrirModalMedia();
            }
            else if (button.id === "documentsButtonAddButton") {
                abrirModalDocumento();
            }
            else if (button.id === "funnelsButtonAddButton") {
                abrirModalFunil();
            }

            else {
                const title = button.innerText.replace("Adicionar nos ", "").replace("Adicionar nas ", "");
                const category = button.id.replace("AddButton", "");
                openAddModal(title, category);
            }
        });
    });
});

function updateCategoryCounts() {
    const categories = {
        messages: "count-messages",
        audio: "count-audio",
        media: "count-media",
        documents: "count-documents",
        funnels: "count-funnels",
        triggers: "count-triggers"
    };

    chrome.storage.local.get(Object.keys(categories), (result) => {
        Object.entries(categories).forEach(([category, countId]) => {
            const countElement = document.getElementById(countId);
            if (countElement) {
                const data = result[category] || [];
                countElement.textContent = data.length;
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", updateCategoryCounts);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("addModal").classList.add("hidden"); /// faz o add item ficar invisivel ao abrir, provavelmente está errado
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
    const usernameElement = document.getElementById("username");
    const cellNumberElement = document.getElementById("cellnumber");
  
    if (usernameElement) {
      const savedUsername = localStorage.getItem("username") || "Usuário";
      usernameElement.textContent = `Olá, ${savedUsername}!`;
    }
  
    if (cellNumberElement) {
      const number = localStorage.getItem("telefone");
      if (number) {
        cellNumberElement.innerText = number;
      } else {
        console.log("Número de telefone não encontrado no localStorage.");
      }
    }
  });



document.addEventListener("DOMContentLoaded", function () {

    const addButton = document.getElementById("AddButton");

    if (addButton) {
        addButton.addEventListener("click", function () {
        });
    }
});


document.getElementById("confirmarEnvioFunil")?.addEventListener("click", async () => {
    const numero = document.getElementById("destinoFunnelInput").value;
    const modal = document.getElementById("executarFunnelModal");

    if (!numero || !numero.startsWith("55")) {
        alert("Número inválido.");
        return;
    }

    const funnel = window.funilSelecionado;
    if (!funnel || !funnel.steps) {
        alert("Funil inválido.");
        return;
    }

    for (let i = 0; i < funnel.steps.length; i++) {
        const step = funnel.steps[i];
        const tipo = step?.type === "messages" ? "mensagem"
            : step?.type === "audio" ? "audio"
                : step?.type === "media" ? "midia"
                    : step?.type === "documents" ? "documento"
                        : step?.type;

        let conteudo = "";

        if (step?.type === "messages") {
            conteudo = step?.item?.content || step?.item?.name || "";
        } else if (step?.type === "audio") {
            conteudo = step?.item?.audioBase64 || "";
        } else if (step?.type === "documents") {
            conteudo = step?.item?.fileBase64 || "";
        } else if (step?.type === "media") {
            conteudo = step?.item?.src || "";

            const base64Length = conteudo.length - (conteudo.indexOf(',') + 1);
            const fileSizeInBytes = (base64Length * 3) / 4;
            const maxSize = 5 * 1024 * 1024;
            if (fileSizeInBytes > maxSize) {
                alert(`❌ A mídia da etapa ${i + 1} excede 5MB e não será enviada.`);
                continue;
            }
        }

        if (!tipo || !conteudo) {
            console.warn("Etapa inválida no sidebar:", step);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, funnel.delay * 1000));
    }

    alert("✅ Funil executado com sucesso!");
    modal.classList.add("hidden");
});
