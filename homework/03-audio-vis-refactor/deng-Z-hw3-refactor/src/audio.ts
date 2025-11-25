// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx: AudioContext;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element: HTMLAudioElement;
let sourceNode: MediaElementAudioSourceNode;
let analyserNode: AnalyserNode;
let gainNode: GainNode;
let waveShaperNode: WaveShaperNode;
let stereoPannerNode: StereoPannerNode;

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    gain: 5,
    distortion: 0,
    pan: 0,
    numSamples: 256
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

// sigmoid distortion curve sourced from
// https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createWaveShaper
const makeDistortionCurve = (amount: Number) => {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < n_samples; i++) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
const setupWebAudio = (filePath: string) => {
    const AudioContext = window.AudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = new Audio();

    // 3 - have it point at a sound file
    loadSoundFile(filePath);

    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // 5 - create an analyser node
    // note the UK spelling of "Analyser"
    analyserNode = audioCtx.createAnalyser();
    /*
    // 6
    We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
    across the sound spectrum.
    
    If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
    the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
    the amplitude of that frequency.
    */

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    // create two effect nodes for distortion & reverb
    waveShaperNode = audioCtx.createWaveShaper();
    waveShaperNode.curve = makeDistortionCurve(DEFAULTS.distortion);
    waveShaperNode.oversample = "4x";

    stereoPannerNode = audioCtx.createStereoPanner();
    stereoPannerNode.pan.value = DEFAULTS.pan;

    // 8 - connect the nodes - we now have an audio graph
    sourceNode
        .connect(analyserNode)
        .connect(stereoPannerNode)
        .connect(gainNode)
        .connect(waveShaperNode)
        .connect(audioCtx.destination);
};

const loadSoundFile = (filePath: string) => {
    element.src = filePath;
};

const playCurrentSound = () => {
    element.play();
};

const pauseCurrentSound = () => {
    element.pause();
};

const setVolume = (value: number) => {
    // value = +value; // we don't need this conversion anymore
    gainNode.gain.value = value;
};

const setDistortion = (value: number) => {
    const curve = makeDistortionCurve(value);
    waveShaperNode.curve = curve;
}

const setPan = (value: number) => {
    stereoPannerNode.pan.value = value;
}

export { audioCtx, setupWebAudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, setDistortion, setPan, analyserNode };