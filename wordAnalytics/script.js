const textareaEl = document.querySelector('.textarea');
const charactersNumberEl = document.querySelector('.stat__number--characters');
const twitterNumberEl = document.querySelector('.stat__number--twitter');
const facebookNumberEl = document.querySelector('.stat__number--facebook');
const wordsNumberEl = document.querySelector('.stat__number--words');

//

const inputHandler = () => {
    if (textareaEl.value.includes('<script>')) {
        alert('Scripts not allowed')
        textareaEl.value = textareaEl.value.replace('<script>', '');
    }
    // console.log('h')

    //determine new numbers
    const numOfCharacters = textareaEl.value.length;
    const twitterCharactersLeft = 280 - numOfCharacters;
    const facebookCharactersLeft = 2200 - numOfCharacters;

    //add visual indicator if limit is exceeeded
    if (twitterCharactersLeft < 0) {
        twitterNumberEl.classList.add('stat__number--limit');
    } else {
        twitterNumberEl.classList.remove('stat__number--limit');
    }

    if (facebookCharactersLeft < 0) {
        facebookNumberEl.classList.add('stat__number--limit');
    } else {
        facebookNumberEl.classList.remove('stat__number--limit');
    }

    //set new numbers
    charactersNumberEl.textContent = numOfCharacters;
    twitterNumberEl.textContent = twitterCharactersLeft;
    facebookNumberEl.textContent = facebookCharactersLeft;


    //word count
    let wordArrayLength = textareaEl.value.split(' ').length;
    if (textareaEl.value.length === 0) {
        wordArrayLength = 0;
    }

    const wordsEl = document.querySelector('.stat__number--words');
    wordsEl.innerHTML = wordArrayLength
}

textareaEl.addEventListener('input', inputHandler);


