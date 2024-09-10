const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const {
  getUsersjson,
  getAllUserscrypto,
  getUserByIdcryptography,
  getAllUsersbcrypt,
  getAllUserscryptography,
} = require("../controllers/encryption.js");

router.post("/users", userController.createUser);
router.get("/finduser/:id", getUsersjson);
router.get("/finduserscrypto", getAllUserscrypto);
router.get("/finduserscryptogrphy", getAllUserscryptography);
router.get("/findusercryptogrphy/:id", getUserByIdcryptography);
router.get("/findusersbcrypt/:id", getAllUsersbcrypt);
router.get("/findusers", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
