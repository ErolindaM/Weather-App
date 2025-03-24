function getWeather() {
    const apiKey = '1b6399fec55cb7439bb873cf866f1a38';
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Please enter a city to check the weather');
        return;
    }

    const cityPattern = /^[a-zA-Z\s]+$/;
    if (!cityPattern.test(city)) {
        alert('Invalid input! Please enter a valid city name.');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    clearWeatherData();

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                showNotFoundMessage(); 
                return Promise.reject('City not found');
            }
            displayWeather(data);

            
            return fetch(forecastUrl);
        })
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404" || !data.list) {
                return;
            }
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            if (error !== 'City not found') {
                alert('Error fetching weather data. Please try again.');
            }
        });
}

function clearWeatherData() {
    document.getElementById('temp-div').innerHTML = ''; 
    document.getElementById('weather-info').innerHTML = ''; 
    document.getElementById('weather-icon').src = '';
    document.getElementById('weather-icon').style.display = 'none';
    document.getElementById('hourly-forecast').innerHTML = ''; 
}

function showNotFoundMessage() {
    clearWeatherData();
    document.getElementById('weather-info').innerHTML = `<p>City not found. Please enter a valid city.</p>`;
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    if (data.cod === "404") {
        showNotFoundMessage();
        return;
    }

    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
    weatherInfoDiv.innerHTML = `<p class="cityName">${cityName}</p><p>${description}</p>`;

    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; 

    if (!hourlyData || hourlyData.length === 0) {
        return;
    }

    const next24Hours = hourlyData.slice(0, 8);
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
        <div class="hourly-item">
            <span>${hour}:00</span>
            <img src="${iconUrl}" alt="Hourly Weather Icon">
            <span>${temperature}°C</span>
            <br>
        </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}
