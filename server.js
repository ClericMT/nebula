


// create an express app
const express = require("express");
const app = express();

const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const port = 3000;

const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://clericmt:St4rw4rs@cluster0.rmuwu.mongodb.net/test?retryWrites=true&w=majority";
// use the express-static middleware
app.use(express.static("public"));

// define the first route
app.get("/", async function (req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  app.set('view engine', 'ejs') //sets EJS as template engine
  app.use(bodyParser.urlencoded({ extended: true }))  // Make sure you place body-parser before your CRUD handlers!
  app.use(bodyParser.json()) //So server can read JSON
  app.use(express.static('public')) //This allows server to serve files in public folder
  
  try {
    await client.connect();

    const database = client.db('node-db');
    const collection = database.collection('nodes');

    app.get('/nodes', (req, res) => {
      db.collection('nodes').find().toArray()
        .then(results => {
          res.send({ nodes: results }) //renders results (also add <%= nodes %> to index.ejs)
        })

        .catch(error => console.error(error))
    })
  } catch(err) {
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));