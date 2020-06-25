const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();
const dbConfig = require("./db.js");
var uuid = require('uuid-random');
var cors = require('cors')
const PORT=3001;

const app = express();

//делаем наш парсинг в формате json
app.use(bodyParser.json());
app.use(cors());

// парсит запросы по типу: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

function query(sql) {
  return new Promise((resolve, reject) =>{
    setTimeout(function(){
      db.all(sql, [], (err, data) => {
        if (err) {
          console.error(err.message);
          reject()
        } 
        resolve(data)
      });
    }, 300);
  });
}

async function listShows() {
  result = await query(`SELECT * FROM shows`);
  return result;
}

function addMovie(movie) {
  console.log(`insert into movie VALUES(${uuid()}, ${movie.title}, ${movie.duration})`)
  db.run(`insert into movie VALUES('${uuid()}', '${movie.title}', ${movie.duration})`, function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`)
  }); 
}

const listMovies = function(){
  var result = [];
  db.serialize(() => {
    db.each(`SELECT * FROM movie`, (err, movie) => {
      if (err) {
        console.error(err.message);
      }
      // console.log(JSON.stringify(movie, null, 4))
      result.push(movie);
    });
  });
  return result;
}

app.post('/movies', (req, res)=>{
  console.log(JSON.stringify(req.body))
  addMovie(req.body)
  res.status(200).send();
});
//  простой response - request
app.get("/", async (req, res) => {
  console.log('requested:' + req);
  var result = { 
    greeting: "Добро пожаловать в YoKino, like, repost" , 
    movies: listMovies(),
    shows: await listShows()
  };
  res.json(result);
});

// установить порт, и слушать запросы
app.listen(3001, () => {
  console.log("Сервер запущен на 3001 порту!");
});

let db = new sqlite3.Database('./' + dbConfig.path + '/' + dbConfig.name + '.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the planetcinema database.');
  
});

const notAvailableTickets = function(id){
  db.serialize(() => {
    db.each(`SELECT * FROM tickets t WHERE t.show_id = '${id}' AND t.status in ('BOOKED', 'SOLD')`, (err, ticket) => {
      if (err) {
        console.error(err.message);
      }
      console.log(ticket.id + "\t" + ticket.show_id + "\t" + ticket.chair);
    });
  });
  
}

let id = 'a169bf20-060d-449e-9c7b-006fa872fc89';
notAvailableTickets(id)

