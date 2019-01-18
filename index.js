'use strict'

// create global var for map to use for the several different functions it will be needed for
var map;

const apiKey = '129dca29bda24b02aa5ec3b9cf875b1e';
const dataArray = [];

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  console.log('queryItems',queryItems)
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
    const newsUrl=responseJson.data[i].fields.url
    const lat=responseJson.data[i].fields.country[0].location.lat;
    const long=responseJson.data[i].fields.country[0].location.lon;
    const location=responseJson.data[i].fields.name;
    const description=responseJson.data[i].fields.description;
    const dataObject= {
      newsUrl: newsUrl,
      description: description,
      location: location,
    };
    dataArray.push(dataObject);
    drawMarkers(long,lat,location, i);
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

// generates map markers along with creating the popups that for each associated marker.
function drawMarkers(long,lat,location, i) {
  var link=`<button onclick="returnNews('${i}')" class="listener">${location}</button>`
  var marker = new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map)
    .setPopup(new mapboxgl.Popup().setLngLat([long, lat]).setHTML(link))
}



function returnNews(i) {
  const location= dataArray[i].location;
  const newsUrl= dataArray[i].newsUrl;
  const description= dataArray[i].description;
  console.log(dataArray);
  $('#results-list').empty();
  $('#results-list').append(`
  <li><h3>${location}</h3><p>${description}</p><a href='${newsUrl}'>${location}</a></li>
  `)
  $('#results').removeClass('hidden')
}


function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
  })
}

$(displayResults);
