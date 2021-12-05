const express = require('express');
// const bodyParser = require("body-parser");
const https = require('https');
const app = express();

app.use(express.urlencoded({extended:true}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.post("/", (req, res)=>{
        const query = req.body.cityName;
        const apiKey= process.env.API_KEY;
        const unit = "metric";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiKey}`;
        https.get(url, (response)=>{
            response.on('data', (data)=>{
                const weatherData = JSON.parse(data);
                const temp =weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                // const weatherLocation = weatherData.name;
                const icon = weatherData.weather[0].icon;
                const imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                res.write(`<p>The weather is currently ${weatherDescription}.</p>`);
                res.write(`<h1>The Temperature of ${query} is ${temp} degree Celcius.</h1>`);
                res.write(`<img src="${imageUrl}">`);
                res.send();
            });
        }).on("err",(e)=>{
            console.error(e);
        });
});


app.listen(3000, (req, res)=>{
    console.log('server is running on port 3000');
});
