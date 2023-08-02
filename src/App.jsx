import axios from "axios"
import { useEffect, useState } from "react"
import sunrise from "./assets/sunrise.png"
import sunset from "./assets/sunset.png"
import direction from "./assets/direction.png"
import humidity from "./assets/humidity.png"
import thermometer from "./assets/thermometer.png"

const App = ()=> {
  

  const locationQapiKey = "pk.65c549f786146fbcccced7a2fb922aad"
  const openWeatherApiKey = "35fa80ee573b22aa10441583a371b976"

  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const [weather, setWeather] = useState({})
  const [weatherloading, setWeatherLoading] = useState(false)

  
  const [currentTime, setCurrentTime] = useState()

  useEffect(()=> {
    const updateSecondInterval = setInterval(() => {
      if(weather.id) {
        const dateObject = new Date(); // Membuat objek Date untuk waktu saat ini

        const utcTimeStamp = Date.UTC(
          dateObject.getUTCFullYear(),
          dateObject.getUTCMonth(),
          dateObject.getUTCDate(),
          dateObject.getUTCHours(),
          dateObject.getUTCMinutes(),
          dateObject.getUTCSeconds(),
          dateObject.getUTCMilliseconds()
        );

        const localTimestamp = utcTimeStamp + weather.timezone * 1000;
        setCurrentTime(new Date(localTimestamp).toUTCString())
      }
    }, 1000);

    return()=> {
      clearInterval(updateSecondInterval)
    }
  },[weather])

  const handleChange = e => {
    setInputValue(e.target.value)

    const fetchWeather = async ()=> {
      setSuggestionLoading(true)
      try{
        const locationData = await axios.get(`https://us1.locationiq.com/v1/search?key=${locationQapiKey}&q=${e.target.value}&format=json`)
        setSuggestions(locationData.data)
      } catch(error) {
        console.log(error)
      }
      setSuggestionLoading(false)
      if(e.target.value.length < 1) {
        setSuggestions([])
      }
    }
  
    fetchWeather()
  }

  const handleClick = (location) => {
    // Set the suggestions to empty immidieately after click the city
    setSuggestions([])
    
    // get the location to display in browser
    const fetchWeather = async ()=> {
      setWeatherLoading(true)
      try {
        // get the weather data
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${openWeatherApiKey}`)
        // set the data to state
        setWeather(result.data)
      } catch(error) {
        console.log(error)
      }
      setWeatherLoading(false)
    }
    fetchWeather()
  }

  const glamorphism = {
    /* From https://css.glass */
    background: "rgba(25, 2, 2, 0.33)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5.6px)",
    border: "1px solid rgba(25, 2, 2, 0.69)"
  }

  
  return(
    <div className="w-screen min-h-screen flex flex-col justify-start items-center pt-20 bg-gradient-to-r from-blue-400 to-purple-400">
      <div className="flex flex-col justify-start items-center gap-1 w-8/12 relative">
        <input type="text" placeholder="Enter the location" className="p-2 w-full rounded-full active:outline-none placeholder:text-gray-500 text-lg text-center placeholder:text-center" onChange={handleChange} value={inputValue}  />

          {suggestionLoading ? (
            <div className="absolute z-10 mt-12 p-2 w-full bg-white rounded-lg shadow-lg ">
            <div className="loading-spinner mx-auto text-center"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="absolute z-10 mt-12 p-2 w-full bg-white rounded-lg shadow-lg ">
              <ul>
                {suggestions.map(city => (
                  <li key={city.osm_id} onClick={()=> handleClick(city)} className="pb-2 border-b border-gray-300 cursor-pointer hover:bg-gray-200">{city.display_name}</li>
                ))}
              </ul>
            </div>
          ) : <div></div>}
      </div>
      {weatherloading ? (
        <div className="lds-ring mt-20"><div></div><div></div><div></div><div></div></div>
      ) : weather.id && (
        <div className="w-10/12 md:8/12 mt-20 p-6 text-center text-gray-50 relative" style={glamorphism}>
          <h1 className="text-2xl flex justify-center items-center">{Math.round(weather.main.temp - 273.15)}°C <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="" /> | {weather.name}, {weather.sys.country}</h1>
          <h2 className="text-xl pb-3">{currentTime}</h2>
          <hr />
          <div className="flex justify-evenly pt-3 w-full">
            <div className="flex gap-2">
              <img src={sunrise} alt="sunrise" className="w-16 h-full" />
              <div className="text-lg md:text-2xl">
                <p>{`${String(new Date(weather.sys.sunrise * 1000).getHours()).padStart(2, '0')}:${String(new Date(weather.sys.sunrise * 1000).getMinutes()).padStart(2, '0')}`}</p>
                <p>sunrise</p>
              </div>
            </div>
            <div className="flex gap-2">
              <img src={sunset} alt="sunset" className="w-16 h-full" />
              <div className="text-lg md:text-2xl">
                <p>{`${String(new Date(weather.sys.sunset * 1000).getHours()).padStart(2, '0')}:${String(new Date(weather.sys.sunset * 1000).getMinutes()).padStart(2, '0')}`}</p>
                <p>sunset</p>
              </div>
            </div>
          </div>
          <div className="flex justify-evenly pt-4 w-full">
            <div className="flex gap-2">
              <img src={direction} alt="direction" className="w-6 h-full" style={{ transform: `rotate(${weather.wind.deg}deg)` }} />
              <div className="text-lg md:text-2xl">
                <p>{weather.wind.speed * 3.6} km/h</p>
                <p>Wind</p>
              </div>
            </div>
            <div className="flex gap-2">
              <img src={humidity} alt="humidity" className="w-12 h-full" />
              <div className="text-lg md:text-2xl">
                <p>{weather.main.humidity} %</p>
                <p>Humidity</p>
              </div>
            </div>
          </div>
          <div className="flex justify-evenly pt-4 w-full">
            <div className="flex gap-2">
              <img src={thermometer} alt="thermometer" className="w-16 h-full" />
              <div className="text-lg md:text-2xl">
                <p>{weather.main.pressure} hPa</p>
                <p>Pressure</p>
              </div>
            </div>
          </div>

          <p className="absolute bottom-0 right-3 italic">Powered by openwathermap api</p>
        </div>
      )}
      <footer className="text-center bottom-0">
        <p>Made with &#x2764; by Rizky</p>
      </footer>
    </div>
  )
}

export default App