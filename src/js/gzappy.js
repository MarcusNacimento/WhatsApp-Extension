import {
  GZAPPY_API_TOKEN,
  GZAPPY_INSTANCE_ID,
  GZAPPY_URL_MESSAGE,
  GZAPPY_URL_MEDIA
} from "./constants.js";

console.log("📡 GZappy conectado com:", GZAPPY_INSTANCE_ID);

window.gzappy = {
  async enviarMensagem(numero, texto) {
    const payload = {
      instance_id: GZAPPY_INSTANCE_ID,
      message: [texto],
      phone: [numero],
    };

    console.log("📡 GZappy conectado com:", GZAPPY_INSTANCE_ID);

    const response = await fetch(GZAPPY_URL_MESSAGE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GZAPPY_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Resposta GZappy:", data);

    return data;
    
  },

  async enviarAudio(numero, base64) {
    return await fetch(GZAPPY_URL_MEDIA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GZAPPY_API_TOKEN}`,
      },
      body: JSON.stringify({
        instance_id: GZAPPY_INSTANCE_ID,
        mediaUrl: base64,
        phone: [numero],
      }),
    }).then(res => res.json());
  },

  async enviarMidia(numero, base64) {
    const response = await fetch(GZAPPY_URL_MEDIA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GZAPPY_API_TOKEN}`,
      },
      body: JSON.stringify({
        instance_id: GZAPPY_INSTANCE_ID,
        mediaUrl: base64,
        phone: [numero],
        message: ""
      }),
    });
  
    if (!response.ok) {
      const text = await response.text(); // 👈 tentar ler como texto se falhou
      console.warn("⚠️ Erro de resposta da GZappy:", text);
      return { error: `Erro HTTP ${response.status}` };
    }
  
    return await response.json();
  },
  
  async enviarDocumento(numero, base64) {
    return await fetch(GZAPPY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GZAPPY_API_TOKEN}`,
      },
      body: JSON.stringify({
        instance_id: GZAPPY_INSTANCE_ID,
        document: [base64],
        phone: [numero],
      }),
    }).then(res => res.json());
  },

  async enviarEtapa(numero, step) {
    if (!step || !step.tipo || !step.conteudo) {
      console.warn("❌ Etapa inválida recebida em enviarEtapa:", step);
      return { error: "Etapa inválida recebida" };
    }
    console.log(step.tipo);
    if (step.tipo === "mensagem") {
      return await window.gzappy.enviarMensagem(numero, step.conteudo);
    }
  
    if (step.tipo === "audio") {
      return await window.gzappy.enviarAudio(numero, step.conteudo);
    }
  
    if (step.tipo === "midia") {
      return await window.gzappy.enviarMidia(numero, step.conteudo);
    }
  
    if (step.tipo === "documento") {
      return await window.gzappy.enviarDocumento(numero, step.conteudo);
    }
  
    console.warn("⚠️ Tipo de etapa não suportado:", step.tipo);
    return { error: "Tipo de etapa não suportado." };
  }
  
};


