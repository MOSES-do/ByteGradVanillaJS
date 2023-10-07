'use strict';

const score0El = document.querySelector('#score--0');
const score1El = document.querySelector('#score--1');

const currentScore0El = document.querySelector('#current--0');
const currentScore1El = document.querySelector('#current--1');

const diceEl = document.querySelector('.dice');

let playing, scores, currentScore, activePlayer;
const scores2 = [0, 0];

const init = () => {
    playing = true;
    scores = [0, 0]
    score0El.textContent = 0;
    score1El.textContent = 0;
    currentScore = 0;
    activePlayer = 0;
    document.querySelector(`.player--${activePlayer}`).classList.add('player--active');
    document.querySelector(`.player--${activePlayer}`).classList.remove('player--winner');
    currentScore0El.textContent = 0;
    currentScore1El.textContent = 0;
    document.querySelector(`.player--1`).classList.remove('player--winner');
    diceEl.classList.add('hidden');
}
init();



const btnRollEl = document.querySelector('.btn--roll');
const btnNewEl = document.querySelector('.btn--new');
const btnHoldEl = document.querySelector('.btn--hold');

const switchPlayer = () => {
    currentScore = 0;
    document.querySelector(`#current--${activePlayer}`).textContent = currentScore;
    document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
    activePlayer = activePlayer === 0 ? 1 : 0;
    document.querySelector(`.player--${activePlayer}`).classList.toggle('player--active');
}

btnRollEl.addEventListener('click', () => {
    //1. Generate random dice roll
    if (playing) {
        const dice = Math.trunc(Math.random() * 6) + 1;
        diceEl.src = `dice-${dice}.png`
        diceEl.classList.remove('hidden');

        if (dice !== 1) {

            //Add to current player score
            currentScore += dice;
            document.querySelector(`#current--${activePlayer}`).textContent = currentScore;
        } else {
            switchPlayer();
        }
    }
})


btnHoldEl.addEventListener('click', () => {
    if (playing) {
        scores[activePlayer] += currentScore;
        scores2[activePlayer] += currentScore;

        document.querySelector(`#score--${activePlayer}`).textContent = scores[activePlayer];

        if (scores[activePlayer] >= 5) {
            playing = false;
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
            diceEl.classList.add('hidden');
        } else {
            switchPlayer();
        }
    }
})


btnNewEl.addEventListener('click', () => {
    init();
})



































































































































































































/*
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');

const score0El = document.querySelector('#score--0');
const score1El = document.querySelector('#score--1');
const diceEl = document.querySelector('.dice');

const currentScore0El = document.querySelector('#current--0');
const currentScore1El = document.querySelector('#current--1');

const btnReset = document.querySelector('.btn--new');
const btnRollEl = document.querySelector('.btn--roll');
const btnHoldEl = document.querySelector('.btn--hold');



let scores, currentScore, activePlayer, playing;


const init = () => {
    scores = [0, 0]
    currentScore = 0;
    activePlayer = 0;
    playing = true;

    diceEl.classList.add('hidden');

    document.querySelector(`#current--0`).textContent = 0;
    document.querySelector(`#current--1`).textContent = 0;
    score0El.textContent = 0;
    score1El.textContent = 0;
    document.querySelector(`.player--${activePlayer}`).classList.add('player--active');
    document.querySelector(`.player--0`).classList.remove('player--winner');
    document.querySelector(`.player--1`).classList.remove('player--winner');
}
init();

function switchPlayer() {
    currentScore = 0;
    document.getElementById(`current--${activePlayer}`).textContent = currentScore;
    activePlayer = activePlayer === 0 ? 1 : 0;
    //reassigning active player bg
    player0El.classList.toggle('player--active');
    player1El.classList.toggle('player--active');
}

btnRollEl.addEventListener('click', () => {
    if (playing) {
        diceEl.classList.remove('hidden');

        //generate random dice
        const dice = Math.trunc(Math.random() * 6) + 1;
        diceEl.src = `dice-${dice}.png`

        // console.log(dice)
        if (dice !== 1) {
            //add dice roll to current score
            currentScore += dice;
            //dynamic allocation of player current score
            document.getElementById(`current--${activePlayer}`).textContent = currentScore;
        } else {
            //switch player

            switchPlayer();
        }
    }
})

btnHoldEl.addEventListener('click', () => {
    if (playing) {
        //1. Add current score to active player's score
        scores[activePlayer] += currentScore;
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

        //Finish the game
        //2. Check if  player's score >= 100
        if (scores[activePlayer] >= 30) {
            playing = false;
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
            diceEl.classList.add('hidden');

            // btnHoldEl.disabled = true;
        } else {
            //switch to next player
            switchPlayer();
        }
    }
})



btnReset.addEventListener('click', init);

*/