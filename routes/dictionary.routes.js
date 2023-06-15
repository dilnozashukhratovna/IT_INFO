const { Router } = require("express");
const {
    addTerm,
    getTerms,
    getTermsById,
    updateTerm,
    deleteTerm,
    getTermsByLetter,
} = require("../controllers/dictionary.controller");
const router = Router();

router.post("/", addTerm);
router.get("/", getTerms);
router.get("/:id", getTermsById);
router.get("/letter/:letter", getTermsByLetter);
router.put("/:id", updateTerm);
router.delete("/:id", deleteTerm);
module.exports = router;
