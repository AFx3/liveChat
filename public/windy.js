const options = {
    
    key: 'tZPm6csZetRJUkYCD6TN4gqTaeVsyuSb', // chiave API

    // Put additional console output
    verbose: true,

    // Coordinate iniziali mappa
    lat: 41.56,
    lon: 14.23,
    zoom: 5,
};

// Initialize Windy API
windyInit(options, windyAPI => {
    // windyAPI is ready, and contain 'map', 'store',
    // 'picker' and other usefull stuff

    const { map } = windyAPI;
    // .map is instance of Leaflet map
    //metto locatore su Roma
    L.popup()
        .setLatLng([41.9027835, 12.4963655])
        .setContent('Check the forecasts!')
        .openOn(map);

   
});
