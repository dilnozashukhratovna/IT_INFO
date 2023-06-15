const { Router } = require("express");
const {
    addCategory,
    getCategorys,
    getCategorysById,
    updateCategory,
    deleteCategory,
} = require("../controllers/category.controller");
const router = Router();

router.post("/", addCategory);
router.get("/", getCategorys);
router.get("/:id", getCategorysById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
