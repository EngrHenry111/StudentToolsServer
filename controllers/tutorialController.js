import Tutorial from "../models/tutorialModel.js";

/*
Create Tutorial (minimal working version)
*/

export const createTutorial = async (req, res) => {
 try {

  // Normalize title
  const cleanTitle = req.body.title.trim().toLowerCase();

  // Check if tutorial already exists (by title)
  const existing = await Tutorial.findOne({
   title: { $regex: `^${cleanTitle}$`, $options: "i" }
  });

  if (existing) {
   return res.status(400).json({
    message: "Tutorial with this title already exists"
   });
  }

// MODIFY this part

const category = req.body.category?.toLowerCase().trim();
const topic = req.body.topic?.toLowerCase().trim() || "general";

const tutorial = await Tutorial.create({
 title: req.body.title,
 content: req.body.content,
 category,
 topic,
 tags: req.body.tags || []
});

  res.status(201).json(tutorial);

 } catch (error) {
  console.error("CREATE TUTORIAL ERROR:", error);
  res.status(500).json({ message: error.message });
 }
};


/*
Get All Tutorials
*/

export const getTutorials = async (req,res)=>{

 try{

  const page = Number(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const filter = {};

if(req.query.category){
 filter.category = req.query.category.toLowerCase();
}

if(req.query.topic){
 filter.topic = req.query.topic.toLowerCase();
}

  const tutorials = await Tutorial
   .find(filter)
   .sort({createdAt:-1})
   .skip(skip)
   .limit(limit);

  const total = await Tutorial.countDocuments(filter);

  res.json({
   tutorials,
   totalPages: Math.ceil(total / limit),
   currentPage: page
  });

 }catch(error){

  res.status(500).json({message:error.message});

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

export const getTutorialBySlug = async (req,res)=>{

 try{

  const tutorial = await Tutorial.findOneAndUpdate(
   { slug:req.params.slug },
   { $inc:{ views:1 } },
   { new:true }
  );

  res.json(tutorial);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

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