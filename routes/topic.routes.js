const { Router } = require("express");
const {
    addTopic,
    getTopics,
    getTopicsById,
    updateTopic,
    deleteTopic,
} = require("../controllers/topic.controller");
const router = Router();

router.post("/", addTopic);
router.get("/", getTopics);
router.get("/:id", getTopicsById);
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);
module.exports = router;
