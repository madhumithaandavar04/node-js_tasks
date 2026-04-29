import mongoose from "mongoose"
//user schema
const userSchema = new mongoose.Schema({
  employeeId: {
    type: Number,
    required: true
  },
  realName: {
    type: String,
    required: true
  },
  nickName: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  hobbies: {
    type: [{ type: String }],
    required: true
  }
})
//create user model
const User = mongoose.model('User', userSchema);
export default User;