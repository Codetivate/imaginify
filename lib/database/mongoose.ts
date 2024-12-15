// Import mongoose and Mongoose types from the mongoose package
import mongoose, { Mongoose } from "mongoose";

// Load MongoDB URL from environment variables (for security reasons, sensitive data is stored in environment variables)
const MONGODB_URL = process.env.MONGODB_URL;

// Define an interface to make TypeScript happy by declaring a type for the cached connection and promise
interface MongooseConnection {
  conn: Mongoose | null;  // 'conn' stores the actual connection to the database, initially null
  promise: Promise<Mongoose> | null;  // 'promise' stores the promise of establishing the connection, initially null
}

// Use a global variable to cache the connection in the global scope to avoid multiple connections in serverless environments
let cached: MongooseConnection = (global as any).mongoose;  // 'global' refers to the global scope in Node.js

// If the 'cached' object doesn't exist in the global scope, create it (only executed the first time)
if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,   // No active connection initially
    promise: null // No promise to establish connection initially
  };
}

// Export a function that establishes a connection to the MongoDB database
export const connectToDatabase = async () => {
  // If there's already an active database connection, return it (avoiding multiple connections)
  if (cached.conn) 
    return cached.conn;

  // If the MongoDB URL is missing, throw an error (this is a safeguard)
  if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');
  
  // If there's no existing connection promise, create one by calling mongoose.connect (async operation)
  cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
    dbName: 'Imaginify',        // The name of the database you're connecting to
    bufferCommands: false       // Disable buffering commands when disconnected (to prevent issues in serverless environments)
  });

  // Wait for the promise to resolve and store the connection in 'cached.conn' so future calls use the same connection
  cached.conn = await cached.promise;

  // Return the active connection
  return cached.conn;
};



/*
Explanation:
Serverless Environment Context: In Next.js, especially when deployed in serverless environments, the server may be recreated with each request. This makes it crucial to avoid creating multiple connections to the database with each request.

Connection Caching: The code caches the connection using a global variable (cached) to reuse the same MongoDB connection across multiple requests, improving performance and avoiding connection limits.

Mongoose Connection: The mongoose.connect function establishes a connection to MongoDB, and the connection is saved in cached.conn.

Error Handling: If the environment variable MONGODB_URL is missing, the code throws an error to alert the developer.

TypeScript: The interface MongooseConnection ensures proper type checking to avoid errors when working with connections and promises in TypeScript.



Sum up:
Think of it like a restaurant with a waiter (the database connection).

Without Caching (No Reuse):
Every time a customer (request) arrives, you hire a new waiter just for them. Once the customer is done, the waiter leaves. For every new customer, you have to find a new waiter. This takes time and resources, especially if many customers show up at once, and you may run out of waiters (hit a rate limit).

With Caching (Reuse):
You hire one waiter (connection) and they serve all customers throughout the day. Every time a new customer (request) arrives, the same waiter takes care of them. This is more efficient, faster, and you don't run out of waiters because you're reusing the same one for multiple customers (requests).

In the same way, reusing a database connection for multiple requests saves time and resources, and avoids hitting connection limits.


*/