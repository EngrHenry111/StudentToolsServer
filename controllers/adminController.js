import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req,res)=>{

 try{

  const {email,password} = req.body;

  const admin = await Admin.findOne({email});

  if(!admin){
   return res.status(401).json({message:"Invalid credentials"});
  }

  const isMatch = await bcrypt.compare(password,admin.password);

  if(!isMatch){
   return res.status(401).json({message:"Invalid credentials"});
  }

  const token = jwt.sign(
   {id:admin._id},
   process.env.JWT_SECRET,
   {expiresIn:"1d"}
  );

  res.json({token});

 }catch(error){

  res.status(500).json({message:error.message});

 }

};


export const getAdminStats = async (req, res) => {
 try {

  // ✅ TOTAL
  const total = await Tutorial.countDocuments();

  // ✅ SAFE published (fallback if no status field)
  const published = await Tutorial.countDocuments({
   $or: [
    { status: "published" },
    { status: { $exists: false } } // fallback
   ]
  });

  // ✅ SAFE drafts
  const drafts = await Tutorial.countDocuments({
   status: "draft"
  });

  // ✅ SAFE views aggregation
  const tutorials = await Tutorial.find().select("views");

  const views = tutorials.reduce((sum, t) => {
   return sum + (t.views || 0);
  }, 0);

  res.json({
   total,
   published,
   drafts,
   views
  });

 } catch (error) {
  console.error("ADMIN STATS ERROR:", error); // 👈 VERY IMPORTANT

  res.status(500).json({
   message: error.message
  });
 }
};