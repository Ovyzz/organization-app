const jwt = require("jsonwebtoken");
require("dotenv").config();

function checkLogin(req, res, next) {
    const token = req.header("token");
    if (!token) {
        return res.status(500).json({message: "You are not authorized for this action"});
    }
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = user;
    next();
  }

function generateUserAccessToken(email) {
    return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '12h' });
}

module.exports = {checkLogin, generateUserAccessToken};
