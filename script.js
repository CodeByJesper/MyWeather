// Listen for the DOMContentLoaded event, which fires when the HTML is fully loaded
// This ensures our script runs after all elements are available
document.addEventListener("DOMContentLoaded", function() {
    // Call the function to get the user's location as soon as the page loads
    getUserLocation();
});

// We define an asynchronous function that fetches weather data based on latitude and longitude
async function getWeather(lat, lon) {

    // API key from OpenWeather (replace with your actual key)
    let apiKey; /*YOUR_API_KEY_HERE*/

    // Assign the latitude and longitude passed as arguments to descriptive variables
    const latitude = lat;    // e.g., 59.3293 for Stockholm
    const longitude = lon;   // e.g., 18.0686 for Stockholm

    // Build the URL to the OpenWeather API
    // We include:
    // - lat/lon: the coordinates for which we want weather data
    // - appid: our API key
    // - units=metric: to get temperature in Celsius
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    // Use try/catch to handle any potential errors
    try {
        // Send an HTTP GET request to the API
        // 'await' pauses the function until the response is received
        let response = await fetch(url);

        // Convert the response from JSON text into a JavaScript object
        let data = await response.json();

        // Log the entire data object to see all information returned from the API
        console.log(data);

        // Log the city name returned by OpenWeather
        console.log(data.name);

        // Log the temperature value in Celsius
        console.log("Temperature: ", data.main.temp, "°C");

        // Call the function to update the HTML with the weather icon and info
        updateWeatherOnPage(data);

    } catch (error) {
        // If anything goes wrong (e.g., network issue or invalid API key), the error is caught here
        console.log(error);
    }
}

// Call getUserLocation immediately (redundant with DOMContentLoaded listener but ensures functionality)
getUserLocation();

// Function to get the user's current location using the Geolocation API
function getUserLocation() {
    // Check if the browser supports Geolocation
    if (navigator.geolocation) {
        // Request the user's current position
        navigator.geolocation.getCurrentPosition(
            // Success callback: receives the position object
            (position) => {
                const lat = position.coords.latitude;   // latitude of the user
                const lon = position.coords.longitude;  // longitude of the user

                // Call getWeather with the user's coordinates
                getWeather(lat, lon);
            },
            // Error callback: called if location cannot be obtained
            (error) => {
                console.error("Could not get location:", error);
            }
        );
    } else {
        // Alert the user if their browser does not support geolocation
        alert("Your browser does not support this function.");
    }
}

// Function to extract and display the current weather icon and related information
function updateWeatherOnPage(data) {
    // Take the first weather object from the array (represents main weather)
    let currentWeather = data.weather[0];

    // Extract the icon code and description
    let iconCode = currentWeather.icon;            // e.g., "02d"
    let description = currentWeather.description;  // e.g., "few clouds"

    // Build the full URL to the OpenWeather icon
    let iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

    // Select the HTML elements where we want to display the information
    let city = document.getElementById("city");           // Element to display city name
    let weather = document.getElementById("description");// Element to display description
    let temperature = document.getElementById("temp");   // Element to display temperature
    let img = document.getElementById("weatherImg");     // <img> element for weather icon

    // Update the innerHTML or src of each element with the current data
    city.innerHTML = data.name;                              // Show city name
    weather.innerHTML = description;                         // Show weather description
    temperature.innerHTML = "Temperature: " + data.main.temp + "°C"; // Show temperature
    img.src = iconURL;                                       // Display the icon image
}
