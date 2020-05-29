const mymap = L.map('listmap').setView([0, 0], 1);
const attribution =
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();

const selfies = [];

document.getElementById('timeSort').addEventListener('click', event => {
    sortData((a,b) => b.timeSort - a.timeSort);
});
document.getElementById('nameSort').addEventListener('click', event => {
    sortData((a,b) => {
        nameA = a.nameSort.toUpperCase();
        nameB = b.nameSort.toUpperCase();
        if(nameB > nameA) return -1;
        else return 1;
    });
});

function sortData(compare){
    for(let item of selfies){
        item.elt.remove();
    }
    selfies.sort(compare);
    for(let item of selfies){
        document.body.append(item.elt);
    }
}

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    console.log('checkpoint');
    
    for (item of data) {

        const response = await fetch(`/weather/${item.lat},${item.lon}`);
        const json = await response.json();
        console.log(json,"over here!!!!");
        const root = document.createElement('p');
        const username = document.createElement('div');
        const geo = document.createElement('div');
        const date = document.createElement('div');
        const weather = document.createElement('div');
        const aq = document.createElement('div');
        
        username.textContent = `username: ${item.username}`;
        geo.textContent = `${item.lat}, ${item.lon}`;
        const dateString = new Date(item.timestamp).toLocaleString();
        date.textContent = dateString;
        
        root.append(username, geo, date, weather, aq);
        
        selfies.push({ elt: root, timeSort: item.timestamp, nameSort: item.username});
        document.body.append(root);
        
        let txt = `coordinate:(${item.lat},${item.lon})<br>The weather here is ${json.weather.weather[0].main} with a temperature of ${json.weather.main.temp}&deg; Celsius.<br>`;
        
        if(item.aq.value < 0){
            txt += ' No air quality reading.';
        } else {
            weather.textContent = `weather: ${json.weather.weather[0].main}`;
            aq.textContent = `particulate matter: ${json.air_quality.results[0].measurements[0].value} ${json.air_quality.results[0].measurements[0].unit}`;
            txt += `Air Quality: ${json.air_quality.results[0].measurements[0].parameter.toUpperCase()} ${json.air_quality.results[0].measurements[0].value} ${json.air_quality.results[0].measurements[0].unit}`
        }

        const marker = L.marker([item.lat,item.lon]).addTo(mymap);
        marker.bindPopup(txt).openPopup();

    }

    console.log(data);
}




