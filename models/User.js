const { boolean } = require("joi");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        user_name: {
            type: String,
            reuired: true,
            trim: true,
        },
        user_email: {
            type: String,
            reuired: true,
            trim: true,
            unique: true,
        },
        user_password: {
            type: String,
            reuired: true,
            trim: true,
        },
        user_info: {
            type: String,
            reuired: true,
            trim: true,
        },
        user_photo: {
            type: String,
            reuired: true,
            trim: true,
        },
        created_date: {
            type: Date,
        },
        updated_date: {
            type: Date,
        },
        user_is_active: {
            type: Boolean,
        },
        user_token: {
            type: String,
        },
    },
    {
        versionKey: false,
    }
);

module.exports = model("User", userSchema);