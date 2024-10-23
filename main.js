document.addEventListener('DOMContentLoaded', (event) => {
  const checkbox = document.getElementById('checkbox');
  const body = document.body;

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
    }
  });

  body.classList.add('light-mode');
});

function getWeather() {
  const apiKey = '57619bd2552c97a4bd52b9482c9b72ef';
  const city = document.querySelector('.btn-search').value;

  if (!city) {
    alert('Будь ласка, введіть місто');
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  
  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error('Помилка отримання поточних даних про погоду:', error);
      alert('Помилка отримання поточних даних про погоду. Будь ласка, спробуйте ще раз.');
    });

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      displayHourlyForecast(data.list);
      displayDailyForecast(data.list);
    })
    .catch(error => {
      console.error('Помилка отримання даних прогнозу:', error);
      alert('Помилка отримання даних прогнозу. Будь ласка, спробуйте ще раз.');
    });
}

function displayWeather(data) {
  const weatherLineDiv = document.createElement('div');
  weatherLineDiv.id = 'weather-line';
  weatherLineDiv.style.display = 'flex';
  weatherLineDiv.style.flexDirection = 'column';
  weatherLineDiv.style.alignItems = 'center';
  weatherLineDiv.style.padding = '20px';
  weatherLineDiv.style.border = '2px solid #4a90e2';  // Changed color to a blue shade
  weatherLineDiv.style.borderRadius = '15px';
  weatherLineDiv.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.5)';  // Changed color to match the border
  weatherLineDiv.style.background = 'linear-gradient(135deg, #e6f2ff, #b3d9ff)';  // Changed to blue-tinted gradient

  const containerMain = document.querySelector('.container-main');
  containerMain.innerHTML = '';
  containerMain.appendChild(weatherLineDiv);

  if (data.cod === '404') {
    weatherLineDiv.innerHTML = `<p style="color: #4a90e2; font-size: 18px;">${data.message}</p>`;  // Changed color to blue
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const windSpeed = Math.round(data.wind.speed);
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    weatherLineDiv.innerHTML = `
      <h2 style="color: #4a90e2; font-size: 28px; margin-bottom: 10px;">${cityName}</h2>
      <p id="current-time" style="color: #4a4a4a; font-size: 18px; margin-bottom: 20px;"></p>
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="${iconUrl}" alt="${description}" style="width:100px; height:100px; margin-right: 20px;">
        <div>
          <p style="color: #4a90e2; font-size: 36px; font-weight: bold; margin: 0;">${temperature}°C</p>
          <p style="color: #4a4a4a; font-size: 18px; margin: 5px 0;">${description}</p>
        </div>
      </div>
      <div style="display: flex; justify-content: space-around; width: 100%;">
        <p style="color: #4a4a4a; font-size: 16px;">Вітер: ${windSpeed} м/с</p>
        <p style="color: #4a4a4a; font-size: 16px;">Схід сонця: ${sunriseTime}</p>
        <p style="color: #4a4a4a; font-size: 16px;">Захід сонця: ${sunsetTime}</p>
      </div>
    `;

    function updateTime() {
      const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
      document.getElementById('current-time').textContent = `Поточний час: ${currentTime}`;
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

  const hourlyForecastDiv = document.createElement('div');
  hourlyForecastDiv.id = 'hourly-forecast';
  containerMain.appendChild(hourlyForecastDiv);

  const dailyForecastDiv = document.createElement('div');
  dailyForecastDiv.id = 'daily-forecast';
  containerMain.appendChild(dailyForecastDiv);
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById('hourly-forecast');
  hourlyForecastDiv.style.display = 'flex';
  hourlyForecastDiv.style.overflowX = 'auto';
  hourlyForecastDiv.style.marginTop = '20px';
  hourlyForecastDiv.style.padding = '10px';
  hourlyForecastDiv.style.background = 'rgba(74, 144, 226, 0.1)';  // Changed to blue tint
  hourlyForecastDiv.style.borderRadius = '10px';

  const next24Hours = hourlyData.slice(0, 8);

  hourlyForecastDiv.innerHTML = next24Hours.map(item => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    return `
      <div class="hourly-item" style="margin-right: 20px; text-align: center;">
        <span style="color: #4a4a4a; font-weight: bold;">${hour}:00</span>
        <img src="${iconUrl}" alt="Погодинний значок погоди" style="display: block; margin: 5px auto; width: 50px; height: 50px;">
        <span style="color: #4a90e2; font-weight: bold;">${temperature}°C</span>
      </div>
    `;
  }).join('');
}

function displayDailyForecast(forecastData) {
  const dailyForecastDiv = document.getElementById('daily-forecast');
  dailyForecastDiv.style.display = 'flex';
  dailyForecastDiv.style.flexDirection = 'column';
  dailyForecastDiv.style.marginTop = '20px';
  dailyForecastDiv.style.padding = '10px';
  dailyForecastDiv.style.background = 'rgba(74, 144, 226, 0.1)';  // Changed to blue tint
  dailyForecastDiv.style.borderRadius = '10px';

  const dailyData = forecastData.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  dailyForecastDiv.innerHTML = Object.entries(dailyData).slice(0, 5).map(([date, dayData]) => {
    const avgTemp = Math.round(dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length);
    const mostFrequentWeather = getMostFrequentWeather(dayData);
    const iconUrl = `https://openweathermap.org/img/wn/${mostFrequentWeather.icon}.png`;

    return `
      <div class="daily-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 10px; border: 1px solid #4a90e2; border-radius: 5px; background-color: rgba(255, 255, 255, 0.7);">
        <span style="color: #4a4a4a; font-weight: bold;">${new Date(date).toLocaleDateString('uk-UA', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        <img src="${iconUrl}" alt="Щоденний значок погоди" style="width: 50px; height: 50px;">
        <span style="color: #4a90e2; font-weight: bold;">${avgTemp}°C</span>
        <span style="color: #4a4a4a;">${mostFrequentWeather.description}</span>
      </div>
    `;
  }).join('');
}

function getMostFrequentWeather(dayData) {
  const weatherCounts = dayData.reduce((acc, item) => {
    const weather = item.weather[0];
    if (!acc[weather.description]) {
      acc[weather.description] = { count: 0, icon: weather.icon };
    }
    acc[weather.description].count++;
    return acc;
  }, {});

  return Object.entries(weatherCounts).reduce((a, b) => a[1].count > b[1].count ? a : b)[1];
}

document.querySelector('.btn-enter').addEventListener('click', (event) => {
  event.preventDefault();
  getWeather();
});