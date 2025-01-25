// import { state } from './model'

import * as model from './model'
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { async } from 'regenerator-runtime';

// hot module reloading
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    // Get hash from url parameter
    const id = window.location.hash
    //remove the hash symbol (#)
    const ids = id.slice(1)

    if (!ids) return;
    await model.loadRecipe(ids);

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // Update view to display active class
    bookmarksView.update(model.state.bookmarks);

    // 1) loading recipe
    recipeView.renderSpinner()

    //2 Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}


const controlSearchResults = async function () {
  try {

    // console.log(resultsView)
    // 1) Get search query
    const query = searchView.getQuery();

    if (!query) return;

    resultsView.renderSpinner()

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results)
    // Some 
    resultsView.render(model.getSearchResultsPage(1));
    // console.log(model.state.search.results)

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goToPage) {
  //  1) Render Next Page
  resultsView.render(model.getSearchResultsPage(goToPage));
  // console.log(model.state.search.results)

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);


  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function () {
  // 1) Add/delete bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2} Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}


const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe
    await model.uploadRecipe(newRecipe)
    // console.log(model.state.recipe)

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Display succss message
    addRecipeView.renderSuccessMessage();

    // Re-render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL on bookmarking without reloading browser
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // console.error(err);
    addRecipeView.renderError(err.message);
  }
}
// Subscriber
// Publisher -> Subscriber is implemented to ensure we do not have the controller function in the view of our application
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
};
init();


const clearBookmarks = function () {
  localStorage.clear('bookmarks')
}
// clearBookmarks();
