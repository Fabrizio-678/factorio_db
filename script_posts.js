//Botones de Paginación
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");

const postsGrid = document.getElementById("postsGrid")

let currentPage = 1;
// let has_more_pages = true

controlPosts(currentPage)

async function controlPosts(page){
    let result = await getDataBasePosts(page);
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
                <a href="#drawerGeneric" class="btn-solid theme-primary" role="button" aria-controls="drawerGeneric">Más Info...</a>
            </div>
        </section>`;
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