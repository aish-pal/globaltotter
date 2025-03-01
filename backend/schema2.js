import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    referralCode: {
      type: Number, // Changed to Number type
      required: true,
      unique: true, // Ensures referral codes are unique
    },
    score: {
      type: Number,
      default: 0, // Default score is 0
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);

// Create the model with the collection name "users"
const UserModel = mongoose.connection
  .useDb("backend") // Use the "backend" database
  .model("users", userSchema); // Collection name is "users"

// Export the model
export default UserModel;
