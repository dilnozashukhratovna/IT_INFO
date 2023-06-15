const { Router } = require("express");
const {
    addSynonym,
    getSynonyms,
    getSynonymsById,
    updateSynonym,
    deleteSynonym,
} = require("../controllers/synonym.controller");
const router = Router();

router.post("/", addSynonym);
router.get("/", getSynonyms);
router.get("/:id", getSynonymsById);
router.put("/:id", updateSynonym);
router.delete("/:id", deleteSynonym);
module.exports = router;
