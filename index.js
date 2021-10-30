const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config()

app.use(express.json());
app.use(cors());


const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iascy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("bdTravelAndTours");
        const travelCollection = database.collection("destination");
        const newsCollection = database.collection("news");
        const confirmOrderCollection = database.collection("confirmOrder")
        // create a document to insert
        // GET all destination API
        app.get('/destination', async (req, res) => {
            const cursor = travelCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // GET single destination API
        app.get('/destination/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await travelCollection.findOne(query);
            res.send(result);
        })
        // POST single destination API
        app.post('/destination/:id', async (req, res) => {
            const order = req.body;
            const result = await confirmOrderCollection.insertOne(order);
            res.json(result);
        })
        // POST single add tour API
        app.post('/destination', async (req, res) => {
            const postbody = req.body;
            const result = await travelCollection.insertOne(postbody);
            res.json(result);
        })
        app.get('/orders', async (req, res) => {
            const cursor = confirmOrderCollection.find({})
            const result = await cursor.toArray();
            res.send(result);
        })
        // POST confirm signle order API
        app.post('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const confirmOrder = req.body;
            // console.log('this is', confirmOrder);
            const result = await confirmOrderCollection.insertOne(confirmOrder)
            res.send(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await confirmOrderCollection.deleteOne(query);
            res.json(result);

        })

        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            console.log(body);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: body.status
                }
            }
            console.log(updateDoc);
            const result = await confirmOrderCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })

        // GET all news API
        app.get('/news', async (req, res) => {
            const cursor = newsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('this is travel server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});