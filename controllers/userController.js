const User = require("../models/userModel");
/**************************************         function route      ****************************/
const getUser = function (req, res) {
  const id = req.params.id;

  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).json({
          msg: "not found",
        });
      }
      res.status(200).json({
        msg: "successful",
        user: user,
      });
    })
    .catch((err) => {
      res.status(404).json({
        msg: "erreur",
        err: err,
      });
    });
};

const getAllUsers = async function (req, res) {
  try {
    const queryObj = { ...req.query }; //create a copy of req.query
    //  const queryObj=req.query;//create a reference of req.query
    const excludeFileds = ["page", "sort", "limit", "fields"];
    excludeFileds.forEach((el) => delete queryObj[el]);
    // console.log(queryObj)
    const query = User.find(queryObj);

    const users = await query;
    
    res.status(200).send(users);
  } catch (error) {
    res.status(404).send({
      status: "field",
      message: error,
    });
  }
};
const addUser = async function (req, res) {
  const { username, email, password, hobbies } = req.body;

  try {
    const newUser = new User({
      username: username,
      email: email,
      password: password,
      hobbies: hobbies,
    });

    await newUser.save();

    res
      .status(200)
      .json({ msg: "Utilisateur créé avec succès", user: newUser });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message,
    });
  }
};

const updateUser = function (req, res) {
  const userId = req.params.id;
  const { username } = req.body;

  User.findByIdAndUpdate(userId, { username: username }, { new: true })
    .then(() => {
      res.status(200).json({
        status: 200,
        msg: "Updated Successfuly",
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: 400,
        msg: "Updated Field",
        error: err,
      });
    });
};
const deleteUser = function (req, res) {
  const { email } = req.body;
  User.findOneAndDelete({ email: email })
    .then(() => {
      res.status(200).json({
        status: "success",
        msg: "delete user Successfuly",
      });
    })
    .catch((err) => {
      res.status(404).json({
        status: "field",
        msg: "delete user field",
        error: err,
      });
    });
};

module.exports = {
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  addUser,
};
