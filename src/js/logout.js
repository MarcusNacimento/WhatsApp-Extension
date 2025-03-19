document.addEventListener("DOMContentLoaded", function () {

  function initializeLogout() {
      const logoutButton = document.getElementById("logoutBtn");

      if (logoutButton) {
          logoutButton.addEventListener("click", function (event) {
              event.preventDefault();

              // 🔹 Remove todos os dados de login do localStorage
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("username");
              localStorage.removeItem("cellnumberInput");

              // 🔹 Redireciona para a tela de login
              let loginUrl = chrome.runtime.getURL("src/html/login.html"); // Ajuste o caminho se necessário
              window.location.href = loginUrl;
          });
      } else {
          console.warn("⚠️ Botão de logout não encontrado! Tentando novamente...");
          setTimeout(initializeLogout, 500); // 🔹 Tenta encontrar o botão de novo após 500ms
      }
  }

  initializeLogout();
});
