import { MongoClient, ServerApiVersion } from 'mongodb';
const uri ="mongodb+srv://pedrogomeslycee_db_user:test1234@mycontacts.a80kk2e.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  return client.db('MyContacsUser');
}

export default connectDB;