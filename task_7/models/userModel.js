import mongoose from "mongoose"
import bcrypt from "bcryptjs";

//user schema
const userSchema = new mongoose.Schema({
  employeeId: {
    type: Number,
    unique: true,
    required: [true, "Please provide employee id"]
  },
  realName: {
    type: String,
    required: [true, "Please provide real name"]
  },
  nickName: {
    type: String,
    required: [true, "Please provide nick name"]
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Please provide password"],
  },
  dob: {
    type: Date,
    required: [true, "Please provide dob"]
  },
  token: {
    type: String,
  },
  hobbies: {
    type: [{ type: String }],
    required: [true, "Please provide hobbies"]
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: "user"
  }
})

//runs before saving any user
userSchema.pre('save', async function () {
  const user = this;
  if (!user.isModified('password')) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(user.password, salt);
    user.password = hashed;
  } catch (error) {
    throw error;
  }
})

//create user model
const User = mongoose.model('User', userSchema);
export default User;