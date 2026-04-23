// // ADD THIS FILE

// import AiUsage from "../models/aiUsageModel.js";
// import {getToday} from "../utils/helper.js";

// const FREE_LIMIT = 5;

// const aiLimiter = async(req,res,next)=>{

//  try{

//   const user = req.user;

//   if(!user){
//    return res.status(401).json({message:"Unauthorized"});
//   }

//   // 🔓 PRO USERS → unlimited
//   if(user.plan === "pro" && user.subscriptionStatus === "active"){
//    return next();
//   }

//   const today = getToday();

//   let usage = await AiUsage.findOne({
//    user:user._id,
//    date:today
//   });

//   // 🆕 create record if not exist
//   if(!usage){

//    usage = await AiUsage.create({
//     user:user._id,
//     date:today,
//     count:0
//    });

//   }

//   // ❌ limit reached
//   if(usage.count >= FREE_LIMIT){

//    return res.status(403).json({
//     message:"Daily AI limit reached. Upgrade to continue."
//    });

//   }

//   // attach for later increment
//   req.aiUsage = usage;

//   next();

//  }catch(error){

//   res.status(500).json({message:error.message});

//  }

// };

// export default aiLimiter;