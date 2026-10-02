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

 tags:[String],

 // SEO: the main phrase this page targets, plus secondary phrases. Used for
 // the keywords meta tag, search ranking and keyword-cannibalisation checks.
 focusKeyword:{
  type:String,
  lowercase:true,
  trim:true,
  default:""
 },

 keywords:[String],

 // sha1 of the normalised plain text — catches exact re-uploads cheaply.
 contentHash:{
  type:String,
  index:true
 },

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

 // Generate the slug once, on creation (or if somehow missing). It must
 // stay stable afterwards — it's the public URL. Regenerating on every
 // save previously mutated it on each edit (the uniqueness check matched
 // the document itself), breaking the canonical URL of published tutorials.
 if(this.title && (this.isNew || !this.slug)){

  let slug = slugify(this.title,{
   lower:true,
   strict:true
  });

  const existingTutorial = await mongoose.models.Tutorial.findOne({
   slug,
   _id: { $ne: this._id }
  });

  if(existingTutorial){
   slug = slug + "-" + Date.now();
  }

  this.slug = slug;

 }

});


// Weighted full-text index for public search: a hit in the title or SEO
// keywords outranks a passing mention in the body.
tutorialSchema.index(
 { title:"text", focusKeyword:"text", keywords:"text", tags:"text", excerpt:"text", content:"text" },
 {
  name:"tutorial_search",
  weights:{ title:10, focusKeyword:8, keywords:6, tags:5, excerpt:3, content:1 }
 }
);

export default mongoose.model("Tutorial",tutorialSchema);