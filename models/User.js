import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }, 

  isVerified: {
  type: Boolean,
  default: false
},

refreshToken: {
  type: String,
  default: null
},

tokenVersion: {
  type: Number,
  default: 0
},

subscriptionCode: {
  type: String,
  default: null
},

// Paystack's per-subscription email token, required (along with the
// subscription code) to disable a subscription via their API.
subscriptionEmailToken: {
  type: String,
  default: null
},

// Prevents someone from cancelling and resubscribing repeatedly to keep
// reusing the launch discount — once true, they always pay full price.
usedLaunchOffer: {
  type: Boolean,
  default: false
},

subscriptionStatus: {
  type: String,
  default: "inactive" // active, cancelled
},

nextBillingDate: {
  type: Date,
  default: null
},
freeQuizCount: {
  type: Number,
  default: 0
},

lastQuizDate: {
  type: Date,
  default: null
},

isPremium: {
  type: Boolean,
  default: false
},

aiQuizAttempts: {
  type: Number,
  default: 0
},

}, { timestamps: true });

export default mongoose.model("User", userSchema);



// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({

//  name:{
//   type:String,
//   required:true
//  },

//  email:{
//   type:String,
//   required:true,
//   unique:true
//  },

//  password:{
//   type:String,
//   required:true
//  },

//  // MODIFY THIS PART IN models/User.js

// plan:{
//  type:String,
//  enum:["free","pro"],
//  default:"free"
// },

// subscriptionStatus:{
//  type:String,
//  enum:["active","inactive"],
//  default:"inactive"
// },

// subscriptionExpiry:{
//  type:Date
// },

// },{timestamps:true});

// export default mongoose.model("User",userSchema);