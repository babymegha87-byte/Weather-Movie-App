const API_KEY = "32494e29606d81166e2047563efdb16b";
const OMDB_API_KEY = "9b32defa";

// WEATHER ELEMENTS
const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const weather = document.getElementById("weather");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const description = document.getElementById("description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

// MOVIE ELEMENTS
const movieForm = document.getElementById("movieForm");
const movieInput = document.getElementById("movieInput");
const movieSearchBtn = document.getElementById("movieSearchBtn");
const movieMessage = document.getElementById("movieMessage");
const movieResults = document.getElementById("movieResults");

// WEATHER SEARCH
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name.";
        weather.hidden = true;
        return;
    }

    if (
        !API_KEY ||
        API_KEY === "PASTE_YOUR_REGENERATED_WEATHER_KEY_HERE"
    ) {
        message.textContent = "Please add your weather API key.";
        return;
    }

    await getWeather(city);
});

// GET WEATHER DATA
async function getWeather(city) {
    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";
    message.textContent = "Fetching weather data...";
    weather.hidden = true;

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Check the spelling.");
            }

            if (response.status === 401) {
                throw new Error("Weather API key is invalid or inactive.");
            }

            throw new Error(data.message || "Unable to get weather.");
        }

        cityName.textContent = `${data.name}, ${data.sys.country}`;
        description.textContent = data.weather[0].description;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherIcon.alt = data.weather[0].description;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        humidity.textContent = `${data.main.humidity}%`;
        wind.textContent = `${data.wind.speed} m/s`;

        message.textContent = "Weather updated successfully!";
        weather.hidden = false;

    } catch (error) {
        message.textContent = error.message;
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
}

// MOVIE SEARCH
movieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const movie = movieInput.value.trim();

    if (!movie) {
        movieMessage.textContent = "Please enter a movie name.";
        return;
    }

    if (
        !OMDB_API_KEY ||
        OMDB_API_KEY === "PASTE_YOUR_OMDB_KEY_HERE"
    ) {
        movieMessage.textContent = "Please add your OMDb API key in script.js.";
        return;
    }

    await searchMovies(movie);
});

// GET MOVIE DATA
async function searchMovies(movie) {
    movieSearchBtn.disabled = true;
    movieSearchBtn.textContent = "Searching...";
    movieMessage.textContent = "Searching for movies...";
    movieResults.replaceChildren();

    try {
        const url =
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(movie)}&type=movie`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Unable to contact the movie service.");
        }

        if (data.Response === "False") {
            throw new Error(data.Error || "No movies found.");
        }

        data.Search.forEach((item) => {
            const card = document.createElement("article");
            card.className = "movie-card";

            const poster = document.createElement("img");
            poster.alt = `${item.Title} poster`;
            poster.loading = "lazy";

            if (item.Poster && item.Poster !== "N/A") {
                poster.src = item.Poster;
            } else {
                poster.alt = "Poster unavailable";
            }

            const title = document.createElement("h3");
            title.textContent = item.Title;

            const year = document.createElement("p");
            year.textContent = `Release year: ${item.Year}`;

            card.append(poster, title, year);
            movieResults.appendChild(card);
        });

        movieMessage.textContent =
            `Found ${data.Search.length} movie results!`;

    } catch (error) {
        movieMessage.textContent = error.message;
    } finally {
        movieSearchBtn.disabled = false;
        movieSearchBtn.textContent = "Search Movies";
    }
}