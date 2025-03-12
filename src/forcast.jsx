import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

const defaults = {
    color: "white",
    size: 112,
    animate: true,
};

function Forcast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const fetchCitySuggestions = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKeys.key}`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setSuggestions([]);
    }
  };

  const search = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${city}&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
        setSuggestions([]);
      })
      .catch((error) => {
        console.log(error);
        setWeather(null);
        setQuery("");
        setError("City not found");
      });
  };

  useEffect(() => {
    search("Delhi");
  }, []);

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather icon={props.icon} {...defaults} />
      </div>

      <div className="today-weather">
        <h3>{weather ? weather.weather[0].main : ""}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              fetchCitySuggestions(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && search(query)}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              alt="Search"
              onClick={() => search(query)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <ul className="suggestions">
          {suggestions.map((city, index) => (
            <li key={index} onClick={() => search(city.name)}>
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
        {weather ? (
          <ul>
            <li className="cityHead">
              <p>
                {weather.name}, {weather.sys.country}
              </p>
              <img
                className="temp"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt="Weather Icon"
              />
            </li>
            <li>
              Temperature: <span className="temp">{Math.round(weather.main.temp)}°C ({weather.weather[0].main})</span>
            </li>
            <li>
              Humidity: <span className="temp">{weather.main.humidity}%</span>
            </li>
            <li>
              Visibility: <span className="temp">{(weather.visibility / 1000).toFixed(1)} km</span>
            </li>
            <li>
              Wind Speed: <span className="temp">{Math.round(weather.wind.speed)} km/h</span>
            </li>
          </ul>
        ) : (
          <p className="error">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Forcast;
