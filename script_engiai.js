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

const yesOrNoQuestions = [
    {
        pregunta: "¿Los hornos permiten fundir minerales para convertirlos en placas?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Factorio es un videojuego de construcción y gestión de fábricas?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los paneles solares generan energía durante la noche?",
        respuesta: "No. Necesitan luz solar para producir electricidad."
    },
    {
        pregunta: "¿Los enemigos pueden evolucionar a medida que avanza la partida?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Las cintas transportadoras sirven para mover objetos automáticamente?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Se puede fabricar cualquier objeto sin utilizar recursos?",
        respuesta: "No. La fabricación requiere los ingredientes correspondientes."
    },
    {
        pregunta: "¿Los robots logísticos pueden transportar objetos entre cofres compatibles?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los laboratorios producen automáticamente los paquetes de ciencia?",
        respuesta: "No. Los laboratorios consumen paquetes de ciencia para realizar investigaciones."
    },
    {
        pregunta: "¿Los trenes permiten transportar grandes cantidades de recursos?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Las cintas transportadoras necesitan combustible para funcionar?",
        respuesta: "No. Funcionan utilizando la energía de la fábrica cuando corresponde, sin consumir combustible propio."
    },
    {
        pregunta: "¿Los insertadores pueden recoger y colocar objetos?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Es posible investigar tecnologías sin utilizar paquetes de ciencia?",
        respuesta: "No. Las investigaciones requieren los paquetes de ciencia correspondientes."
    },
    {
        pregunta: "¿Las calderas pueden generar vapor utilizando agua y combustible?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los acumuladores pueden almacenar energía eléctrica?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los acumuladores generan electricidad por sí solos sin haber almacenado energía?",
        respuesta: "No. Almacenan energía previamente disponible y la entregan cuando se necesita."
    },
    {
        pregunta: "¿Los ensambladores fabrican objetos utilizando ingredientes?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los mordedores y escupidores son enemigos que pueden atacar la fábrica?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los hornos eléctricos necesitan carbón para funcionar?",
        respuesta: "No. Utilizan energía eléctrica."
    },
    {
        pregunta: "¿El petróleo crudo puede procesarse en una refinería?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los robots de construcción pueden transportar objetos entre cofres logísticos para satisfacer solicitudes?",
        respuesta: "No. Esa función corresponde a los robots logísticos."
    },
    {
        pregunta: "¿Es posible lanzar un cohete para completar el objetivo clásico de Factorio?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Las torretas láser necesitan munición física para disparar?",
        respuesta: "No. Utilizan energía eléctrica."
    },
    {
        pregunta: "¿Los paquetes de ciencia se utilizan en los laboratorios para investigar?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los módulos de productividad aumentan directamente la velocidad de una máquina?",
        respuesta: "No. Aumentan la productividad, pero reducen la velocidad de funcionamiento."
    },
    {
        pregunta: "¿Los semáforos ferroviarios ayudan a evitar colisiones entre trenes?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los trenes pueden circular automáticamente sin tener una locomotora?",
        respuesta: "No. Necesitan al menos una locomotora para desplazarse."
    },
    {
        pregunta: "¿Los planos permiten guardar diseños de construcciones para reutilizarlos?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿La contaminación puede atraer la atención de los enemigos?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los robots logísticos pueden construir estructuras utilizando planos?",
        respuesta: "No. Esa tarea corresponde a los robots de construcción."
    },
    {
        pregunta: "¿Los fluidos pueden transportarse mediante tuberías?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los insertadores pueden recoger objetos que están fuera de su alcance?",
        respuesta: "No. Tienen un alcance de recogida y colocación limitado."
    },
    {
        pregunta: "¿Las máquinas necesitan energía para funcionar?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Se puede investigar una tecnología que todavía no está desbloqueada sin cumplir sus requisitos?",
        respuesta: "No. Primero deben cumplirse sus requisitos de investigación."
    },
    {
        pregunta: "¿Los módulos permiten modificar características de producción de las máquinas?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los paneles solares producen energía durante toda la noche?",
        respuesta: "No. Su producción depende de la luz solar."
    },
    {
        pregunta: "¿Las balizas transmiten los efectos de los módulos a máquinas cercanas?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Las torretas pueden utilizarse para defender la base?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los hornos pueden transformar placas de hierro en minerales de hierro?",
        respuesta: "No. La fundición transforma minerales en placas, no al revés."
    },
    {
        pregunta: "¿El agua puede transportarse mediante tuberías?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los taladros mineros pueden extraer recursos de cualquier superficie del mapa?",
        respuesta: "No. Necesitan estar colocados sobre un yacimiento compatible."
    },
    {
        pregunta: "¿El hierro y el cobre son recursos minerales básicos?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los ensambladores pueden fabricar objetos sin recibir los ingredientes necesarios?",
        respuesta: "No. Necesitan disponer de los ingredientes de su receta."
    },
    {
        pregunta: "¿Es posible investigar tecnologías para desbloquear nuevas máquinas y mejoras?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los módulos de velocidad aumentan la velocidad de producción de las máquinas?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los trenes pueden ignorar las señales ferroviarias sin consecuencias?",
        respuesta: "No. Las señales regulan la circulación y permiten evitar conflictos entre trenes."
    },
    {
        pregunta: "¿Los robots de construcción pueden ayudar a construir estructuras mediante planos?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿La contaminación desaparece inmediatamente cuando se detienen todas las máquinas contaminantes?",
        respuesta: "No. La contaminación acumulada puede permanecer y dispersarse durante un tiempo."
    },
    {
        pregunta: "¿El objetivo principal del juego es construir y automatizar una fábrica?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿Los módulos de eficiencia pueden reducir el consumo eléctrico de las máquinas?",
        respuesta: "Sí."
    },
    {
        pregunta: "¿En Factorio se puede automatizar prácticamente toda la producción de objetos?",
        respuesta: "Sí."
    }
];

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

function makeYesOrNoQuestion(){
    if (document.getElementById('yesOrNoQuestions').classList.contains('active')) {
        questionNumber = Math.floor(Math.random() * (49 - 0 + 1)) + 0;
        document.getElementById("bot-chat").innerHTML = `<div class="w-100 p-4">
        ${yesOrNoQuestions[questionNumber].pregunta}
        <button id="yes" type="button" class="btn">Si</button>
        <button id="no" type="button" class="btn">No</button>
        </div>`;

        document.addEventListener('click', (e) => {
            if ((e.target.innerHTML == "Si" || e.target.innerHTML == "No") && e.target.text == yesOrNoQuestions[questionNumber].respuesta) {
                console.log("Correcto");
            } else {
                console.log("Incorrecto");
            }
        });
    }
}

// Detección de tecla 'Enter' en el agente de IA
document.getElementById("user-input").addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        enviarMensaje()
    }
});

document.getElementById("button-send").addEventListener('click', enviarMensaje)

document.querySelector('[aria-label="Close EngiAI Menu"]').addEventListener('click', () => {
    document.getElementById('drawerAI').close();
});

document.querySelector('[aria-label="Open EngiAI Menu"]').addEventListener('click', () => {
    document.getElementById('drawerAI').showModal();
});

document.querySelector("div.nav.nav-pills.navbar-nav").addEventListener('click', (e) => {
    if (!e.target.classList.contains('active')){
        e.target.classList.add('active');
        document.getElementById('bot-chat').innerHTML = "";
        switch (e.target.id) {
            case "normalConversation":
                document.getElementById('yesOrNoQuestions').classList.remove('active');
                document.getElementById('multipleChoice').classList.remove('active');
                break;
            case "yesOrNoQuestions":
                document.getElementById('normalConversation').classList.remove('active');
                document.getElementById('multipleChoice').classList.remove('active');
                makeYesOrNoQuestion();
                break;
            case "multipleChoice":
                document.getElementById('normalConversation').classList.remove('active');
                document.getElementById('yesOrNoQuestions').classList.remove('active');
                break;
        }
    }
});