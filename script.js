const apiKey = "0f19f4e2c17f45378a58baa024fb3369";
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');

function showMessage(msg) {
    weatherResult.innerHTML = `<p>${msg}</p>`;
}

function displayWeather(data) {
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    let advice = "";
    let cardColor = "";
    
    // Reset body background in case it was previously changed
    document.body.style.backgroundColor = "";

    if (temp < 10) {
        advice = "Wear a heavy jacket, it's freezing!";
        cardColor = "#b3d9ff"; // Darker light blue
    } else if (temp < 20) {
        advice = "A light jacket or sweater is fine.";
        cardColor = "#e6f2ff"; // Pale light blue
    } else if (temp < 30) {
        advice = "A t-shirt or light clothes are fine.";
        cardColor = "#ffe6e6"; // Pale light red
    } else {
        advice = "It's very hot! Stay hydrated.";
        cardColor = "#ffcccc"; // Darker light red
    }

    if (desc.includes('rain') || desc.includes('drizzle')) {
        advice += " Don't forget an umbrella!";
    }

    weatherResult.innerHTML = `
        <div class="weather-card" style="background-color: ${cardColor};">
            <h2>${data.name}, ${data.sys.country}</h2>
            <div class="temp">${temp}°C</div>
            
            <div class="details">
                <p><strong>Condition:</strong> ${desc}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            </div>
            
            <p class="advice">${advice}</p>
        </div>
    `;
}

function fetchWeather(city) {
    showMessage("Loading...");
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) throw new Error("City not found.");
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(err => showMessage(err.message));
}

function fetchWeatherByCoords(lat, lon) {
    showMessage("Loading...");
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) throw new Error("Location error.");
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(err => showMessage("Could not get weather for your location."));
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
            err => console.log("Geolocation denied or error.")
        );
    }
};
