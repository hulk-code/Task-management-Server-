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


    app.post("/addtasks", async (req, res) => {
        const task = req.body;
        const result = await AddTaskCollection.insertOne(task);
        // sendInitialEmail(task.email, task.task);
        // scheduleFollowUpEmails(task._id, task.email, task.task);
        res.send(result);
      });

      app.get('/addtasks', async (req, res) => {
        const result = await AddTaskCollection.find().toArray();
        res.send(result);
    })

      

      app.get('/addtasks/:email' ,  async (req , res) =>{
        const email=req.params.email
        const query={email :email}
       const result = await AddTaskCollection.findOne(query)
     res.send(result);
    })

      
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