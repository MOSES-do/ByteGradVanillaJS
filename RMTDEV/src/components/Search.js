import {
    searchInputEl,
    searchFormEl,
    jobListSearchEl,
    numberEl,
    BASE_API_URL,
    getData,
    state,
    sortingBtnRelevantEl,
    sortingBtnRecentEl,
} from '../common.js'
import renderError from '../components/Error.js'
import renderSpinner from './Spinner.js';
import renderJobList from './JobList.js';
import renderPaginationButtons from './Pagination.js';

// -- SEARCH COMPONENT
const submitHandler = async (e) => {
    e.preventDefault();

    // get search text
    const searchText = searchInputEl.value;

    // reset sorting on search
    resetSortings();

    // validation (regular expression)
    const forbiddenPattern = /[0-9]/;
    const patternMatch = forbiddenPattern.test(searchText);
    if (patternMatch) {
        renderError('Your search may not contain numbers');
        return;
    }

    // blur input
    searchInputEl.blur();

    // clear searchbar
    jobListSearchEl.innerHTML = '';

    //render spinner
    renderSpinner('search');

    // fetch search result
    try {
        const data = await getData(`${BASE_API_URL}/jobs?search=${searchText}`)

        // extract job items
        const { jobItems } = data;

        // update state
        state.searchJobItems = jobItems;
        // update current page state on search (reste page to 1)
        state.currentPage = 1;
        // reset page buttons on page number reset
        renderPaginationButtons();

        //remove spinner
        renderSpinner('search');

        // render results
        numberEl.textContent = jobItems.length;

        // render job items in search job list
        renderJobList();

        // render results
        numberEl.textContent = jobItems.length;
    } catch (error) {
        //remove spinner
        renderSpinner('search');
        renderError(error.message);
    }

    // fetch(`${BASE_API_URL}/jobs?search=${searchText}`)
    //     .then((res) => {
    //         if (!res.ok) throw new Error('Resource issue (e.g. resource doesn\'t exist)')

    //         return response.json();
    //     }).then(data => {
    //         // extract job items
    // const { jobItems } = data;

    // //remove spinner
    // renderSpinner('search');

    // // render results
    // numberEl.textContent = jobItems.length;

    // // render job items in search job list
    // renderJobList(jobItems);
    //     }).catch(error => {
    //         //remove spinner
    //         renderSpinner('search');
    //         renderError(error.message);
    //     });
}
searchFormEl.addEventListener('submit', submitHandler)

// sorting reset function
function resetSortings() {
    sortingBtnRecentEl.classList.remove('sorting__button--active');
    sortingBtnRelevantEl.classList.add('sorting__button--active');
}