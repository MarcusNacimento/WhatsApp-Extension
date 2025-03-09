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

    window.renderList = function(category) {
        const itemList = document.getElementById("itemList");
    
        itemList.style.maxHeight = "600px";
        itemList.style.overflowY = "auto";
        itemList.style.padding = "10px";
        itemList.innerHTML = "";
    
        const data = JSON.parse(localStorage.getItem(category)) || [];
    
        if (data.length === 0) {
            itemList.innerHTML = "<p style='text-align: center;'>Nenhum item adicionado ainda.</p>";
            return;
        }
    
        data.forEach((item, index) => {
            const listItem = document.createElement("div");
            listItem.classList.add("list-item");
        
            // Nome do item
            const itemName = document.createElement("span");
            itemName.classList.add("item-name");
            itemName.textContent = item.name;
        
        
            // Container de ações
            const itemActions = document.createElement("div");
            itemActions.classList.add("item-actions");
        
            const editButton = document.createElement("button");
            editButton.classList.add("edit-btn");
            editButton.textContent = "Editar";
            editButton.addEventListener("click", function () {
                openEditModal(category, index, item.name);
            });
        
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn");
            deleteButton.textContent = "Deletar";
            deleteButton.addEventListener("click", function () {
                deleteItem(category, index);
            });
        
            itemActions.appendChild(editButton);
            itemActions.appendChild(deleteButton);
        
            listItem.appendChild(itemName); // Nome aparece aqui
        
            // Condição específica para categoria áudio
            if (category === "audio" && item.audioBase64) {
                const audioElement = document.createElement("audio");
                audioElement.src = item.audioBase64;
                audioElement.controls = true;
                listItem.appendChild(audioElement);
            }
        
            listItem.appendChild(itemActions);
            itemList.appendChild(listItem);
        });
        
    }
    
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

// Segundo bloco: Alterna visibilidade e configura os botões "Adicionar"
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

// Quarto bloco: Gerencia dados no localStorage
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link"); // Links do menu

    // Seleciona os modais fora do loop para evitar reprocessamento
    const addModal = document.getElementById("addModal");
    const audioModal = document.getElementById("audioModal");
    const modalTitle = document.getElementById("modalTitle");
    const addForm = document.getElementById("addForm");
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

            if (button.id === "audioButtonAddButton") {
                abrirModalAudio();
            } else {
                const title = button.innerText.replace("Adicionar nos ", "").replace("Adicionar nas ", "");
                const category = button.id.replace("AddButton", "");
                openAddModal(title, category);
            }
        });
    });
});


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




