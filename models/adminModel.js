import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

 email:{
  type:String,
  required:true,
  unique:true
 },

 password:{
  type:String,
  required:true
 },
 status: {
 type: String,
 enum: ["draft", "published"],
 default: "published"
}

});

export default mongoose.model("Admin",adminSchema);
