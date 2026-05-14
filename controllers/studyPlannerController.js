import StudyPlanner from "../models/studyPlannerModel.js";

/* CREATE PLAN */
export const createPlan = async (req, res) => {

 try {

  const {
   title,
   subject,
   studyDate,
   studyTime,
   note
  } = req.body;

  const newPlan = await StudyPlanner.create({
   title,
   subject,
   studyDate,
   studyTime,
   note
  });

  res.status(201).json({
   success: true,
   data: newPlan
  });

 } catch (error) {

  res.status(500).json({
   success: false,
   message: error.message
  });

 }

};

/* GET PLANS */
export const getPlans = async (req, res) => {

 try {

  const plans = await StudyPlanner.find().sort({
   createdAt: -1
  });

  res.status(200).json(plans);

 } catch (error) {

  res.status(500).json({
   success: false,
   message: error.message
  });

 }

};

/* DELETE PLAN */
export const deletePlan = async (req, res) => {

 try {

  await StudyPlanner.findByIdAndDelete(req.params.id);

  res.status(200).json({
   success: true,
   message: "Plan deleted"
  });

 } catch (error) {

  res.status(500).json({
   success: false,
   message: error.message
  });

 }

};