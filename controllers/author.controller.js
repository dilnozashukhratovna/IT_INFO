const { errorHandler } = require("../helpers/error_handler");
const Author = require("../models/Author");
const { default: mongoose } = require("mongoose");
const { authorValidation } = require("../validations/author");
// const jwd = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

const myJwt = require("../services/JwtService");

// const generateAccessToken = (id, is_expert, authorRoles) => {
//     const payload = {
//         id,
//         is_expert,
//         authorRoles,
//     };
//     return jwd.sign(payload, config.get("secret"), { expiresIn: "1h" });
// };

const addAuthor = async (req, res) => {
    try {
        // const { error, value } = authorValidation(req.body);
        // if (error) {
        //     return res.status(400).send({ message: error.details[0].message });
        // }

        const {
            author_first_name,
            author_last_name,
            author_nick_name,
            author_password,
            author_email,
            author_phone,
            author_info,
            author_position,
            author_photo,
            is_expert,
        } = req.body;

        // console.log(value);

        const author = await Author.findOne({ author_email });
        if (author) {
            return res.status(400).send({ message: "Bunday avtor kiritilgan" });
        }

        const hashedPassword = await bcrypt.hash(author_password, 7);

        const newAuthor = await Author({
            author_first_name,
            author_last_name,
            author_nick_name,
            author_password: hashedPassword,
            author_email,
            author_phone,
            author_info,
            author_position,
            author_photo,
            is_expert,
        });

        await newAuthor.save();
        res.status(200).send({ message: "Yangi author qoshildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const getAuthors = async (req, res) => {
    try {
        const authors = await Author.find({});
        if (!authors) {
            return res.status(400).send({ message: "Authorlar topilmadi" });
        }
        res.json(authors);
    } catch (error) {
        errorHandler(res, error);
    }
};

const getAuthorsById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const author = await Author.findOne({ _id: req.params.id });
        if (!author) {
            return res.status(400).send({ message: "Author topilmadi" });
        }
        res.json(author);
    } catch (error) {
        errorHandler(res, error);
    }
};

const updateAuthor = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const author = await Author.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    author_first_name: req.body.author_first_name,
                    author_last_name: req.body.author_last_name,
                    author_nick_name: req.body.author_nick_name,
                    author_password: req.body.author_password,
                    author_email: req.body.author_email,
                    author_phone: req.body.author_phone,
                    author_info: req.body.author_info,
                    author_position: req.body.author_position,
                    author_photo: req.body.author_photo,
                    is_expert: req.body.is_expert,
                },
            }
        );
        if (!author) {
            return res.status(400).send({ message: "Author topilmadi" });
        }
        res.json({ message: "Update qilindi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const refreshAuthorToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
        return res.status(400).send({ message: "Token topilmadi" });
    const authorDataFromCookie = await myJwt.verifyRefresh(refreshToken);

    const authorDataFromDB = await Author.findOne({
        author_token: refreshToken,
    });
    if (!authorDataFromDB || !authorDataFromCookie) {
        return res.status(400).send({ message: "Author ro'yxatdan o'tmagan" });
    }

    const author = await Author.findById(authorDataFromCookie.id);
    if (!author) return res.status(400).send({ message: "ID notogri" });

    const payload = {
        id: author._id,
        is_expert: author.is_expert,
        authorRoles: ["READ", "WRITE"],
    };
    const tokens = myJwt.generateTokens(payload);
    author.author_token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: config.get("refresh_ms"),
        httpOnly: true,
    });

    res.status(200).send({ ...tokens });
};

const loginAuthor = async (req, res) => {
    try {
        const { author_email, author_password } = req.body;
        const author = await Author.findOne({ author_email });
        if (!author)
            return res
                .status(400)
                .send({ message: "Email yoki parol noto'g'ri" });
        const validPassword = bcrypt.compareSync(
            author_password, //ochiq password
            author.author_password //bazadan olingan password
        );
        if (!validPassword)
            return res
                .status(400)
                .send({ message: "Email yoki parol noto'g'ri" });

        const payload = {
            id: author._id,
            is_expert: author.is_expert,
            authorRoles: ["READ", "WRITE"],
        };
        const tokens = myJwt.generateTokens(payload);
        console.log(tokens);

        // const token = generateAccessToken(author._id, author.is_expert, [
        //     "READ",
        //     "WRITE",
        // ]);

        author.author_token = tokens.refreshToken;
        await author.save();

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true,
        });

        res.status(200).send({ ...tokens });
    } catch (error) {
        errorHandler(res, error);
    }
};

const logoutAuthor = async (req, res) => {
    const { refreshToken } = req.cookies;
    let author;
    if (!refreshToken)
        return res.status(400).send({ message: "Token topilmadi" });
    author = await Author.findOneAndUpdate(
        { author_token: refreshToken },
        { author_token: "" },
        { new: true }
    );
    if (!author) return res.status(400).send({ message: "Token topilmadi" });
    res.clearCookie("refreshToken");
    return res.status(200).send({ author });
};

// const loginAuthor = async (req, res) => {
//     try {
//         const { author_email, author_password } = req.body;
//         const author = await Author.findOne({ author_email });
//         if (!author) {
//             return res
//                 .status(400)
//                 .send({ message: "Email yoki parol noto'g'ri" });
//         }
//         const validPassword = await bcrypt.compare(
//             author_password,
//             author.author_password
//         );
//         if (!validPassword) {
//             return res
//                 .status(400)
//                 .send({ message: "Email yoki parol noto'g'ri" });
//         }
//         res.status(200).send({ message: "Tizimga xush kelibsiz!" });
//     } catch (error) {
//         errorHandler(res, error);
//     }
// };

const deleteAuthor = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const author = await Author.deleteOne({ _id: req.params.id });
        if (!author) {
            return res.status(400).send({ message: "Author topilmadi" });
        }
        res.json({ message: "Author o'chirildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = {
    addAuthor,
    getAuthors,
    getAuthorsById,
    updateAuthor,
    deleteAuthor,
    loginAuthor,
    logoutAuthor,
    refreshAuthorToken,
};
