const counterEl = document.querySelector('.counter')
const titleEl = document.querySelector('.counter__title')
const buttonEl = document.querySelector('.counter__button')

const incrementCounter = document.querySelector('.counter__button--increase');
const decrementCounter = document.querySelector('.counter__button--decrease');
const resetCounter = document.querySelector('.counter__reset-button');
const counterValue = document.querySelector('.counter__value');


console.log(incrementCounter)

function incrementBtnHandler() {

    // //convert value to number type
    const currentValue = +counterValue.textContent;

    const counterValueAsNumber = currentValue;

    let newValue = counterValueAsNumber + 1;


    //check if value is greater than 5
    if (newValue > 5) {
        newValue = 5;

        //Give visual indicator by changing background color
        counterEl.classList.add('counter--limit');

        //update counter title to say limit has been reached
        titleEl.innerHTML = "LIMIT! BUY <b>PRO</b> FOR > 5"

        //disable buttons increment/decrement
        buttonEl.disabled = true;
    }



    // //set counter element with new value
    counterValue.textContent = newValue

    //unfocus (blur) reset button
    incrementCounter.blur();
}

function decrementBtnHandler() {
    //shorthand for counter increment and number conversion
    +counterValue.textContent--;

    if (counterValue.textContent < 1) {
        counterValue.textContent = 0;
    }

    //unfocus (blur) reset button
    decrementCounter.blur();
}

const resetCounterHandler = () => {
    counterValue.textContent = 0;

    //remove visual indicator by changing background color
    counterEl.classList.remove('counter--limit');

    //update counter title to say limit has been reached
    titleEl.innerHTML = "FANCY COUNTER"

    //enable buttons increment/decrement
    buttonEl.disabled = true;

    //unfocus (blur) reset button
    resetCounter.blur();
}

//Event Handlers
incrementCounter.addEventListener('click', incrementBtnHandler)
document.addEventListener('keydown', incrementBtnHandler)
decrementCounter.addEventListener('click', decrementBtnHandler)
resetCounter.addEventListener('click', resetCounterHandler)
