export const loadCreatures = (callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://example.com/creatures.json');

    xhr.onload = () => {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            callback(response.creatures);
        } else {
            console.error('Failed to load creatures:', xhr.status);
        }
    };

    xhr.onerror = () => console.error('XHR error occurred.');

    xhr.send();
};

export const loadCreaturesFetch = (callback) => {
    return fetch("https://example.com/creatures.json")
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                console.error(`Failed to load creatures: ${response.status}`)
            }
        })
        .then(creatureData => {
            if (creatureData) {
                return callback(response.creatures);
            }
        })
        .catch(error => console.error("Fetch error occurred."));
};

// Updates the page title based on the currently selected biome
const updateTitle = (biome) => {
    const title = document.querySelector(".title");

    title.innerHTML = biome === "All" ?
        "All Creatures" : `${biome} Creatures`;
};