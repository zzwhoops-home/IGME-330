const getPOIData = async (url) => {
    const poiFetch = await fetch(url);

    if (!poiFetch.ok) {
        throw new Error(`Oops, POI data fetch error with code ${response.status}`);
    }

    const poiData = await poiFetch.json();
    return poiData;
};

export { getPOIData };