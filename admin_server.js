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




// установить порт, и слушать запросы
app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту!`);
});
