import Course from "../models/courseModel.js"

export const createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body)
    res.status(201).json(newCourse)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCourses = async (req, res) => {
  const courses = await Course.find()
  res.json(courses)
}

export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" })
  res.json(course);
};

export const updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(course)
}

export const deleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
}
