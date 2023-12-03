export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    // send and receive request
    const response = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await response.json();

    // handle error
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    // destructuring recipe object
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
    console.error(err);
  }
};
