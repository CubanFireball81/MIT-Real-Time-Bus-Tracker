// Global variables
let markerArray = [];
let busArray = [];
let darkMode = true;
let runStatus = false;
var runTimeout;
var refreshTimeout;
const refreshRate = 10000; // milliseconds
mapboxgl.accessToken = 'pk.eyJ1IjoiY3ViYW5maXJlYmFsbDgxIiwiYSI6ImNrd2E2YjZ4ZzFuMjAzMm84enZwOHFtaWoifQ.T0AG_7RahFHKmRfTAMPoag';

// DOM elements
let lastUpdated = document.getElementById('lastUpdated');
const displayBtn = document.getElementById('displayBtn');
const runBtn = document.getElementById('runBtn');
const pText = document.getElementsByTagName('p');
const h5Text = document.getElementsByTagName('h5');

// Random color generator
const randomColor = () => {
    const getRandom = (scale) => {
        return Math.floor(Math.random() * scale);
    }
    return `rgb(${getRandom(255)},${getRandom(255)},${getRandom(255)})`;
}

// Run tracker, get data, make/update markerArray
const run = async () => {
    busArray = await getBusLocations();
    lastUpdated.innerText = new Date();
    refreshTimer = refreshRate / 1000;
    for (bus of busArray) {
        const item = getMarker(bus['id']);
        if (!item) {
            makeMarker(bus, bus['id']);
        } else {
            const marker = Object.values(item)[0];
            updateMarker(marker, bus);
        }
    }
    console.log(busArray);
    updateList();
    runTimeout = setTimeout(run, refreshRate);
}

// Fetch bus data from API
const getBusLocations = async () => {
    const response = await fetch('https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip');
    const json = await response.json();
    return json.data;
}

// Make marker and push to array
const makeMarker = (bus, id) => {
    let color = randomColor();
    const marker = new mapboxgl.Marker({
        color: color
    })
        .setLngLat([bus['attributes']['longitude'], bus['attributes']['latitude']])
        .addTo(map);
    const item = {
        "marker": marker,
        "id": id,
        "color": color
    };
    markerArray.push(item);
}

// Get marker & bus id
const getMarker = (busId) => {
    const result = markerArray.find((item) =>
        item['id'] === busId
    );
    return result;
}

// Update marker location
const updateMarker = (marker, bus) => {
    marker.setLngLat([bus['attributes']['longitude'], bus['attributes']['latitude']])
}

// Update List
const updateList = () => {
    let html = '';
    let list = document.getElementById('list');
    for (marker of markerArray) {
        html += `<li id='${marker.id}' style='color:${marker.color}'>${marker.id.toUpperCase()}</li>`;
    }
    list.innerHTML = html;
}

// Click button effect
const buttonEffect = (buttonId) => {
    let buttonClicked = document.getElementById(buttonId);
    buttonClicked.classList.add('buttonEffect');
    buttonClicked.addEventListener('transitionend', () => {
        buttonClicked.classList.remove('buttonEffect');
    }, {
        once: true
    });
}

// Toggle Start
const toggleStatus = () => {
    if (!runStatus) {
        runStatus = !runStatus;
        runBtn.innerText = 'Live';
        runBtn.onclick = toggleStatus;
        runBtn.classList.add('buttonEffect');
        run();
    }
}

// Updates refresh timer
const timer = () => {
    refreshTimer -= 0.1;
    refreshCountdown.innerText = refreshTimer.toFixed(1);
    refreshTimeout = setTimeout(timer, 100);
}

// Dark/light mode
const displayMode = () => {
    if (darkMode) {
        clearMap();
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [-71.104081, 42.365554],
            zoom: 12,
        }).addControl(new mapboxgl.NavigationControl());
        darkMode = !darkMode;
        displayBtn.innerHTML='Dark Mode';
        displayBtn.classList.toggle('lightmode');
        runBtn.classList.toggle('lightmode');
        toggleLightModeText();
        return;
    }
    clearMap();
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-71.104081, 42.365554],
        zoom: 12,
    }).addControl(new mapboxgl.NavigationControl());
    displayBtn.innerHTML = 'Light Mode';
    displayBtn.classList.toggle('lightmode')
    runBtn.classList.toggle('lightmode')
    darkMode = !darkMode;
    toggleLightModeText();
}

// Dark/light mode text changes
const toggleLightModeText = () => {
    for (p of pText) {
        p.classList.toggle('lightText');
    }
    h5Text[0].classList.toggle('lightText');
}

// Mapbox default dark mode
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-71.104081, 42.365554],
    zoom: 12,
}).addControl(new mapboxgl.NavigationControl());
displayBtn.innerHTML = 'Light Mode';

// Clear map, refreshes if running
const clearMap = () => {
    myMap = document.getElementById('map');
    myMap.innerHTML = '';
    markerArray = [];
    if (runStatus) {
        clearTimeout(runTimeout)
        setTimeout(run, 500)
        clearTimeout(refreshTimer);
    }
}