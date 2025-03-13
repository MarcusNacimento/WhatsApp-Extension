document.addEventListener("DOMContentLoaded", function () {
  const cellInput = document.getElementById("cellnumberInput");

  if (cellInput) {
      cellInput.addEventListener("input", function () {
          let value = cellInput.value.replace(/\D/g, ""); // Remove tudo que não for número

          if (value.length > 11) {
              value = value.slice(0, 11); // Limita a 11 números
          }

          if (value.length <= 10) {
              cellInput.value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
          } else {
              cellInput.value = value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3");
          }
      });
  }
  const loginButton = document.getElementById("loginBtn");

  if (loginButton) {
    loginButton.addEventListener("click", function () {
      const enteredKey = document.getElementById("accessKey").value.trim();
      const enteredName = document.getElementById("usernameInput").value.trim(); // Captura o nome digitado
      const enteredCell = document.getElementById("cellnumberInput").value.trim();


      if (enteredKey === "") {
        alert("⚠️ Por favor, digite a chave de acesso.");
        return;
      }

      if (enteredName === "") {
        alert("⚠️ Por favor, digite seu nome.");
        return;
    }

    if (enteredCell === "" || enteredCell.length < 15) {
        alert("⚠️ O número de telefone é obrigatório e deve ter pelo menos 10 dígitos.");
        return;
    }

      if (enteredKey === "Teste") { // 🔹 Altere pela lógica real de autenticação
        console.log("✅ Login bem-sucedido!");

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", enteredName || "Usuário"); // 🔹 Salva o nome no localStorage
        localStorage.setItem("cellnumberInput", enteredCell);


        const redirectPage = localStorage.getItem("redirectAfterLogin") || "index.html";
        window.location.href = redirectPage;
      } else {
        alert("❌ Chave incorreta! Tente novamente.");
      }
    });
  }
});
