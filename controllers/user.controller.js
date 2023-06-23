const { errorHandler } = require("../helpers/error_handler");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
// const { userValidation } = require("../validations/user");
const config = require("config");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const mailService = require("../services/MailService");
const myJwt = require("../services/JwtService");

const addUser = async (req, res) => {
    try {
        // const { error, value } = userValidation(req.body);
        // if (error) {
        //     return res.status(400).send({ message: error.details[0].message });
        // }

        const {
            user_name,
            user_email,
            user_password,
            user_info,
            user_photo,
            created_date,
            updated_date,
        } = req.body;

        // console.log(value);

        const user = await User.findOne({ user_email });
        if (user) {
            return res.status(400).send({ message: "Bunday user kiritilgan" });
        }

        const hashedPassword = await bcrypt.hash(user_password, 7);
        const user_activation_link = uuid.v4();


        const newUser = await User({
            user_name,
            user_email,
            user_password: hashedPassword,
            user_info,
            user_photo,
            created_date,
            updated_date,
            user_activation_link,
        });

        await newUser.save();
        await mailService.sendActivationMail(
            user_email,
            `${config.get("api_url")}/api/user/activate/${user_activation_link}`
        );

        const payload = {
            id: newUser._id,
            userRoles: ["READ", "WRITE", 'CHANGE', 'DELETE'],
            user_is_active: newUser.user_is_active,
        };

        const tokens = myJwt.generateTokens(payload);
        newUser.user_token = tokens.refreshToken;
        await newUser.save();

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true,
        });

        res.status(200).send({ ...tokens, user: payload });
    } catch (error) {
        errorHandler(res, error);
    }
};

const userActivate = async (req, res) => {
    try {
        const user = await User.findOne({
            user_activation_link: req.params.link,
        });
        if (!user) {
            return res.status(400).send({ message: "Bunday user topilmadi" });
        }
        if (user.user_is_active) {
            return res.status(400).send({ message: "User already activated" });
        }
        user.user_is_active = true;
        await user.save();
        res.status(200).send({
            user_is_active: user.user_is_active,
            message: "user activated",
        });
    } catch (error) {
        errorHandler(res, error);
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            return res.status(400).send({ message: "Userlar topilmadi" });
        }
        res.json(users);
    } catch (error) {
        errorHandler(res, error);
    }
};

const getUsersById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).send({ message: "User topilmadi" });
        }
        res.json(user);
    } catch (error) {
        errorHandler(res, error);
    }
};

const updateUser = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const user = await User.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    user_name: req.body.user_name,
                    user_email: req.body.user_email,
                    user_password: req.body.user_password,
                    user_info: req.body.user_info,
                    user_photo: req.body.user_photo,
                    created_date: req.body.created_date,
                    updated_date: req.body.updated_date,
                },
            }
        );
        if (!user) {
            return res.status(400).send({ message: "User topilmadi" });
        }
        res.json({ message: "Update qilindi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        const user = await User.findOne({ user_email });
        if (!user)
            return res
                .status(400)
                .send({ message: "Email yoki parol noto'g'ri" });
        const validPassword = bcrypt.compareSync(
            user_password,
            user.user_password
        );
        if (!validPassword)
            return res
                .status(400)
                .send({ message: "Email yoki parol noto'g'ri" });

        const payload = {
            id: user._id,
            userRoles: ["READ", "WRITE", "CHANGE", "DELETE"],
        };
        const tokens = myJwt.generateTokens(payload);
        console.log(tokens);

        user.user_token = tokens.refreshToken;
        await user.save();

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true,
        });

        res.status(200).send({ ...tokens });
    } catch (error) {
        errorHandler(res, error);
    }
};

const logoutUser = async (req, res) => {
    const { refreshToken } = req.cookies;
    let user;
    if (!refreshToken)
        return res.status(400).send({ message: "Token topilmadi" });
    user = await User.findOneAndUpdate(
        { user_token: refreshToken },
        { user_token: "" },
        { new: true }
    );
    if (!user) return res.status(400).send({ message: "Token topilmadi" });
    res.clearCookie("refreshToken");
    return res.status(200).send({ user });
};

const deleteUser = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const user = await User.deleteOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).send({ message: "User topilmadi" });
        }
        res.json({ message: "User o'chirildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = {
    addUser,
    getUsers,
    getUsersById,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,
    userActivate,
};
