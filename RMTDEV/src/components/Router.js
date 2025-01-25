import { jobDetailsContentEl, BASE_API_URL, getData, state } from "../common.js";
import renderSpinner from "./Spinner.js";
import renderJobDetails from "./JobDetails.js";
import renderError from "./Error.js";
import renderJobList from "./JobList.js";

const loadHashChangeHandler = async () => {

    // get id from url
    const id = window.location.hash.substring(1);

    if (id) {

        // remove active class from previously active job item on hash change
        document.querySelectorAll('.job-item--active').forEach(jobItemWithActiveClass => jobItemWithActiveClass.classList.remove('job-item--active'));

        // remove previous job details content
        jobDetailsContentEl.innerHTML = '';

        //remove spinner
        renderSpinner('job-details');

        try {
            const data = await getData(`${BASE_API_URL}/jobs/${id}`)

            const { jobItem } = data;

            // Keep track of active job item object using .find
            // and 
            state.activeJobItem = jobItem;

            // re-render joblist to update active class on hash change
            renderJobList();

            //remove spinner
            renderSpinner('job-details');

            // render job details
            renderJobDetails(jobItem)
        } catch (error) {
            //remove spinner
            renderSpinner('job-details');
            renderError(error.message);
        }
    }
}

// window.addEventListener('DOMContentLoaded', loadHashChangeHandler);
// window.addEventListener('hashchange', loadHashChangeHandler);
const actions = ['DOMContentLoaded', 'hashchange'];
actions.forEach(ev => window.addEventListener(ev, loadHashChangeHandler));

