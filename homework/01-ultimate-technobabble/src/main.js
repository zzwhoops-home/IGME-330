import { getRandomFromArr } from "./utils.js";

let [words1, words2, words3] = [[], [], []]

const loadBabble = () => {
    // fetch babble words
    return fetch("./data/babble-data.json")
        .then(resText => resText.json())
        // get "words" and then destructure 3 arrays
        .then(words => {
            const arrays = words.words;
            const { "1": one, "2": two, "3": three } = arrays;

            [words1, words2, words3] = [one, two, three]
        })
        // add event listeners for buttons
        .then(() => {
            babbleButton.addEventListener("click", () => createBabble(1));
            multiBabbleButton.addEventListener("click", () => createBabble(5));
        })
        // load initial displayed babble
        .then(() => createBabble(1));
};

// helper function to get and concatenate 3 random words from the arrays
const getBabble = () => {
    // get words
    let word1 = getRandomFromArr(words1);
    let word2 = getRandomFromArr(words2);
    let word3 = getRandomFromArr(words3);

    // concatenate
    let babble = `${word1} ${word2} ${word3}`;

    return babble;
};

// get page elements
let output = document.querySelector("#output");
let babbleButton = document.querySelector("#babble");
let multiBabbleButton = document.querySelector("#multi-babble");

const createBabble = (num) => {
    let html = '';

    for (let i = 0; i < num; i++) {
        html += `<p>${getBabble()}</p>`;
    }

    // update output
    output.innerHTML = html;
};

// load arrays
loadBabble();