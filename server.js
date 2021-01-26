


const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const port = 3000;
//MongoDB connection string
//'mongodb+srv://clericmt:St4rw4rs@cluster0.rmuwu.mongodb.net/test?retryWrites=true&w=majority'
const connectionString = 'mongodb+srv://clericmt:St4rw4rs@cluster0.rmuwu.mongodb.net/test?retryWrites=true&w=majority'
const { MongoClient } = require("mongodb");

const uri = MONGODB_URI
//"mongodb+srv://clericmt:St4rw4rs@cluster0.rmuwu.mongodb.net/test?retryWrites=true&w=majority";
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


    
    app.get('/nodes', (req, res) => { //when req sent from nodes, returns response
      db.collection('nodes').find().toArray() //each object in db to an array
        .then(results => {
          res.send({ nodes: results }) //sends array to client as "nodes"
        })

        .catch(error => console.error(error))
    })
    
    
    app.get('/', (req, res) => { //When the main page loads, the esj file will render
        res.render('index.ejs')
    })

    /*

    app.post('/nodes', (req, res) => {
        nodeCollection.insertOne(req.body)
          .then(result => {
            console.log(req.body._id)
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })

    app.put('/nodes', (req, res) => {
      nodeCollection.updateOne({_id: ObjectID(req.body.id)},
      { 
        $set: {
          x: req.body.x,
          y: req.body.y,
          time: req.body.time,
          name: req.body.name,
          text: req.body.text
        }
      })
      .then(result => {
        res.json('Success')
      })
      .catch(error => console.error(error))
    })
    
    
    app.delete('/nodes', (req, res) => {
      nodeCollection.deleteOne(
        { _id: ObjectId(req.body.id) }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No nodes to delete')
          }
          res.json(`Deleted node`)
        })
        .catch(error => console.error(error))
    })
    */

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    
    /*
    app.delete('/nodes', (req, res) => {
      nodeCollection.deleteMany(
        { }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No nodes to delete')
          }
          res.json(`Deleted node`)
        })
        .catch(error => console.error(error))
    })
    */
    
    
  })
  .catch(console.error)