'use strict'

// create global var for map to use for the several different functions it will be needed for
var map;

const apiKey = '129dca29bda24b02aa5ec3b9cf875b1e'

const searchURL = 'https://newsapi.org/v2/everything';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join('&');
}

//
function callUrl() {
  fetch('https://api.reliefweb.int/v1/disasters?profile=full')
  .then(response => response.json())
    .then(responseJson =>
      disasterData(responseJson))
    .catch(error => alert('Something went wrong. Try again later.'));
}

function disasterData(responseJson) {
  for (let i=0; i<responseJson.data.length; i++) {
    const lat=responseJson.data[i].fields.country[0].location.lat;
    const long=responseJson.data[i].fields.country[0].location.lon;
    const location=responseJson.data[i].fields.name;
    drawMarkers(long,lat, location)
  }
}

// generates news based of name of disaster area from relief API
function getNews(query, maxResults=10) {
  const params = {
    q: query,
    language: "en",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };
// fetch API url then throw promises to see if there are any errors or not
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => console.log(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

// throws promise to check if there are any errors when loading the webgl map
function displayResults() {
  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaHVhYmxvdW50MiIsImEiOiJjanB4N3hoZzYwMzBxNDhwcGV1OXNqbXhoIn0.r-dvdiKjDsHHPmL-RFn9ww';
   newMap(mapboxgl)
  .then(() => {
    console.log('map loaded')
    callUrl();
    // getPopups();
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


//
function drawMarkers(long,lat,location) {
  var link=`<a href="https://www.google.com">${location}</a>`
  var marker = new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map)
    .setPopup(new mapboxgl.Popup().setLngLat([long, lat]).setHTML(link))
}

//
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
  })
}

$(displayResults);
