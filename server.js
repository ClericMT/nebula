


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
  
  try {
    await client.connect();

    const database = client.db('node-db');
    const collection = database.collection('nodes');

    // Query for a movie that has the title 'Back to the Future'
    const query = { name: 'Jesse' };
    const cursor = await collection.aggregate([
      { $match: query },
      { $sample: { size: 1 } },
    ]);

    const movie = await cursor.next();

    return res.json(movie);
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