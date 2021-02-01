const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const port = 3000;
//MongoDB connection string
const uri = 'mongodb+srv://clericmt:St4rw4rs@cluster0.rmuwu.mongodb.net/test?retryWrites=true&w=majority' //for dev
const { MongoClient } = require("mongodb");
const { json } = require('body-parser');

const connectionstring = process.env.MONGODB_URI
// use the express-static middleware
app.use(express.static("public"));

const client = new MongoClient(uri, { useUnifiedTopology: true });

//connect to my dataBase
client.connect()
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('node-db')
    const nodeCollection = db.collection('nodes')

    //
    // Middlewares
    //
    app.set('view engine', 'ejs') //sets EJS as template engine
    app.use(bodyParser.urlencoded({ extended: true }))  // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.json()) //So server can read JSON
    app.use(express.static('public')) //This allows server to serve files in public folder

    //
    // Routes
    //

    app.get('/login', (req, res) => { //When the main page loads, the esj file will render
      res.render('login.ejs')
    })

    app.get('/', (req, res) => { //When the main page loads, the esj file will render
      res.render('index.ejs')
    })

    app.get('/create', (req, res) => { //When the main page loads, the esj file will render
      res.render('new_user.ejs')
    })

    //Find user match.
    app.get('/users', (req, res) => {
      db.collection('users').find().toArray()
      .then(results => {
        res.send({ users: results})
        
      })
      .catch(error => console.error(error))
    })

    //Create user
    app.post('/users', (req, res) => {
      db.collection('users').insertOne(req.body)
        .then(result => {
          console.log(req.body._id)
          res.redirect('/login')
        })
        .catch(error => console.error(error))
    })

    //Save data
    app.post('/nodes', (req, res) => {
        db.collection('users').updateOne(
          {name: req.body.username},
          {
            $push: {
              nodes:
                {
                  id: req.body.id,
                  name: req.body.name,
                  info: req.body.info,
                  x: req.body.x,
                  y: req.body.y,
                  io: req.body.io,
                  conns: req.body.conns,
                  colour: req.body.colour,
                  time: req.body.time,
                  timer: req.body.timer,
                  startTimer: req.body.startTimer
                } 
            }
          },
          { upsert: true }
          )
          .then(results => {
            res.redirect("/")
          })
          .catch(error => console.log(error))
    })

    app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))
  })
  .catch(console.error)
