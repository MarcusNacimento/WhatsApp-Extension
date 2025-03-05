document.addEventListener("DOMContentLoaded", function () {
  const btnDashboard = document.getElementById("goToDashboardBtn");
  const btnFormulario = document.getElementById("goToFormularioBtn");
  const btnSideBar = document.getElementById("goToSideBarBtn");

  function checkLoginAndRedirect(e) {
      if (!localStorage.getItem("accessKey")) {
          window.location.href = "src/html/Key.html"; // ✅ Corrigido
          return;
      }

      const redirectMap = {
          "goToDashboardBtn": "src/html/dashboard.html",
          "goToFormularioBtn": "src/html/formulario.html",
          "goToSideBarBtn": "src/html/sidebar.html"
      };

      const targetUrl = redirectMap[e.currentTarget.id];
      if (targetUrl) {
          window.location.href = targetUrl;
      }
  }

  [btnDashboard, btnFormulario, btnSideBar].forEach(button => {
      if (button) {
          button.addEventListener("click", checkLoginAndRedirect);
      }
  });
});
