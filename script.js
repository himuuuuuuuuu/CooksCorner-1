// DOM
let searchFood = document.getElementById("search-input");
let searchBtn = document.getElementById("search-btn");
let allCards = document.getElementById("allCards");
let allCategoryButtons =
  document.getElementsByClassName("allCategoryButtons")[0];
let searchByLettter = document.getElementById("searchByLettter");
let myMegaCard = document.getElementById("megaCard");
let resultInfo = document.getElementById("result-info");

// displaying all catagoty and letter button whenever our Page Load.

window.onload = () => {
  displayCatagotyButton();
  generateLetterButtons();
  allCards.innerHTML = "";
};

/**
 * When User Click on Top search Button we are calling function fetchDataByName Function
 * with the argument value of Search input-box.
 */
searchBtn.addEventListener("click", () => {
  resultInfo.innerHTML = "";
  if (searchFood.value == "") {
    resultInfo.innerHTML = "Please Enter Recipe Name 🙏";
  } else {
    resultInfo.innerHTML = `Search Result for : &nbsp;<span id="keyword">${searchFood.value}<span/>`;
    fetchDataByName(searchFood.value);
  }
});

async function fetchDataByName(name) {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=" + name
    );
    const data = await response.json();
    displayData(data);
  } catch {
    resultInfo.innerHTML = "Something Went Wrong 😞😞 TRY Later !! ";
    clearAllCards();
  }
}

function displayData(data) {
  clearAllCards();

  isCategories = "categories" in data;

  if (isCategories) {
    const { categories } = data;
    arrayOfObject = categories;
  } else {
    const { meals } = data;
    arrayOfObject = meals;
  }

  if (arrayOfObject == null) {
    resultInfo.innerHTML = "No Result Found !!😟 ";
    return;
  }

  arrayOfObject.forEach((element, index) => {
    let card = document.createElement("div");

    card.innerHTML = `<div class="mycard">
            <div class="food-img">
               <img src="${
                 isCategories ? element.strCategoryThumb : element.strMealThumb
               }"
                alt="food-img">
            </div>
            <div class="food-info">
            <h2>${isCategories ? element.strCategory : element.strMeal}</h2>
            <button class="readMoreBtn" onclick="getById(${
              isCategories ? element.idCategory : element.idMeal
            })">Read More</button>
         </div>
         </div>`;

    allCards.appendChild(card);
  });
}

// here this fetchAllCategories function will fetch all 14 Categories of meal.

async function fetchAllCategories() {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    const data = await response.json();
    return data;
  } catch {
    resultInfo.innerHTML = "Something Went Wrong 😞😞 TRY Later !! ";
    clearAllCards();
  }
}

// here this Function will Display All the Category Buttons Below Search Bar.

async function displayCatagotyButton() {
  const AllCategories = await fetchAllCategories();
  const { categories } = AllCategories;

  categories.forEach((element) => {
    let categoryBtn = document.createElement("button");

    categoryBtn.innerText = `${element.strCategory}`;
    categoryBtn.classList.add("CategoryBtn");
    categoryBtn.setAttribute("onClick", "fetchByCatagoty(this)");

    allCategoryButtons.appendChild(categoryBtn);
  });
  fetchByCatagoty("All categories");
}

// Here fetchByCatagoty Function will call when user click on catagory button below search bar.

async function fetchByCatagoty(catagoty) {
  resultInfo.innerHTML = "";
  // remove active class from all Buttons
  let CategoryBtns = document.querySelectorAll(".CategoryBtn");
  for (let i = 0; i < 15; i++) {
    CategoryBtns[i].classList.remove("active");
  }

  // if user click on "All categories" Button
  if (catagoty == "All categories") {
    const allCategories = await fetchAllCategories();
    displayData(allCategories);
    CategoryBtns[0].classList.add("active");
    return;
  }

  catagoty.classList.add("active");

  try {
    const filterBycatagoty = await fetch(
      "https://www.themealdb.com/api/json/v1/1/filter.php?c=" +
        catagoty.innerText
    );
    const catagotyJson = await filterBycatagoty.json();
    displayData(catagotyJson);
  } catch {
    resultInfo.innerHTML = "Something Went Wrong 😞😞 TRY Later !! ";
    clearAllCards();
  }
}

async function getById(id) {
  try {
    const getById = await fetch(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );
    const data = await getById.json();
    displayAllDetails(data["meals"]["0"]);
  } catch {
    resultInfo.innerHTML = "Something Went Wrong 😞😞 TRY Later !! ";
    clearAllCards();
  }
}

function displayAllDetails(recipeObject) {
  clearAllCards();
  // allCards.remove();
  console.log(myMegaCard);
  allCards.style.paddingBlock = 0 + "px";
  const div = document.createElement("div");

  div.classList = "innerDiv";

  div.innerHTML = `
    <h1 class="topbanner">${recipeObject.strMeal}</h1>
    <hr />
    <div class="parts">
      <div class="left-part">
        <img src="${recipeObject.strMealThumb}" alt="food-img" />
        <iframe width="520" height="320"src="https://www.youtube.com/embed/${
          recipeObject.strYoutube.split("=")[1]
        }"></iframe>
      </div>
      <div class="right-part">
        <p class="category">
          <span>Category</span> : ${recipeObject.strCategory}
        </p>
        <p class="area"><span> Area</span> : ${recipeObject.strArea}</p>

        <p>
          <span>Instructions :</span> <br /><br />
          ${recipeObject.strInstructions};
        </p>

        <ol id="ingredientList">
          <li><span>Ingredient</span> :</li>
          <br />
        </ol>
        <a href="${recipeObject.strYoutube}" target="_blank">watch video</a>
      </div>
    </div>
    `;

  console.log(myMegaCard);

  myMegaCard.appendChild(div);

  let ol = document.getElementById("ingredientList");
  console.log(ol);

  let i = 1;
  str = "strIngredient" + i;
  console.log(typeof str);

  console.log(typeof recipeObject.strIngredient1);

  console.log(recipeObject.strIngredient1);
  // while (recipeObject.str != null) {
  //   let li = document.createElement("li");
  //   li.innerText = str;
  //   ol.appendChild(li);
  //   i++;
  // }
}

// generate footer letter buttons

function generateLetterButtons() {
  for (i = 97; i <= 122; i++) {
    let letterButton = document.createElement("button");
    letterButton.setAttribute("onClick", "searchByletter(this.innerText)");
    letterButton.innerHTML = `${String.fromCharCode(i)} `;
    searchByLettter.appendChild(letterButton);
  }
}

async function searchByletter(letter) {
  resultInfo.innerHTML = "";
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?f=" + letter
    );
    const data = await response.json();
    displayData(data);
  } catch {
    resultInfo.innerHTML = "Something Went Wrong 😞😞 TRY Later !! ";
    clearAllCards();
  }
}

function clearAllCards() {
  allCards.innerHTML = "";
  myMegaCard.innerHTML = "";
}
