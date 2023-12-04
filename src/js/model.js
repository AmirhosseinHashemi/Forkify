import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
  },
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
  } catch (err) {
    console.log(err);
  }
};
