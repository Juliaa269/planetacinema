const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');
var cors = require('cors')
const PORT = 3002;
const BACKEND_PORT = 3001;

axios.defaults.headers.common.accept = 'application/json'

const app = express();
app.use(cors());

//делаем наш парсинг в формате json
app.use(bodyParser.json());

// парсит запросы по типу: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/movies', (req, res)=>{
  axios.get(`http://localhost:${BACKEND_PORT}/`)
  .then(response => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.status(200).send(response.data.movies)
  })
  .catch(error => {
    console.log(error);
  });  
});

app.get('/shows', (req, res)=>{
  axios.get(`http://localhost:${BACKEND_PORT}/`)
  .then(response => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.status(200).send(response.data.shows)
  })
  .catch(error => {
    console.log(error);
  });  
});

// установить порт, и слушать запросы
app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту!`);
});
