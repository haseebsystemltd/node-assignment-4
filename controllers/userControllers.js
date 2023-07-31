const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "Imgonnaencryptyourdata";

exports.signup = async (req, res) => {
  try {
    const user = await userModel.find({
      email: req.body.email,
    });

    if (user.length != 0) {
      return res.status(404).json({
        error: "Email Already Exist",
      });
    }

    const password = await bcrypt.hash(req.body.password, 10);

    const newUser = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: password,
      role: req.body.role,
    });
    res.status(200).json({
      message: "Successfully generated",
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    let user = await userModel.findOne({
      email: req.body.email,
    });
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    let comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      secretKey
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error);
  }
};
