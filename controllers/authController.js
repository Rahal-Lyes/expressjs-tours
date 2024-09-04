const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const validator = require("validator");
const AppError = require("../utils/appError");
const generateToken = function (id) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d"; // Par défaut 1 jour
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn });
};

const signup = async function (req, res, next) {
  try {
    const { username, email, password, confirmPassword, hobbies, sexe } =
      req.body;
    const newUser = new User({
      username,
      email,
      password,
      confirmPassword,
      hobbies,
      sexe,
    });
    const user = await newUser.save();
    const token = generateToken(user._id);
    res.status(201).send({
      status: "success ",
      token: token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (validator.isEmpty(email) || validator.isEmpty(password)) {
    res.status(404).json({
      status: "field",
      message: "email or password is empty",
    });
    return;
  }
  try {
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(404).json({
        status: "failed",
        message: "email or password is incorrect",
      });
      return;
    }

    const token = generateToken(user._id);
    res.status(200).json({
      status: "success login",
      token: token,
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const protect = async (req, res, next) => {
  let token;
  //getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
  }

  //verification token
  let decode;
  try {
    decode = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT décodé:", decode);
    next();
  } catch (err) {
    next(new AppError("Invalid token", 401));
  }

  //check if user still exists

  const freshUser = await User.findById(decode.id);

  if (!freshUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  //check if user changed password after the token

  req.user = freshUser;
  next();
};
module.exports = { signup, login, protect };
