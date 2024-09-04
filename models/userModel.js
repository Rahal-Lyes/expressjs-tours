const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { use } = require("../routes/userRoutes");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
    modifyAt: {
      type: Date,
      default: Date.now,
    },
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not the same",
      select: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hobbies: {
    type: [String],
  },
  sexe: {
    type: String,
    enum: {
      values: ["Male", "Female"],
      message: "Sexe must be either",
    },
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
  } catch (error) {
    console.log(error);
  }
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model("User", userSchema);

module.exports = User;
