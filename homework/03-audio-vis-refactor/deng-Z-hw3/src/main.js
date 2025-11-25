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
    showBars: true,
    showCircles: true,
    showTeslas: true,
    timeDomain: false,
    coilCenter: 0.5
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/Blessing Song.mp3"
});

const DEFAULT_FPS = 60;
const JSON_FILE_PATH = "data/av-data.json";

const loadJSON = () => {
    fetch(JSON_FILE_PATH)
        .then(response => {
            return response.json();
        })
        .then(data => {
            // setup title
            const pageTitle = document.querySelector("title");
            const titleElement = document.querySelector("#title");
            pageTitle.innerHTML = data.title;
            titleElement.innerHTML = data.title;

            // setup options
            const trackSelect = document.querySelector("#track-select");
            const tracks = data.audio_files;
            const options = tracks
                .map(track => `<option value="${track.filepath}">${track.metadata.title}</option>`)
                .join("\n");
            trackSelect.innerHTML = options;

            // setup instructions
            const instructionsElement = document.querySelector("#instructions");
            instructionsElement.innerHTML = data.instructions;
        })
        .catch(error => {
            console.log(`Warning, error occurred: ${error}`);
            return null;
        })
};

const init = () => {
    audio.setupWebAudio(DEFAULTS.sound1);

    console.log("init called");

    // load items from JSON
    loadJSON();

    let canvasElement = document.querySelector("#fg-canvas"); // hookup <canvas> element
    let canvasDiv = document.querySelector("#canvas");
    setupUI(canvasElement, canvasDiv);

    canvas.setupCanvas(canvasElement, audio.analyserNode);

    loop();
}

const setupUI = (canvasElement, canvasDiv) => {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fs-button");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("goFullscreen() called");
        utils.goFullscreen(canvasDiv);
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

    // setup sliders for distortion and pan
    let distortionSlider = document.querySelector("#distortion-slider");
    let distortionLabel = document.querySelector("#distortion-label");

    distortionSlider.oninput = e => {
        // set distortion
        audio.setDistortion(e.target.value);
        // update label
        distortionLabel.innerHTML = Math.round(e.target.value);
    };

    // initial value
    distortionSlider.dispatchEvent(new Event("input"));

    let panSlider = document.querySelector("#pan-slider");
    let panLabel = document.querySelector("#pan-label");

    panSlider.oninput = e => {
        // set pan
        audio.setPan(e.target.value);
        // update label
        panLabel.innerHTML = e.target.value;
    };

    // initial value
    panSlider.dispatchEvent(new Event("input"));

    let coilSlider = document.querySelector("#coil-slider");
    let coilLabel = document.querySelector("#coil-label");

    coilSlider.oninput = e => {
        // set pan
        drawParams.coilCenter = e.target.value;
        // update label
        coilLabel.innerHTML = e.target.value;
    };

    // initial value
    coilSlider.dispatchEvent(new Event("input"));

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
    const teslaCB = document.querySelector("#tesla-cb");
    const domainCB = document.querySelector("#domain-type-cb");

    // everything is checked to start
    gradientCB.checked = drawParams.showGradient;
    barsCB.checked = drawParams.showBars;
    circlesCB.checked = drawParams.showCircles;
    teslaCB.checked = drawParams.showTeslas;
    domainCB.checked = drawParams.timeDomain;

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

    teslaCB.addEventListener("change", (e) => {
        drawParams.showTeslas = !drawParams.showTeslas;
        teslaCB.checked = drawParams.showTeslas;
    });

    domainCB.addEventListener("change", (e) => {
        drawParams.timeDomain = !drawParams.timeDomain;
        domainCB.checkced = drawParams.timeDomain;
    });

} // end setupUI

const loop = () => {
    // run at 60 FPS always
    setTimeout(() => {
        loop();
    }, 1000 / DEFAULT_FPS);

    canvas.draw(drawParams);
}

export { init };