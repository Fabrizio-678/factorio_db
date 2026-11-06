const postsGrid = document.getElementById("postsGrid")

let currentPage = 1;

controlPosts(currentPage)

async function controlPosts(page){
    let result = await getDataBasePosts(page);
    //console.log(`result es ${result}`)
    chargeGrid(result);
}

function chargeGrid(obj){
    //console.log(obj)
    obj.data.forEach((element) => {
        postsGrid.innerHTML += 
        `<section class="card">
            <div class="card-body d-flex flex-row align-items-center">
                <h4 class="card-title">${element.title}</h4>
                <p class="card-text">${element.description}</p>
                <a href="#" class="btn-solid theme-primary">Más Info...</a>
            </div>
        </section>`
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