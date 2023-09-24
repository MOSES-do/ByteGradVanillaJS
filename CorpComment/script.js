'use strict';

//-- COUNTER COMPONENT --
const counterEl = document.querySelector('.counter');
const textareaEl = document.querySelector('#textarea');

//-- FORM COMPOMENT --
const formEl = document.querySelector('.form');
const submit_btn__textEl = document.querySelector('.submit_btn__text');

// Feedback list 
const feedbacksEl = document.querySelector('.feedbacks');


const textInputHandler = () => {
    //determine maximum number of characters
    const maxNumChars = 150;

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




//--FORM
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
        formEl.classList.add('form--valid');

        setTimeout(() => formEl.classList.remove('form--valid'), 2000);
    } else {
        formEl.classList.add('form--invalid');

        setTimeout(() => {
            formEl.classList.remove('form--invalid');
        }, 2000)

        //focus textarea
        textareaEl.focus();

        //stop submission if input was wrong
        return;
    }

    //Submit to the list

    //1) Now we have text, extract other info from text
    //Array methods and string methods can be used together when strings has been converted to an array

    const hashtag = text.split(' ').find(word => word.includes('#'));
    console.log(hashtag)
    const company = hashtag.substring(1);
    const badgeLetter = company.substring(0, 1).toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;


    //new feedback item HTML
    const feedbackItemHTML = `
        <li class="feedback">
            <button class='upvote'>
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${upvoteCount}</span>
            </button>
            <section class="feedback__badge">
            <p class="feedback__letter">${badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${company}</p>
                <p class="feedback__text">${text}</p>
            </div>
            <p class="feedback__date">${daysAgo === 0 ? 'NEW' : `${daysAgo}d`}</p>
        </li>
    `;

    //insert new feedback item in list
    feedbacksEl.insertAdjacentHTML('beforeend', feedbackItemHTML);

    //clear textarea
    textareaEl.value = '';

    //blur submit button/remove focus
    submit_btn__textEl.blur();

    // reset counter
    counterEl.textContent = '150';
};
formEl.addEventListener('submit', formSubmitHandler);
