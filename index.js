const express=require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors')
require('dotenv').config();
const app=express();
const port=process.env.PORT||5000
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.bw2yndc.mongodb.net/?retryWrites=true&w=majority`;

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

    const AddTaskCollection=client.db('TaskManagement').collection('Addtask')


    app.post("/addtask", async (req, res) => {
        const task = req.body;
        const result = await AddTaskCollection.insertOne(task);
      
        res.send(result);
      });

      app.get('/addtask', async (req, res) => {
        console.log(req.query.email);
        let query={}
        if (req.query?.email){
          query={email: req.query.email}
        }
        const result = await AddTaskCollection.find(query).toArray();
        res.send(result);
    })

   



    app.put("/donetask/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          done: true,
        },
      };
      const result = await AddTaskCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    app.put("/undonetask/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          done: false,
        },
      };
      const result = await AddTaskCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    app.put("/edittask/:id", async (req, res) => {
      const id = req.params.id;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          task: req.body.task,
        },
      };
      const result = await AddTaskCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AddTaskCollection.deleteOne(query);
      res.send(result);
    });

      
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})