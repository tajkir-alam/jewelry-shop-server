const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
// app.use(cors());
const corsConfig = {
    origin: '*',
    Credential: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig));

app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h2ziqne.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    // Server Auto off / can't get data error solution code
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7) 
        // await client.connect();

        const ShopByCategory = client.db("TheJewelryArmy").collection("ShopByCategory");


        // ------------------->>>>>> Index was did for 1 time then I turn it off.
        // const indexKeys = { name: 1 };
        // const indexOptions = { name: "searchingToys" };
        // const indexCreating = await ShopByCategory.createIndex(indexKeys, indexOptions);

       
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    const all_Jewelry = 'https://trov-titans-server-data.vercel.app/alltoys'
    const single_Jewelry = 'https://trov-titans-server-data.vercel.app/alltoys/64684820d42658e60f48d02c'
    const text = { all_Jewelry, single_Jewelry }
    res.send({ text })
})

app.listen(port, () => {
    console.log("Server is running on port: ", port);
})