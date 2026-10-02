import Tutorial from "../models/tutorialModel.js";
import {
 normalizeTutorialContent,
 htmlToPlainText
} from "../utils/normalizeHtml.js";
import {
 isValidTutorialCategory,
 isCleanTopicSlug,
 topicSlug,
 tutorialCategoryList
} from "../services/tutorialCategories.js";
import {
 checkTutorial,
 escapeRegex,
 parseKeywords
} from "../services/tutorialQuality.js";

// Duplicate gate shared by create/update. Hard duplicates are always
// rejected; softer matches (similar title in the same topic, partial content
// overlap, repeated paragraphs, keyword clash) need `confirmSimilar: true`
// from the admin after they've seen the warnings.
const runDuplicateGate = async (fields, body, res) => {
 const report = await checkTutorial(fields);

 if (report.blocking.length) {
  res.status(409).json({
   message: report.blocking.join(" "),
   duplicate: true,
   blocked: true,
   report
  });
  return null;
 }

 if (report.warnings.length && !body.confirmSimilar) {
  res.status(409).json({
   message: report.warnings.join(" "),
   duplicate: true,
   blocked: false,
   report
  });
  return null;
 }

 return report;
};

/*
Create Tutorial (minimal working version)
*/

export const createTutorial = async (req, res) => {
 try {

  // ✅ Validate title
  const cleanTitle = req.body.title?.trim();

  if (!cleanTitle) {
   return res.status(400).json({
    message: "Title is required"
   });
  }

  // ✅ Check duplicate (case insensitive, regex-escaped)
  const existing = await Tutorial.findOne({
   title: { $regex: `^${escapeRegex(cleanTitle)}$`, $options: "i" }
  });

  if (existing) {
   return res.status(400).json({
    message: "Tutorial with this title already exists"
   });
  }

  // ✅ Normalize + validate category & topic against the shared taxonomy
  const category = req.body.category?.toLowerCase().trim();
  const topic = topicSlug(req.body.topic || "");

  if (!category) {
   return res.status(400).json({
    message: "Category is required"
   });
  }

  if (!isValidTutorialCategory(category)) {
   return res.status(400).json({
    message: `Invalid category. Choose one of: ${tutorialCategoryList.join(", ")}`
   });
  }

  if (!topic || !isCleanTopicSlug(topic)) {
   return res.status(400).json({
    message: "Topic is required (letters, numbers and hyphens only)"
   });
  }

  // ✅ Ensure content exists
  if (!req.body.content) {
   return res.status(400).json({
    message: "Content is required"
   });
  }

  // ✅ Store real HTML, never entity-escaped markup
  const content = normalizeTutorialContent(req.body.content);

  // ✅ Clean text (for fallback excerpt)
  const cleanText = htmlToPlainText(content);

  // ✅ EXCERPT LOGIC (BEST VERSION)
  const excerpt =
   req.body.excerpt?.trim() ||
   cleanText.slice(0, 150);

  // ✅ Image (optional)
  let image = "";
  if (req.body.image?.trim()) {
   const img = req.body.image.trim();

   if (!img.startsWith("http")) {
    return res.status(400).json({
     message: "Image must be a valid URL"
    });
   }

   image = img;
  }

  // ✅ Tags (ensure array)
  const tags = Array.isArray(req.body.tags)
   ? req.body.tags.map(tag => tag.toLowerCase().trim())
   : [];

  const focusKeyword = req.body.focusKeyword?.toLowerCase().trim() || "";
  const keywords = parseKeywords(req.body.keywords);

  // ✅ Duplicate topic / repeated content / keyword clash
  const report = await runDuplicateGate({
   title: cleanTitle,
   content,
   category,
   topic,
   excerpt,
   focusKeyword,
   keywords
  }, req.body, res);
  if (!report) return;

  // ✅ CREATE (slug is generated once by the model's pre-save hook)
  const tutorial = await Tutorial.create({
   title: cleanTitle,
   content,
   contentHash: report.contentHash,
   focusKeyword,
   keywords,
   category,
   topic,
   excerpt,
   image,
   tags,
   status: req.body.status || "draft"
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
  // This is a public endpoint — only ever expose published tutorials.
  // Admin listing uses getAdminTutorials (auth-protected) instead.
  const filter = { status: "published" };

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
Admin: list every tutorial (drafts included). Auth-protected route.
*/
export const getAdminTutorials = async (req, res) => {
 try {

  const tutorials = await Tutorial.find()
   .sort({ createdAt: -1 });

  res.json({ tutorials });

 } catch (error) {
  res.status(500).json({ message: error.message });
 }
};


/*
Search Tutorials
*/
export const searchTutorials = async (req,res)=>{

 try{

  const q = String(req.query.q || "").trim().slice(0, 100);

  if(!q){
   return res.json([]);
  }

  const fields = "title slug excerpt content category topic image tags focusKeyword views createdAt";
  let tutorials = [];

  // Ranked keyword search: title > focus keyword > keywords > tags >
  // excerpt > body (weights live on the text index in the model).
  try{
   tutorials = await Tutorial.find(
    { status: "published", $text: { $search: q } },
    { score: { $meta: "textScore" } }
   )
   .sort({ score: { $meta: "textScore" }, views: -1 })
   .select(fields)
   .limit(20)
   .lean();
  }catch(err){
   console.error("TEXT SEARCH UNAVAILABLE:", err.message);
  }

  // Fallback for partial words ("newt") or if the text index isn't built.
  if(!tutorials.length){
   const rx = { $regex: escapeRegex(q), $options: "i" };

   tutorials = await Tutorial.find({
    status: "published",
    $or:[
     {title: rx},
     {focusKeyword: rx},
     {keywords: rx},
     {tags: rx},
     {excerpt: rx},
     {topic: rx},
     {category: rx}
    ]
   })
   .sort({ views: -1 })
   .select(fields)
   .limit(20)
   .lean();
  }

  res.json(tutorials);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};

export const searchSuggestions = async (req,res)=>{

 try{

  const q = String(req.query.q || "").trim().slice(0, 60);

  if(!q){
   return res.json([]);
  }

  const rx = { $regex: escapeRegex(q), $options: "i" };

  const tutorials = await Tutorial.find({

   status: "published",
   $or:[
    {title: rx},
    {focusKeyword: rx},
    {keywords: rx}
   ]

  })
  .sort({ views: -1 })
  .limit(6)
  .select("title slug");

  res.json(tutorials);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};

/*
Admin: run the duplicate / repeated-content / SEO keyword check on a draft
without saving it. Pass `id` when editing so the tutorial isn't compared
against itself.
*/
export const checkTutorialDraft = async (req, res) => {
 try {

  const report = await checkTutorial({
   title: req.body.title?.trim() || "",
   content: normalizeTutorialContent(req.body.content || ""),
   category: req.body.category?.toLowerCase().trim() || "",
   topic: topicSlug(req.body.topic || ""),
   excerpt: req.body.excerpt?.trim() || "",
   focusKeyword: req.body.focusKeyword || "",
   keywords: parseKeywords(req.body.keywords),
   excludeId: req.body.id || null
  });

  delete report.contentHash;
  res.json(report);

 } catch (error) {
  console.error("CHECK TUTORIAL ERROR:", error);
  res.status(500).json({ message: error.message });
 }
};

/*
Get Tutorial By Slug
*/

// MODIFY THIS PART in tutorialController.js

export const getTutorialBySlug = async (req, res) => {

 try {

  // Public endpoint — resolve by slug only, and only ever return a
  // published tutorial. Admin screens load drafts by id through the
  // auth-protected getTutorialById route instead.
  const tutorial = await Tutorial.findOneAndUpdate(
   { slug: req.params.slug, status: "published" },
   { $inc: { views: 1 } },
   { returnDocument: "after" }
  );

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
   status: "published",
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

  const tutorials = await Tutorial.find({ status: "published" })
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

  const categories = await Tutorial.distinct("category", { status: "published" });

  res.json(categories);

 }catch(error){

  res.status(500).json({message:error.message});

 }

};


export const getTopicsByCategory = async (req,res)=>{

 try{

  const {category} = req.params;

  const topics = await Tutorial.distinct("topic",{
   category: category.toLowerCase(),
   status: "published"
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

  // Category / topic: validate any *changed* value against the taxonomy,
  // but let an unchanged legacy value pass so old rows stay editable.
  if (req.body.category != null) {
   const nextCategory = String(req.body.category).toLowerCase().trim();

   if (
    nextCategory !== tutorial.category &&
    !isValidTutorialCategory(nextCategory)
   ) {
    return res.status(400).json({
     message: `Invalid category. Choose one of: ${tutorialCategoryList.join(", ")}`
    });
   }

   tutorial.category = nextCategory || tutorial.category;
  }

  if (req.body.topic != null) {
   const nextTopic = topicSlug(req.body.topic);

   if (
    nextTopic &&
    nextTopic !== tutorial.topic &&
    !isCleanTopicSlug(nextTopic)
   ) {
    return res.status(400).json({
     message: `Invalid topic "${nextTopic}" (letters, numbers and hyphens only)`
    });
   }

   tutorial.topic = nextTopic || tutorial.topic;
  }

  tutorial.title = req.body.title || tutorial.title;

  if (req.body.content) {
   tutorial.content = normalizeTutorialContent(req.body.content);
  }

  tutorial.excerpt =
   req.body.excerpt?.trim() ||
   tutorial.excerpt ||
   htmlToPlainText(tutorial.content).slice(0, 150);

  tutorial.image = req.body.image || tutorial.image;
  tutorial.tags = req.body.tags || tutorial.tags;
  tutorial.status = req.body.status || tutorial.status;

  if (req.body.focusKeyword != null) {
   tutorial.focusKeyword = String(req.body.focusKeyword).toLowerCase().trim();
  }

  if (req.body.keywords != null) {
   tutorial.keywords = parseKeywords(req.body.keywords);
  }

  // Re-check duplicates only when something that defines the topic or the
  // body changed, so routine edits (status, image) never get blocked by
  // older near-duplicates.
  if (
   tutorial.isModified("title") ||
   tutorial.isModified("content") ||
   tutorial.isModified("topic") ||
   tutorial.isModified("category") ||
   tutorial.isModified("focusKeyword")
  ) {
   const report = await runDuplicateGate({
    title: tutorial.title,
    content: tutorial.content,
    category: tutorial.category,
    topic: tutorial.topic,
    excerpt: tutorial.excerpt,
    focusKeyword: tutorial.focusKeyword,
    keywords: tutorial.keywords,
    excludeId: tutorial._id
   }, req.body, res);
   if (!report) return;

   tutorial.contentHash = report.contentHash;
  }

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


export const getSubtopics = async (req, res) => {
  try {
    const { category, topic } = req.query;

    const tutorials = await Tutorial.find({
      category,
      topic,
      status: "published"
    }).select("title slug");

    res.json(tutorials);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


