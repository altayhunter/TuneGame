// Globals.
const siteName = 'tune';

// Return the last stored high score. Must be called after storeOctaves.
function retrieveHighScore() {
	return JSON.parse(localStorage.getItem(siteName) || 100);
}

// Store the given high score.
function storeHighScore(score) {
	localStorage.setItem(siteName, JSON.stringify(score));
}

export {
	retrieveHighScore,
	storeHighScore,
}
