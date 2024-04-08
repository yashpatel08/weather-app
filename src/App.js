import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cloud from './cloud.png'
function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [city, setCity] = useState('');
  const apikey = 'b1b89674761bd3c540eb42e4a0e9b09c';
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!city) return; // Skip API call if city is empty
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
        const response = await axios.get(url);
        setWeatherData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [city, apikey]);

  const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };
  const mpsToMph = (mps) => {
    return mps * 2.23694;
  };

  useEffect(() => {
    const currentDate = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDate(currentDate.toLocaleDateString('en-US', options));
  }, []);


  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     
  };

  function convertTime(timestamp) {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM
    hours %= 12; // Convert 24-hour time to 12-hour time
    hours = hours || 12; // Handle midnight (0 hours) as 12 AM
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${meridiem}`;
    return formattedTime;
  }

  const getWeatherType = () => {
    if (!weatherData || !weatherData.weather) return 'Unknown';

    const weatherDescription = weatherData.weather[0].description.toLowerCase();
    if (weatherDescription.includes('rain') || weatherDescription.includes('drizzle')) {
      return 'Rain';
    } else {
      return 'Light';
    }
  };


  return (
    <div className="App">
      <h1 className='title'>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <div className="center">
          <input className='input' type='text' name='city' placeholder={weatherData ? city : 'Loading...'} value={city}
            onChange={handleInputChange} 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(e);
              }
            }}

          />
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </form>
      {weatherData && (
        <div className='container'>

          <div className='left'>
            <h2>
              {weatherData.name} , {weatherData.sys.country}
            </h2>
            <p>{currentDate}</p>
          </div>
          <div className='right'>
               
                <div>
                  <p>Weather</p>
                  <span>{getWeatherType()}</span>
                </div>
                
                <div>
                    <p>{mpsToMph(weatherData.wind.speed).toFixed(2)} mph</p>
                    <span>Wind Speed</span>
                </div>

                <div>
                    <p>{convertTime(weatherData.sys.sunrise)}</p>
                    <span>Sunrise</span>
                </div>

                <div>
                    <p>{convertTime(weatherData.sys.sunset)}</p>
                    <span>Sunset</span>
                </div>
                <div>
                    <p>{weatherData.wind.deg}°</p>
                    <span>Wind Direction</span>
                </div>
                <div>
                    <p>{weatherData.weather[0].main}</p>
                    <span>Weather</span>
                </div>
                <div>
                    <p>{weatherData.main.humidity}%</p>
                    <span>Humidity</span>
                </div>
                <div>
                    <p>{weatherData.main.pressure} hPa</p>
                    <span>Pressure</span>
                </div>
          </div>
          <div className='temp'>
            <div className='sub-temp'>
            <img src={cloud} alt='temp'/>
            <p>{kelvinToCelsius(weatherData.main.temp).toFixed(2)} °C</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
