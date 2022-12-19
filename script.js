const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const selectInput = document.getElementById("selectInput");
const itemsDiv = document.querySelector(".items-div");
const recipeDetails = document.querySelector(".recipe-details");

//www.themealdb.com/api/json/v1/1/list.php?i=list

window.addEventListener("DOMContentLoaded", () => {
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=beef')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            renderItems(data);
        })
})

selectInput.addEventListener("click", () => {
    searchInput.setAttribute("placeholder", `filter meals by: ${selectInput.value}`);
})

searchBtn.addEventListener("click", () => {
    let item = searchInput.value;
    let searchType = selectInput.value;

    itemSearch(item, searchType);
})

function itemSearch(itemName, searchType) {

    if (searchType.includes("category")) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${itemName}`)
            .then(response => response.json())
            .then((data) => {
                renderItems(data, searchType);
            })
    } else if (searchType.includes("area")) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${itemName}`)
            .then(response => response.json())
            .then((data) => {
                renderItems(data, searchType);
            })
    } else if (searchType.includes("name")) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${itemName}`)
            .then(response => response.json())
            .then((data) => {
                renderItems(data, searchType);
            })
    }

}

function renderItems(data, searchType) {
    itemsDiv.innerHTML = "";
    if (data.meals != null) {
        data.meals.forEach((meal) => {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then(response => response.json())
                .then((data) => {
                    let item = document.createElement("div");
                    item.classList.add("item");
                    item.setAttribute("data-id", `${data.meals[0].idMeal}`)
                    let content = "";
                    content = `                            
                        <div class="img">
                            <img src="${data.meals[0].strMealThumb}" alt="">
                        </div>
                        <div class="item-info">
                            <h2>${data.meals[0].strMeal}</h2>
                            <p>
                                ${data.meals[0].strInstructions.substring(0, 90) + ". . ."}
                            </p>
                        </div>
                        <div class="buttons">
                            <a href="
                                ${data.meals[0].strYoutube}
                            ">
                                <button><i class="fa-solid fa-play"></i> play Video</button>
                            </a>
                                <button class="recipeBtn">view recipe</button>
                        </div>
                    `;


                    item.innerHTML = content;
                    itemsDiv.appendChild(item);

                    let recipeBtns = itemsDiv.querySelectorAll(".item .buttons .recipeBtn");
                    recipeBtns.forEach((button) => {
                        button.addEventListener("click", (e) => {
                            let itemId = e.currentTarget.parentElement.parentElement.dataset.id;
                            if (itemId == data.meals[0].idMeal) {
                                showRecipeDetails(itemId);
                                recipeDetails.classList.add("showRecipe");
                            }
                        })
                    })
                })
        })
    } else {
        itemsDiv.innerHTML = `<h2>Sorry, we can't find meals from your search, Please make sure you are searching by ${searchType}</h2>`
    }
}

function showRecipeDetails(itemId) {

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${itemId}`)
        .then(response => response.json())
        .then((data) => {
            data.meals.forEach((meal) => {
                let contents = `
                    <div class="img">
                        <img src="${meal.strMealThumb}" alt="">
                    </div>
                    <h2>${meal.strMeal}</h2>
                    <p class="recipe-text">
                        ${meal.strInstructions}
                    </p>
                    <div class="specifications">
                        <button class="category">${meal.strCategory}</button>
                        <button class="area">${meal.strArea}</button>
                    </div>
                    <i class="fa-solid fa-xmark"></i>
                `;
                recipeDetails.innerHTML = contents;
                let closeBtn = recipeDetails.querySelector("i.fa-xmark");
                closeBtn.addEventListener("click", () => {
                    recipeDetails.classList.remove("showRecipe");
                })
            })
        })
}