const checkLogin = require("../helper/user/user").checkLogin;
const pool = require("../database");
const router = require("express").Router();

router.post("/addgroup", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const createAt = new Date().toLocaleString();
        const { groupName, parentGroup } = req.body;
        if (groupName.length === 0) {
            res.json(false);
            return;
        }
        await pool.query("INSERT INTO groups (groupName, creator, createAt) VALUES ($1, $2, $3)",
            [groupName, creator, createAt]);
        if (parentGroup == "Select a parent group" || typeof (parentGroup) == "undefined") {
            res.json(true);
            return;
        }
        const group = await pool.query("SELECT * FROM groups where creator = $1 and createAt = $2", [creator, createAt]);
        await pool.query("INSERT INTO groupTree (parent, child, creator, createAt) VALUES ($1, $2, $3, $4)",
            [parentGroup, group.rows[0].id, creator, createAt]);
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(400).json(false);
    }
});

router.get("/getgroups", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const group = await pool.query("SELECT * FROM groups where creator = $1", [creator]);
        res.json(group.rows);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.post("/getgroupsuser", checkLogin, async (req, res) => {
    try {
        const creator = req.user.email;
        const idCreator = req.body.idCreator;
        const selectedList = await pool.query("SELECT groups.id, groups.groupName FROM groups INNER JOIN groupDetail ON (groups.id = groupDetail.idgroup AND groupDetail.idCreator = $1) WHERE groups.creator = $2", [idCreator, creator]);
        const selectionList = await pool.query("SELECT groups.id, groups.creator, groups.groupName FROM groups LEFT JOIN groupDetail ON (groups.id = groupDetail.idgroup AND groupDetail.idCreator = $1) WHERE groupDetail.idgroup IS null AND groups.creator = $2", [idCreator, creator]);
        res.json([selectionList.rows, selectedList.rows]);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

router.post("/updatinggroup", checkLogin, async (req, res) => {
    try {
        const { id, groupName } = req.body;
        const updateAt = new Date().toLocaleString();
        await pool.query("UPDATE groups SET groupName = $1, updateAt = $2 WHERE id = $3",
            [groupName, updateAt, id]);
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Server Error");
    }
});

module.exports = router;
