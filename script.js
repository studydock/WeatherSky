// ============================
// SkySense Weather Website JS
// ============================

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

// Leaflet map
let map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let marker = L.marker([20.5937, 78.9629]).addTo(map);

// Fetch Weather Data
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    if (data.cod === "404" || data.cod === 404) {
      alert("City not found! Please check the spelling.");
      return;
    }

    updateWeather(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Something went wrong! Check console.");
  }
}

// Update DOM
function updateWeather(data) {
  const { name } = data;
  const { temp, humidity: hum } = data.main;
  const { speed } = data.wind;
  const { description, icon, main } = data.weather[0];

  cityName.textContent = name;
  weatherDesc.textContent = description.toUpperCase();
  temperature.textContent = `Temperature: ${temp}°C`;
  humidity.textContent = `Humidity: ${hum}%`;
  wind.textContent = `Wind Speed: ${(speed * 3.6).toFixed(1)} km/h`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIcon.alt = description;

  const card = document.querySelector('.weather-display');
  card.classList.remove('animate__fadeInUp');
  void card.offsetWidth;
  card.classList.add('animate__fadeInUp');

  const { lat, lon } = data.coord;
  map.setView([lat, lon], 10, { animate: true });
  marker.setLatLng([lat, lon]);

  setBackground(main);
}

// Dynamic background
function setBackground(weatherMain) {
  const weather = weatherMain.toLowerCase();
  const bgMap = {
    clear: "sunny.jpg",
    clouds: "cloudy.jpg",
    rain: "rainy.jpg",
    drizzle: "rainy.jpg",
    snow: "snow.jpg",
    thunderstorm: "thunderstorm.jpg"
  };
  heroSection.style.background = `url('images/${bgMap[weather] || 'cloud-bg.jpg'}') no-repeat center/cover`;
}

// Search button click
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
    cityInput.value = "";
  } else {
    alert("Please enter a city name!");
  }
});

// Enter key support
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchBtn.click();
});

// Default load
window.addEventListener('load', () => {
  fetchWeather("New Delhi");
});
