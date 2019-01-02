'use strict'

// create global var for map to use for the several different functions it will be needed for
var map;

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

$(displayResults);
