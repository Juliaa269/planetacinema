const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();
const dbConfig = require("./db.js");
var uuid = require('uuid-random');
const date = require('date-and-time');
var cors = require('cors')
const axios = require('axios');
const PORT=3001;

const app = express();

//делаем наш парсинг в формате json
app.use(bodyParser.json());
app.use(cors());



app.get('/shows', (req, res)=>{
  axios.get(`http://localhost:${PORT}/`)
      .then(response => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        res.status(200).send(response.data.shows)
      })
      .catch(error => {
        console.log(error);
      });
});
app.put('/movies', (req, res)=>{
  console.log(JSON.stringify(req.body))
  create(req.body)
  res.status(200).send();
});
app.get('/movies', (req, res)=>{
  axios.get(`http://localhost:${PORT}/`)
      .then(response => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        res.status(200).send(response.data.movies)
      })
      .catch(error => {
        console.log(error);
      });
});
app.post('/movies/:id', (req, res)=>{
  console.log(JSON.stringify(req.body))
  update(req.body, req.params.id)
  res.status(200).send();
});

app.delete('/movies/:id', (req, res)=> {
  console.log(`DELETE FROM movie WHERE id = ${req.params.id}`)
  query(`DELETE FROM movie WHERE id = '${req.params.id}'`)
  res.status(200).send();
})

function update(movie, id) {
  console.log(`UPDATE movie SET title = '${movie.title}' , duration = ${movie.duration} , poster = '${movie.poster}' WHERE id = '${id}'`)
  db.run(`UPDATE movie SET title = '${movie.title}' , duration = ${movie.duration} , poster = '${movie.poster}' WHERE id = '${id}'`, function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been updated with rowid ${this.lastID}`)
  });
}

function create(movie) {
  console.log(`insert into movie VALUES(${uuid()}, ${movie.title}, ${movie.duration}, '${movie.poster}')`)
  db.run(`insert into movie VALUES('${uuid()}', '${movie.title}', ${movie.duration}, '${movie.poster}')`, function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`)
  });
}

app.get('/shows', (req, res)=>{
  axios.get(`http://localhost:${PORT}/`)
      .then(response => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        res.status(200).send(response.data.shows)
      })
      .catch(error => {
        console.log(error);
      });
});
app.put('/shows', (req, res)=>{
  console.log(JSON.stringify(req.body))
  createShow(req.body)
  res.status(200).send();
});
app.get('/shows', (req, res)=>{
  axios.get(`http://localhost:${PORT}/`)
      .then(response => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        res.status(200).send(response.data.shows)
      })
      .catch(error => {
        console.log(error);
      });
});
app.post('/shows/:id', (req, res)=>{
  console.log(JSON.stringify(req.body))
  updateShow(req.body, req.params.id)
  res.status(200).send();
});

app.delete('/shows/:id', (req, res)=> {
  console.log(`DELETE FROM shows WHERE id = ${req.params.id}`)
  query(`DELETE FROM shows WHERE id = '${req.params.id}'`)
  res.status(200).send();
})

function updateShow(show, id) {
  console.log(`UPDATE shows SET room = '${show.room}' , time_at = '${show.time_at}' , movie_id = '${show.movie_id}' WHERE id = '${id}'`)
  db.run(`UPDATE shows SET room = '${show.room}' , time_at = '${show.time_at}' , movie_id = '${show.movie_id}' WHERE id = '${id}'`, function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been updated with rowid ${this.lastID}`)
  });
}

function createShow(show) {
  console.log(`insert into shows VALUES('${uuid()}', '${show.movie_id}', '${show.time_at}', '${show.room}')`)
  db.run(`insert into shows VALUES('${uuid()}', '${show.movie_id}', '${show.time_at}', 100, '${show.room}')`, function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`)
  });
}

app.get('/schedule/:show_date', async (req, res)=>{
  console.log(JSON.stringify(req.params.show_date))
  let data = await getMovieSchedule(req.params.show_date)
  console.log(data)
  res.status(200).send(data);
});

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
  result = await query(`SELECT s.id, movie_id, time_at, m.title as title, room FROM shows s join movie m on s.movie_id = m.id`);
  return result;
}

async function getSchedule(input) {
  const jsPattern = date.compile('YYYY-MM-DD');
  const sqlPattern = date.compile('YYYY-MM-DD HH:mm:ss');

  console.log(input)
  var start = date.parse(input, jsPattern), end = date.parse(input, jsPattern);
  start.setHours(0, 0, 0);
  end.setHours(23,59,59);
  console.log(start)
  console.log(end)
  console.log(`SELECT * FROM shows WHERE time_at BETWEEN ${date.format(start, sqlPattern)} AND ${date.format(end, sqlPattern)}`)
  return await query(`SELECT * FROM shows WHERE time_at BETWEEN '${date.format(start, sqlPattern)}' AND '${date.format(end, sqlPattern)}'`)
}

async function getMovieSchedule(input) {
  const jsPattern = date.compile('YYYY-MM-DD');
  const sqlPattern = date.compile('YYYY-MM-DD HH:mm:ss');

  console.log(input)
  var start = date.parse(input, jsPattern), end = date.parse(input, jsPattern);
  start.setHours(0, 0, 0);
  end.setHours(23,59,59);
  console.log(start)
  console.log(end)
  let sql = `SELECT * FROM movie where id IN(SELECT movie_id FROM shows WHERE time_at BETWEEN '${date.format(start, sqlPattern)}' AND '${date.format(end, sqlPattern)}')`;
  console.log(sql)
  return await query(sql)
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

app.get('/schedule', async (req, res)=>{
  let body = await getSchedule(req.query.date);
  res.json(body);
});


//  простой response - request
app.get("/", async (req, res) => {
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

