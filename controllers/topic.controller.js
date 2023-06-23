const { errorHandler } = require("../helpers/error_handler");
const Topic = require("../models/Topic");
const mongoose = require("mongoose");

const addTopic = async (req, res) => {
    try {
        const {
            author_id,
            topic_title,
            topic_text,
            is_checked,
            is_approved,
            expert_id,
            created_at,
            updated_at,
        } = req.body;
        const newTopic = await Topic({
            author_id,
            topic_title,
            topic_text,
            is_checked,
            is_approved,
            expert_id,
            created_at,
            updated_at,
        });

        await newTopic.save();
        res.status(200).send({ message: "Yangi topic qo'shildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const getTopics = async (req, res) => {
    try {
        const topics = await Topic.find({});
        if (!topics) {
            return res.status(400).send({ message: "Topiclar topilmadi" });
        }
        res.json({ data: topics });
    } catch (error) {
        errorHandler(res, error);
    }
};

const getTopicsById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const topic = await Topic.findOne({ _id: req.params.id });
        if (!topic) {
            return res.status(400).send({ message: "Topic topilmadi" });
        }
        res.json(topic);
    } catch (error) {
        errorHandler(res, error);
    }
};

const updateTopic = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const topic = await Topic.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    author_id: req.body.author_id,
                    topic_title: req.body.topic_title,
                    topic_text: req.body.topic_text,
                    is_checked: req.body.is_checked,
                    is_approved: req.body.is_approved,
                    expert_id: req.body.expert_id,
                    created_at: req.body.created_at,
                    updated_at: req.body.updated_at,
                },
            }
        );
        if (!topic) {
            return res.status(400).send({ message: "Topic topilmadi" });
        }
        res.json({ message: "Update qilindi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

const deleteTopic = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "Incorrect ID" });
        }
        const topic = await Topic.deleteOne({ _id: req.params.id });
        if (!topic) {
            return res.status(400).send({ message: "Topic topilmadi" });
        }
        res.json({ message: "Topic o'chirildi" });
    } catch (error) {
        errorHandler(res, error);
    }
};

module.exports = {
    addTopic,
    getTopics,
    getTopicsById,
    updateTopic,
    deleteTopic,
};
