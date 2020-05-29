const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));
const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if(err){
            response.end();
            return;
        }
        response.json(data);
    });
});

app.post('/api', (request, response) => {
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    console.log(data);
    database.insert(data);
    response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat,lon);
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.API_KEY}`;
    // const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=0135e9107fa891b30d427d8bb3157b2f`;
    const fetch_weather = await fetch(weather_url);
    const json_weather = await fetch_weather.json();

    const aq_url =`https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const fetch_aq = await fetch(aq_url);
    const json_aq = await fetch_aq.json();
    
    const data ={
        weather: json_weather,
        air_quality: json_aq
    };
    // database.insert(json.weather[0].main);
    response.json(data);
});