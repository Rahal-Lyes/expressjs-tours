const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    trim: true,
    unique: true,
    maxLength: [40, "A tour name must have less or equal then 40 characters"],
    minLength: [10, "A tour name must have more or equal then 10 characters"],
  },

  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty is either: easy, medium, difficult",
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});
