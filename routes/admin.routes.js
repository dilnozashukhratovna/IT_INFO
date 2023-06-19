const { Router } = require("express");
const Validator = require("../middleware/validator");
const {
    addAdmin,
    getAdmins,
    getAdminsById,
    updateAdmin,
    deleteAdmin,
    loginAdmin,
    logoutAdmin,
} = require("../controllers/admin.controller");
const adminPolice = require("../middleware/adminPolice");
const {
    addSynonym,
    updateSynonym,
    deleteSynonym,
    getSynonyms,
} = require("../controllers/synonym.controller");
const {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategorys,
} = require("../controllers/category.controller");
const {
    addTerm,
    updateTerm,
    deleteTerm,
    getTerms,
} = require("../controllers/dictionary.controller");
const {
    addDescription,
    updateDescription,
    deleteDescription,
    getDescriptions,
} = require("../controllers/description.controller");

const router = Router();

router.post("/", Validator("admin"), addAdmin);
router.post("/login", Validator("admin_email_pass"), loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/", getAdmins);
router.get("/:id", getAdminsById);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
router.post("/addSyn", adminPolice, addSynonym);
router.post("/addCtg", adminPolice, addCategory);
router.post("/addDct", adminPolice, addTerm);
router.post("/addDsc", adminPolice, addDescription);
router.put("/:id/updateSyn", adminPolice, updateSynonym);
router.put("/:id/updateCtg", adminPolice, updateCategory);
router.put("/:id/updateDct", adminPolice, updateTerm);
router.put("/:id/updateDsc", adminPolice, updateDescription);
router.delete("/:id/deleteSyn", adminPolice, deleteSynonym);
router.delete("/:id/deleteCtg", adminPolice, deleteCategory);
router.delete("/:id/deleteDct", adminPolice, deleteTerm);
router.delete("/:id/deleteDsc", adminPolice, deleteDescription);
router.get("/getSyn", adminPolice, getSynonyms);
router.get("/getCtg", adminPolice, getCategorys);
router.get("/getDct", adminPolice, getTerms);
router.get("/getDsc", adminPolice, getDescriptions);

module.exports = router;
