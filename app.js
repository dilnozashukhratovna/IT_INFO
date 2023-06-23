const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.routes");
const error_handling_middleware = require("./middleware/error_handling_middleware");
const cookieParser = require("cookie-parser");
const PORT = config.get("port") || 3030;
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const app = express();
const logger = require("./services/logger");
// expressWinston = require("express-winston");
const winston = require("winston");
const exHbs = require("express-handlebars");

const {
    expressWinstonLogger,
    expressWinstonErrorLogger,
} = require("./middleware/loggerMiddleware");
// const { loggerMiddleware } = require("./middleware/loggerMiddleware");

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));
// console.log(config.get("access_key"));

// logger.log("info", "LOG ma'lumotlari");
// logger.error("ERROR ma'lumotlari");
// logger.debug("DEBUG ma'lumotlari");
// logger.warn("WARN ma'lumotlari");
// logger.info("INFO ma'lumotlari");
// console.trace("TRACE ma'lumotlari")
// console.table(
// [
//     ['SALIM', 20],
//     ['NODIR', 45],
//     ['KARIM', 31]
// ]
// )

app.use(express.json()); // Frontenddan kelayotgan so'rovlarni JSON'ga parse qiladi(taniydi)
app.use(cookieParser()); // Frontenddan kelayotgan so'rovlar ichidagi cookie'ni parse qiladi(taniydi)

// app.use(
//     expressWinston.logger({
//         transports: [
//             new winston.transports.Console({
//                 json: true,
//                 colorize: true,
//             }),
//         ],
//         meta: true, // optional: control whether you want to log the meta data about the request (default to true)
//         msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
//         expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
//         colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
//         ignoreRoute: function (req, res) {
//             return false;
//         }, // optional: allows to skip some log messages based on request and/or response
//     })
// );

const hbs = exHbs.create({
    defaultLayout: "main",
    extname: "hbs",
});

app.engine("hbs", hbs.engine);

app.set("view engine", "hbs");
app.set("views", "views");
app.use(express.static("views"));


// app.use(expressWinstonLogger);
app.use(mainRouter);
// app.use(expressWinstonErrorLogger);

// app.use(
//     expressWinston.errorLogger({
//         transports: [
//             new winston.transports.Console({
//                 json: true,
//                 colorize: true,
//             }),
//         ],
//     })
// );

app.use(error_handling_middleware);

// process.on("uncaughtException", (ex) => {
//     console.log("uncaughtException", ex.message);
//     // process.exit(1);
// });

// process.on("unhandledRejection", (rej) => {
//     console.log("unhandledRejection", rej);
// });

async function start() {
    try {
        await mongoose.connect(config.get("dbUri"));
        app.listen(PORT, () => {
            console.log(`Server ishga tushdi: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("Serverda xatolik", error);
    }
}

start();
