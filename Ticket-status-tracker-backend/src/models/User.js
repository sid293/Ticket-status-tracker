import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  userId: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  }
}, {
  timestamps: true
});

// Generate userId and hash password before saving
userSchema.pre("save", async function(next) {
  // Generate userId if it doesn't exist
  if (!this.userId) {
    try {
      const lastUser = await this.constructor.findOne({ userId: { $exists: true, $ne: null } }, { userId: 1 }, { sort: { userId: -1 } });
      const nextId = lastUser && lastUser.userId ? parseInt(lastUser.userId) + 1 : 1;
      this.userId = nextId.toString();
    } catch (error) {
      return next(error);
    }
  }
  
  // Hash password if it's modified
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
