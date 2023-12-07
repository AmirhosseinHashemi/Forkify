import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

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

// receive recipe that users clicks on them
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;

    // store data in the state
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,

      // is recipe on book mark list or not
      bookMark: state.bookMarks.some(marked => marked.id === id),
    };
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
    const data = await getJSON(`${API_URL}?search=${query}`);

    // store data in the state and destructure data
    state.search.result = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
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
  state.bookMarks = JSON.parse(storage);
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
