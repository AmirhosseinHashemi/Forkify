import { API_URL, KEY, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookMarks: [],
};

const recreateRecipeObject = function (data) {
  const { recipe } = data.data;

  // store data in the state
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// receive recipe that users clicks on them
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = recreateRecipeObject(data);
    // is recipe on book mark list or not
    state.recipe.bookMark = state.bookMarks.some(marked => marked.id === id);
  } catch (err) {
    // rethrow error for controller
    throw err;
  }
};

// receive recipes that users searchs for
export const loadSearchResult = async function (query) {
  try {
    // store query in the state
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // store data in the state and destructure data
    state.search.result = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    // reset page to one
    state.search.page = 1;
  } catch (err) {
    console.log(err);
  }
};

// slice some spcific result of search
export const getSearchResaultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.result.slice(start, end);
};

export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

// set bookmarks in the local storage
const setBookmarksInStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
};

// get bookmarks from the local storage
export const getBookmarks = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookMarks = JSON.parse(storage);
};

export const addBookMark = function (recipe) {
  state.bookMarks.push(recipe);
  if (state.recipe.id === recipe.id) state.recipe.bookMark = true;
  setBookmarksInStorage();
};

export const removeBookMark = function (id) {
  const index = state.bookMarks.findIndex(marked => id === marked.id);
  state.bookMarks.splice(index, 1);
  if (state.recipe.id === id) state.recipe.bookMark = false;
  setBookmarksInStorage();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // destructur ingredients into an array of object
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingredientArr = ing[1].replaceAll(' ', '').split(',');
        // check if ingredients is written into correct form  => quantity,unit,description
        if (ingredientArr.length !== 3) {
          throw new Error('Please enter ingredients in correct form :(');
        }
        const [quantity, unit, description] = ingredientArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    // convert uploaded recipe into correct form to send for server
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = recreateRecipeObject(data);
    addBookMark(state.recipe);
    console.log(state);
  } catch (err) {
    throw err;
  }
};
