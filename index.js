const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middlewar
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster2.y3njyog.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//JWT token verify function
function verifyJWT(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
       return  res.status(401).send({message : 'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , function(err, decoded){
        if(err){
            res.status(403).send({message: 'unauthorized access'})
        }
        req.decoded = decoded;
        next();
    })
}




async function run (){

try{
    const serviceCollection = client.db("skyPhotography").collection("events");
    const commentsCollection = client.db("allComments").collection("comments");
    // load data for service section 
    app.get('/service', async(req, res) =>{
        const query = {};
        const cursor = serviceCollection.find(query).sort({ _id : -1})
        .limit(3);
        const result = await cursor.toArray();
        res.send(result)
    })
    // load data for All services page
    app.get('/allservices', async(req, res)=>{
        const query ={};
        const cursor = serviceCollection.find(query).sort({ _id : -1})
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
    //load only user comments
    app.get('/allcomments/user', verifyJWT, async(req, res)=>{
        const decoded = req.decoded;
        if(decoded.email !== req.query.email){
            res.status(403).send({message: 'unauthorized access'})
        }
        let query ={};
        if(req.query.email){
            query = {
                email : req.query.email
            }
        }
        const cursor = await commentsCollection.find(query)
        const result = await cursor.toArray();
        res.send(result)
    })

    //for JWT
    app.post('/jwt', (req, res)=>{
        const user = req.body;
        const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET , {expiresIn: '1h'});
        res.send({token})
    })




    // store comments in database
    app.post('/allcomments', async(req, res)=>{
        const comments = req.body;
        const result = await commentsCollection.insertOne(comments)
        res.send(result);
    });
    // add new service in database
    app.post('/allservices',verifyJWT, async(req, res)=>{
        const addServices = req.body;
        const result = await serviceCollection.insertOne(addServices)
        res.send(result)
    })


    //delete comment
    app.delete('/allcomments/:id', async(req, res)=>{
        const id = req.params.id ;
        const query ={_id : ObjectId(id)}
        const result = await commentsCollection.deleteOne(query);
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



