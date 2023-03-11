// Global app controller
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { clerLoader, elements, renderLoader } from "./views/base";
import Search from './models/search';
import Recipe from './models/recipe';


const state = {};
window.state = state;

/* SEARCH CONTROLER */
const contorlSearch = async () => {
    //1)get query from view
    const query = searchView.getInput();

    if(query){
        //2) new search object and add state
        state.search = new Search(query);

        //3)clear input value
        searchView.clearInput();

        //clear searchList
        searchView.clearResult();

        //4)add loader
        renderLoader(elements.searchResList);
        
        try {
            await state.search.getResults();
            //5)clear loader
            clerLoader();

            //render recipe UI
            searchView.renderResult(state.search.result)

        } catch (error) {
            alert('Error Search');
        }
    }
};

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contorlSearch();
});

elements.searchResPage.addEventListener('click', (e) => {
    const btn = (e.target.closest('.btn-inline'));

    if(btn) {
        const gotoPage = +btn.dataset.goto;
        searchView.clearResult()
        searchView.renderResult(state.search.result, gotoPage)
    }
});


/* RECIPE CONTROLER */
const controlRecipe = async () => {
    //get ID from url
    const id = window.location.hash.replace('#', '');

    if(id){

        //clear recipe
        recipeView.clearRecipe()

        //prepare UI
        renderLoader(elements.recipe);

        state.recipe = new Recipe(id);
        
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calc time and servings
            state.recipe.calcTime();
            state.recipe.calcServings()

            //clear loader
            clerLoader()

            //render recipe
            recipeView.renderRecipe(state.recipe);
            
        } catch (error) {
            alert('Error Recipe');
        }
    }
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);