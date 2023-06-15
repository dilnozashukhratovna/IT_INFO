const Joi = require("joi");

exports.adminValidation = (data) => {
    const schema = Joi.object({
        admin_name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).required(),
        admin_email: Joi.string().email(),
        admin_password: Joi.string().min(6).max(20),
        confirm_password: Joi.ref("admin_password"),
        admin_is_active: Joi.boolean().default(true),
        admin_is_creator: Joi.boolean().default(true),
        created_date: Joi.date(),
        updated_date: Joi.date(),
    });
    return schema.validate(data, { abortEarly: false });
};
