import React, { Component } from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

class Weather extends Component {
  state = {
    lat: null,
    lon: null,
    city: null,
    country: null,
    temperatureC: null,
    temperatureF: null,
    humidity: null,
    description: null,
    icon: "CLEAR_DAY",
    sunrise: null,
    sunset: null,
    errorMsg: null,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch(() => {
          this.getWeather(28.67, 77.22); // Default location
          alert(
            "You have disabled location services. Allow access for real-time weather updates."
          );
        });
    } else {
      alert("Geolocation is not available on your device.");
    }

    this.timerID = setInterval(() => {
      if (this.state.lat && this.state.lon) {
        this.getWeather(this.state.lat, this.state.lon);
      }
    }, 600000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  getWeather = async (lat, lon) => {
    try {
      const api_call = await fetch(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await api_call.json();

      if (!data.main) {
        throw new Error("Weather data unavailable.");
      }

      this.setState({
        lat,
        lon,
        city: data.name || "Unknown",
        country: data.sys.country || "Unknown",
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity || "N/A",
        description: data.weather[0]?.main || "Unknown",
        sunrise: this.getTimeFromUnixTimeStamp(data.sys.sunrise),
        sunset: this.getTimeFromUnixTimeStamp(data.sys.sunset),
        icon: this.getWeatherIcon(data.weather[0]?.main),
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      this.setState({ errorMsg: "Unable to retrieve weather data." });
    }
  };

  getWeatherIcon = (weatherCondition) => {
    const iconMap = {
      Haze: "CLEAR_DAY",
      Clouds: "CLOUDY",
      Rain: "RAIN",
      Snow: "SNOW",
      Dust: "WIND",
      Drizzle: "SLEET",
      Fog: "FOG",
      Smoke: "FOG",
      Tornado: "WIND",
      Clear: "CLEAR_DAY",
    };

    return iconMap[weatherCondition] || "CLEAR_DAY";
  };

  getTimeFromUnixTimeStamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  render() {
    const {
      city,
      country,
      temperatureC,
      humidity,
      description,
      icon,
      errorMsg,
    } = this.state;

    return (
      <React.Fragment>
        {temperatureC ? (
          <div className="city">
            <div className="title">
              <h2>{city}</h2>
              <h3>{country}</h3>
            </div>
            <div className="mb-icon">
              <ReactAnimatedWeather
                icon={icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{description}</p>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div className="current-time">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>
                  {temperatureC}°<span>C</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment>
            {errorMsg ? (
              <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
                {errorMsg}
              </h3>
            ) : (
              <>
                <img src={loader} alt="Loading..." style={{ width: "50%", WebkitUserDrag: "none" }} />
                <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
                  Detecting your location
                </h3>
                <h3 style={{ color: "white", marginTop: "10px" }}>
                  Your current location will be displayed and used for real-time weather calculations.
                </h3>
              </>
            )}
          </React.Fragment>
        )}
        {temperatureC && <Forcast icon={icon} weather={description} />}
      </React.Fragment>
    );
  }
}

export default Weather;
