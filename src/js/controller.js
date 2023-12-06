import 'core-js/stable'; // polyfill ES6 features
import 'regenerator-runtime/runtime'; // polyfill async/await
import * as model from './model.js'; // import entire file as a object with model name
import RecipeView from './views/recipeView.js'; // import recipeView object
import SearchView from './views/searchView.js';
import ResultView from './views/resultView.js';
import PaginationView from './views/paginationView.js';

// handler recipe that user clicks on
const controlRecipes = async function () {
  try {
    // receive id(#hash) from url
    const id = window.location.hash.slice(1);
    if (!id) return;

    RecipeView.renderSpinner();
    await model.loadRecipe(id);
    RecipeView.render(model.state.recipe);
  } catch (err) {
    RecipeView.renderError();
  }
};

// handler submit event when user searchs for recipes
const controlSearchResault = async function () {
  try {
    const query = SearchView.getQuery();
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

const controlServing = function (newServing) {
  model.updateServing(newServing);
  RecipeView.update(model.state.recipe);
};

// add handler to events _ publisher-subscriber pattern
const init = function () {
  RecipeView.addHandlerRender(controlRecipes);
  SearchView.addHandlerSearch(controlSearchResault);
  PaginationView.addHandlerPagination(controlPagination);
  RecipeView.addHandlerServingUpdate(controlServing);
};
init();
