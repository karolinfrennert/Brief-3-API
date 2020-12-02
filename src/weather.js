const weatherParagraph = document.getElementById('weather');
const suggestion = document.getElementById('suggestion');

let requestWeatherURL = '';

const getWeatherInput = () => {
    const key = '761772a644b5d4b8d51f72682e52a919';
    const weatherURL = 'https://api.openweathermap.org/data/2.5/weather';
    const cityInput = document.getElementById('cityname').value;
    requestWeatherURL = weatherURL.concat('?q=' + cityInput + '&units=metric' + '&appid=' + key);
    document.querySelector(".swiper-pagination").style.display = "none";

    showWeatherResult();
}

const showWeatherResult = async() => {
    await fetch(requestWeatherURL) 
     .then(response => response.json())
    
     .then(data => {
        let weather = data.main.temp
        const cityInput = document.getElementById('cityname').value;

        if (weather >= 15) {
            suggestion.innerHTML = 'Sorry, we couldn\'t find something within your description. But looks like a beatiful day outside, how about a picnic date today?'
            weatherParagraph.innerHTML = 'Today\'s temperature ' + 'in ' + cityInput + ' is: ' + weather
        } else {
            suggestion.innerHTML = 'Sorry, we couldn\'t find something within your description. Looks like it\'s a little cold outside, so how about visiting a museum today with your date?'
            weatherParagraph.innerHTML = 'Today\'s temperature ' + 'in ' + cityInput + ' is: ' + weather;
        }
        
    });
}

export { weatherParagraph, suggestion, requestWeatherURL, getWeatherInput, showWeatherResult };