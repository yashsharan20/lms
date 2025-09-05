import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["student","instructor"],
        default:"student"
    },
    enrolledCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }],
    photoUrl:{
        type:String,
        default:""
    }
},{timestamps:true});

const User = mongoose.model("User",userSchema);
export default User;