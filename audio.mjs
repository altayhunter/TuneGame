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
}

// Continuous range of frequencies using even temperament and A440 tuning.
// B4 is at index 0 and C4 is at index 11.
function noteFrequency(index) {
	return 440 * Math.pow(2, (index - 9) / 12);
}

// Play the frequency corresponding to the given piano key index.
function playNote(index, error) {
	const frequency = noteFrequency(index + error);
	playFrequency(frequency);
}

export {
	playNote,
}
