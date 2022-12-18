const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const selectInput = document.getElementById("selectInput");
const itemsDiv = document.querySelector(".items-div");

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
                renderItems(data);
            })
    } else if (searchType.includes("area")) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${itemName}`)
            .then(response => response.json())
            .then((data) => {
                renderItems(data);
            })
    } else if (searchType.includes("name")) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${itemName}`)
            .then(response => response.json())
            .then((data) => {
                renderItems(data);
            })
    }

}

function renderItems(data) {
    itemsDiv.innerHTML = "";
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
                        <a href="">
                            <button>view recipe</button>
                        </a>
                    </div>
                `;
                item.innerHTML = content;
                itemsDiv.appendChild(item);
            })
    })
}