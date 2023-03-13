// Global app controller
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { clerLoader, elements, renderLoader } from "./views/base";
import Search from './models/search';
import Recipe from './models/recipe';
import List from './models/list';


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

        //higlight selected search item
        state.search && searchView.higlightSelected(id)
        //create new recipe object
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


/*shooping list controler */
const controllerList = () => {
    //crete new list
    state.list = new List();
    
    //clear shoping list
    listView.clearShooping();

    //add ingredients
    state.recipe.ingredients.forEach(ing => {
        const item = state.list.addItems(ing.count, ing.unit, ing.ingredient);
        listView.renderItem(item);
    });
}; 

//handle delete and update list item (add shooping)
elements.shooping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete item
        state.list.deleteItems(id);
        //delete from UI
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value, .shopping__count-value *')) {
        //update count
        const val = +e.target.value;
        state.list.updateCount(id, val); 
    }
});


/* heandling recipe button click (minus, plus, like, addshoping)*/
elements.recipe.addEventListener('click', e => {

    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease btn click
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')) {
        //increase btn click
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__love, .recipe__love *')) {
        //click love btn
        console.log('love');
    }else if(e.target.matches('.recipe__btn__add, .recipe__btn__add *')) {
        //click add shoping btn
        controllerList();
    }
});