import {MongoClient, MongoClientOptions} from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI || '';
const options: MongoClientOptions = <MongoClientOptions>{};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any)._mongoClientPromise = client.connect();
    }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    clientPromise = (global as any)._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
