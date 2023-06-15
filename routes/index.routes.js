const { Router } = require("express");
const router = Router();

const categoryRouter = require("./category.routes");
const dictionaryRouter = require("./dictionary.routes");
const descriptionRouter = require("./description.routes");
const synonymRouter = require("./synonym.routes");
const authorRouter = require("./author.routes");
const adminRouter = require("./admin.routes");
const userRouter = require("./user.routes");


router.use("/api/category", categoryRouter);
router.use("/api/dictionary", dictionaryRouter);
router.use("/api/description", descriptionRouter);
router.use("/api/synonym", synonymRouter);
router.use("/api/author", authorRouter);
router.use("/api/admin", adminRouter);
router.use("/api/user", userRouter);




module.exports = router;
