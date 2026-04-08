const apiKey = "0f19f4e2c17f45378a58baa024fb3369"
const btn = document.getElementById('btn')
const inputField = document.getElementById('input_place')
const dataDisplay = document.getElementById('root')

function renderMessage(text) {
    dataDisplay.innerHTML = `<div class="message">${text}</div>`;
}

function showLoading() {
    renderMessage('Searching for weather...')
}

function showError(msg) {
    renderMessage(msg)
}

function updateWeatherUI(weatherData) {
    let currentTemp = weatherData.main.temp;
    let weatherCondition = weatherData.weather[0].main.toLowerCase();
    let description = weatherData.weather[0].description;
    let weatherIcon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    let cityName = weatherData.name;
    let country = weatherData.sys.country;
    let humidity = weatherData.main.humidity;
    let windSpeed = weatherData.wind.speed;

    let advice = "";
    if (currentTemp < 15) {
        advice = "Wear a warm jacket, it's cold!";
    } else if (currentTemp >= 15 && currentTemp < 25) {
        advice = "A t-shirt or light jacket is fine.";
    } else {
        advice = "Wear light clothes, it's hot!";
    }

    if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
        advice += " Bring an umbrella!";
    } else if (weatherCondition.includes('snow')) {
        advice += " Wear snow boots and gloves!";
    }

    dataDisplay.innerHTML = `
        <div class="weather-box city-weather-box">
            <div>
                <h2 class="city-title">${cityName}, ${country}</h2>
                <p class="weather-description">${description}</p>
            </div>
            <div class="temp-box">
                <img src="${weatherIcon}" alt="Weather Icon" class="weather-icon">
                <div class="temp-display">${Math.round(currentTemp)}°C</div>
            </div>
        </div>

        <div class="weather-box advice-stats-box">
            <div class="weather-advice">
                <p><strong>What to Wear:</strong> ${advice}</p>
            </div>
            <div class="stats-box">
                <div class="detail-item">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Wind Speed</span>
                    <span class="detail-value">${windSpeed} m/s</span>
                </div>
            </div>
        </div>
    `;

    console.log("Weather updated for " + cityName);
}

function fetchWeather(area) {
    showLoading();
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${area}&appid=${apiKey}&units=metric`)
        .then((res)=>{
            if (!res.ok){
                throw new Error("City not found");
            }
            return res.json()
        })
        .then(updateWeatherUI)
        .catch(err => {
            showError("Could not find that city. Please check the spelling and try again.");
            console.error(err);
        });
}

function fetchWeatherByCoords(lat, lon) {
    showLoading();
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then((res)=>{
            if (!res.ok){
                throw new Error("Unable to fetch data for current location.");
            }
            return res.json()
        })
        .then(updateWeatherUI)
        .catch(err => {
            showError("Could not retrieve your current weather. Try searching by city instead.");
            console.error(err);
        });
}

btn.addEventListener('click', () => {
    const city = inputField.value.trim()
    if (city) {
        inputField.value = ''
        fetchWeather(city)
    }
})

inputField.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        btn.click()
    }
})


window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            error => {
                console.log("Geolocation error or denied.");
            }
        );
    }
});
