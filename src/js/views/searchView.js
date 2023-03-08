import { elements } from "./base";


export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = "";

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
}

//recipe title limit 
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0)
        return `${newTitle.join(' ')}...`
    }
    return title;
};

//get recipe object and make UI
const renderRecipe = recipe => {
    const markup = `
      <li>
        <a class="results__link" href="${recipe.recipe_id}">
          <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
          </div>
        </a>
      </li>
    `;
    
    elements.searchResList.insertAdjacentHTML('beforeend', markup)
};

export const renderResult = (recipes) => {
    recipes.forEach(renderRecipe);
};