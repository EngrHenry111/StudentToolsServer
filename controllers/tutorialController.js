import Tutorial from "../models/tutorialModel.js";

/*
Create Tutorial (minimal working version)
*/

export const createTutorial = async (req, res) => {
 try {
  const tutorial = await Tutorial.create({
   title: req.body.title,
   content: req.body.content,
   category: req.body.category,
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
*/export const getTutorials = async (req,res)=>{

 try{

  const page = Number(req.query.page) || 1;

  const limit = 6;

  const skip = (page - 1) * limit;

  const tutorials = await Tutorial
   .find()
   .sort({createdAt:-1})
   .skip(skip)
   .limit(limit);

  const total = await Tutorial.countDocuments();

  res.json({
   tutorials,
   totalPages: Math.ceil(total / limit),
   currentPage: page
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};


/*
Search Tutorials
*/
export const searchTutorials = async (req, res) => {
 try {
  const keyword = req.query.q;

  const tutorials = await Tutorial.find({
   title: { $regex: keyword, $options: "i" }
  });

  res.json(tutorials);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};


/*
Get Tutorial By Slug
*/
export const getTutorialBySlug = async (req, res) => {
 try {
  const tutorial = await Tutorial.findOne({ slug: req.params.slug });

  if (!tutorial) {
   return res.status(404).json({ message: "Tutorial not found" });
  }

  res.json(tutorial);
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};