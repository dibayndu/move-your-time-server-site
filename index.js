const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

//mideleware
app.use(cors());
app.use(express.json());

//Database conncetion Mongo

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fazvm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try{
        await client.connect();
        const database = client.db('moveyourtime1');
        const collectionUser = database.collection('services');

        //GET API
        app.get('/services', async(req,res) => {
            const cursor = collectionUser.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/service/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const singlePackage = await collectionUser.findOne(query);
            res.send(singlePackage);
        })
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req,res) => {
    res.send('Node server is runniung');
})


app.listen(port, () => {
    console.log('Listening to port', port);
})