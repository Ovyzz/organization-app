const checkLogin = require("../helper/user/user").checkLogin;
const pool = require("../database");
const router = require("express").Router();

router.post("/addpeople", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const createAt = new Date().toLocaleString();
        const { firstName, lastName, jobTitle } = req.body;
        if (firstName.length === 0 || lastName.length === 0 || jobTitle.length === 0) {
            res.json(false);
            return;
        }
        await pool.query("INSERT INTO peoples (firstName, lastName, jobTitle, creator, createAt) VALUES ($1, $2, $3, $4, $5)",
            [firstName, lastName, jobTitle, creator, createAt]);
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(400).json(false);
    }
});

router.get("/getpeoples", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const people = await pool.query("SELECT * FROM peoples where creator = $1", [creator]);
        res.json(people.rows);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.post("/updatingpeople", checkLogin, async (req, res) => {
    try {
        const { id, firstName, lastName, jobTitle } = req.body;
        const updateAt = new Date().toLocaleString();
        await pool.query("UPDATE peoples SET firstName = $1, lastName = $2, jobTitle = $3, updateAt = $4 WHERE id = $5",
            [firstName, lastName, jobTitle, updateAt, id]);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.post("/addrelationgroup", checkLogin, async (req, res) => {
    try {
        const { moveGroup, idCreator } = req.body;
        if (moveGroup == "Select a group" || idCreator === 0 ||
            typeof (moveGroup) == "undefined") {
            res.json(false);
            return;
        }
        const createAt = new Date().toLocaleString();
        await pool.query("INSERT INTO groupDetail (idGroup, idCreator, createAt) VALUES ($1, $2, $3)",
            [moveGroup, idCreator, createAt]);
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(400).json(false);
    }
});

router.post("/deletegrouplist", checkLogin, async (req, res) => {
    try {
        const {idCreator, idGroup} = req.body;
        await pool.query("DELETE FROM groupDetail WHERE idCreator = $1 and idGroup = $2", [idCreator, idGroup]);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

module.exports = router;
