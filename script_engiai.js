const customRender = {
    heading(token) {
        const text = typeof token === 'string' ? token : (token.text || '');
        const level = token.depth || 1;

        // Procesa formato en línea dentro de los títulos (ej: ### **Título**)
        const textoFormateado = marked.parseInline(text);

        // Clases de Bootstrap según la jerarquía del título
        const clases = {
            1: "h1 fs-2 fw-bold text-light fg-info mt-4 mb-3 border-bottom pb-2 d-block",
            2: "h2 fs-3 fw-bold text-light mt-4 mb-3 d-block",
            3: "h3 fs-4 fw-semibold color-orange mt-4 mb-2 d-block", // Evita solapamiento con d-block
            4: "h4 fs-5 fw-semibold fg-warning mt-3 mb-2 d-block"
        }; // No se incluye h5 por si hay h6 y para determinar el mínimo
        const claseElegida = clases[level] || "h5 text-light mt-2 mb-2 d-block";
        return `<h${level} class="${claseElegida}">${textoFormateado}</h${level}>`
    },
    paragraph(token) {
        const text = typeof token === 'string' ? token : (token.text || '');
        // Procesa negritas (**), cursivas (*) y enlaces ([...]) dentro de los párrafos
        const textoFormateado = marked.parseInline(text);
        return `<p class="mb-3 text-light-50 lh-base d-block">${textoFormateado}</p>`;
    },
    list(token) {
        const tag = token.ordered ? "ol" : "ul";
        // Compatibilidad si 'token' es enviado como string directo
        if (typeof token === 'string') {
            return `<${tag} class="mb-3 ps-4 text-light">${token}</${tag}>`;
        }

        // Procesa cada elemento de la lista (token.items)
        const body = (token.items || []).map(item => {
            // Parsear el texto interno por si contiene **negritas**, *cursivas* o enlaces
            const textoItem = marked.parseInline(item.text || '');
            return `<li class="mb-1">${textoItem}</li>`;
        }).join('');

        return `<${tag} class="mb-3 ps-4 text-light">${body}</${tag}>`;
    },
    image(item){
        const href = item.href || item;
        const title = item.title || "";
        const text = item.text || "";
        return `<img src="${href}" alt="${text}" title="${title}" class="img-fluid rounded my-3 d-block mx-auto shadow-sm">`;
    },
    hr() {
        return `<hr class="my-4 border-secondary opacity-50">`;
    },
    blockquote(item) {
        const text = item.text || item;
        return `<blockquote class="blockquote ps-3 border-start border-3 border-primary text-muted my-3">${text}</blockquote>`;
    }
}

// Aplicar el render personalizado a Marked
marked.use({ renderer: customRender });

async function enviarMensaje(){
    const inputUsuario = document.getElementById("user-input");
    const chatBot = document.getElementById("bot-chat");
    const texto = inputUsuario.value.trim();

    if (!texto) return;

    chatBot.innerHTML += `<div class="rounded-8 bg-2 w-fit ms-auto p-4">${texto}</div>`;
    inputUsuario.value = "";

    try{
        const respuesta = await fetch("http://127.0.0.1:5000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
            body: JSON.stringify({ message: texto })
        });

        const data = await respuesta.text()

        // 1. Limpiar el '+' inicial si existe en el string
        // let textoProcesado = data.response.replace(/^\+/, '');
        
        const htmlRespuesta = marked.parse(data);
        chatBot.innerHTML += `<div class="w-100 p-4">${htmlRespuesta}</div>`;

        // Auto-scroll
        chatBot.scrollTop = chatBot.scrollHeight;
    } catch (error) {
        chatBot.innerHTML += `<div class="w-100 p-4">Error al conectar con EngiAI.</div>`;
        console.error(`Error exacto de conexión: ${error}`);
    }
}

// Detección de tecla 'Enter' en el agente de IA
document.addEventListener('keydown', (event) =>{
    if (event.key === 'Enter'){
        enviarMensaje()
    }
});

document.getElementById("button-send").addEventListener('click', enviarMensaje)

document.querySelector('[aria-label="Close EngiAI Menu"]').addEventListener('click', () =>{
    document.getElementById('drawerAI').close();
});

document.querySelector('[aria-label="Open EngiAI Menu"]').addEventListener('click', () =>{
    document.getElementById('drawerAI').showModal();
});