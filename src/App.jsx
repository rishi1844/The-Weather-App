import React from "react";
import CurrentLocation from "./currentLocation";
import "./App.css";
import instagramIcon from "./images/instagram.png";
import facebookIcon from "./images/facebook.png";

function App() {
  return (
    <React.Fragment>
        <div className="container">
          <CurrentLocation />
        </div>

      <div className="footer-info">
        <a
          href="https://github.com/rishi1844/The-Weather-App"
          target="_blank"
          rel="noopener noreferrer"
        >
          📥 Download Source Code
        </a>{" "}
        | Created with by{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://rishikantportfolio.netlify.app/"
        >
          Rishikant Singh
        </a>{" "}
        | Data sourced from{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://openweathermap.org/"
        >
          OpenWeather API
        </a>{" "}
      </div>

    </React.Fragment>
  );
}

export default App;
