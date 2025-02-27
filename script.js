document.getElementById('get-weather').addEventListener('click', function() {
    const input = document.getElementById('city-input').value;
    const apiKey = '49b619d265e74103ab215153252702';
    const forecastType = document.querySelector('input[name="forecast"]:checked').value;
    const url = forecastType === 'current' 
        ? `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${input}&aqi=no` 
        : `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${input}&days=7&aqi=no`; 

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    
    xhr.onload = function() {
        const weatherResult = document.getElementById('weather-result');
        const errorMessage = document.getElementById('error-message');
        weatherResult.innerHTML = '';
        errorMessage.innerHTML = '';

        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            if (forecastType === 'current') {
                weatherResult.innerHTML = `
                    <h2>${data.location.name}</h2>
                    <p>Температура: ${data.current.temp_c} °C</p>
                    <p>Влажность: ${data.current.humidity}%</p>
                    <img src="https:${data.current.condition.icon}">
                `;
            } else {
                weatherResult.innerHTML = `<h2>${data.location.name}</h2>`;
                
                const forecastContainer = document.createElement('div');
                forecastContainer.classList.add('forecast-container');

                data.forecast.forecastday.forEach(day => {
                    const forecastDay = document.createElement('div');
                    forecastDay.classList.add('forecast-day');
                    forecastDay.innerHTML = `
                        <p>${day.date}</p>
                        <p>Темп: ${day.day.avgtemp_c} °C</p>
                        <p>Влажность: ${day.day.avghumidity}%</p>
                        <img src="https:${day.day.condition.icon}">
                    `;
                    forecastContainer.appendChild(forecastDay);
                });

                weatherResult.appendChild(forecastContainer);
            }
            weatherResult.classList.remove('hidden');
            weatherResult.classList.add('show');
        } else {
            errorMessage.innerHTML = 'Город не найден или введены неверные координаты.';
            errorMessage.classList.remove('hidden');
        }
    };

    xhr.onerror = function() {
        const errorMessage = document.getElementById('error-message');
        errorMessage.innerHTML = 'Ошибка запроса к API.';
        errorMessage.classList.remove('hidden');
    };

    xhr.send();
});