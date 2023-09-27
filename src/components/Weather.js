import React, { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";

const Weather = () => {
  const [search, setSearch] = useState("");
  const [weatherData, setWeatherData] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [temp, setTemp] = useState("");
  const [tempType, setTempType] = useState("celsius");

  const baseUrl = "https://api.openweathermap.org/data/2.5/";
  const KEY = process.env.REACT_APP_API_KEY;
  let IP = "";

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.ip);
        IP = data.ip;
      })
      .catch((e) => {
        console.log("Error while fetching Ip address", e);
      });
  }, []);

  const getWeather = (search) => {
    if (search) {
      setLoading(true);
      fetch(`${baseUrl}/weather?q=${search}&APPID=${KEY}&units=metric`)
        .then((res) => res.json())
        .then((data) => {
          const fetchedData = {
            name: data.name,
            temp: data.main.temp,
            humidity: data.main.humidity,
            speed: data.wind.speed,
            weather_desc: data.weather[0].description,
            iconCode: data.weather[0].icon,
          };
          console.log(fetchedData);
          setTemp(fetchedData.temp);
          setWeatherData(fetchedData);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setWeatherData("");
          setError({ message: "Data not found!" });
        });
    } else {
      setError({ message: "Enter data!" });
    }
  };

  const getLocation = () => {
    fetch(`https://ipinfo.io/${IP}/geo?token=6cb6e85b8cb4a2`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.city);
        setSearch(data.city);
        getWeather(data.city);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const changeTempType = () => {
    if (tempType == "celsius") {
      let newTemp = temp * (9 / 5) + 32;
      setTemp(newTemp.toFixed(2));
      setTempType("Fahrenheit");
    } else {
      let newTemp = (temp - 32) * (5 / 9);
      setTemp(newTemp.toFixed(2));
      setTempType("celsius");
    }
  };

  return (
    <div className="weather-back">
      <div className="container mt-5 weather-container">
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="buttons mt-4">
          <button onClick={() => getWeather(search)}>Get Weather</button>
          <button onClick={getLocation}>Current Location Weather</button>
        </div>

        {loading ? (
          <div className="loader">
            <Audio
              height="80"
              width="80"
              radius="9"
              color="green"
              ariaLabel="loading"
              wrapperStyle
              wrapperClass
            />
          </div>
        ) : (
          ""
        )}

        {error && !weatherData ? (
          <div className="error-container">
            <p>{error.message}</p>
          </div>
        ) : (
          ""
        )}

        {weatherData ? (
          <div className="weather-content">
            <div className="temp-field">
              <div className="temp-content">
                <p className="temp-val">
                  {temp + "°"}
                  {tempType === "celsius" ? "C" : "F"}
                </p>
                <button onClick={changeTempType}>
                  {tempType === "celsius" ? "Fahrenheit" : "Celsius"}
                </button>
              </div>

              <div>
                <div className="weather-field">
                  <p>Humidity - {weatherData.humidity}</p>
                </div>
                <div className="weather-field">
                  <p>Speed - {weatherData.speed}</p>
                </div>
              </div>
            </div>

            <hr/>
            <div className="temp-field">
              <div className="icon-container">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.iconCode}@2x.png`}
                />
                <p>{weatherData.name}</p>
              </div>
              <div className="weather-field">
              <p>Description - {weatherData.weather_desc}</p>
            </div>
            </div>


          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Weather;
