import User from "../models/userModel.js"
import jwt from "jsonwebtoken"

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body

  try {
    const userExists = await User.findOne({ email })
    if (userExists)
      return res.status(400).json({ message: "User already exists" })

    const user = await User.create({ name, email, password, phoneNumber })

    generateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    })
  } else {
    res.status(401).json({ message: "Invalid credentials" })
  }
}

export const getProfile = async (req, res) => {
  res.json(req.user);
}

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber
    if (req.body.password) user.password = req.body.password

    const updatedUser = await user.save()
    res.json(updatedUser)
  } else {
    res.status(404).json({ message: "User not found" })
  }
}
