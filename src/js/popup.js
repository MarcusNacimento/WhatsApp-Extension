document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 popup.js carregado!");

  const buttons = [
    { id: "goToDashboardBtn", url: "dashboard.html" },
    { id: "goToFormularioBtn", url: "formulario.html" },
    { id: "goToSideBarBtn", url: "sidebar.html" }
  ];

  buttons.forEach(({ id, url }) => {
    const button = document.getElementById(id);

    if (button) {
      console.log(`✅ Botão encontrado: ${id}`);

      button.addEventListener("click", function () {
        console.log(`🟢 Botão ${id} clicado!`);

        // 🔹 Verifica se o usuário está logado no localStorage
        if (!localStorage.getItem("isLoggedIn")) {
          console.warn("⚠️ Usuário não está logado! Redirecionando para login.html");
          
          // 🔹 Salva para onde ele queria ir e manda para a tela de login
          localStorage.setItem("redirectAfterLogin", url);
          let loginUrl = chrome.runtime.getURL("src/html/login.html");
          chrome.tabs.create({ url: loginUrl });
          return;
        }

        // 🔹 Ajusta a URL corretamente sem duplicação
        let correctUrl = chrome.runtime.getURL(`src/html/${url}`);
        console.log(`🔄 Redirecionando para: ${correctUrl}`);
        chrome.tabs.create({ url: correctUrl });
      });
    } else {
      console.error(`❌ ERRO: Botão não encontrado - ${id}`);
    }
  });
});
