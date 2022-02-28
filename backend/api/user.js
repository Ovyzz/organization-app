const bcrypt = require("bcrypt");
const { checkEmailAlreadyUse } = require("../validator/user");
const checkLogin = require("../helper/user/user").checkLogin;
const generateUserAccessToken = require("../helper/user/user").generateUserAccessToken;
const pool = require("../database");
const router = require("express").Router();

router.post("/register", async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;
        const emailInUse = await checkEmailAlreadyUse(email);
        if (emailInUse) {
            return res.status(400).json("This email is already used");
        }
        if (firstName.length === 0 || lastName.length === 0 || password.length === 0 || email.length === 0) {
            return res.status(400).json("Try again, complete all fields or select another email");
        }
        const salt = await bcrypt.genSalt(10);
        const cryptPassword = await bcrypt.hash(password, salt);
        const newUser = await pool.query("INSERT INTO users (email, firstName, lastName, password) VALUES ($1, $2, $3, $4)", [email, firstName, lastName, cryptPassword]);
        return res.status(200).json("Account has been successfully registered");
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(403).json({ message: "The email address you entered is invalid" });
        }
        const bcryptPassword = await bcrypt.compare(password, user.rows[0].password);
        if (bcryptPassword) {
            const token = generateUserAccessToken({ email: email });
            res.json(token);
        } else {
            return res.status(403).json({ message: "The password you entered is invalid" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.get("/authorization", checkLogin, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.get("/getuserdata", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const name = await pool.query("SELECT lastName FROM users WHERE email = $1", [creator]);
        const lastPerson = await pool.query("SELECT * FROM peoples WHERE creator = $1 ORDER BY createat ASC", [creator]);
        const lastUpdatePerson = await pool.query("SELECT * FROM peoples WHERE creator = $1 ORDER BY updateat ASC", [creator]);
        const lastGroup = await pool.query("SELECT * FROM groups WHERE creator = $1 ORDER BY createat ASC", [creator]);
        const lastUpdateGroup = await pool.query("SELECT * FROM groups WHERE creator = $1 ORDER BY updateat ASC", [creator]);
        let lastPersonData;
        let lastGroupData;
        let lastUpdatePersonData;
        let lastUpdateGroupData;
        if (lastPerson.rows.length !== 0) {
            lastPersonData = lastPerson.rows[lastPerson.rows.length - 1].firstname + " " +
                lastPerson.rows[lastPerson.rows.length - 1].lastname + " " +
                new Date(lastPerson.rows[lastPerson.rows.length - 1].createat).toLocaleString();
        }
        if (lastUpdatePerson.rows.length !== 0) {
            lastUpdatePersonData = lastUpdatePerson.rows[lastPerson.rows.length - 1].firstname + " " +
                lastUpdatePerson.rows[lastPerson.rows.length - 1].lastname + " " +
                new Date(lastUpdatePerson.rows[lastPerson.rows.length - 1].updateat).toLocaleString();
        }
        if (lastGroup.rows.length !== 0) {
            lastGroupData = lastGroup.rows[lastPerson.rows.length - 1].groupname + " " +
                new Date(lastGroup.rows[lastPerson.rows.length - 1].updateat).toLocaleString();
        }
        if (lastUpdateGroup.rows.length !== 0) {
            lastUpdateGroupData = lastUpdateGroup.rows[lastPerson.rows.length - 1].groupname + " " +
                new Date(lastUpdateGroup.rows[lastPerson.rows.length - 1].updateat).toLocaleString();
        }
        const userData = {
            name: name.rows[0].lastname,
            lastPerson: lastPersonData,
            lastUpdatePerson: lastUpdatePersonData,
            lastGroup: lastGroupData,
            lastUpdateGroup: lastUpdateGroupData
        }
        res.json(userData);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

module.exports = router;
