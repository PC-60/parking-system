const express = require('express');
const { MongoClient, Long } = require('mongodb');
const cors = require('cors');
const path = require("path");
require("dotenv").config(); // ✅ ADDED

const app = express();
const PORT = process.env.PORT || 8082;

app.use(cors());
app.use(express.json());

const _dirname = path.dirname("");
const buildpath = path.join(_dirname, "../parking_system/build");
app.use(express.static(buildpath));
console.log("website started");

// ❌ OLD
// const uri = "mongodb://127.0.0.1:27017/parking";

// ✅ NEW
const uri = process.env.MONGO_URI;

const client = new MongoClient(process.env.MONGO_URI, {
  tls: true
});
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        throw err;
    }
}

// ✅ FIXED (avoid duplicate collection error)
async function createCollections() {
  try {
      const database = client.db("ParkingSystem");

      const collections = await database.listCollections().toArray();
      const names = collections.map(c => c.name);

      if (!names.includes("USER")) await database.createCollection("USER");
      if (!names.includes("parking")) await database.createCollection("parking");
      if (!names.includes("parkstatus")) await database.createCollection("parkstatus");

      console.log("Collections checked/created successfully");
  } catch (err) {
      console.error("Error creating collections:", err);
      throw err;
  }
}

app.post('/signup', async (req, res) => {
    try {
        const userCollection = client.db("ParkingSystem").collection("USER");
        const result = await userCollection.insertOne({
            Fname: req.body.username[0],
            Email: req.body.email[0],
            Upassword: req.body.password[0]
        });
        res.json(result);
    } catch (err) {
        console.error("Error:", err);
        res.json({ error: "An error occurred" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const userCollection = client.db("ParkingSystem").collection("USER");
        const user = await userCollection.findOne({ Email: req.body.email[0], Upassword: req.body.password[0] });
        if (user) {
            res.json("Success");
        } else {
            res.json("Failed");
            console.log("Not user");
        }
    } catch (err) {
        console.error("Error:", err);
        res.json({ error: "An error occurred" });
    }
});

app.post("/Home", async (req, res) => {
    try {
        const parkingCollection = client.db("ParkingSystem").collection("parking");
        const result = await parkingCollection.insertOne({
            date1: req.body.Date[0],
            park: req.body.Park[0],
            Vechileno: req.body.Vechile_no[0],
            model: req.body.Model[0],
            TimeA: req.body.aTime[0],
            TimeB: req.body.dTime[0],
        });
        res.json(result);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/Home/Slots', async (req, res) => {
    try {
        const parkingCollection = client.db("ParkingSystem").collection("parkstatus");
        const results = await parkingCollection.find({}).toArray();
        res.json(results);
    } catch (err) {
        console.error('Error fetching seat data:', err);
        res.status(500).json({ error: 'Failed to fetch seat data' });
    }
});

app.post("/Home/Slots", async (req, res) => {
    try {
        const parkingCollection = client.db("ParkingSystem").collection("parkstatus");

        const result = await parkingCollection.insertOne({
            slot: Long.fromNumber(req.body.selectedSlot),
            Vechileno: req.body.Vechile_no[0],
            startTime: req.body.arr[0],
            endTime: req.body.dep[0],
        });

        console.log("Data inserted successfully");
        res.json(result);
    } catch (err) {
        console.error("Error inserting data into the database: " + err);
        res.status(500).json({ error: "Internal server error" });
    }
});

async function startServer() {
    try {
        await connectToMongoDB();
        await createCollections();

        app.listen(PORT, () => {
            console.log('listening ', PORT);
        });
    } catch (err) {
        console.error("Error starting server:", err);
    }
}

startServer();
