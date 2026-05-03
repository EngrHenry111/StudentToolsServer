import Tutorial from "../models/tutorialModel.js";

/*
Create Tutorial (minimal working version)
*/

export const createTutorial = async (req, res) => {
 try {

  // ✅ Normalize title
  const cleanTitle = req.body.title?.trim().toLowerCase();

  if (!cleanTitle) {
   return res.status(400).json({
    message: "Title is required"
   });
  }

  // ✅ Check duplicate
  const existing = await Tutorial.findOne({
    
   title: { $regex: `^${cleanTitle}$`, $options: "i" }
  });

  if (existing) {
   return res.status(400).json({
    message: "Tutorial with this title already exists"
   });
  }

  // ✅ Normalize category & topic
  const category = req.body.category?.toLowerCase().trim();
  const topic = req.body.topic?.toLowerCase().trim() || "general";
  

  if (!category) {
   return res.status(400).json({
    message: "Category is required"
   });
  }

  // ✅ Clean content text (for excerpt fallback)
  const cleanText = req.body.content.replace(/<[^>]+>/g, "");

  // ✅ Excerpt (optional)
  const excerpt =
   req.body.excerpt?.trim() ||
   cleanText.slice(0, 150);

  // ✅ Image (optional)
  let image = "";
  if (req.body.image && req.body.image.trim() !== "") {
   const img = req.body.image.trim();

   // Optional validation
   if (!img.startsWith("http")) {
    return res.status(400).json({
     message: "Image must be a valid URL"
    });
   }

   image = img;
  }

  // ✅ Tags (optional)
  const tags = Array.isArray(req.body.tags)
   ? req.body.tags
   : [];

  // ✅ CREATE TUTORIAL
  const tutorial = await Tutorial.create({
   status: req.body.status || "draft",
   title: req.body.title,
   content: req.body.content,
   category,
   topic,
   excerpt,
   image,
   tags
   
  });

  res.status(201).json(tutorial);

 } catch (error) {
  console.error("CREATE TUTORIAL ERROR:", error);
  res.status(500).json({
   message: error.message
  });
 }
};


/*
Get All Tutorials
*/

export const getTutorials = async (req, res) => {
 try {

  const page = Number(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const { category, topic } = req.query;

  // ✅ BUILD FILTER OBJECT
  const filter = {};

  if (category) {
   filter.category = category.toLowerCase();
  }

  if (topic) {
   filter.topic = topic.toLowerCase();
  }

  const tutorials = await Tutorial.find(filter)
   .sort({ createdAt: -1 })
   .skip(skip)
   .limit(limit);

  const total = await Tutorial.countDocuments(filter);

  res.json({
   tutorials,
   totalPages: Math.ceil(total / limit),
   currentPage: page
  });

 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};


/*
Search Tutorials
*/
export const searchTutorials = async (req,res)=>{

 try{

  const {q} = req.query;

  const tutorials = await Tutorial.find({

   $or:[
    {title:{$regex:q,$options:"i"}},
    {content:{$regex:q,$options:"i"}},
    {category:{$regex:q,$options:"i"}}
   ]

  }).limit(10);

  res.json(tutorials);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};

export const searchSuggestions = async (req,res)=>{

 try{

  const {q} = req.query;

  if(!q){
   return res.json([]);
  }

  const tutorials = await Tutorial.find({

   title:{$regex:q,$options:"i"}

  })
  .limit(5)
  .select("title slug");

  res.json(tutorials);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
/*
Get Tutorial By Slug
*/

// MODIFY THIS PART in tutorialController.js

export const getTutorialBySlug = async (req, res) => {

 try {

  let tutorial;

  // ✅ CHECK IF ID (Mongo ObjectId)
  if (req.params.slug.match(/^[0-9a-fA-F]{24}$/)) {

   tutorial = await Tutorial.findByIdAndUpdate(
    req.params.slug,
    { $inc: { views: 1 } },
    { new: true }
   );

  } else {

   tutorial = await Tutorial.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true }
   );

  }

  if (!tutorial) {
   return res.status(404).json({ message: "Tutorial not found" });
  }

  res.json(tutorial);

 } catch (error) {
  res.status(500).json({ message: error.message });
 }

};

// MODIFY THIS FUNCTION

export const getRelatedTutorials = async (req,res)=>{

 try{

  const { category, topic, id } = req.query;

  const tutorials = await Tutorial.find({
   category: category.toLowerCase(),
   topic: topic?.toLowerCase(),
   _id: { $ne: id }
  })
  .sort({views:-1})
  .limit(5);

  res.json(tutorials);

 }catch(error){

  res.status(500).json({message:error.message});

 }

};

export const getTrendingTutorials = async (req,res)=>{

 try{

  const tutorials = await Tutorial.find()
   .sort({views:-1})
   .limit(4);

  res.json(tutorials);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};


export const getCategories = async (req,res)=>{

 try{

  const categories = await Tutorial.distinct("category");

  res.json(categories);

 }catch(error){

  res.status(500).json({message:error.message});

 }

};


export const getTopicsByCategory = async (req,res)=>{

 try{

  const {category} = req.params;

  const topics = await Tutorial.distinct("topic",{
   category: category.toLowerCase()
  });

  res.json(topics);

 }catch(error){

  res.status(500).json({message:error.message});

 }

};

// ADD THIS

export const updateTutorial = async (req, res) => {
 try {

  const tutorial = await Tutorial.findById(req.params.id);

  if (!tutorial) {
   return res.status(404).json({ message: "Tutorial not found" });
  }

  tutorial.title = req.body.title || tutorial.title;
  tutorial.content = req.body.content || tutorial.content;
  tutorial.category = req.body.category || tutorial.category;
  tutorial.topic = req.body.topic || tutorial.topic;
  tutorial.excerpt = req.body.excerpt || tutorial.excerpt;
  tutorial.image = req.body.image || tutorial.image;
  tutorial.tags = req.body.tags || tutorial.tags;
  tutorial.status = req.body.status || tutorial.status;

  const updated = await tutorial.save();

  res.json(updated);

 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};



// ADD THIS

export const deleteTutorial = async (req, res) => {
 try {

  const tutorial = await Tutorial.findById(req.params.id);

  if (!tutorial) {
   return res.status(404).json({
    message: "Tutorial not found"
   });
  }

  await tutorial.deleteOne();

  res.json({
   message: "Tutorial deleted successfully"
  });

 } catch (error) {
  console.error("DELETE TUTORIAL ERROR:", error);
  res.status(500).json({
   message: error.message
  });
 }
};

// ADD THIS

export const getTutorialById = async (req, res) => {
 try {

  const tutorial = await Tutorial.findById(req.params.id);

  if (!tutorial) {
   return res.status(404).json({ message: "Tutorial not found" });
  }

  res.json(tutorial);

 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};

