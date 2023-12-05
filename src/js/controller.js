import 'core-js/stable'; // polyfill ES6 features
import 'regenerator-runtime/runtime'; // polyfill async/await
import * as model from './model.js'; // import entire file as a object with model name
import recipeView from './views/recipeView.js'; // import recipeView object
import searchView from './views/searchView.js';
import ResultView from './views/resultView.js';
import PaginationView from './views/paginationView.js';

// handler recipe that user clicks on
const controlRecipes = async function () {
  try {
    // receive id(#hash) from url
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// handler submit event when user searchs for recipes
const controlSearchResault = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    ResultView.renderSpinner();
    await model.loadSearchResult(query);
    ResultView.render(model.getSearchResaultPage());
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// handler pagination when users clicks buttons
const controlPagination = function (goTo) {
  ResultView.render(model.getSearchResaultPage(goTo));
  PaginationView.render(model.state.search);
};

// add handler to events _ publisher-subscriber pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResault);
  PaginationView.addHandlerPagination(controlPagination);
};
init();
