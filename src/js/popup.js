document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById("goToDashboardBtn");

  if (button) {
    button.addEventListener("click", function() {
      chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
    });
  } else {
    console.error("Botão com ID 'goToDashboardBtn' não encontrado.");
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById("goToFormularioBtn");

  if (button) {
    button.addEventListener("click", function() {
      chrome.tabs.create({ url: chrome.runtime.getURL("formulario.html") });
    });
  } else {
    console.error("Botão com ID 'goToFormularioBtn' não encontrado.");
  }
});


document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById("goToFormularioBtn");

  if (button) {
    button.addEventListener("click", function() {
      chrome.tabs.create({ url: chrome.runtime.getURL("formulario.html") });
    });
  } else {
    console.error("Botão com ID 'goToFormularioBtn' não encontrado.");
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById("goToSideBarBtn");

  if (button) {
    button.addEventListener("click", function() {
      chrome.tabs.create({ url: chrome.runtime.getURL("sidebar.html") });
    });
  } else {
    console.error("Botão com ID 'goToSideBarBtn' não encontrado.");
  }
});
