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