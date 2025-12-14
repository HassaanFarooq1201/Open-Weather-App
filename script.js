// OpenWeatherMap API Configuration
// Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
// Get your free API key at: https://openweathermap.org/api
const API_KEY = '6b5fad7b6b05c4b0873dfe2ed5ddd103';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');

// Function to fetch weather data
async function fetchWeather(city) {
    try {
        // Show loading state
        hideError();
        weatherInfo.classList.add('hidden');

        // Validate API key
        if (API_KEY === 'YOUR_API_KEY') {
            throw new Error('Please add your OpenWeatherMap API key in script.js');
        }

        // Validate city input
        if (!city || city.trim() === '') {
            throw new Error('Please enter a city name');
        }

        // Construct API URL
        const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        // Fetch weather data
        const response = await fetch(url);

        // Check if response is ok
        if (!response.ok) {
            // Try to get error details from response
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = null;
            }

            if (response.status === 404) {
                throw new Error('City not found. Please check the city name and try again.');
            } else if (response.status === 401) {
                const errorMsg = errorData?.message || 'Invalid API key';
                throw new Error(`Invalid API key: ${errorMsg}. Please verify your API key at https://openweathermap.org/api. Make sure you have activated your API key via email.`);
            } else {
                const errorMsg = errorData?.message || response.statusText;
                throw new Error(`Error: ${response.status} - ${errorMsg}`);
            }
        }

        // Parse JSON response
        const data = await response.json();

        // Display weather information
        displayWeather(data);

    } catch (error) {
        // Display error message
        showError(error.message);
    }
}

// Function to display weather information
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = Math.round(data.main.temp);
    condition.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;

    // Show weather info and hide error
    weatherInfo.classList.remove('hidden');
    hideError();
}

// Function to show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
}

// Function to hide error message
function hideError() {
    errorMessage.classList.add('hidden');
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    fetchWeather(city);
});

// Allow Enter key to trigger search
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        fetchWeather(city);
    }
});

