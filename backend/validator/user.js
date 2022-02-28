const pool = require("../database");

async function checkEmailAlreadyUse(email) {
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length !== 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
}

module.exports = {checkEmailAlreadyUse};
