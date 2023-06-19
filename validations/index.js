const author_email_pass = require("./author_email_pass.validator");
const author = require("./author.validator");
const category = require("./category.validator");
const admin_email_pass = require("./admin_email_pass.validator");
const admin = require("./admin.validator");
const user_email_pass = require("./user_email_pass.validator");
const user = require("./user.validator");

module.exports = {
    author_email_pass,
    author,
    category,
    admin_email_pass,
    admin,
    user_email_pass,
    user,
};
