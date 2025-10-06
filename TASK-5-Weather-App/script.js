// Dummy weather data for cities
const cities = [
    {
        name: "New York",
        temperature: 24,
        description: "Sunny",
        icon: "fa-sun",
        humidity: 45,
        windSpeed: 5,
        feelsLike: 26
    },
    {
        name: "London",
        temperature: 18,
        description: "Cloudy",
        icon: "fa-cloud",
        humidity: 70,
        windSpeed: 8,
        feelsLike: 16
    },
    {
        name: "Tokyo",
        temperature: 28,
        description: "Partly Cloudy",
        icon: "fa-cloud-sun",
        humidity: 60,
        windSpeed: 4,
        feelsLike: 30
    },
    {
        name: "Sydney",
        temperature: 22,
        description: "Rainy",
        icon: "fa-cloud-rain",
        humidity: 80,
        windSpeed: 12,
        feelsLike: 20
    },
    {
        name: "Paris",
        temperature: 21,
        description: "Clear",
        icon: "fa-sun",
        humidity: 50,
        windSpeed: 6,
        feelsLike: 22
    },
    {
        name: "Dubai",
        temperature: 36,
        description: "Hot",
        icon: "fa-temperature-high",
        humidity: 35,
        windSpeed: 9,
        feelsLike: 39
    },
    {
        name: "Moscow",
        temperature: 10,
        description: "Snowy",
        icon: "fa-snowflake",
        humidity: 75,
        windSpeed: 15,
        feelsLike: 5
    },
    {
        name: "Rio de Janeiro",
        temperature: 30,
        description: "Sunny",
        icon: "fa-sun",
        humidity: 65,
        windSpeed: 7,
        feelsLike: 32
    }
];

// Dummy forecast data
const forecastData = [
    { day: "Tuesday", temperature: 25, icon: "fa-sun" },
    { day: "Wednesday", temperature: 23, icon: "fa-cloud-sun" },
    { day: "Thursday", temperature: 22, icon: "fa-cloud" },
    { day: "Friday", temperature: 20, icon: "fa-cloud-rain" },
    { day: "Saturday", temperature: 21, icon: "fa-cloud-sun" }
];

// DOM elements
const cityNameElement = document.getElementById('city-name');
const currentDateElement = document.getElementById('current-date');
const temperatureElement = document.getElementById('temperature');
const weatherIconElement = document.querySelector('.weather-icon i');
const weatherDescriptionElement = document.getElementById('weather-description');
const windSpeedElement = document.getElementById('wind-speed');
const humidityElement = document.getElementById('humidity');
const feelsLikeElement = document.getElementById('feels-like');
const forecastContainer = document.querySelector('.forecast');
const cityCardsContainer = document.querySelector('.city-cards');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');

// Format current date
function formatDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Display current weather for a city
function displayCurrentWeather(city) {
    cityNameElement.textContent = city.name;
    currentDateElement.textContent = formatDate();
    temperatureElement.textContent = `${city.temperature}°C`;
    weatherIconElement.className = `fas ${city.icon}`;
    weatherDescriptionElement.textContent = city.description;
    windSpeedElement.textContent = `${city.windSpeed} km/h`;
    humidityElement.textContent = `${city.humidity}%`;
    feelsLikeElement.textContent = `${city.feelsLike}°C`;
}

// Create forecast cards
function createForecastCards() {
    forecastContainer.innerHTML = '';
    
    forecastData.forEach(day => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        
        forecastCard.innerHTML = `
            <div class="day">${day.day}</div>
            <div class="forecast-icon"><i class="fas ${day.icon}"></i></div>
            <div class="forecast-temp">${day.temperature}°C</div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}

// Create city cards
function createCityCards() {
    cityCardsContainer.innerHTML = '';
    
    cities.forEach(city => {
        const cityCard = document.createElement('div');
        cityCard.className = 'city-card';
        cityCard.setAttribute('data-city', city.name);
        
        cityCard.innerHTML = `
            <h4>${city.name}</h4>
            <div class="city-temp">${city.temperature}°C</div>
            <div class="city-desc"><i class="fas ${city.icon}"></i> ${city.description}</div>
            <div class="city-info">
                <span><i class="fas fa-tint"></i> ${city.humidity}%</span>
                <span><i class="fas fa-wind"></i> ${city.windSpeed} km/h</span>
            </div>
        `;
        
        cityCard.addEventListener('click', () => {
            displayCurrentWeather(city);
        });
        
        cityCardsContainer.appendChild(cityCard);
    });
}

// Search functionality
function setupSearch() {
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') return;
    
    const foundCity = cities.find(city => 
        city.name.toLowerCase().includes(searchTerm)
    );
    
    if (foundCity) {
        displayCurrentWeather(foundCity);
        searchInput.value = '';
    } else {
        alert('City not found. Please try another city from our list.');
    }
}

// Add some interactivity with animations
function addInteractivity() {
    // Add hover effects to forecast cards
    const cards = document.querySelectorAll('.forecast-card, .city-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
}

// Initialize the app
function initApp() {
    // Display New York weather by default
    const defaultCity = cities[0];
    displayCurrentWeather(defaultCity);
    
    // Create forecast and city cards
    createForecastCards();
    createCityCards();
    
    // Setup search functionality
    setupSearch();
    
    // Add interactivity
    setTimeout(addInteractivity, 1000); // Wait for DOM to be fully loaded
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);