    const fs = require("fs");
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/tours-simple.json`)
);
const toursLegth = tours.length;

const checkId = (req, res, next, val) => {
  console.log(val);
  if (Number(req.params.val) > toursLegth) {
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: "field",
      msg: "Name and Price should be!",
    });
  }
  next();
};
/**************************************         function route      ****************************/
const getTour = function (req, res) {
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);
  res.json({
    tour,
  });
};
const getAllTours = function (req, res) {
  res.status(200).json({
    status: "Success",
    results: tours.length,
    data: { tours },
  });
};
const addTour = function (req, res) {
  const newId = tours.length + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "fail",
          message: "Error writing to file",
        });
      }
      res.status(201).json({
        status: "Success",
        data: newTour,
      });
    }
  );
};

const updateTour = function (req, res) {
  res.status(200).json({
    status: 200,
    msg: "Updated Successfuly",
  });
};
const deleteTour = function (req, res) {
  res.status(200).json({
    status: "success",
    msg: "delete tour Successfuly",
  });
};

module.exports = {
  getTour,
  getAllTours,
  deleteTour,
  updateTour,
  addTour,
  checkId,
  checkBody,
};
