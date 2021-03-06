var express = require("express");
var router = express.Router();
const { Student,Campus } = require("../database/models");

/* GET all students. */
// /api/students
router.get("/", async (req, res, next) => {
  // try to get students object from database
  try {
    // students will be the result of the Campus.findAll promise
    const students = await Student.findAll({include: Campus});
    // if students is valid, it will be sent as a json response
    console.log(students);
    res.status(200).json(students);
  } catch (err) {
    // if there is an error, it'll passed via the next parameter to the error handler middleware
    next(err);
  }
});

router.get("/:id",async (req, res, next)=>{
    const { id } = req.params;
    // query the database for a campus with matching id
    try {
      // if successful:
      const student = await Student.findByPk(id, {include: Campus});
      // send back the campus as a response
      res.status(200).json(student);
    } catch (err) {
      // if error:
      // handle error
      next(err);
    }
});

router.get("/:id/campuses", async (req, res, next) => {
  const { id } = req.params;
  // find the campus associated with the id
  let foundStudent;
  try {
    foundStudent = await Student.findByPk(id);
  } catch (err) {
    next(err);
  }

  try {
    const campusesOfstudent = await foundStudent.getCampuses();
    res.status(200).json(campusesOfstudent);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next)=>{
    const { firstName, lastName, email, gpa, imageUrl } = req.body;
    // Create a campus object
    const studentObj = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        gpa: gpa,
        imageUrl: imageUrl,
    };
  try{
    // console.log(req.query)
    const newStudent = await Student.create(studentObj);
    res.status(201).json (newStudent);
  }
  catch (err){
    next(err);
  }
}); 


router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { campusId } = req.body;
  const updatedObj = { campusId: campusId };
  try {
    const student = await Student.findByPk(id);
    await student.set(updatedObj);
    const updatedStudent = await student.save();
    res.status(201).send(updatedStudent);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) =>{
    const { id } = req.params;
  try{
    const student = await Student.findByPk(id);
    await student.destroy();
    res.sendStatus(204);
  }
  catch(err){
    next(err);
  }
}); 


module.exports = router;
