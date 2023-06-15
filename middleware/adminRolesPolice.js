const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method == "OPTIONS") {
            next();
        }
        try {
            const authorization = req.headers.authorization;
            if (!authorization) {
                return res
                    .status(403)
                    .json({ message: "Admin ro'yxatdan o'tmagan" });
            }

            console.log(authorization);
            const bearer = authorization.split(" ")[0];
            const token = authorization.split(" ")[1];

            if (bearer != "Bearer" || !token) {
                return res.status(403).json({
                    message: "Admin ro'yxatdan o'tmagan (token berilmagan)",
                });
            }

            const { admin_is_active, admin_is_creator, adminRoles } =
                jwt.verify(token, config.get("secret"));

            let hasRole = false;
            adminRoles.forEach((adminRole) => {
                if (roles.includes(adminRole)) hasRole = true;
            });

            if (!admin_is_active || !hasRole || !admin_is_creator) {
                return res.status(403).json({
                    message: "Sizga bunday huquq berilmagan",
                });
            }

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "Admin ro'yxatdan o'tmagan (token notog'ri)",
            });
        }
    };
};
