import 'core-js/stable'; // polyfill ES6 features
import 'regenerator-runtime/runtime'; // polyfill async/await
import * as model from './model.js'; // import entire file as a object with model name
import recipeView from './views/recipeView.js'; // import recipeView object

const controlRecipes = async function () {
  try {
    // receive id(#hash) from url
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    const s = await model.loadRecipe(id);
    console.log(s);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
  }
};

// event handler
['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipes)
);
