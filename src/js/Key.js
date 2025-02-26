document.addEventListener("DOMContentLoaded", function(){
    const btnDashboard = document.getElementById("goToDashboardBtn");
    const btnFormulario = document.getElementById("goToFormularioBtn");
    const btnSideBar = document.getElementById("goToSideBarBtn");
    
    function checkLoginAndRedirect(e){
      if (!localStorage.getItem("accessKey")) {
        window.location.href = "Key.html";
      } else {
        if (e.currentTarget.id === "goToDashboardBtn") {
          window.location.href = "src/html/dashboard.html";
        } else if (e.currentTarget.id === "goToFormularioBtn") {
          window.location.href = "src/html/formulario.html";
        } else if (e.currentTarget.id === "goToSideBarBtn") {
          window.location.href = "src/html/sidebar.html";
        }
      }
    }
    
    btnDashboard.addEventListener("click", checkLoginAndRedirect);
    btnFormulario.addEventListener("click", checkLoginAndRedirect);
    btnSideBar.addEventListener("click", checkLoginAndRedirect);
  });
  