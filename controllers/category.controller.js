const { errorHandler } = require("../helpers/error_handler");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const { categoryValidation } = require("../validations/category");

const addCategory = async (req, res) => {
    try {
        const { error, value } = categoryValidation(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const { category_name, parent_category_id } = value;

        const category = await Category.findOne({
            category_name: { $regex: category_name, $options: "i" },
        });

        if (category) {
            return res
                .status(400)
                .send({ message: "Bunday kategoriya kiritilgan" });
        }

        const newCategory = await Category({
            category_name,
            parent_category_id,
        });

        await newCategory.save();
        res.status(200).send({ message: "Yangi category qoshildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const getCategorys = async (req, res) => {
    try {
        const categorys = await Category.find({});
        if (!categorys) {
            return res.status(400).send({ message: "Categorylar topilmadi" });
        }
        res.json(categorys);
    } catch (error) {
        errorHandler(res, error);
    }
};

const getCategorysById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const category = await Category.findOne({ _id: req.params.id });
        if (!category) {
            return res.status(400).send({ message: "Kategoriya topilmadi" });
        }
        res.json(category);
    } catch (error) {
        errorHandler(res, error);
    }
};

const updateCategory = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const category = await Category.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    category_name: req.body.category_name,
                    parent_category_id: req.body.parent_category_id,
                },
            }
        );
        if (!category) {
            return res.status(400).send({ message: "Category topilmadi" });
        }
        res.json({ message: "Update qilindi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const deleteCategory = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const category = await Category.deleteOne({ _id: req.params.id });
        if (!category) {
            return res.status(400).send({ message: "Category topilmadi" });
        }
        res.json({ message: "Category o'chirildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = {
    addCategory,
    getCategorys,
    getCategorysById,
    updateCategory,
    deleteCategory,
};
