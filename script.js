// This array contains the coordinates for all bus stops between MIT and Harvard
const busStops = [
    [-71.093729, 42.359244],
    [-71.094915, 42.360175],
    [-71.0958, 42.360698],
    [-71.099558, 42.362953],
    [-71.103476, 42.365248],
    [-71.106067, 42.366806],
    [-71.108717, 42.368355],
    [-71.110799, 42.369192],
    [-71.113095, 42.370218],
    [-71.115476, 42.372085],
    [-71.117585, 42.373016],
    [-71.118625, 42.374863],
];

// Add your own access token
mapboxgl.accessToken = process.env.API_Key;
// mapboxgl.accessToken = 'pk.eyJ1IjoiY3ViYW5maXJlYmFsbDgxIiwiYSI6ImNrd2E2YjZ4ZzFuMjAzMm84enZwOHFtaWoifQ.T0AG_7RahFHKmRfTAMPoag';

// This is the map instance
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-71.093729, 42.359244],
    zoom: 14,
});

-71.104081, 42.365554
// Add a marker to the map at the first coordinates in the array busStops. The marker variable should be named "marker"
let marker = new mapboxgl.Marker({color: "red"}).setLngLat(busStops[0]).addTo(map);
// counter here represents the index of the current bus stop
let counter = 0;

// Displays Initial location in the sidebar menu
if (counter == 0) {
    document.getElementById('location').innerHTML = 'You are at MIT.'
}

function move() {
    // Move the marker on the map every 1000ms. Use the function marker.setLngLat() to update the marker coordinates
    // Use counter to access bus stops in the array busStops
    // Make sure you call move() after you increment the counter.
    setTimeout(() => {
        if (counter >= busStops.length) {
            document.getElementById('location').innerHTML = 'You are at Harvard.';
            alert("You've arrived at Harvard!");
        } else {
            marker.setLngLat(busStops[counter]);
            counter++
            move();
        }
        
    }, 1000)
}

function move2() {
    // Move the marker on the map every 1000ms. Use the function marker.setLngLat() to update the marker coordinates
    // Use counter to access bus stops in the array busStops
    // Make sure you call move() after you decrement the counter.
    setTimeout(() => {
        if (counter > (busStops.length - busStops.length)) {
            counter--
            marker.setLngLat(busStops[counter]);
            move2();
        } else {
            document.getElementById('location').innerHTML = 'You are at MIT.';
            alert("You've arrived at MIT!");
        }
    }, 1000)
}
