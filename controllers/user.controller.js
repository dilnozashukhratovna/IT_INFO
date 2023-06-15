const { errorHandler } = require("../helpers/error_handler");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const { userValidation } = require("../validations/user");

const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
    try {
        const { error, value } = userValidation(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const {
            user_name,
            user_email,
            user_password,
            user_info,
            user_photo,
            created_date,
            updated_date,
            user_is_active,
        } = value;

        console.log(value);

        const user = await User.findOne({ user_email });
        if (user) {
            return res.status(400).send({ message: "Bunday user kiritilgan" });
        }

        const hashedPassword = await bcrypt.hash(user_password, 7);

        const newUser = await User({
            user_name,
            user_email,
            user_password: hashedPassword,
            user_info,
            user_photo,
            created_date,
            updated_date,
            user_is_active,
        });

        await newUser.save();
        res.status(200).send({ message: "Yangi user qoshildi" });
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
                    user_is_active: req.body.user_is_active,
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

        res.status(200).send({ message: "Tizimga xush kelibsiz!" });
    } catch (error) {
        errorHandler(res, error);
    }
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
};
