// Import the function(s) from dataFetcher.js
import { fetchData } from "./dataFetcher.js";


// Import the function(s) from uiHandler.js
import { renderList, populateDropdown } from "./uiHandler.js";

populateDropdown();

document.querySelector('#build-button').addEventListener('click', () => {
    const selectedCategory = document.querySelector('#category-select').value;

    fetchData("./data/parodyData.json", selectedCategory)
        .then(data => renderList(data))
        .then(ulString => {
            document.querySelector("#data-list").innerHTML = ulString;
        });

    // TODO: Call fetchData to retrieve data from 'data/parodyData.json' 
    // for the selectedCategory. Then use renderList to display the data 
    // in #data-list div.  See example usage in practical instructions.
});
