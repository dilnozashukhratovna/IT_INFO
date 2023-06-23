const { errorHandler } = require("../helpers/error_handler");
const Dictionary = require("../models/Dictionary");
const mongoose = require("mongoose")



const addTerm = async (req, res) => {
    try {
        const { term } = req.body;
        const dict = await Dictionary.findOne({
            term: { $regex: term, $options: "i" },
        });
        if (dict) {
            return res
                .status(400)
                .send({ message: "Bunday termin avval kiritilgan" });
        }
        const newTerm = await Dictionary({
            term,
            letter: term[0],
        });
        await newTerm.save();
        res.status(200).send({ message: "Yangi termin qo'shildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};


const getTerms = async (req, res) => {
    try {
        const terms = await Dictionary.find({});
        if (!terms) {
            return res.status(400).send({ message: "Termlar topilmadi" });
        }
        res.json({data: terms});
    } catch (error) {
        errorHandler(res, error);
    }
}


const getTermsById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const term = await Dictionary.findOne({ _id: req.params.id });
        if (!term) {
            return res.status(400).send({ message: "Term topilmadi" });
        }
        res.json(term);
    } catch (error) {
        errorHandler(res, error);
    }
};


const getTermsByLetter = async (req, res) => {
    try {
        const letter = req.params.letter;
        const terms = await Dictionary.find({ letter });

        if (!terms) {
            return res
                .status(400)
                .send({ message: "Birorta termin topilmadi" });
        }
        res.json({ terms });
    } catch (error) {
        errorHandler(res, error);
    }
};


const updateTerm = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const term = await Dictionary.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    term: req.body.term,
                    letter: req.body.term[0],
                },
            }
        );
        if (!term) {
            return res.status(400).send({ message: "Term topilmadi" });
        }
        res.json({ message: "Update qilindi" });
    } catch (error) {
        errorHandler(res, error);
    }
};


const deleteTerm = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const term = await Dictionary.deleteOne({ _id: req.params.id });
        if (!term) {
            return res.status(400).send({ message: "Term topilmadi" });
        }
        res.json({ message: "Term o'chirildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};


module.exports = {
    addTerm,
    getTerms,
    getTermsById,
    updateTerm,
    deleteTerm,
    getTermsByLetter,
};
