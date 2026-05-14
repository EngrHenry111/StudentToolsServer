import mongoose from "mongoose";

const studyPlannerSchema = new mongoose.Schema({

 title: {
  type: String,
  required: true
 },

 subject: {
  type: String,
  required: true
 },

 studyDate: {
  type: String,
  required: true
 },

 studyTime: {
  type: String,
  required: true
 },

 note: {
  type: String
 },

 createdAt: {
  type: Date,
  default: Date.now,

  // AUTO DELETE AFTER 7 DAYS
  expires: 604800
 }

});

const StudyPlanner = mongoose.model(
 "StudyPlanner",
 studyPlannerSchema
);

export default StudyPlanner;