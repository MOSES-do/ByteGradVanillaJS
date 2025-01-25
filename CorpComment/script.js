'use strict';

// --GLOBAL --
const MAX_CHARS = 150;
const BASE_API_URL = `https://bytegrad.com/course-assets/js/1/api`


//-- COUNTER COMPONENT --
const counterEl = document.querySelector('.counter');
const textareaEl = document.querySelector('#textarea');

//-- FORM COMPOMENT --
const formEl = document.querySelector('.form');
const submit_btn__textEl = document.querySelector('.submit_btn__text');
const spinnerEl = document.querySelector('.spinner');

// Feedback list 
const feedbacksEl = document.querySelector('.feedbacks');
const hashtagListEl = document.querySelector('.hashtags');

const renderFeedbackItem = (feedbackItem, post) => {
    const insertHTMLPostContent = feedbackItem === 'insertContent' ?
        `
        <li class="feedback">
            <button class='upvote'>
                <i class="fa-solid fa-caret-up  upvote__icon--up"/></i>
                <span class="vote__count upvote__vote__count">${post.upvoteCount}</span>
                <i class="fa-solid fa-caret-down upvote__icon--down voteicon--disable"></i>
            </button>
            <section class="feedback__badge">
            <p class="feedback__letter">${post.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${post.company}</p>
                <p class="feedback__text">${post.text}</p>
            </div>
            <p class="feedback__date">${post.daysAgo === 0 ? 'NEW' : `${post.daysAgo}d`}</p>
        </li>
    `
        :
        '';
    //insert new feedback item in list
    feedbacksEl.insertAdjacentHTML('beforeend', insertHTMLPostContent);
}

fetch(`${BASE_API_URL}/feedbacks`)
    .then(res => {
        return res.json();
    }).then(data => {
        // console.log(data.feedbacks)

        //remove spinner when data is received
        spinnerEl.remove();

        data.feedbacks.forEach(feedbackItem => {
            renderFeedbackItem('insertContent', feedbackItem)
        })
    })
    .catch(error => {
        feedbacksEl.textContent = `Failed to fetch feedback items. Error message: ${error.message}`;
    });


(() => {
    const textInputHandler = () => {
        //determine maximum number of characters
        const maxNumChars = MAX_CHARS;

        //determine number of characters typed
        const numOfCharsTyped = textareaEl.value.length;
        // console.log(numOfChars)

        //calculate number of characters left
        const remainingCharacterLength = maxNumChars - numOfCharsTyped;

        //show number of characters left
        counterEl.textContent = remainingCharacterLength;

        const warningOnCharacterLength = remainingCharacterLength === 0;

        if (warningOnCharacterLength) {
            formEl.classList.add('form--invalid');
            setTimeout(() => formEl.classList.remove('form--invalid'), 2000);
        }
    };
    textareaEl.addEventListener('input', textInputHandler);
})()




//--FORM COMPONENT --

const showVisualIndicator = (textCheck) => {
    const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid';
    //show valid indicator
    formEl.classList.add(className);
    //remove valid indicator
    setTimeout(() => formEl.classList.remove(className), 2000);
}

const formSubmitHandler = (e) => {
    //prevent default browser action on form submission
    e.preventDefault();

    //get text from textarea 
    const text = textareaEl.value;

    if (text.includes('<script>')) {
        formEl.classList.add('form--invalid');
        alert('Scripts not allowed');
        text = text.replace('<script>', '')
    }

    //validate text (e.g. check if #hashtag is present and text is long enough)
    if (text.includes('#') && text.length >= 5) {
        showVisualIndicator('valid');
    } else {
        showVisualIndicator('invalid');

        //focus textarea
        textareaEl.focus();

        //stop submission if input was wrong
        return;
    }

    //Submit to the list

    //1) Now we have text, extract other info from text
    //Array methods and string methods can be used together when strings has been converted to an array

    const hashtag = text.split(' ').find(word => word.includes('#'));
    // console.log(hashtag)
    const company = hashtag.substring(1);
    const badgeLetter = company.substring(0, 1).toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;

    //create feedback item object
    const post = {
        hashtag: hashtag,
        company: company,
        badgeLetter: badgeLetter,
        upvoteCount: upvoteCount,
        daysAgo: daysAgo,
        text: text
    }
    //render feedback item in  list
    renderFeedbackItem('insertContent', post);

    //send feedback item to server
    fetch(`${BASE_API_URL}/feedbacks`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(post)
    }).then(res => {
        if (!res.ok) {
            console.log('Something went wrong');
            return;
        }
        console.log('Successfully submitted;')
    }).catch(err => console.log(err)
    )

    //clear textarea
    textareaEl.value = '';

    //blur submit button/remove focus
    submit_btn__textEl.blur();

    // reset counter
    counterEl.textContent = MAX_CHARS;
};
formEl.addEventListener('submit', formSubmitHandler);



(() => {
    // -- FEEDBACK LIST COMPONENT --- Event delegation --------------------------------
    const clickHandler = event => {
        // console.log(event)
        //get clicked HTML-element
        const clickedEl = event.target;
        console.log(clickedEl)
        //determine if user intended to upvote or expand. Returns a boolean value
        const upvoteIntention = clickedEl.className.includes('upvote');
        console.log(upvoteIntention)

        //run the appropriate logic
        if (upvoteIntention) {
            const upvoteBtnEl = clickedEl.closest('.upvote');

            const upVoteCounter = clickedEl.className.includes('upvote__icon--up');
            const downVoteCounter = clickedEl.className.includes('upvote__icon--down');

            const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__icon--up');
            const downVoteCountEl = upvoteBtnEl.querySelector('.upvote__icon--down');

            //vote count element
            const voteCountEl = upvoteBtnEl.querySelector('.vote__count');
            let upvoteCount = +voteCountEl.textContent;

            function addVoteCount(vote) {
                vote === 'add' ? upvoteCount = upvoteCount + 1 : ''
                voteCountEl.textContent = upvoteCount;
            }

            function subtractVoteCount(vote) {
                vote === 'sub' ? upvoteCount = upvoteCount - 1 : '';
                voteCountEl.textContent = upvoteCount;
            }

            //vote count element
            if (upVoteCounter) {
                addVoteCount('add');
                upvoteCountEl.classList.add('voteicon--disable');
                downVoteCountEl.classList.remove('voteicon--disable');
            }
            if (downVoteCounter) {
                subtractVoteCount('sub');
                upvoteCountEl.classList.remove('voteicon--disable');
                downVoteCountEl.classList.add('voteicon--disable');
            }

        } else {
            //expand the clicked feedback item
            //selects the closest element with the class .feedback from the element clicked
            clickedEl.closest('.feedback').classList.toggle('feedback--expand');
        }
    }
    feedbacksEl.addEventListener('click', clickHandler);
})()






// ---HASHTAG LIST COMPONENT ---
/**
 * We get the hashtag using event delegation and childNodes and compare 
 * if they are the same to perform some action
 * 
 */
const clickHandler = (e) => {
    //get clicked event
    const clickedEl = e.target;
    console.log(clickedEl)
    //stop function if click happened in list, but outside buttons
    if (clickedEl.className === 'hashtags') return;

    //extract company name
    const companyNameFromHashtag = clickedEl.textContent.substring(1).toLowerCase().trim();

    //iterate over each feedback item in the list
    feedbacksEl.childNodes.forEach(childNode => {
        //stop this iteration if it's a text node
        if (childNode.nodeType === 3) return;

        //extract company name
        const companyNameFromFeedbackItem = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();

        //remove feedback item if company name are not equal
        if (companyNameFromHashtag !== companyNameFromFeedbackItem) {
            childNode.remove();
        }
    })
    console.log(clickedEl)
}

hashtagListEl.addEventListener('click', clickHandler);



// refactored above for better performance
/**
 *     const upvoteBtnEl = clickedEl.closest('.upvote');

            //toggle between addition and subtraction of vote for each user
            const upvoteCountUp = upvoteBtnEl.querySelector('.upvote__icon--up');
            const upvoteCountDown = upvoteBtnEl.querySelector('.upvote__icon--down');

            //vote count element
            const voteCountEl = upvoteBtnEl.querySelector('.vote__count');
            let upvoteCount = +voteCountEl.textContent;

            function addVoteCount(vote) {
                vote === 'add' ? upvoteCount = upvoteCount + 1 : ''
                voteCountEl.textContent = upvoteCount;
            }

            function subtractVoteCount(vote) {
                vote === 'sub' ? upvoteCount = upvoteCount - 1 : '';
                voteCountEl.textContent = upvoteCount;
            }

            //run logic using above functions
            upvoteCountUp.addEventListener('click', () => {
                addVoteCount('add');
                upvoteCountUp.classList.add('voteicon--disable');
                upvoteCountDown.classList.remove('voteicon--disable');
            })
            upvoteCountDown.addEventListener('click', () => {
                subtractVoteCount('sub')
                upvoteCountUp.classList.remove('voteicon--disable');
                upvoteCountDown.classList.add('voteicon--disable');
            })
 */