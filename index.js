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
        const cartItems = client.db("TheJewelryArmy").collection("cartItems");


        // ------------------->>>>>> Index was did for 1 time then I turn it off.
        // const indexKeys = { name: 1 };
        // const indexOptions = { name: "searchingToys" };
        // const indexCreating = await ShopByCategory.createIndex(indexKeys, indexOptions);

        app.get('/all-jewelry', async (req, res) => {

            const limitIs = parseInt(req.query.limit)
            const categoryName = req.query.categoryname;
            const jewelryName = req.query.searchjewelry;
            const getEamil = req.query.email;
            const sortJewelry = req.query.sortjewelry;

            let limit = 100000000;
            let query = {};
            let sortIs = {};

            if (limitIs) {
                limit = limitIs;
            }

            if (categoryName) {
                query = { subCategory: categoryName };
            }

            if (jewelryName) {
                query = { name: { $regex: jewelryName, $options: 'i' } };
            }

            if (getEamil) {
                query = { sellerEmail: getEamil }
            }

            if (sortJewelry) {
                sortIs = { price: sortJewelry }
            }

            const cursor = ShopByCategory.find(query).limit(limit).sort(sortIs);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/all-jewelry', async (req, res) => {
            const allJewelry = req.body;
            const result = await ShopByCategory.insertOne(allJewelry);
            res.send(result);
        })

        app.get('/all-jewelry/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await ShopByCategory.findOne(query);
            res.send(result)
        })

        app.put('/all-jewelry/:id', async (req, res) => {
            const id = req.params.id;
            const updatedJewelry = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const jewelry = {
                $set: {
                    price: updatedJewelry.price,
                    quantity: updatedJewelry.quantity,
                    details: updatedJewelry.details,
                },
            };
            const result = await ShopByCategory.updateOne(filter, jewelry, options);
            res.send(result);
        })

        app.delete('/all-jewelry/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await ShopByCategory.deleteOne(filter);
            res.send(result);
        })


        app.post('/cart', async (req, res) => {
            const cartItem = req.body;
            const result = await cartItems.insertOne(cartItem);
            res.send(result);
        })
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    const all_Jewelry = 'https://jewelry-shop-client-side.vercel.app/all-jewelry'
    const single_Jewelry = 'https://jewelry-shop-client-side.vercel.app/all-jewelry/65217506933bad4281ec0001'
    const text = { all_Jewelry, single_Jewelry }
    res.send({ text })
})

app.listen(port, () => {
    console.log("Server is running on port: ", port);
})