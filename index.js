const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nl16z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("freshValley").collection("products");
  const orderCollection = client.db("freshValley").collection("orders");
  
    app.get('/products', (req, res) => {
       productCollection.find()
       .toArray((err, products) => {
           res.send(products)
       }) 
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('adding new product:', newProduct);
        productCollection.insertOne(newProduct)
        .then(result => {
            console.log('insertedCount:', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
        console.log(newOrder);
    })

    app.get('/orders', (req, res) => {
        //console.log(req.query.email);
        orderCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0)
        })
    })

  //client.close();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})





app.listen(port);