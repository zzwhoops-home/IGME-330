/*
    main.js is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js'
import * as canvas from './visualizer.js';

const drawParams = {
    showGradient: true,
    showBars : true,
    showCircles: true,
    showNoise: true
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/New Adventure Theme.mp3"
});

function init() {
    audio.setupWebAudio(DEFAULTS.sound1);

    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);

    canvas.setupCanvas(canvasElement, audio.analyserNode);

    loop();
}

function setupUI(canvasElement) {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fs-button");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("goFullscreen() called");
        utils.goFullscreen(canvasElement);
    };

    // B - hookup play button
    const playButton = document.querySelector("#play-button");

    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        // check if context is in suspened state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        if (e.target.dataset.playing == "no") {
            // if track is currently paused, play it
            audio.playCurrentSound();
            e.target.dataset.playing = "yes";
        }
        // if track is playing, pause it
        else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";
        }
    };

    // C - hookup volume slider & label
    let volumeSlider = document.querySelector("#volume-slider");
    let volumeLabel = document.querySelector("#volume-label");

    // add .oninput event to slider
    volumeSlider.oninput = e => {
        //set the gain
        audio.setVolume(e.target.value);
        // update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    };

    // set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    // D - hookup track <select>
    let trackSelect = document.querySelector("#track-select");
    // add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        // pause the current track if it is playing
        if (playButton.dataset.playButton == "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };

    // E - setup and hookup checkboxes
    const gradientCB = document.querySelector("#gradient-cb");
    const barsCB = document.querySelector("#bars-cb");
    const circlesCB = document.querySelector("#circles-cb");
    const noiseCB = document.querySelector("#noise-cb");

    // everything is checked to start
    gradientCB.checked = drawParams.showGradient;
    barsCB.checked = drawParams.showBars;
    circlesCB.checked = drawParams.showCircles;
    noiseCB.checked = drawParams.showNoise;

    // add event listeners for everything
    gradientCB.addEventListener("change", (e) => {
        drawParams.showGradient = !drawParams.showGradient;
        gradientCB.checked = drawParams.showGradient;
    });
    
    barsCB.addEventListener("change", (e) => {
        drawParams.showBars = !drawParams.showBars;
        barsCB.checked = drawParams.showBars;
    });

    circlesCB.addEventListener("change", (e) => {
        drawParams.showCircles = !drawParams.showCircles;
        circlesCB.checked = drawParams.showCircles;
    });

    noiseCB.addEventListener("change", (e) => {
        drawParams.showNoise = !drawParams.showNoise;
        noiseCB.checked = drawParams.showNoise;
    });

} // end setupUI

function loop(){
/* NOTE: This is temporary testing code that we will delete in Part II */
	requestAnimationFrame(loop);

    canvas.draw(drawParams);
}

export { init };