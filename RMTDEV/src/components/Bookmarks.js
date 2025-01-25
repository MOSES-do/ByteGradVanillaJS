import { state, bookmarksBtnEl, jobDetailsEl, jobListBookmarksEl } from '../common.js'
import renderJobList from './JobList.js';



const clickHandler = (e) => {
    // guard clause
    if (!e.target.className.includes('bookmark')) return;

    // update state

    // Delete
    if (state.bookmarkJobItems.some(bookmarkJobItem => bookmarkJobItem.id === state.activeJobItem.id)) {
        state.bookmarkJobItems = state.bookmarkJobItems.filter(bookmarkJobItem => bookmarkJobItem.id !== state.activeJobItem.id);
    } else {
        // Add
        state.bookmarkJobItems.push(state.activeJobItem);
    }

    // persist data with local storage
    localStorage.setItem('bookmarkJobItems', JSON.stringify(state.bookmarkJobItems));

    // update bookmark icon
    document.querySelector('.job-info__bookmark-icon').classList.toggle('job-info__bookmark-icon--bookmarked');
}

const mouseEnterHandler = () => {
    // make bookmarks btn look active
    bookmarksBtnEl.classList.add('bookmarks-btn--active');

    // make job list visible
    jobListBookmarksEl.classList.add('job-list--visible');

    // render bookmarks job list
    renderJobList('bookmarks');
}

const mouseLeaveHandler = () => {
    // make bookmarks btn look inactive
    bookmarksBtnEl.classList.remove('bookmarks-btn--active');

    // make job list invisible
    jobListBookmarksEl.classList.remove('job-list--visible'); //
}
jobDetailsEl.addEventListener('click', clickHandler)
bookmarksBtnEl.addEventListener('mouseenter', mouseEnterHandler);
jobListBookmarksEl.addEventListener('mouseleave', mouseLeaveHandler);