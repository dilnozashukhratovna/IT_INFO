const { Router } = require("express");
const {
    addAuthor,
    getAuthors,
    getAuthorsById,
    updateAuthor,
    deleteAuthor,
    loginAuthor,
} = require("../controllers/author.controller");

const authorPolice = require("../middleware/authorPolice");
const authorRolesPolice = require("../middleware/authorRolesPolice");
const adminPolice = require("../middleware/adminPolice");

const router = Router();

router.post("/", addAuthor);
router.post("/login", loginAuthor);
router.get("/", authorPolice || adminPolice, getAuthors);
router.get("/:id", authorRolesPolice(["READ", "WRITE"]), getAuthorsById);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

module.exports = router;
