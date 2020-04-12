// Frequencies of B3-C5 in Hz using even temperament and A440 tuning.
const noteFrequencies = [
	246.9417, 261.6256, 277.1826, 293.6648, 311.1270, 329.6276, 349.2282,
	369.9944, 391.9954, 415.3047, 440.0000, 466.1638, 493.8833, 523.2511
]

// AudioContext for the oscillators.
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Audibly play the frequency for one second.
function playFrequency(frequency) {
	const duration = 1.0;
	const oscillator = audioCtx.createOscillator();
	oscillator.type = 'square';
	oscillator.frequency.value = frequency;
	const sweepEnv = audioCtx.createGain();
	sweepEnv.gain.setValueAtTime(0, audioCtx.currentTime);
	sweepEnv.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
	sweepEnv.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration - 0.25);
	oscillator.connect(sweepEnv).connect(audioCtx.destination);
	oscillator.start();
	oscillator.stop(audioCtx.currentTime + duration);
	console.log('Played frequency', frequency);
}

// Return the frequency of an adjacent note based on the sign of the error.
function neighborFrequency(index, error) {
	if (error < 0) {
		return noteFrequencies[index - 1];
	} else {
		return noteFrequencies[index + 1];
	}
}

// TODO: Make this exponential instead of linear!
// Return the value error-fraction of the way from correct to incorrect.
function getFrequencyWithError(correct, incorrect, error) {
	const range = Math.abs(correct - incorrect);
	return correct + range * error;
}

// Play the frequency corresponding to the given piano key index.
function playNote(index, error) {
	const neighbor = neighborFrequency(index + 1, error);
	const frequency = getFrequencyWithError(noteFrequencies[index + 1], neighbor, error);
	playFrequency(frequency);
}

export {
	playNote,
}
