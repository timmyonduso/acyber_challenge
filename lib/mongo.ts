import { MongoClient, ServerApiVersion } from 'mongodb';

const uri: string | undefined = process.env.MONGODB_URI;
const options = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }

if (!uri) {
  throw new Error('Add Mongo URI to .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Declare a global variable to persist the client instance in development
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
