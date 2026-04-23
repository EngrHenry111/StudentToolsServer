// ADD THIS FILE

import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema({

 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 date:{
  type:String, // YYYY-MM-DD
  required:true
 },

 count:{
  type:Number,
  default:0
 }

},{timestamps:true});

// prevent duplicate per day per user
aiUsageSchema.index({user:1,date:1},{unique:true});

export default mongoose.model("AiUsage",aiUsageSchema);