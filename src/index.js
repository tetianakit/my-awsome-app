let units = "metric";
let apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
let dateElement = document.querySelector("#date");
let searchForm = document.querySelector("#search-form");
let cityElement = document.querySelector("#city");
let windElement = document.querySelector("#wind");
let humidityElement = document.querySelector("#humidity");
let weatherElement = document.querySelector("#weather");
let forecastElement = document.querySelector("#forecast");
let temperatureElement = document.querySelector("#temperature");
let iconElement = document.querySelector("#icon");
let currentButton = document.querySelector("#current");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");
let celsiusTemperature = null;

function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");

  retrieveWeatherByCity(searchInput.value);
}
function current(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(function (position) {
    retrieveWeatherByCoordinates(
      position.coords.latitude,
      position.coords.longitude
    );
  });
}
function retrieveWeatherByCity(city) {
  let url = getUrl() + `&q=${city}`;

  retrieveWeather(url);
}
function retrieveWeatherByCoordinates(lat, lon) {
  let url = getUrl() + `&lat=${lat}&lon=${lon}`;

  retrieveWeather(url);
}
function getUrl() {
  return `https://api.openweathermap.org/data/2.5/weather?units=${units}&appid=${apiKey}`;
}
function retrieveWeather(url) {
  axios
    .get(url)
    .then(showWeather)
    .catch(function (error) {
      return;
    });
}
function showWeather(response) {
  celsiusTemperature = Math.round(response.data.main.temp);
  cityElement.innerText = response.data.name;
  windElement.innerText = response.data.wind.speed;
  humidityElement.innerText = response.data.main.humidity;
  weatherElement.innerText = response.data.weather[0].main;
  temperatureElement.innerText = celsiusTemperature;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  retrieveForecast(response.data.coord.lat, response.data.coord.lon);
}

function retrieveForecast(lat, lon) {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely&units=${units}&appid=${apiKey}`
    )
    .then(showForecast)
    .catch(function (error) {
      return;
    });
}

function showForecast(response) {
  let forecast = response.data.daily.splice(0, 5);
  let forecastHTML = "";

  forecast.forEach(function (day) {
    let tempDay = Math.round(day.temp.day);
    let tempNight = Math.round(day.temp.night);
    let shortDay = formatDate(new Date(day.dt * 1000)).slice(0, 3);
    let src = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
    let alt = day.weather[0].description;
    forecastHTML =
      forecastHTML +
      `
      <div class="col d-grid">
        <div>${shortDay}</div>
        <div>
          <img src="${src}" alt="${alt}" class="icon" />
        </div>
        <div>${tempDay}°  <span class="text-muted">${tempNight}°</span></div>
      </div>
    `;
  });

  forecastElement.innerHTML = forecastHTML;
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  temperatureElement.innerText = Math.round(celsiusTemperature * (9 / 5) + 32);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  temperatureElement.innerText = celsiusTemperature;
}

dateElement.innerText = formatDate(new Date());
searchForm.addEventListener("submit", search);
currentButton.addEventListener("click", current);
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
celsiusLink.addEventListener("click", displayCelsiusTemperature);
document.querySelectorAll(".change-city").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    retrieveWeatherByCity(event.target.innerText);
  });
});
retrieveWeatherByCity("Helsinki");
