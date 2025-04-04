(function () {

  async function obterNumeroConversaAtual() {
    // 1. Tenta capturar o número no topo da conversa
    const spans = document.querySelectorAll("header span");
    for (const span of spans) {
      const texto = span.textContent || "";
      const numero = texto.replace(/\D/g, ""); // remove tudo que não for número
      if (/^\d{12,15}$/.test(numero)) {
        console.log("📲 Número capturado automaticamente:", numero);
        return numero;
      }
    }
  
    // 2. Se não encontrou, pergunta pro usuário
    const numeroManual = prompt("📲 Digite o número com DDI (ex: 5599999999999):");
    const numeroFinal = numeroManual?.replace(/\D/g, ""); // tira espaços, traços, etc
  
    if (!numeroFinal || !/^\d{12,15}$/.test(numeroFinal)) {
      alert("❌ Número inválido. Ex: 5511999999999");
      return null;
    }
  
    console.log("✍️ Número digitado manualmente:", numeroFinal);
    return numeroFinal;
  }

  window._executarFunilInject = async function (funnel) {
    const numero = await obterNumeroConversaAtual();
    if (!numero) return;
  
    for (let i = 0; i < funnel.steps.length; i++) {
      const step = funnel.steps[i];
      const tipo = step.type === "messages" ? "mensagem"
        : step.type === "audio" ? "audio"
          : step.type === "media" ? "midia"
            : step.type === "documents" ? "documento"
              : step.type;
  
      if (step.type === "messages") {
        const mensagem = step.item.content || step.item.name || "";
        if (!mensagem) {
          console.warn(`🚫 Etapa ${i + 1} com mensagem vazia:`, step);
          continue;
        }
  
        await window.enviarMensagemNoChat(mensagem);
        await new Promise(r => setTimeout(r, funnel.delay * 1000));
        continue;
      }
      else if (step.type === "documents") {
        await window.enviarDocumentoAutomaticamente(step.item.name);
        await new Promise(r => setTimeout(r, funnel.delay * 1000));
        continue;
      }
      else if (step.type === "media") {
        await window.enviarMidiaAutomaticamente(step.item.name);
        await new Promise(r => setTimeout(r, funnel.delay * 1000));
        continue;
      }
      else if (step.type === "audio") {
        await window.enviarAudioAutomaticamente(step.item.name);
        await new Promise(r => setTimeout(r, funnel.delay * 1000));
        continue;
      }
  
      console.warn(`🚫 Tipo de etapa inválido ou não suportado: ${step.type}`, step);
    }
  
    alert("✅ Funil enviado com sucesso!");
  };

  window.enviarAudioAutomaticamente = async function (nomeOriginal) {
    console.log("🎧 Iniciando envio de áudio:", nomeOriginal);
  
    return new Promise((resolve) => {
      const nomeArquivo = nomeOriginal.endsWith(".ogg") ? nomeOriginal : `${nomeOriginal}.ogg`;
  
      chrome.storage.local.get(["audio"], async (result) => {
        const lista = result.audio || [];
        const audio = lista.find((a) => a.name === nomeArquivo);
        if (!audio) {
          alert(`❌ Áudio "${nomeArquivo}" não encontrado.`);
          return resolve();
        }
  
        const base64Full = audio.audioBase64;
        const mimeMatch = base64Full.match(/^data:(.+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "audio/ogg";
        const base64 = base64Full.split(",")[1];
  
        const byteCharacters = atob(base64);
        const byteNumbers = Array.from(byteCharacters).map((c) => c.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const file = new File([blob], nomeArquivo, { type: mimeType });
  
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
  
        // Abre o clipe 📎
        const clipButton = document.querySelector("#main > footer > div.x1n2onr6.xhtitgo.x9f619.x78zum5.x1q0g3np.xuk3077.x193iq5w.x122xwht.x1bmpntp.xs9asl8.x1swvt13.x1pi30zi.xnpuxes.copyable-area > div > span > div > div.x9f619.x78zum5.x6s0dn4.xl56j7k.x1ofbdpd._ak1m > div > button");
        if (!clipButton) {
          alert("❌ Botão do clipe não encontrado.");
          return resolve();
        }
        clipButton.click();
  
        const fotosBtn = await new Promise((res) => {
          const interval = setInterval(() => {
            const btn = document.querySelector("#app > div > span:nth-child(7) > div > ul > div > div > div:nth-child(2) > li > div");
            if (btn) {
              clearInterval(interval);
              res(btn);
            }
          }, 300);
        });
  
        if (!fotosBtn) return resolve();
  
        const fileInput = fotosBtn.querySelector("input[type='file']");
        if (!fileInput) {
          alert("❌ Input de áudio não encontrado.");
          return resolve();
        }
  
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event("change", { bubbles: true }));
        console.log("🎤 Áudio injetado");
  
        setTimeout(() => {
          const sendButton = document.querySelector('[aria-label="Enviar"]');
          if (sendButton) {
            sendButton.click();
            console.log("✅ Áudio enviado com preview");
          } else {
            alert("❌ Botão enviar não encontrado.");
          }
          resolve();
        }, 1000);
      });
    });
  };
  

  window.criarBotoesFunis = function () {
    const ID_CONTAINER = "container-funis-teddy";
    const inputContainer = document.querySelector("footer");
    if (!inputContainer) return;

    const antigo = document.getElementById(ID_CONTAINER);
    if (antigo) antigo.remove();

    chrome.storage.local.get(["funnels"], (result) => {
      const funis = result.funnels || [];
      console.log("📦 Funis carregados:", funis);
      if (funis.length === 0) return;

      const container = document.createElement("div");
      container.id = ID_CONTAINER;
      container.style.display = "flex";
      container.style.flexWrap = "wrap";
      container.style.gap = "6px";
      container.style.marginTop = "8px";
      container.style.paddingTop = "8px";
      container.style.borderTop = "1px solid rgba(255,255,255,0.1)";

      funis.forEach((f) => {
        const btn = document.createElement("button");
        btn.innerText = `🚀 ${f.name}`;
        Object.assign(btn.style, {
          padding: "6px 10px",
          background: "#25D366",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "12px",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
          maxWidth: "140px",
          overflow: "hidden",
          textOverflow: "ellipsis"
        });

        btn.onmouseover = () => btn.style.opacity = "0.85";
        btn.onmouseout = () => btn.style.opacity = "1";
        btn.addEventListener("click", () => window._executarFunilInject(f));
        container.appendChild(btn);
      });

      inputContainer.appendChild(container);
      console.log("✅ Botões de funil injetados");
    });
  }

  let botaoCriado = false;

  const observer = new MutationObserver(() => {
    const footer = document.querySelector("footer");
    if (footer && !botaoCriado) {
      botaoCriado = true;
      criarBotoesFunis();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log("👂 MutationObserver ativado");
})();

window.enviarMensagemNoChat = async function (mensagem) {
  return new Promise((resolve) => {
    if (!mensagem || typeof mensagem !== "string") {
      alert("❌ Mensagem inválida.");
      return resolve();
    }

    console.log("✉️ Preparando para enviar mensagem:", mensagem);

    // 1. Seleciona a caixa de texto no rodapé
    const inputBox = document.querySelector("#main footer div[contenteditable='true']");
    if (!inputBox) {
      alert("❌ Campo de digitação não encontrado.");
      return resolve();
    }

    // 2. Preenche a mensagem no campo
    inputBox.focus();
    document.execCommand("insertText", false, mensagem); // melhor que innerHTML
    inputBox.dispatchEvent(new InputEvent("input", { bubbles: true }));

    // 3. Aguarda e clica no botão de enviar
    setTimeout(() => {
      const sendButton = document.querySelector('span[data-icon="send"]')?.closest("button");
      if (sendButton) {
        sendButton.click();
        console.log("✅ Mensagem enviada:", mensagem);
      } else {
        alert("❌ Botão de enviar não encontrado.");
      }
      resolve();
    }, 500); // pequeno delay pra simular humano digitando
  });
};


window.enviarDocumentoAutomaticamente = async function (nomeOriginal) {
  console.log("📄 Iniciando envio de documento:", nomeOriginal);

  return new Promise((resolve) => {
    chrome.storage.local.get(["documents"], async (result) => {
      const lista = result.documents || [];
      const doc = lista.find((d) => d.name === nomeOriginal);
      if (!doc) {
        alert(`❌ Documento "${nomeOriginal}" não encontrado.`);
        return resolve();
      }

      const base64Full = doc.fileBase64;
      const mimeMatch = base64Full.match(/^data:(.+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "application/pdf";
      const base64 = base64Full.split(",")[1];

      const byteCharacters = atob(base64);
      const byteNumbers = Array.from(byteCharacters).map((c) => c.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const file = new File([blob], doc.fileName || nomeOriginal, { type: mimeType });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const clipButton = document.querySelector("#main > footer > div.x1n2onr6.xhtitgo.x9f619.x78zum5.x1q0g3np.xuk3077.x193iq5w.x122xwht.x1bmpntp.xs9asl8.x1swvt13.x1pi30zi.xnpuxes.copyable-area > div > span > div > div.x9f619.x78zum5.x6s0dn4.xl56j7k.x1ofbdpd._ak1m > div > button");
      if (!clipButton) {
        alert("❌ Botão do clipe não encontrado.");
        return resolve();
      }
      clipButton.click();

      // Espera o botão "Documento"
      const docBtn = await new Promise((res) => {
        const interval = setInterval(() => {
          const btn = document.querySelector("#app > div > span:nth-child(7) > div > ul > div > div > div:nth-child(2) > li > div");
          if (btn) {
            clearInterval(interval);
            res(btn);
          }
        }, 300);
      });

      if (!docBtn) return resolve();

      // Injeta no input dentro do botão de documento
      const fileInput = docBtn.querySelector("input[type='file']");
      if (!fileInput) {
        alert("❌ Input de documento não encontrado.");
        return resolve();
      }

      fileInput.files = dataTransfer.files;
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
      console.log("📎 Documento injetado");

      setTimeout(() => {
        const sendButton = document.querySelector('[aria-label="Enviar"]');
        if (sendButton) {
          sendButton.click();
          console.log("✅ Documento enviado");
        } else {
          alert("❌ Botão enviar não encontrado.");
        }
        resolve();
      }, 1000);
    });
  });
};

window.enviarMidiaAutomaticamente = async function (nomeOriginal) {
  console.log("🖼️ Iniciando envio de mídia:", nomeOriginal);

  return new Promise((resolve) => {
    const nomeArquivo = nomeOriginal;

    chrome.storage.local.get(["media"], async (result) => {
      const lista = result.media || [];
      const midia = lista.find((m) => m.name === nomeArquivo);
      if (!midia) {
        alert(`❌ Mídia "${nomeArquivo}" não encontrada.`);
        return resolve();
      }

      const base64Full = midia.src;
      const mimeMatch = base64Full.match(/^data:(.+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const base64 = base64Full.split(",")[1];

      const byteCharacters = atob(base64);
      const byteNumbers = Array.from(byteCharacters).map((c) => c.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const file = new File([blob], midia.fileName || nomeArquivo, { type: mimeType });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // 1. Clica no botão do clipe 📎
      const clipButton = document.querySelector("#main > footer > div.x1n2onr6.xhtitgo.x9f619.x78zum5.x1q0g3np.xuk3077.x193iq5w.x122xwht.x1bmpntp.xs9asl8.x1swvt13.x1pi30zi.xnpuxes.copyable-area > div > span > div > div.x9f619.x78zum5.x6s0dn4.xl56j7k.x1ofbdpd._ak1m > div > button");
      if (!clipButton) {
        alert("❌ Botão do clipe não encontrado.");
        return resolve();
      }
      clipButton.click();
      console.log("📎 Clip clicado");

      // 2. Aguarda o botão "Fotos e vídeos" aparecer
      const fotosBtn = await new Promise((res) => {
        const interval = setInterval(() => {
          const btn = document.querySelector("#app > div > span:nth-child(7) > div > ul > div > div > div:nth-child(2) > li > div");
          if (btn) {
            clearInterval(interval);
            res(btn);
          }
        }, 300);
      });

      if (!fotosBtn) return resolve();
      console.log("📂 Botão 'Fotos e vídeos' disponível");

      // 3. Injeta o arquivo sem clicar
      const fileInput = fotosBtn.querySelector("input[type='file']");
      if (!fileInput) {
        alert("❌ Input de mídia não encontrado.");
        return resolve();
      }

      fileInput.files = dataTransfer.files;
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
      console.log("📸 Mídia injetada silenciosamente");

      // 4. Clica no botão enviar
      setTimeout(() => {
        const sendButton = document.querySelector('[aria-label="Enviar"]');
        if (sendButton) {
          sendButton.click();
          console.log("✅ Mídia enviada com preview!");
        } else {
          alert("❌ Botão enviar não encontrado.");
        }
        resolve();
      }, 1000);
    });
  });
};


