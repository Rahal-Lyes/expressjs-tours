const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.param("id", (req, res, next, val) => {
  console.log("valeur de id: " + val);
  next();
});
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(userController.addUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
