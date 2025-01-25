import { sortingBtnRelevantEl, sortingBtnRecentEl, sortingEl, state } from "../common.js";
import renderJobList from "./JobList.js";
import renderPaginationButtons from "./Pagination.js";


const clickHandler = () => {
    // get clicked button element
    const clickedButtonEl = event.target.closest('.sorting__button')

    // guard clause
    if (!clickedButtonEl) return;

    // update state if sort clicked (reste page to 1)
    state.currentPage = 1;
    // reset page buttons on page number reset
    renderPaginationButtons();

    // check if intemtion is recent or relavant sorting
    const recent = clickedButtonEl.className.includes('--recent') ? true : false;

    // make sorting button look (in)active
    if (recent) {
        sortingBtnRecentEl.classList.add('sorting__button--active');
        sortingBtnRelevantEl.classList.remove('sorting__button--active');
    } else {
        sortingBtnRecentEl.classList.remove('sorting__button--active');
        sortingBtnRelevantEl.classList.add('sorting__button--active');
    }

    // sort job items
    if (recent) {
        state.searchJobItems.sort((a, b) => {
            return a.daysAgo - b.daysAgo;
        })
    }

    if (!recent) {
        state.searchJobItems.sort((a, b) => {
            return b.relevanceScore - a.relevanceScore;
        })
    }

    // render jobItems in list
    renderJobList()
}
sortingEl.addEventListener('click', clickHandler);