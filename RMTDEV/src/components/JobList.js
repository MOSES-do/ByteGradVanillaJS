import {
    jobListSearchEl,
    jobDetailsContentEl,
    BASE_API_URL,
    getData,
    state,
    RESULT_PER_PAGE,
    jobListBookmarksEl
} from '../common.js'
import renderError from './Error.js';
import renderJobDetails from './JobDetails.js';
import renderSpinner from './Spinner.js';

const renderJobList = (whichJobList = 'search') => {
    // determine correct selector for job list (search list or bookmark list)
    const jobListEl = whichJobList === 'search' ? jobListSearchEl : jobListBookmarksEl;

    jobListEl.innerHTML = '';

    // determine job items to be rendered
    let jobItems;
    if (whichJobList === 'search') {
        jobItems = state.searchJobItems.slice(state.currentPage * RESULT_PER_PAGE - RESULT_PER_PAGE, state.currentPage * RESULT_PER_PAGE)
    } else if (whichJobList === 'bookmarks') {

        jobItems = state.bookmarkJobItems;
    }

    jobItems.map(jobItem => {
        const id = state.activeJobItem.id;
        const newJobItemHTML = `
                <li class="job-item ${jobItem.id === id ? 'job-item--active' : ''}">
                    <a class="job-item__link" data-href="${jobItem.id}" href="${jobItem.id}">
                        <div class="job-item__badge">${jobItem.badgeLetters}</div>
                        <div class="job-item__middle">
                            <h3 class="third-heading">${jobItem.title}</h3>
                            <p class="job-item__company">${jobItem.company}</p>
                            <div class="job-item__extras">
                                <p class="job-item__extra"><i class="fa-solid fa-clock job-item__extra-icon"></i> ${jobItem.duration}</p>
                                <p class="job-item__extra"><i class="fa-solid fa-money-bill job-item__extra-icon"></i> ${jobItem.salary}</p>
                                <p class="job-item__extra"><i class="fa-solid fa-location-dot job-item__extra-icon"></i> ${jobItem.location}</p>
                            </div>
                        </div>
                        <div class="job-item__right">
                            <i class="fa-solid fa-bookmark job-item__bookmark-icon ${state.bookmarkJobItems.some(bookmarkJobItem => bookmarkJobItem.id === jobItem.id) && 'job-item__bookmark-icon--bookmarked'}"></i>
                            <time class="job-item__time">${jobItem.daysAgo}d</time>
                        </div>
                    </a>
                </li>`
        jobListEl.insertAdjacentHTML('beforeend', newJobItemHTML);
    })
}
// -- JOB LIST COMPONENT
const clickHandler = async (e) => {
    // prevent default (navigation)
    e.preventDefault();

    // get clicked element
    const jobItemEl = e.target.closest('.job-item');

    // remove active class from previously active job item
    document.querySelectorAll('.job-item--active').forEach(jobItemWithActiveClass => jobItemWithActiveClass.classList.remove('job-item--active'));

    //empty job details section
    jobDetailsContentEl.innerHTML = '';

    //render spinner
    renderSpinner('job-details');

    // get the id
    const id = jobItemEl.children[0].getAttribute('href')

    // Keep track of active job item object using .find
    const allJobItems = [...state.searchJobItems, ...state.bookmarkJobItems];
    state.activeJobItem = allJobItems.find(jobItem => jobItem.id === +id);

    // re-render search joblist to update active class on bookmark item click
    renderJobList();

    // add id to the url
    // window.location.hash = id;
    history.pushState(null, '', `/#${id}`)


    try {
        const data = await getData(`${BASE_API_URL}/jobs/${id}`)

        const { jobItem } = data;

        state.jobItem = jobItem;
        //remove spinner
        renderSpinner('job-details');

        // render job details
        renderJobDetails(state.jobItem)
    } catch (error) {
        //remove spinner
        renderSpinner('job-details');
        renderError(error.message);
    }


};
jobListSearchEl.addEventListener('click', clickHandler);
jobListBookmarksEl.addEventListener('click', clickHandler);


export default renderJobList;