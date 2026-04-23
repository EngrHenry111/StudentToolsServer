import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

 name:{
  type:String,
  required:true
 },

 email:{
  type:String,
  required:true,
  unique:true
 },

 password:{
  type:String,
  required:true
 },

 // MODIFY THIS PART IN models/User.js

plan:{
 type:String,
 enum:["free","pro"],
 default:"free"
},

subscriptionStatus:{
 type:String,
 enum:["active","inactive"],
 default:"inactive"
},

subscriptionExpiry:{
 type:Date
},

},{timestamps:true});

export default mongoose.model("User",userSchema);