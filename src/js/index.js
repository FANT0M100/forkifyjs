// Global app controller
import * as searchView from './views/searchView'
import { clerLoader, elements, renderLoader } from "./views/base";
import Search from './models/search';


const state = {};
window.state = state;

/* search controller */
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

const controlRecipe = () => {
    console.log(window.location.hash.replace('#', ''));
};
window.addEventListener('hashchange', controlRecipe);