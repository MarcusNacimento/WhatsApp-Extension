document.addEventListener("DOMContentLoaded", function () {
  // Verifica se já está logado
  const username = localStorage.getItem("username");
  const telefone = localStorage.getItem("telefone");

  if (username && telefone) {
    window.location.href = "sidebar.html";
    return;
  }

  const cellInput = document.getElementById("cellnumberInput");

  if (cellInput) {
    cellInput.addEventListener("input", function () {
      let value = cellInput.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);
      if (value.length <= 10) {
        cellInput.value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
      } else {
        cellInput.value = value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3");
      }
    });
  }

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("usernameInput").value.trim();
    const telefone = document.getElementById("cellnumberInput").value.trim();
    const senha = document.getElementById("accessKey").value.trim();

    if (senha === "Teste") {
      localStorage.setItem("username", username);
      localStorage.setItem("telefone", telefone);
      window.location.href = "sidebar.html";
    } else {
      alert("❌ Senha incorreta. Tente novamente.");
    }
  });
});
