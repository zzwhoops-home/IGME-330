/*
    main.js is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils';
import * as audio from './audio'
import * as canvas from './visualizer';
import { DefaultSong } from './enums';

const drawParams: canvas.DrawParams = {
    showGradient: true,
    showBars: true,
    showCircles: true,
    showTeslas: true,
    timeDomain: false,
    coilCenter: 0.5
};

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
    audio.setupWebAudio(DefaultSong.sound1);

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
    const fsButton = document.querySelector("#fs-button") as HTMLButtonElement;

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("goFullscreen() called");
        utils.goFullscreen(canvasDiv);
    };

    // B - hookup play button
    const playButton = document.querySelector("#play-button") as HTMLButtonElement;

    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        // check if context is in suspened state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }

        const target = e.target as HTMLButtonElement;
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        if (target.dataset.playing == "no") {
            // if track is currently paused, play it
            audio.playCurrentSound();
            target.dataset.playing = "yes";
        }
        // if track is playing, pause it
        else {
            audio.pauseCurrentSound();
            target.dataset.playing = "no";
        }
    };

    // C - hookup volume slider & label
    let volumeSlider = document.querySelector("#volume-slider") as HTMLInputElement;
    let volumeLabel = document.querySelector("#volume-label") as HTMLLabelElement;

    // add .oninput event to slider
    volumeSlider.oninput = e => {
        const target = e.target as HTMLInputElement;

        //set the gain
        audio.setVolume(target.value);

        const numValue = Number(target.value);
        // update value of label to match value of slider
        volumeLabel.innerHTML = String(Math.round((numValue / 2 * 100)));
    };

    // set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    // setup sliders for distortion and pan
    let distortionSlider = document.querySelector("#distortion-slider") as HTMLInputElement;
    let distortionLabel = document.querySelector("#distortion-label") as HTMLLabelElement;

    distortionSlider.oninput = e => {
        const target = e.target as HTMLInputElement;

        // set distortion
        audio.setDistortion(target.value);

        const numValue = Number(target.value);
        // update label
        distortionLabel.innerHTML = String(Math.round(numValue));
    };

    // initial value
    distortionSlider.dispatchEvent(new Event("input"));

    let panSlider = document.querySelector("#pan-slider") as HTMLInputElement;
    let panLabel = document.querySelector("#pan-label") as HTMLLabelElement;

    panSlider.oninput = e => {
        const target = e.target as HTMLInputElement;

        // set pan
        audio.setPan(target.value);

        // update label
        panLabel.innerHTML = target.value;
    };

    // initial value
    panSlider.dispatchEvent(new Event("input"));

    let coilSlider = document.querySelector("#coil-slider") as HTMLInputElement;
    let coilLabel = document.querySelector("#coil-label") as HTMLLabelElement;

    coilSlider.oninput = e => {
        const target = e.target as HTMLInputElement;

        // set pan
        drawParams.coilCenter = Number(target.value);
        // update label
        coilLabel.innerHTML = target.value;
    };

    // initial value
    coilSlider.dispatchEvent(new Event("input"));

    // D - hookup track <select>
    let trackSelect = document.querySelector("#track-select") as HTMLSelectElement;
    // add .onchange event to <select>
    trackSelect.onchange = e => {
        const target = e.target as HTMLSelectElement;

        audio.loadSoundFile(target.value);
        // pause the current track if it is playing
        if (playButton.dataset.playButton == "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };

    // E - setup and hookup checkboxes
    const gradientCB = document.querySelector("#gradient-cb") as HTMLInputElement;
    const barsCB = document.querySelector("#bars-cb") as HTMLInputElement;
    const circlesCB = document.querySelector("#circles-cb") as HTMLInputElement;
    const teslaCB = document.querySelector("#tesla-cb") as HTMLInputElement;
    const domainCB = document.querySelector("#domain-type-cb") as HTMLInputElement;

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
        domainCB.checked = drawParams.timeDomain;
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