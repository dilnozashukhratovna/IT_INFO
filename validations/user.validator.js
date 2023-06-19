const Joi = require("joi");

const userSchema = Joi.object({
    user_name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).required(),
    user_email: Joi.string().email().required(),
    user_password: Joi.string().min(8).max(20),
    confirm_password: Joi.ref("user_password"),
    user_info: Joi.string(),
    user_photo: Joi.string().default("/photos/avatar.jpg"),
    created_date: Joi.date(),
    updated_date: Joi.date(),
    user_is_active: Joi.boolean().default(false),
});

module.exports = userSchema
