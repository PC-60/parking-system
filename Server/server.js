const express = require('express');
const { MongoClient,Long } = require('mongodb');
const cors = require('cors');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8082;

app.use(cors());
app.use(express.json());

const _dirname = path.dirname("");
const buildpath = path.join(_dirname, "../parking_system/build");
app.use(express.static(buildpath));
console.log("website started");

const uri = "mongodb://127.0.0.1:27017/parking";
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        throw err; // Propagate the error so it can be handled externally
    }
}

async function createCollections() {
  try {
      const database = client.db("ParkingSystem");
      
      // Create collections
      await database.createCollection("USER");
      await database.createCollection("parking");
      await database.createCollection("parkstatus");
      // Add more collections if needed
      
      console.log("Collections created successfully");
  } catch (err) {
      console.error("Error creating collections:", err);
      throw err; // Propagate the error so it can be handled externally
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
        // Handle any errors that occur during server startup
    }
}

startServer();








// const express=require('express');
// const mysql=require('mysql');
// const cors =require('cors');
// const path=require("path");
// const app = express();
// const PORT=8082;

// app.use(cors());
// app.use(express.json());

// const _dirname=path.dirname("");
// const buildpath = path.join(_dirname,"../parking_system/build");
// app.use(express.static(buildpath));


// // let PORT=process.env.PORT || 8081;
// const db=mysql.createConnection({
//     host:'parkdatabase.cry8gswoinym.us-east-1.rds.amazonaws.com',
//     user:'admin',
//     password:'Darshan29',
//     database: 'ParkingSystem',
//     port:3306
// })
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//   } else {
//     console.log('Connected to MySQL database!');
//   }
// });

// app.post('/signup',(req,res)=>{
//     const sql ='INSERT INTO USER(`Fname`,`Email`,`Upassword`) VALUES (?)';
//     const values = [
//         req.body.username,
//         req.body.email,
//         req.body.password
//     ]
//     db.query(sql,[values],(err,data)=>{
//         if(err){
//             return res.json('Error');
//         }
//         return res.json(data);
//     })
// })

// app.post('/login',(req,res)=>{
//     const sql ='SELECT * FROM USER WHERE `Email`=? AND `Upassword`=?';
//     db.query(sql,[req.body.email,req.body.password],(err,data)=>{
//         if(err){
//             return res.json('Error');
//         }
//         else if(req.body.email=='darshan.mahajan@gmail.com' && req.body.password=='Darshan@29')
//         {
//             return res.json('Admin');
//         }
//         if(data.length>0){
//             return res.json("Success");
//         }else{
//             return res.json('Failed');
//         }
//     })
// })


// app.post("/Home", (req, res) => {
//     const sql =
//       "INSERT INTO parking(date1, park, Vechileno, model, TimeA, TimeB) VALUES (?, ?, ?, ?, ?, ?)";
    
    
//     const values = [
//       req.body.Date, 
//       req.body.Park,
//       req.body.Vechile_no,  
//       req.body.Model, 
//       req.body.aTime, 
//       req.body.dTime, 
//     ];
  
//     db.query(sql, values, (err, data) => {
//       if (err) {
//         console.error("Error inserting data into the database: " + err);
//         res.status(500).json({ error: "Internal server error" });
//       } else {
//         console.log("Data inserted successfully");
//         res.json(data);
//       }
//     });
//   });

//   app.get('/Home/Slots', (req, res) => {
//     db.query('SELECT * FROM parkstatus', (err, results) => {
//       if (err) {
//         console.error('Error fetching seat data:', err);
//         res.status(500).json({ error: 'Failed to fetch seat data' });
//       } else {
//         res.json(results);
//       }
//     });
//   });

//   app.post("/Home/Slots", (req, res) => {
//     const sql =
//       "INSERT INTO parkstatus(slot,Vechileno,startTime,endTime) VALUES (?, ?, ?, ?)";
    
    
//     const values = [
//       req.body.selectedSlot, 
//       req.body.Vechile_no,
//       req.body.arr,  
//       req.body.dep,  
//     ];
    
  
//     db.query(sql, values, (err, data) => {
//       if (err) {
//         console.error("Error inserting data into the database: " + err);
//         res.status(500).json({ error: "Internal server error" });
//       } else {
//         console.log("Data inserted successfully");
//         res.json(data);
//       }
//     });
//   });
  

// app.listen(PORT,()=>{
//     console.log('listening ',PORT);
// })


