document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 logout.js carregado!");

  function initializeLogout() {
      const logoutButton = document.getElementById("logoutBtn");

      if (logoutButton) {
          console.log("✅ Botão de logout encontrado!");
          logoutButton.addEventListener("click", function (event) {
              event.preventDefault();
              console.log("🔴 Usuário fez logout!");

              // 🔹 Remove todos os dados de login do localStorage
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("username");
              localStorage.removeItem("cellnumberInput");

              // 🔹 Redireciona para a tela de login
              let loginUrl = chrome.runtime.getURL("src/html/login.html"); // Ajuste o caminho se necessário
              console.log(`🔄 Redirecionando para: ${loginUrl}`);
              window.location.href = loginUrl;
          });
      } else {
          console.warn("⚠️ Botão de logout não encontrado! Tentando novamente...");
          setTimeout(initializeLogout, 500); // 🔹 Tenta encontrar o botão de novo após 500ms
      }
  }

  initializeLogout();
});
