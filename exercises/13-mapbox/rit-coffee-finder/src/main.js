import * as map from "./map.js";
import * as get from "./get.js";

let poi;
let dataLoading = false;

const loadPOI = () => {
    const url = "https://people.rit.edu/~acjvks/shared/330/igm-points-of-interest.php";

    // load POIs, prevent race condition
    if (!dataLoading) {
        dataLoading = true;

        get.getPOIData(url)
            .then(data => {
                poi = data;

                for (let p of poi) {
                    map.addMarker(p.coordinates, p.title, "A POI!", "poi");
                }

                dataLoading = false;
            })
    }
};

const init = () => {
    // initialize mapbox
    map.initMap();

    // load markers
    map.loadMarkers();

    // add markers
    map.addMarkersToMap();

    // UI stuff
    setupUI();
};

const setupUI = () => {
    // it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
    const lnglatRIT = [-77.67454147338866, 43.08484339838443];
    const lnglatIGM = [-77.67990589141846, 43.08447511795301];

    const btn1 = document.querySelector("#btn1");
    const btn2 = document.querySelector("#btn2");
    const btn3 = document.querySelector("#btn3");
    const btn4 = document.querySelector("#btn4");
    const btn5 = document.querySelector("#btn5");

    // RIT Zoom 15.5
    btn1.addEventListener('click', () => {
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(0, 0);
        map.flyTo(lnglatRIT);
    });

    // RIT isometric view
    btn2.addEventListener('click', () => {
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(45, 0);
        map.flyTo(lnglatRIT);
    });

    // World zoom 0
    btn3.addEventListener('click', () => {
        map.setZoomLevel();
        map.setPitchAndBearing(0, 0);
        map.flyTo();
    });

    // IGM zoom 18
    btn4.addEventListener('click', () => {
        map.setZoomLevel(18);
        map.setPitchAndBearing(0, 0);
        map.flyTo(lnglatIGM);
    });

    // load marker data
    btn5.addEventListener('click', () => {
        // only download data once
        if (!poi) {
            loadPOI();
        }
    });
};

export { init };