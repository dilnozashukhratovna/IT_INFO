const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.routes");
const error_handling_middleware = require("./middleware/error_handling_middleware");
const cookieParser = require('cookie-parser');
const PORT = config.get("port") || 3030;

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use(mainRouter);

app.use(error_handling_middleware)

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
