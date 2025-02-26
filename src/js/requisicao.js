function mask(o) {
    setTimeout(function() {
      var v = mphone(o.value);
      if (v != o.value) {
        o.value = v;
      }
    }, 1);
}

function mphone(v) {
    var r = v.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length > 10) {
        r = r.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
        r = r.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
        r = r.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else {
        r = r.replace(/^(\d*)/, "($1");
    }
    return r;
}


function handleGetFormValues() {
    const whatsappInput = document.getElementById('numero');
    const message = document.getElementById('texto').value;
    if (!whatsapp) {
        alert('Digite um número de WhatsApp válido');
        return null;
    }

    if (!message.trim()) {
        alert('Digite uma mensagem');
        return null;
    }

    const formattedWhatsapp = formatNumber(whatsapp);

    return {
        whatsapp: formattedWhatsapp,  
        message,
    };
}

function formatNumber(number) {
    if (number.length === 11) {
        return `(${number.substring(0, 2)}) ${number.substring(2, 7)}-${number.substring(7, 11)}`;
    }
    return number;  
}

async function handleSubmitWhatsappMessa(){
    const GZAPPY_URL = "https://api.gzappy.com/v1/message/send-message"

    const response = await fetch(GZAPPY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'user_token_id' : '5396c265f5312aebfa6f65c19496456a51a61dd5e3ece737dd352861637feb14cd16ebfdabafeacd4efeecbf285ce94e1ca5debdcc549ee7f941292dccb783b1'
        },
        body: JSON.stringify({
            instance_id: 'H8MNQUIMACIZ8BNSXUKYKLPD',
            message: ["Olá, tudo bem? ","Você tem um novo agendamento marcado","Sr Cliente"],
            phone: "5511999999999"
        })
    })

    const data = await response.json()

    console.log(data)
}



function handleSubmitForm() {
    const data = handleGetFormValues();

    console.log(data)
   
   
}

document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmitForm);
    }

    const numeroInput = document.getElementById('numero');
    if (numeroInput) {
        numeroInput.addEventListener('keypress', function() {
            mask(numeroInput);
        });

        numeroInput.addEventListener('blur', function() {
            mask(numeroInput);
        });
    }
});
