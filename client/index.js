const mapboxgl = require("mapbox-gl");
const buildMarker = require("./marker");
const attractions = require("./attractions");

/*
  * Instantiate the Map
  */

mapboxgl.accessToken = "pk.eyJ1IjoiY2Fzc2lvemVuIiwiYSI6ImNqNjZydGl5dDJmOWUzM3A4dGQyNnN1ZnAifQ.0ZIRDup0jnyUFVzUa_5d1g";
const map = new mapboxgl.Map({
  container: "map-canvas",
  center: [-74.0, 40.731],
  zoom: 12.3, // starting zoom
  pitch: 35,
  bearing: 20,
  style: "mapbox://styles/mapbox/streets-v10"
});

/*
  * Populate the list of attractions
  */

attractions.load().then(list => {
  list.hotels.forEach(attraction => makeOption(attraction, "hotels-choices"));
  list.restaurants.forEach(attraction => makeOption(attraction, "restaurants-choices"));
  list.activities.forEach(attraction => makeOption(attraction, "activities-choices"));
});

function makeOption(attraction, selector) {
  const option = new Option(attraction.name, attraction.id); // makes a new option tag
  const select = document.getElementById(selector);
  select.add(option);
}

/*
  * Attach Event Listeners
  */

// what to do when the `+` button next to a `select` is clicked
["hotels", "restaurants", "activities"].forEach(addEventHandlerFor);
function addEventHandlerFor(attractionType) {
  document.getElementById(`${attractionType}-add`).addEventListener("click", () => handleAddAttraction(attractionType));
}

function handleAddAttraction(attractionType) {
  const select = document.getElementById(`${attractionType}-choices`);
  const selectedId = select.value;
  var attractionAssets = createAttractionAssets(attractionType, selectedId);
}

function createAttractionAssets(category, id) {
  const selectedAttraction = attractions.find(category, id);

  const button = document.createElement("button");
  button.className = "btn btn-xs btn-danger remove btn-circle";
  button.append("x");

  const li = document.createElement("li");
  li.className = "itinerary-item";
  li.append(selectedAttraction.name, button);

  const marker = buildMarker(category, selectedAttraction.place.location);

  document.getElementById(`${category}-list`).append(li);
  marker.addTo(map);
  map.flyTo({
    center: selectedAttraction.place.location,
    zoom: 15
  });

  button.onclick = function() {
    li.remove();
    marker.remove();
    map.flyTo({
      center: [-74.0, 40.731],

      zoom: 12.3 // starting zoom
    });
  };
}
