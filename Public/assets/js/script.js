const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const page = document.getElementById('pag');
let currentPage = 1;

// eventos adicionando eventos de click 
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


// obter uma lista de refeições atraves de um ingrediente 
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            let htmlGroups = "";
            let htmlButtons = "";
            //tratando o index da api
            if (data.meals) {
                for (let index = 0; index < data.meals.length; index++) {
                    const meal = data.meals[index];

                    //bloco de seleção de strings que serão apresentadas 
                    html += `
                     <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-name">
                            <h2>${meal.strMeal}</h2>                                     
                        </div>

                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <h3>${meal.strCategory}</h3>
                        <h3>${meal.strArea}</h3>
                        <div class = "meal-name">
                            
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                    `;
                    //bloco para paginação e limitação de resultado por pagina 
                    let i = index + 1;
                    if (i > 0 && i % 3 == 0) {

                        let divId = i / 3;
                        let divGroup = `<div id='${divId}' class='${divId==1 ? "mostrar" : "esconder"} meal' ${divId==1 ? "" : "hidden"}>${html}</div>`;
                        htmlGroups += divGroup;
                        html = "";
                        let button = `<button class='btnPage' id='btn_${divId}' onClick='showPage(${divId})' >${divId}</button>`;
                        htmlButtons += button;
                    }
                }

                if (html != "") {
                    let divId = Math.ceil(data.meals.length / 3);
                    console.log(divId);
                    let divGroup = `<div id='${divId}' class='esconder meal' hidden>${html}</div>`;
                    htmlGroups += divGroup;
                    let button = `<button id='btn_${divId}' onClick='showPage(${divId})' >${divId}</button>`;
                    htmlButtons += button;
                }

                mealList.innerHTML = htmlGroups;
                page.innerHTML = '<div>' + htmlButtons + '</div>';
            } else {
                // mensagem que deve aparecer caso nenhuma refeição seja encontrada 
                mealList.innerHTML = "Desculpe, não encontramos nenhuma receita!";
                mealList.classList.add('notFound');
            }

        });
}

/** função mostrar paginas
 * objetivo: mostrar página selecionada e esconder página corrente  
 * 
 * */

function showPage(id) {
    document.getElementById(currentPage).classList.add("esconder");
    currentPage = id;
    document.getElementById(id).classList.remove("esconder");

}

// get meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

//  Modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}