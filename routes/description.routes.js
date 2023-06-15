const { Router } = require("express");
const {
    addDescription,
    getDescriptions,
    getDescriptionsById,
    updateDescription,
    deleteDescription,
} = require("../controllers/description.controller");
const router = Router();

router.post("/", addDescription);
router.get("/", getDescriptions);
router.get("/:id", getDescriptionsById);
router.put("/:id", updateDescription);
router.delete("/:id", deleteDescription);
module.exports = router;
