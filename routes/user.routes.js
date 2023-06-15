const express = require("express");
const {
    addUser,
    loginUser,
    getUsers,
    getUsersById,
    updateUser,
    deleteUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/", addUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUsersById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router; 

