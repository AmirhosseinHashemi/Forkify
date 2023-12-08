import 'core-js/stable'; // polyfill ES6 features
import 'regenerator-runtime/runtime'; // polyfill async/await
import * as model from './model.js'; // import entire file as a object with model name
import RecipeView from './views/recipeView.js'; // import recipeView object
import SearchView from './views/searchView.js';
import ResultView from './views/resultView.js';
import PaginationView from './views/paginationView.js';
import BookmarkView from './views/bookmarkView.js';
import AddRecipeView from './views/addRecipeView.js';

// handler recipe that user clicks on
const controlRecipes = async function () {
  try {
    // receive id(#hash) from url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // mark active recipe
    ResultView.update(model.getSearchResaultPage());
    BookmarkView.update(model.state.bookMarks);

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

// handler for change servings number
const controlServing = function (newServing) {
  model.updateServing(newServing);
  RecipeView.update(model.state.recipe);
};

// handler for add bookmark
const controlBookMark = function () {
  if (model.state.recipe.bookMark) {
    model.removeBookMark(model.state.recipe.id);
  } else {
    model.addBookMark(model.state.recipe);
  }

  RecipeView.update(model.state.recipe);
  BookmarkView.render(model.state.bookMarks);
};

// handler for recive bookmarks from local storage
const reciveBookmarks = function () {
  model.getBookmarks();
  BookmarkView.render(model.state.bookMarks);
};

// handler for upload recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    AddRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    RecipeView.render(model.state.recipe);
    BookmarkView.render(model.state.bookMarks);
    //change url hash
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    AddRecipeView.renderSuccess();
  } catch (err) {
    AddRecipeView.renderError(err.message);
  }
};

// add handler to events _ publisher-subscriber pattern
const init = function () {
  BookmarkView.addHandlerBookmark(reciveBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerServingUpdate(controlServing);
  RecipeView.addHandlerBookMark(controlBookMark);
  SearchView.addHandlerSearch(controlSearchResault);
  PaginationView.addHandlerPagination(controlPagination);
  AddRecipeView.addHandlerAddRecipe(controlAddRecipe);
};
init();
