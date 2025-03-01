import express from "express"
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config'; // Load environment variables from .env
import connectDB from './db.js'; // Import the connectDB function
import City from './schema.js'; 
import UserModel from "./schema2.js";



const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log('MONGO_URI:', process.env.MONGO_URI); // Debugging log

// Middleware
app.use(cors());
app.use(express.json());



// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express API!');
});



// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.log('Server error:', err);
});



app.get("/cities/random", async (req, res) => {
    try {
      const randomCities = await City.aggregate([{ $sample: { size: 3 } }]); // Get 3 random cities
      res.json(randomCities); // Send to client-side
    } catch (err) {
      console.error("Error fetching cities:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  app.post("/users", async (req, res) => {
    try {
      const { name, referralCode } = req.body;
  
      // Check if required fields are provided
      if (!name || !referralCode) {
        return res.status(400).json({ message: "Name and your referral code are required." });
      }
  
      // Create a new user with the given name and referral code
      const newUser = new UserModel({ name, referralCode });
  
      await newUser.save(); // Save user to database
  
      res.status(201).json({ message: "User created successfully!" });
  
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  });
  
  // ✅ GET: Retrieve score using friend's referral code (if exists)
  app.get("/users/score/:friendReferralCode", async (req, res) => {
    try {
      const { friendReferralCode } = req.params;
  
      if (!friendReferralCode) {
        return res.status(400).json({ message: "Friend's referral code is required." });
      }
  
      const referredUser = await UserModel.findOne({ referralCode: friendReferralCode });
  
      if (!referredUser) {
        return res.status(404).json({ message: "Referral code not found." });
      }
  
      res.json({ referredUserScore: referredUser.score });
  
    } catch (error) {
      res.status(500).json({ message: "Error fetching score", error: error.message });
    }
  });