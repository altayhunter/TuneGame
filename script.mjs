import {
	playNote,
} from './audio.mjs';
import {
	retrieveHighScore,
	storeHighScore,
} from './storage.mjs';

// DOM elements.
const resultText = document.getElementById('result');
const detailsText = document.getElementById('details');
const submitButton = document.getElementById('submit');
const continueButton = document.getElementById('continue');
const tryAgainButton = document.getElementById('tryAgain');
const pianoKeys = document.getElementsByClassName('pianoKey');

// Globals.
const answer = {};
const ramp = 0.9;
let error;

// Update the error for the next round, or reset it to its initial value.
function setError(reset) {
	error *= ramp;
	if (reset) error = 0.25;
	if (Math.random() < 0.5) error *= -1;
}

// Return the error of the previous round as a percentage.
function getScore() {
	return parseFloat((Math.abs(error) / ramp * 100).toPrecision(4));
}

// Select a new random note.
function chooseRandomNote() {
	const randomInt = (max) => max * Math.random() << 0;
	const index = randomInt(pianoKeys.length);
	answer['index'] = index;
	answer['shown'] = false;
}

// Place the piano keys in their default state, with none selected.
function resetPianoKeys() {
	for (const element of pianoKeys) {
		element.classList = 'pianoKey';
	}
}

// Return the index of the selected piano key.
function selectedPianoKey() {
	for (let i = 0; i < pianoKeys.length; i += 1) {
		if (pianoKeys[i].classList.contains('selected')) {
			return i;
		}
	}
	return -1;
}

// Return the distance in half-notes from the correct answer.
function answerDistance(index) {
	const distance = Math.abs(index - answer['index']);
	if (distance === 11) return 1;
	return distance;
}

// Check current score against high score and reveal both to the player.
function checkHighScore() {
	const score = getScore();
	const record = retrieveHighScore();
	if (score <= 25) {
		detailsText.innerHTML = 'Your precision: ' + score + '%';
		if (score < record) {
			storeHighScore(score);
		}
	}
	if (record <= 25) {
		detailsText.innerHTML += '<br>';
		detailsText.innerHTML += 'Previous best: ' + record + '%';
	}
}

// Check the guess against the answer and update the UI accordingly.
function submitHandler() {
	const index = selectedPianoKey();
	if (index < 0) return;
	answer['shown'] = true;
	pianoKeys[answer['index']].classList.add('correct');
	const distance = answerDistance(index);
	if (distance == 0) {
		resultText.textContent = 'Correct!';
		const scale = Math.round(100 * (1 - ramp));
		detailsText.textContent = `Next one will be ${scale}% harder`;
		setError(false);
		continueButton.classList.remove('hidden');
		continueButton.focus();
	} else {
		resultText.textContent = 'Game Over';
		checkHighScore();
		pianoKeys[index].classList.add('incorrect');
		tryAgainButton.classList.remove('hidden');
	}
	submitButton.disabled = true;
	submitButton.classList.add('hidden');
}

// Mark the piano key as selected and play the corresponding tone.
function selectHandler(index) {
	if (answer['shown']) return;
	resetPianoKeys();
	pianoKeys[index].classList.add('selected');
	playNote(index, index === answer['index'] ? error : 0);
	submitButton.disabled = false;
}

// Add the click and keypress handlers to the piano keys.
function setPianoKeyHandlers() {
	for (let i = 0; i < pianoKeys.length; i += 1) {
		pianoKeys[i].addEventListener('click', () => selectHandler(i));
	}
	document.addEventListener('keydown', (event) => {
		switch (event.code) {
			case 'KeyS': return selectHandler(0);
			case 'KeyE': return selectHandler(1);
			case 'KeyD': return selectHandler(2);
			case 'KeyR': return selectHandler(3);
			case 'KeyF': return selectHandler(4);
			case 'KeyJ': return selectHandler(5);
			case 'KeyI': return selectHandler(6);
			case 'KeyK': return selectHandler(7);
			case 'KeyO': return selectHandler(8);
			case 'KeyL': return selectHandler(9);
			case 'KeyP': return selectHandler(10);
			case 'Semicolon': return selectHandler(11);
			case 'Space': return submitHandler();
		}
	});
}

// Reset the board and select a new note for the player to guess.
function continueHandler() {
	chooseRandomNote();
	resetPianoKeys();
	resultText.textContent = '';
	detailsText.textContent = '';
	submitButton.classList.remove('hidden');
	continueButton.classList.add('hidden');
}

// Reset the error and start a new game.
function tryAgainHandler() {
	setError(true);
	tryAgainButton.classList.add('hidden');
	continueHandler();
}

// Initialize the handlers and start the game.
submitButton.addEventListener('click', submitHandler);
continueButton.addEventListener('click', continueHandler);
tryAgainButton.addEventListener('click', tryAgainHandler);
setPianoKeyHandlers();
tryAgainHandler();
