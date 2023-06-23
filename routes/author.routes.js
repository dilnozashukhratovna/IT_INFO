const { Router } = require("express");
const Validator = require("../middleware/validator");

const {
    addAuthor,
    getAuthors,
    getAuthorsById,
    updateAuthor,
    deleteAuthor,
    loginAuthor,
    logoutAuthor,
    refreshAuthorToken,
    authorActivate,
} = require("../controllers/author.controller");

const authorPolice = require("../middleware/authorPolice");
const authorRolesPolice = require("../middleware/authorRolesPolice");
const adminPolice = require("../middleware/adminPolice");

const router = Router();

router.post("/", Validator("author"), addAuthor);
router.post("/login", Validator("author_email_pass"), loginAuthor);
router.post("/logout", logoutAuthor);
router.get("/", authorPolice || adminPolice, getAuthors);
router.get(
    "/:id",
    // authorRolesPolice(["READ", "WRITE"]),
    authorPolice,
    getAuthorsById
);
router.put("/:id", updateAuthor);
router.delete("/:id", authorPolice, deleteAuthor);
router.post("/refresh", refreshAuthorToken);
router.get("/activate/:link", authorActivate);

module.exports = router;
