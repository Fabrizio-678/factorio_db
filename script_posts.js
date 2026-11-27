//Botones de Paginación
const nextButton = document.getElementById("next");
const randomButton = document.getElementById("random_page");
const previousButton = document.getElementById("previous");

const postsGrid = document.getElementById("postsGrid");

//Drawer
const drawerPosts = document.getElementById("drawerGeneric");

//SearchBox
const searchBox = document.getElementById("searchBoxPosts");

let currentPage = 1;
// let has_more_pages = true
let currentPosts = [];

controlPosts(currentPage)

/*for (let i = 1; i <= 14; i++) {
    let buttonInfo = document.querySelector(`#info${i}`);
    buttonInfo.addEventListener("click", () => {
        activateDrawer(2)
    })
}*/

async function controlPosts(page){
    postsGrid.innerHTML = `
    <svg class="bi spinner-rotate position-absolute top-50 start-50" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentcolor" stroke-width="2" stroke-linecap="round" width="64" height="64">
        <path d="M8 1V4"/>
        <path opacity="0.8" d="M3.05 3.05L5.17 5.17"/>
        <path opacity="0.6" d="M4 8L1 8"/>
        <path opacity="0.5" d="M5.17 10.83L3.05 12.95"/>
        <path opacity="0.4" d="M8 12V15"/>
        <path opacity="0.3" d="M10.83 10.83L12.95 12.95"/>
        <path opacity="0.2" d="M15 8L12 8"/>
        <path opacity="0.1" d="M12.95 3.05L10.83 5.17"/>
    </svg>`;
    nextButton.disabled = true;
    previousButton.disabled = true;
    randomButton.disabled = true;
    nextButton.classList.add('visually-hidden');
    previousButton.classList.add('visually-hidden');
    randomButton.classList.add('visually-hidden');

    searchBox.disabled = true;
    searchBox.classList.add('visually-hidden');

    currentPosts = await getDataBasePosts(page);

    if (!currentPosts) {
        postsGrid.innerHTML = `<p class="fg-danger">No se pudieron cargar los datos. Intentá de nuevo.</p>`;
    }
    
    console.log(currentPosts);
    if (!currentPosts.has_more_pages) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
        nextButton.classList.remove('visually-hidden');
    }
    chargeGrid(currentPosts);
    randomButton.disabled = false;
    randomButton.classList.remove('visually-hidden');
    previousButton.classList.remove('visually-hidden');

    searchBox.disabled = false;
    searchBox.classList.remove('visually-hidden');
    /*nextButton.addEventListener("click", (result) => {
        if (result.has_more_pages) {
            currentPage += 1;
            let newResponse = getDataBasePosts(currentPage);
            chargeGrid(newResponse)
            console.log(currentPage)
        }
    });
    previousButton.addEventListener("click", (result) => {
        if (result.page > 1) {
            currentPage -= 1;
            let newResponse = getDataBasePosts(currentPage);
            chargeGrid(newResponse)
            console.log(currentPage)
        }
    });*/
}

function nextPage(){
    currentPage += 1;
    controlPosts(currentPage);
    console.log(currentPage);
}

function previousPage() {
    if (currentPage > 1){
        currentPage -= 1;
        controlPosts(currentPage);
        console.log(currentPage);
    } else {
        return
    }
}

function chargeGrid(obj){
    //console.log(obj)
    postsGrid.innerHTML = "";
    let position = 0;
    obj.data.forEach((element) => {
        let title = element.title;
        let description = element.description;
        if (description == "No existe descripción..."){
            description = "";
        }
        postsGrid.innerHTML += 
        `<section class="card">
            <div class="card-body d-flex flex-row align-items-center justify-content-between flex-shrink-0">
                <div class="w-icon">
                    ${element.icon_html.replaceAll('/static/', 'https://factoriobin.com/static/')}
                </div>
                <div style="max-width: 600px;">
                    <h4 class="card-title text-nowrap">${title}</h4>
                </div>
                <p class="card-text vanish-text text-truncate">${element.link}</p>
                <a data-index="${position}" class="btn-solid theme-primary button-more-info" data-bs-toggle="drawer" href="#drawerGeneric" role="button" aria-controls="drawerGeneric">Más Info...</a>
            </div>
        </section>`;

        position += 1;
    });
}

async function getDataBasePosts(page_num) {
    return await fetch(/*'http://localhost:5000/backend/posts?'*/'https://engiai.onrender.com/backend/posts?' + new URLSearchParams({
        page: page_num,
    }).toString())
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => { /*console.log(data);*/ return data;})
        .catch(error => console.error('Hubo un problema:', error));
};

function activateDrawer(element){
    console.log(element);
    if (element.description != "No existe descripción...") {
        drawerPosts.innerHTML = 
        `<div class="drawer-header">
            <h5 class="drawer-title">${element.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="drawer" aria-label="Close"></button>
        </div>
        <div class="drawer-body">
            <h4>Description</h4>
            <p>${element.description}</p>
        </div>`
    } else {
        drawerPosts.innerHTML = 
        `<div class="drawer-header">
            <h5 class="drawer-title">${element.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="drawer" aria-label="Close"></button>
        </div>
        <div class="drawer-body">
        </div>`
    }
    
}

async function searchOnPage(userInput) {
    let response = currentPosts;
    let postsToShow = [];
    if (response) {
        userInput = userInput.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        response.data.forEach((element) => {
            if (element.title.toLowerCase().includes(userInput) || element.description.toLowerCase().includes(userInput)) {
                postsToShow.push(element);
            }
        });
        console.log(postsToShow);
    }
}

postsGrid.addEventListener("click", async (e) => {
    if (e.target.classList.contains('button-more-info')) {
        let dataIndex = e.target.getAttribute('data-index');
        let response = currentPosts;
        console.log(response);
        if (response) {
            let element = response.data[dataIndex];
            console.log(element);
            activateDrawer(element);
        }
    }
});

randomButton.addEventListener("click", () => {
    let random_page = Math.floor(Math.random() * (103 - 1 + 1)) + 1;
    console.log(random_page);
    currentPage = random_page;
    controlPosts(random_page);
});

searchBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchBox.value) {
        e.preventDefault();
        let value = searchBox.value;
        searchOnPage(value);
    }
});