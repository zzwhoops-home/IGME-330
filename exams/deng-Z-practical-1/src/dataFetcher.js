// dataFetcher.js (Handles fetching external data)

/*
 * fetchData retrieves data from a given JSON file and processes a specific category.
 * 
 * Parameters:
 *     url - A string containing the file path of the JSON data source.
 *     category - A string containing the specific category within the JSON to extract.
 */
const fetchData = (url, category) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            try {
                // Convert `text` into a JavaScript object and store it 
                let responseData = JSON.parse(text);
                // in a local variable `responseData`.
                
                const data = responseData[category] || [];
                return data;
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        })
        .catch(error => {
            console.error('Failed to load data:', error);
        });
};

// Export fetchData so it can be imported in app.js
export { fetchData };