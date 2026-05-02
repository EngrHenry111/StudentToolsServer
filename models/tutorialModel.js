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

topic:{
 type:String,
 default:"general"
},

 excerpt:String,

 category:String,

 image:String,

 tags:[String],
 
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