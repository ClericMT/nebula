const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

//MongoDB connection string
const connectionString = 'mongodb+srv://clericmt:St4rw4rs@cluster0.rmuwu.mongodb.net/test?retryWrites=true&w=majority'

//Check if server's connected
app.listen(3000, function() {
    console.log('listening on 3000')
  })

//connect to my dataBase
MongoClient.connect(connectionString, { useUnifiedTopology: true })
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


    
    app.get('/nodes', (req, res) => {
      db.collection('nodes').find().toArray()
        .then(results => {
          res.send({ nodes: results }) //renders results (also add <%= nodes %> to index.ejs)
        })

        .catch(error => console.error(error))
    })
    
    
    app.get('/', (req, res) => {
      db.collection('nodes').find().toArray()
        .then(results => {
          res.render('index.ejs', { nodes: results }) //renders results (also add <%= nodes %> to index.ejs)
        })
        .catch(error => console.error(error))
    })

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