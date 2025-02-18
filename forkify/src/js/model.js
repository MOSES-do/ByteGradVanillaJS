import { async } from 'regenerator-runtime';
// import { getJSON, sendJSON } from "./helpers";
import { AJAX } from "./helpers";
import { API_URL, RES_PER_PAGE, KEY } from './config.js';


// state - data for our application
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
}

const createRecipeObject = function (data) {
    // destructuring data object
    const { recipe } = data.data;
    // // creating a new object
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        // Short circuit
        ...(recipe.key && { key: recipe.key }),
    };
}


// function changes state object on every call depending on id
// The external object is so that loadRecipe does not return anything
export const loadRecipe = async function (ids) {
    try {
        // http library
        const data = await AJAX(`${API_URL}/${ids}?key=${KEY}`)

        state.recipe = createRecipeObject(data);


        // Persist bookmark status on pageload
        if (state.bookmarks.some(bookmark => bookmark.id === ids))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        // console.log(recipe.ingredients);
    } catch (err) {
        console.error(`${err}`)
        throw err; //makes error available in recipeView.renderError via controller.js
    }
};


export const loadSearchResults = async function (query) {
    try {
        state.search.query = query
        // Key property is to ensure the user generated recipe is added to result list from http request
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                image: rec.image_url,
                publisher: rec.publisher,
                title: rec.title,
                // Short circuit
                ...(rec.key && { key: rec.key }),
            }
        })
        // set page to 1 on every search
        state.search.page = 1;
    } catch (err) {
        console.error(`${err}`)
        throw err; //makes error available in resultsView.renderError via controller.js
    }
}


// Number of result to display per page based on a page number
export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage   //0;
    const end = page * state.search.resultsPerPage  //10;
    return state.search.results.slice(start, end)
}

export const updateServings = function (newServings) {
    // Update recipe ingredients in state
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        // newQt = oldQt * newServings / oldServings //
    });

    state.recipe.servings = newServings;
}

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) {
        // setting a new property on recipe object
        state.recipe.bookmarked = true;
    }

    persistBookmarks();
}

export const deleteBookmark = function (id) {
    // Delete from bookmarks state
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1)

    // Mark current recipe as NOT bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
}

export const uploadRecipe = async function (newRecipe) {
    // Convert obj to an array using Object.entries and filter fields and return only filled fields
    try {
        const ingredients = Object.entries(newRecipe).filter(
            entry => entry[0].startsWith('ingredient') && entry[1] !== ''
        ).map(ing => {
            // const ingArr = ing[1].replaceAll(' ', '').split(',');
            const ingArr = ing[1].split(',').map(el => el.trim());
            if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :');
            const [quantity, unit, description] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description }
        })
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,

        }
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)
        state.recipe = createRecipeObject(data)
        addBookmark(state.recipe);

    } catch (err) {
        throw err;
    }
}



const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage)
};
init();

