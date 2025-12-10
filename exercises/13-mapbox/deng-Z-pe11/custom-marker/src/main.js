const init = () => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoienp3aG9vcHMiLCJhIjoiY21pemdlbjh5MG82cTNrcHBuN3N4OWptNCJ9.CbdV0IviXCiaNmm5yN6LKg';

    //code from step 5 will go here
    const geojson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-77.032, 38.913]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'Washington, D.C.'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-122.414, 37.776]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'San Francisco, California'
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "title": "Grand Teton Summit",
                    "description": "Grand Teton National Park, WY"
                },
                "geometry": {
                    "coordinates": [
                        -110.80243383290052,
                        43.7410340457445
                    ],
                    "type": "Point"
                }
            },
        ]
    };

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-96, 37.8],
        zoom: 3
    });

    //code from step 6 will go here
    // add markers to map
    for (const feature of geojson.features) {

        // code from step 7-1 will go here
        const el = document.createElement("div");
        el.className = "marker";

        //code from step 8 will go here
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
            )
            .addTo(map);
    }
};

export { init };