// arrays of words
const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];
const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];
const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];

// get page elements
let output = document.querySelector("#output");
let babbleButton = document.querySelector("#babble");
let multiBabbleButton = document.querySelector("#multi-babble");

// helper function to get a random value from an array
const getRandomFromArr = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

const createBabble = (num) => {
    let html = '';

    for (let i = 0; i < num; i++) {
        html += `<p>${getBabble()}</p>`;
    }

    // update output
    output.innerHTML = html;
};

// call initial createBabble function
createBabble(1);

// add event listener for buttons
babbleButton.addEventListener("click", () => createBabble(1));
multiBabbleButton.addEventListener("click", () => createBabble(5));