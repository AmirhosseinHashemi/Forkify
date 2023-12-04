import 'core-js/stable'; // polyfill ES6 features
import 'regenerator-runtime/runtime'; // polyfill async/await
import * as model from './model.js'; // import entire file as a object with model name
import recipeView from './views/recipeView.js'; // import recipeView object
import searchView from './views/searchView.js';

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
  const query = searchView.getQuery();
  await model.loadSearchResult(query);
  console.log(model.state);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResault);
};
init();
