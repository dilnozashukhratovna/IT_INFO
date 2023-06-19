const { Router } = require("express");
const express = require('express');

const categoryRouter = require("./category.routes");
const dictionaryRouter = require("./dictionary.routes");
const descriptionRouter = require("./description.routes");
const synonymRouter = require("./synonym.routes");
const authorRouter = require("./author.routes");
const adminRouter = require("./admin.routes");
const userRouter = require("./user.routes");

express.Router.prefix = function(path, subRouter){
    const router = express.Router()
    this.use(path, router)
    subRouter(router)
    return router
}

const router = Router();
router.prefix("/api", (apiRouter)=>{
    apiRouter.use("/category", categoryRouter);
    apiRouter.use("/dictionary", dictionaryRouter);
    apiRouter.use("/description", descriptionRouter);
    apiRouter.use("/synonym", synonymRouter);
    apiRouter.use("/author", authorRouter);
    apiRouter.use("/admin", adminRouter);
    apiRouter.use("/user", userRouter);
})







module.exports = router;
