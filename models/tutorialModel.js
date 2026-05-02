import mongoose from "mongoose";
import slugify from "slugify";

const tutorialSchema = new mongoose.Schema({

 title:{
  type:String,
  required:true
 },

 slug:{
  type:String,
  unique:true
 },

 content:{
  type:String,
  required:true
 },
 // ADD this field



 excerpt:String,

 category:String,
 
 topic: {
 type: String,
 lowercase: true
},

 image:String,

 tags:[String],// ADD THIS inside tutorialSchema

status: {
 type: String,
 enum: ["draft", "published"],
 default: "draft"
},

views:{
 type:Number,
 default:0
}
},{timestamps:true});


tutorialSchema.pre("save", async function(){

 if(this.title){

  let slug = slugify(this.title,{
   lower:true,
   strict:true
  });

  const existingTutorial = await mongoose.models.Tutorial.findOne({ slug });

  if(existingTutorial){
   slug = slug + "-" + Date.now();
  }

  this.slug = slug;

 }

});


export default mongoose.model("Tutorial",tutorialSchema);