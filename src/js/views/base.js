export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchResPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shooping: document.querySelector('.shopping__list'),
    likeList: document.querySelector('.likes__list'),
    likesMenu: document.querySelector('.likes__field')
};

export const renderLoader = parent => {
    const loader = `
        <div class='loader'>
           <svg>
              <use href='img/icons.svg#icon-cw' ></use>
           </svg>
        </div>
    `
    parent.insertAdjacentHTML("afterbegin", loader);
};

export const clerLoader = () => {
    const loader = document.querySelector('.loader');
    loader && loader.parentElement.removeChild(loader);
};