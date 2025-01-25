import { state, paginationBtnBackEl, paginationBtnNextEl, paginationEl, paginationNumberBackEl, paginationNumberNextEl, RESULT_PER_PAGE } from "../common.js";

import renderJobList from "./JobList.js";

const renderPaginationButtons = () => {
    // display back button on page 2 or further
    if (state.currentPage >= 2) {
        paginationBtnBackEl.classList.remove('pagination__button--hidden');
    } else {
        paginationBtnBackEl.classList.add('pagination__button--hidden');
    }

    // display next if there are more items on next page
    if ((state.searchJobItems.length - state.currentPage * RESULT_PER_PAGE) <= 0) {
        paginationBtnNextEl.classList.add('pagination__button--hidden');
    } else {
        paginationBtnNextEl.classList.remove('pagination__button--hidden');
    }

    // update page numbers
    paginationNumberNextEl.textContent = state.currentPage + 1
    paginationNumberBackEl.textContent = state.currentPage - 1

    // unfocus ('blur) buttons
    paginationBtnNextEl.blur();
    paginationBtnBackEl.blur();
}
const clickHandler = (e) => {
    const clickedButtonEl = e.target.closest('.pagination__button')

    // stop funcion if null
    if (!clickedButtonEl) return;

    // check if intention is next or back
    const nextPage = clickedButtonEl.className.includes('--next') ? true : false;

    // update state
    nextPage ? state.currentPage++ : state.currentPage--;

    // render pagination button
    renderPaginationButtons();

    // render job items for current page
    renderJobList();

}


paginationEl.addEventListener('click', clickHandler);

export default renderPaginationButtons;