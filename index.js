const express = require('express')
require('dotenv').config()
const cors=require('cors')
const port=process.env.PORT || 3000;


const app=express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufivfja.mongodb.net/?appName=Cluster0`;
app.get('/', (req,res)=>{
    res.send("Welcome to Surver")
})


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
  
    await client.connect();
    const db=client.db('FinEaseDB')
const TransactionCollection=db.collection('Transactions')


    
// add transaction API

//API for post
app.post('/add-transaction', async(req,res)=>{
  const NewTransaction=req.body
  const result=await TransactionCollection.insertOne(NewTransaction)
  res.send(result)
})


//API for get

app.get('/add-transaction',  async(req,res)=>{
  const email=req.query.email
  query={}
  if(email){
    query.email=email
  }
  const cursor=TransactionCollection.find(query).sort({amount:-1})
  const result=await cursor.toArray()
  res.send(result)
})

//API get by ID
app.get('/transactions/:id', async(req,res)=>{
  const id=req.params.id
  const quary={_id: new ObjectId(id)}
  const result= await TransactionCollection.findOne(quary).sort({amount:1})
  res.send(result)
})


//Delete Data by ID
app.delete('/transactions/:id', async(req,res)=>{
  const id=req.params.id
  const quary={_id:new ObjectId(id)}
  const result=await TransactionCollection.deleteOne(quary)
  res.send(result)
})

//Edit Data
app.patch('/transactions/:id', async (req,res)=>{
       const id=req.params.id
       const UpdateTransaction=req.body
    const quary={_id:new ObjectId(id)}
    const update={
        $set:{
          
        type: UpdateTransaction.type,
        category: UpdateTransaction.category,
        amount: UpdateTransaction.amount,
        description: UpdateTransaction.description,
        date: UpdateTransaction.date,
        email: UpdateTransaction.email,
        name: UpdateTransaction.name,
      
        }
    }
    const result= await TransactionCollection.updateOne(quary,update)
    res.send(result)
})



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);



//My port listeniing 

app.listen(port,()=>{
    console.log(`port is running on - ${port}`);
    
})


