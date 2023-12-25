const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// middleware 

app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://taskManager:NX3d5MbQPmulOvj7@cluster0.crzw9rp.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection


    const tasksCollection = client.db("TaskManagement").collection("tasks");


    app.get('/tasks',async(req,res)=>{
      const result =await tasksCollection.find().toArray();
      res.send(result)
    })

    app.get("/tasks/:id",async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId (id)}
      const result = await tasksCollection.findOne(query)
      res.send(result)
    })

    app.post("/tasks",async(req,res)=>{
        const task = req.body
        const result = await tasksCollection.insertOne(task);
        res.send(result);

    })

    app.put("/tasks/:id",async(req,res)=>{
      const id = req.params.id
      const data = req.body
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          deadline: data.deadline
        },
      };
      const result = await tasksCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    app.delete("/tasks/:id",async(req,res)=>{
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
    const result = await tasksCollection.deleteOne(query);
    res.send(result)
    })


     // task ongoing
     app.patch("/tasks/ongoing/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: "Ongoing",
        },
      };
      const result = await tasksCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

     // task complete
     app.patch("/tasks/complete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: "Completed",
        },
      };
      const result = await tasksCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Task Management is Running....')
  })
  
  app.listen(port, () => {
    console.log(`Task Management is running on port ${port}`)
  })