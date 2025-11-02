// ============================
// SkySense Weather Website JS
// ============================

// Replace with your own OpenWeather API key
const API_KEY = "216e7d3431e664dd22f4a512c739b3a0";

// DOM elements
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const cityName = document.getElementById('cityName');
const weatherDesc = document.getElementById('weatherDesc');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const weatherIcon = document.getElementById('weatherIcon');
const heroSection = document.querySelector('.hero');

// Default map setup (Leaflet)
let map = L.map('map').setView([20.5937, 78.9629], 5); // Default India center
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let marker = L.marker([20.5937, 78.9629]).addTo(map);

// ============================
// Function: Fetch Weather Data
// ============================
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            alert("City not found! Please try again.");
            return;
        }

        const data = await response.json();
        updateWeather(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Something went wrong! Check console.");
    }
}

// ============================
// Function: Update DOM with Weather
// ============================
function updateWeather(data) {
    const { name } = data;
    const { temp, humidity: hum } = data.main;
    const { speed } = data.wind;
    const { description, icon, main } = data.weather;

    // Update text
    cityName.textContent = name;
    weatherDesc.textContent = description.toUpperCase();
    temperature.textContent = `Temperature: ${temp}°C`;
    humidity.textContent = `Humidity: ${hum}%`;
    wind.textContent = `Wind Speed: ${speed} km/h`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherIcon.alt = description;

    // Animate weather card
    const card = document.querySelector('.weather-display');
    card.classList.remove('animate__fadeInUp');
    void card.offsetWidth; // restart animation
    card.classList.add('animate__fadeInUp');

    // Update map position
    const { lat, lon } = data.coord;
    map.setView([lat, lon], 10, { animate: true });
    marker.setLatLng([lat, lon]);

    // Update background based on weather
    setBackground(main);
}

// ============================
// Function: Set Dynamic Background
// ============================
function setBackground(weatherMain) {
    switch (weatherMain.toLowerCase()) {
        case "clear":
            heroSection.style.background = "url('images/sunny.jpg') no-repeat center/cover";
            break;
        case "clouds":
            heroSection.style.background = "url('images/cloudy.jpg') no-repeat center/cover";
            break;
        case "rain":
        case "drizzle":
            heroSection.style.background = "url('images/rainy.jpg') no-repeat center/cover";
            break;
        case "snow":
            heroSection.style.background = "url('images/snow.jpg') no-repeat center/cover";
            break;
        case "thunderstorm":
            heroSection.style.background = "url('images/thunderstorm.jpg') no-repeat center/cover";
            break;
        default:
            heroSection.style.background = "url('images/cloud-bg.jpg') no-repeat center/cover";
            break;
    }
}

// ============================
// Event Listener: Search Button
// ============================
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== "") {
        fetchWeather(city);
        cityInput.value = "";
    } else {
        alert("Please enter a city name!");
    }
});

// ============================
// Optional: Enter key support
// ============================
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// ============================
// Load default weather (example: New Delhi)
// ============================
window.addEventListener('load', () => {
    fetchWeather("New Delhi");
});
