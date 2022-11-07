const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middlewar
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster2.y3njyog.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run (){

try{
    const serviceCollection = client.db("skyPhotography").collection("events");

    // load data for service section 
    app.get('/service', async(req, res) =>{
        const query = {};
        const cursor = serviceCollection.find(query).limit(3);
        const result = await cursor.toArray();
        res.send(result)
    })





}
finally{

}

}
run().catch((err) => console.log(err))




app.get('/', (req, res)=>{
    res.send('server is running');
})

app.listen(port, ()=>{
    console.log(`Listing to Port ${port}`)
})



