const { errorHandler } = require("../helpers/error_handler");
const Synonym = require("../models/Synonym");
const mongoose = require("mongoose");

const addSynonym = async (req, res) => {
    try {
        const { desc_id, dict_id } = req.body;
        const newSynonym = await Synonym({
            desc_id,
            dict_id,
        });

        await newSynonym.save();
        res.status(200).send({ message: "Yangi synonym qoshildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const getSynonyms = async (req, res) => {
    try {
        const synonyms = await Synonym.find({});
        if (!synonyms) {
            return res
                .status(400)
                .send({ message: "Synonymlar topilmadi" });
        }
        res.json(synonyms);
    } catch (error) {
        errorHandler(res, error);
    }
};

const getSynonymsById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const synonym = await Synonym.findOne({ _id: req.params.id });
        if (!synonym) {
            return res.status(400).send({ message: "Synonym topilmadi" });
        }
        res.json(synonym);
    } catch (error) {
        errorHandler(res, error);
    }
};

const updateSynonym = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const synonym = await Synonym.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    desc_id: req.body.desc_id,
                    dict_id: req.body.dict_id
                },
            }
        );
        if (!synonym) {
            return res.status(400).send({ message: "Synonym topilmadi" });
        }
        res.json({ message: "Update qilindi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const deleteSynonym = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const synonym = await Synonym.deleteOne({ _id: req.params.id });
        if (!synonym) {
            return res.status(400).send({ message: "Synonym topilmadi" });
        }
        res.json({ message: "Synonym o'chirildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = {
    addSynonym,
    getSynonyms,
    getSynonymsById,
    updateSynonym,
    deleteSynonym,
};
