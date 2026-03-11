/*
CGPA Controller

Handles:
1. Saving semester CGPA
2. Calculating cumulative CGPA
*/

import Semester from "../models/Semester.js";
import Course from "../models/Course.js";


// Save Semester CGPA
export const saveSemester = async (req, res) => {

 try {

  const { semesterName, courses } = req.body;

  const semester = await Semester.create({
   user: req.user.id,
   semesterName
  });

  let totalUnits = 0;
  let totalPoints = 0;

  const gradePoints = {
   A: 5,
   B: 4,
   C: 3,
   D: 2,
   E: 1,
   F: 0
  };

  // Save courses
  for (const c of courses) {

   await Course.create({
    semester: semester._id,
    courseCode: c.course,
    unit: c.unit,
    grade: c.grade
   });

   totalUnits += Number(c.unit);
   totalPoints += Number(c.unit) * gradePoints[c.grade];

  }

  const cgpa = totalUnits ? totalPoints / totalUnits : 0;

  semester.cgpa = cgpa;
  semester.totalUnits = totalUnits;

  await semester.save();

  res.json(semester);

 } catch (error) {

  res.status(500).json({ message: error.message });

 }

};


// Get Cumulative CGPA
export const getCumulativeCGPA = async (req, res) => {

 try {

  const semesters = await Semester.find({
   user: req.user.id
  });

  let totalUnits = 0;
  let totalPoints = 0;

  semesters.forEach((semester) => {

   totalUnits += semester.totalUnits;

   totalPoints += semester.cgpa * semester.totalUnits;

  });

  const cumulativeCGPA =
   totalUnits ? (totalPoints / totalUnits).toFixed(2) : 0;

  res.json({
   cumulativeCGPA,
   semesters
  });

 } catch (error) {

  res.status(500).json({ message: error.message });

 }

};