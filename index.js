const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const commentsCollection = client.db("allComments").collection("comments");
    // load data for service section 
    app.get('/service', async(req, res) =>{
        const query = {};
        const cursor = serviceCollection.find(query).limit(3);
        const result = await cursor.toArray();
        res.send(result)
    })
    // load data for All services page
    app.get('/allservices', async(req, res)=>{
        const query ={};
        const cursor = serviceCollection.find(query)
        const result = await cursor.toArray();
        res.send(result)
    })
    // load single service by id
    app.get('/services/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id : ObjectId(id)}
        const result = await serviceCollection.findOne(query)
        res.send(result);
    })
    //load all comments & query (service name)
    app.get('/allcomments', async(req, res)=>{
        let query ={};
        if(req.query.service){
            query = {
                service : req.query.service
            }
        }
        const cursor = commentsCollection.find(query)
        const result = await cursor.toArray();
        res.send(result)
    })
    // store comments in database
    app.post('/allcomments', async(req, res)=>{
        const comments = req.body;
        const result = await commentsCollection.insertOne(comments)
        res.send(result);
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



