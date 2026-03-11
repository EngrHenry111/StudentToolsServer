import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({

 semester:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Semester"
 },

 courseCode:String,

 unit:Number,

 grade:String

});

export default mongoose.model("Course",courseSchema);