
import { enviarMensagem } from "./gzappy.js";

document.addEventListener("DOMContentLoaded", function () {
  const cellInput = document.getElementById("cellnumberInput");
  const loginForm = document.getElementById("loginForm");
  const qrContainer = document.getElementById("qrContainer");
  const qrIframe = document.getElementById("qrIframe");
  const qrStatus = document.getElementById("qrStatus");
  const proceedBtn = document.getElementById("proceedBtn");

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

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const enteredKey = document.getElementById("accessKey").value.trim();
      const enteredName = document.getElementById("usernameInput").value.trim();
      const enteredCell = document.getElementById("cellnumberInput").value.replace(/\D/g, "").trim();

      if (enteredKey === "Teste") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", enteredName || "Usuário");
        localStorage.setItem("telefoneVinculado", enteredCell);

        loginForm.reset();
        loginForm.classList.add("hidden");

        qrContainer.classList.remove("hidden");
        qrStatus.classList.remove("hidden");

        const qr = await window.gzappy.gerarQRCode();
        qrIframe.src = qr;
        qrStatus.innerHTML = "<span class='spinner'></span> Acesse e escaneie o QR Code da dashboard.";
      } else {
        alert("❌ Chave incorreta! Tente novamente.");
      }
    });
  }

  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      window.location.href = "sidebar.html";
    });
  }
});
