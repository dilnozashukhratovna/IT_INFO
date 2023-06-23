const { Schema, model } = require("mongoose");

const topicSchema = new Schema(
    {
        author_id: {
            type: Schema.Types.ObjectId,
            ref: "Author",
        },
        topic_title: {
            type: String,
            required: true,
            trim: true,
        },
        topic_text: {
            type: String,
            required: true,
            trim: true,
        },
        is_checked: {
            type: Boolean,
            required: true,
        },
        is_approved: {
            type: Boolean,
            required: true,
        },
        expert_id: {
            type: Schema.Types.ObjectId,
            ref: "Author",
        },
        created_at: {
            type: Date,
        },
        updated_at: {
            type: Date,
        },
    },
    {
        versionKey: false,
    }
);

module.exports = model("Topic", topicSchema);
