'use strict'

// create global var for map to use for the several different functions it will be needed for
var map;

// fetches the reliefweb API
function callUrl() {
  fetch('https://api.reliefweb.int/v1/disasters?profile=full')
  .then(response => response.json())
    .then(responseJson =>
      disasterData(responseJson))
    .catch(error => alert('Something went wrong. Try again later.'));
}

// takes the Relief Web data and cycles through its array to create variables to plug into the Map
function disasterData(responseJson) {
  for (let i=0; i<responseJson.data.length; i++) {
    const lat=responseJson.data[i].fields.country[0].location.lat;
    const long=responseJson.data[i].fields.country[0].location.lon;
    drawMarkers(long,lat)
  }
}


// throws promise to check if there are any errors when loading the webgl map
function displayResults() {
  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaHVhYmxvdW50MiIsImEiOiJjanB4N3hoZzYwMzBxNDhwcGV1OXNqbXhoIn0.r-dvdiKjDsHHPmL-RFn9ww';
   newMap(mapboxgl)
  .then(() => {
    console.log('map loaded')
    callUrl();
  })
  .catch(err => {
    console.log(`map failed to load ${err}`)
  });
}

// generates webgl based map for users to see markers of worldwide disasters to hover over to get news info on for each specified marker.
function newMap(mapboxgl) {
  map=new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9'
  });
  return Promise.resolve();
}

// generates map markers based of the Relief Web longitude and latitude data
function drawMarkers(long,lat) {
  var marker = new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map);
}

// once user hovers over one of the possible map markers this function will act as though the curser is UI and let the markers have popup capability
function getPopups() {
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  })
  map.on('mouseenter', 'places', function(e) {
  // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates)
    setHTML(description)
    .addTo(map);
  });

    map.on('mouseleave', 'places', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}

$(displayResults);
