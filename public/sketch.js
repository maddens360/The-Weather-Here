const mymap = L.map('mapid').setView([0, 0], 1);
const attribution =
'&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);
let lat, lon;
const button = document.getElementById('btn');
aq_parameter; function setup() {
    button.addEventListener('click', async event => {
        try{
            const api_url = `/weather/${lat},${lon}`;
            const response = await fetch(api_url);
            const json = await response.json();
            const username = document.getElementById('user-name').value;
            aq = json.air_quality.results[0].measurements[0];
            const data = { lat, lon, username, aq, aq_unit, aq_parameter};
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            const response_ = await fetch('/api', options);
            const json_ = await response_.json();
            console.log(json_);

        }catch(error){
            aq = { value: -1 };
            document.getElementById('aq').textContent = 'NO READING';
            const username = document.getElementById('user-name').value;
            const data = { lat, lon, username, aq };
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            const response_ = await fetch('/api', options);
            const json_ = await response_.json();
            console.log(json_);
        }
    });
}
setup();


    if ('geolocation' in navigator) {
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(async position => {
            try{
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                document.getElementById('latitude').textContent = lat.toFixed(2);
                document.getElementById('longitude').textContent = lon.toFixed(2);

                const marker = L.marker([lat, lon]).addTo(mymap);

                const api_url = `/weather/${lat},${lon}`;
                const response = await fetch(api_url);
                const json = await response.json();
                weather_main = json.weather.weather[0].main;
                temperature = json.weather.main.temp;
                aq = json.air_quality.results[0].measurements[0].value;
                aq_unit = json.air_quality.results[0].measurements[0].unit;
                aq_parameter = json.air_quality.results[0].measurements[0].parameter;
                document.getElementById('summary').textContent = weather_main;
                document.getElementById('temperature').textContent = temperature;
                document.getElementById('aq').textContent = aq;
                document.getElementById('aq_unit').textContent = aq_unit;
                document.getElementById('aq_parameter').textContent = 
            
                console.log(position);
                console.log(json);
            }catch(error){
                // console.error(error);
                aq = {value:-1};
                document.getElementById('aq').textContent = 'NO READING';
            }
        });
    } else {
        console.log('geolocation not available');
    }
