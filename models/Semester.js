import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({

 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 semesterName:String,

 cgpa:Number,

 totalUnits:Number

},{timestamps:true});

export default mongoose.model("Semester",semesterSchema);