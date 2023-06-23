// // const { config } = require("dotenv");
// const config = require('config')
// const winston = require("winston");
// require("winston-mongodb");

// const { createLogger, format, transports } = require("winston");
// const { combine, timestamp, label, printf, json } = format;

// const myFormat = printf(({ level, message, timestamp }) => {
//     return `${timestamp} ${level}: ${message}`;
// });

// const logger = createLogger({
//     format: combine(timestamp(), myFormat, json()),
//     transports: [
//         new transports.Console({ level: "debug" }),
//         new transports.File({ filename: "log/error.log", level: "error" }),
//         new transports.File({ filename: "log/combine.log", level: "info" }),
//         new transports.MongoDB({
//             db: config.get("dbUri"),
//             options: { useUnifiedTopology: true },
//         }),
//     ],
// });

// // logger.exceptions.handle(
// //     new transports.File({ filename: "log/exceptions.log" })
// // );
// // logger.rejections.handle(
// //     new transports.File({ filename: "log/rejections.log" })
// // );
// // logger.exitOnError = false

// module.exports = logger;

//===========================FIRST VERSION================================================
// const config = require("config");
// const winston = require("winston");
// require("winston-mongodb");

// const { createLogger, format, transports } = require("winston");
// const { combine, timestamp, label, printf, json } = format;

// const myFormat = printf(({ level, message, timestamp }) => {
//     return `${timestamp} ${level}: ${message}`;
// });

// const logger = createLogger({
//     format: combine(timestamp(), myFormat, json()),
//     transports: [],
// });

// if (process.env.NODE_ENV === "production") {
//     // Use file and MongoDB transports for production mode
//     logger.add(
//         new transports.File({ filename: "log/error.log", level: "error" })
//     );
//     logger.add(
//         new transports.MongoDB({
//             db: config.get("dbUri"),
//             options: { useUnifiedTopology: true },
//         })
//     );
// } else {
//     // Use console and file transports for development mode
//     logger.add(new transports.Console({ level: "debug" }));
//     logger.add(
//         new transports.File({ filename: "log/error.log", level: "error" })
//     );
//     logger.add(
//         new transports.File({ filename: "log/combine.log", level: "info" })
//     );
// }

// module.exports = logger;

//============================SECOND VERSION==============================================
const config = require("config");
const winston = require("winston");
require("winston-mongodb");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, json } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

let logger;
const devLog = createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
        new transports.Console({ level: "debug" }),
        new transports.File({ filename: "log/error.log", level: "error" }),
        new transports.File({ filename: "log/combine.log", level: "info" }),
    ],
});

const prodLog = createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
        new transports.File({ filename: "log/error.log", level: "error" }),
        new transports.MongoDB({
            db: config.get("dbUri"),
            options: { useUnifiedTopology: true },
        }),
    ],
});

if (process.env.NODE_ENV === "production") {
    logger = prodLog;

} else {
    logger = devLog
}

module.exports = logger;
