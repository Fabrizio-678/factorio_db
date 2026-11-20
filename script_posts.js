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

controlPosts(currentPage)

/*for (let i = 1; i <= 14; i++) {
    let buttonInfo = document.querySelector(`#info${i}`);
    buttonInfo.addEventListener("click", () => {
        activateDrawer(2)
    })
}*/

async function controlPosts(page){
    let result = await getDataBasePosts(page);
    console.log(result);
    if (!result.has_more_pages) {
        nextButton.disabled = true;
    } else {
        chargeGrid(result);
    }
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
            <div class="card-body d-flex flex-row align-items-center justify-content-between">
                <h4 class="card-title">${title}</h4>
                <p class="card-text">${description}</p>
                <a data-index="${position}" class="btn-solid theme-primary button-more-info" data-bs-toggle="drawer" href="#drawerGeneric" role="button" aria-controls="drawerGeneric">Más Info...</a>
            </div>
        </section>`;

        position += 1;
    });
}

async function getDataBasePosts(page_num) {
    return await fetch('http://localhost:5000/backend/posts?' + new URLSearchParams({
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
    let response = await getDataBasePosts(currentPage);
    let postsToShow = [];
    if (response) {
        userInput = userInput.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        response.data.forEach((element) => {
            if (element.title.toLowerCase().includes(userInput) || element.description.toLowerCase().includes(userInput)) {
                postsToShow += element;
            }
        });
        console.log(postsToShow[0]);
    }
}

postsGrid.addEventListener("click", async (e) => {
    if (e.target.classList.contains('button-more-info')) {
        let dataIndex = e.target.getAttribute('data-index');
        let response = await getDataBasePosts(currentPage);
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
        searchOnPage(searchBox.value);
    }
});