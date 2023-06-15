const { errorHandler } = require("../helpers/error_handler");
const Description = require("../models/Description");
const mongoose = require("mongoose");

const addDescription = async (req, res) => {
    try {
        const { description, category_id } = req.body;
        const newDescription = await Description({
            description,
            category_id,
        });

        await newDescription.save();
        res.status(200).send({ message: "Yangi description qoshildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const getDescriptions = async (req, res) => {
    try {
        const descriptions = await Description.find({});
        if (!descriptions) {
            return res.status(400).send({ message: "Descriptionlar topilmadi" });
        }
        res.json(descriptions);
    } catch (error) {
        errorHandler(res, error);
    }
};

const getDescriptionsById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const description = await Description.findOne({ _id: req.params.id });
        if (!description) {
            return res.status(400).send({ message: "Description topilmadi" });
        }
        res.json(description);
    } catch (error) {
        errorHandler(res, error);
    }
};

const updateDescription = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const description = await Description.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    description: req.body.description,
                    category_id: req.body.category_id,
                },
            }
        );
        if (!description) {
            return res.status(400).send({ message: "Description topilmadi" });
        }
        res.json({ message: "Update qilindi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const deleteDescription = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const description = await Description.deleteOne({ _id: req.params.id });
        if (!description) {
            return res.status(400).send({ message: "Description topilmadi" });
        }
        res.json({ message: "Description o'chirildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = {
    addDescription,
    getDescriptions,
    getDescriptionsById,
    updateDescription,
    deleteDescription,
};
