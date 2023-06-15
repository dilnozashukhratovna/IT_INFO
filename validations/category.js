const Joi = require("joi");

exports.categoryValidation = (data) => {
    const schema = Joi.object({
        category_name: Joi.string()
            .min(2)
            .message("Kategoriya nomi 2 ta harfdan kam bolmasligi k-k")
            .max(255)
            .message("Kategoriya nomi 255 ta harfdan ko'p bolmasligi k-k")
            .required(),
        parent_category_id: Joi.string().alphanum(),
    });
    return schema.validate(data, { abortEarly: false });
};
