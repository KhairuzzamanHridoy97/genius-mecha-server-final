const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bttmq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('geniusCarMechaDB');
        const serviceCollection = database.collection('services');

        //GET API
        app.get('/services',async(req,res)=>{
            const cursor = serviceCollection.find({});
            const services =await cursor.toArray();
            res.send(services);
        })

        //Get Single Service
        app.get('/singleServices/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.json(service);
            console.log('get the target id',id)
        });

        //POST API
        app.post('/services',async(req,res)=>{
            const service=req.body;
            const result = await serviceCollection.insertOne(service);
            console.log('hit the post api',service);


            res.send('hit the post api')
            res.json(result);
            console.log(result)
        });

        //Delete API
        app.delete('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);

        })
    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Running Genius Car Mechanic Server');
})

app.get('/hello',(req,res)=>{
    res.send('Hello Updated Here');
})

// app.listen(port,()=>{
//     console.log('Running Genius Car Mechanic Server on ',port);
// })

app.listen(process.env.PORT || port); 

/* 
1. heroku account open
2. heroku software install

--Every Project
1. git init 
2. gitingone (node_modules,.env)
3. push everything to git
4. make sure you have this script :"start":"node index.js"
5. make sure: put process.env.PORT in front of your port number
6. heroku login 
7. heroku create (only one time for a project)
8. command: git push heroku main
-- --
UPDATE:
1. save everything check locally
2. git add. git ,git commit-m" " ,git push
3. git push heroku main 
*/