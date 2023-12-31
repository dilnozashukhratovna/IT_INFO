const { errorHandler } = require("../helpers/error_handler");
const Admin = require("../models/Admin");
const { default: mongoose } = require("mongoose");
const { adminValidation } = require("../validations/admin");
const config = require('config');
const bcrypt = require("bcrypt");

const myJwt = require("../services/JwtService");

const addAdmin = async (req, res) => {
    try {
        // const { error, value } = adminValidation(req.body);
        // if (error) {
        //     return res.status(400).send({ message: error.details[0].message });
        // }

        const {
            admin_name,
            admin_email,
            admin_password,
            admin_is_active,
            admin_is_creator,
            created_date,
            updated_date,
        } = req.body;

        // console.log(value);

        const admin = await Admin.findOne({ admin_email });
        if (admin) {
            return res.status(400).send({ message: "Bunday admin kiritilgan" });
        }

        const hashedPassword = await bcrypt.hash(admin_password, 7);

        const newAdmin = await Admin({
            admin_name,
            admin_email,
            admin_password: hashedPassword,
            admin_is_active,
            admin_is_creator,
            created_date,
            updated_date,
        });

        await newAdmin.save();
        res.status(200).send({ message: "Yangi admin qoshildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({});
        if (!admins) {
            return res.status(400).send({ message: "Adminlar topilmadi" });
        }
        res.json(admins);
    } catch (error) {
        errorHandler(res, error);
    }
};

const getAdminsById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const admin = await Admin.findOne({ _id: req.params.id });
        if (!admin) {
            return res.status(400).send({ message: "Admin topilmadi" });
        }
        res.json(admin);
    } catch (error) {
        errorHandler(res, error);
    }
};

const updateAdmin = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const admin = await Admin.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    admin_name: req.body.admin_name,
                    admin_email: req.body.admin_email,
                    admin_password: req.body.admin_password,
                    admin_is_active: req.body.admin_is_active,
                    admin_is_creator: req.body.admin_is_creator,
                    created_date: req.body.created_date,


                    updated_date: req.body.updated_date,
                },
            }
        );
        if (!admin) {
            return res.status(400).send({ message: "Admin topilmadi" });
        }
        res.json({ message: "Update qilindi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { admin_email, admin_password } = req.body;
        const admin = await Admin.findOne({ admin_email });
        if (!admin)
            return res
                .status(400)
                .send({ message: "Email yoki parol noto'g'ri" });
        const validPassword = bcrypt.compareSync(
            admin_password,
            admin.admin_password
        );  
        if (!validPassword)
            return res
                .status(400)
                .send({ message: "Email yoki parol noto'g'ri" });

        const payload = {
            id: admin._id,
            is_expert: admin.is_expert,
            adminRoles: ["READ", "WRITE", "CHANGE", "DELETE"],
        };
        const tokens = myJwt.generateTokens(payload);
        console.log(tokens);

        admin.admin_token = tokens.refreshToken;
        await admin.save();

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true,
        });


        res.status(200).send({...tokens});
    } catch (error) {
        errorHandler(res, error);
    }
};

const logoutAdmin = async (req, res) => {
    const { refreshToken } = req.cookies;
    let admin;
    if (!refreshToken)
        return res.status(400).send({ message: "Token topilmadi" });
    admin = await Admin.findOneAndUpdate(
        { admin_token: refreshToken },
        { admin_token: "" },
        { new: true }
    );
    if (!admin) return res.status(400).send({ message: "Token topilmadi" });
    res.clearCookie("refreshToken");
    return res.status(200).send({ admin });
};

const deleteAdmin = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const admin = await Admin.deleteOne({ _id: req.params.id });
        if (!admin) {
            return res.status(400).send({ message: "Admin topilmadi" });
        }
        res.json({ message: "Admin o'chirildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = {
    addAdmin,
    getAdmins,
    getAdminsById,
    updateAdmin,
    deleteAdmin,
    loginAdmin,
    logoutAdmin,
};
