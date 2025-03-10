
// the script is for converting the id to objectid

const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();
async function fixIds() {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j4q9n9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; // Replace with your MongoDB URI
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("myRestaurantDb"); // Replace with your DB name
        const collection = db.collection("menu"); // Replace with your collection name

        const documents = await collection.find().toArray();

        for (let doc of documents) {
            if (typeof doc._id === "string") {
                const newId = new ObjectId(doc._id); // Convert to ObjectId
                const newDoc = { ...doc, _id: newId }; // Create a new document with ObjectId

                await collection.insertOne(newDoc); // Insert new document
                await collection.deleteOne({ _id: doc._id }); // Delete old document

                console.log(`Updated document: ${doc._id} -> ${newId}`);
            }
        }
        console.log("Successfully converted all string _id values to ObjectId.");
    } catch (error) {
        console.error("Error updating _id:", error);
    } finally {
        await client.close();
    }
}

fixIds();
