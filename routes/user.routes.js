const express = require("express");
const Validator = require("../middleware/validator");

const {
    addUser,
    loginUser,
    getUsers,
    getUsersById,
    updateUser,
    deleteUser,
    logoutUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/", Validator("user"), addUser);
router.post("/login", Validator("user_email_pass"), loginUser);
router.post("/logout", logoutUser);
router.get("/", getUsers);
router.get("/:id", getUsersById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
