const exp = require("express");
const router = exp.Router();
const db = require("../services/db.service");
const jwt = require("jsonwebtoken");
const mdw = require("../services/mdw.service");
const multer = require("multer");
const path = require("path");



// User Authentication
router.post("/authenticate", async (req, res) => {
    let u = req.body;
    if (!u.email || !u.password) {
        return res.json({
            ok: false,
            msg: "Email and Password are mandatory",
        });
    }
    
    let data = await db.executeProcedure("sp_user_authenticate", [u.email, u.password]);
    data = data[0];
    
    if (data.ok) {
        let token = jwt.sign(data.data, process.env.TOKEN_SECRET, { expiresIn: "24h" });
        data.token = token;
    }
    res.json(data);
});

// Add User
router.post("/add", [mdw.is_logged_in], async (req, res) => {
    // let uid = req.user.id;
    let u = req.body;
    if (!u.fname || !u.lname || !u.username || !u.email || !u.password || !u.phone) {
        return res.json({
            ok: false,
            msg: "All fields are mandatory"
        });
    }

    let data = await db.executeProcedure("sp_user_add", [
        u.fname,
        u.lname,
        u.username,
        u.email,
        u.phone,
        u.alter_phone,
        u.password,
        u.dob,
    ]);
    res.json(data[0]);
});

// Update User
router.post("/update/:id", [mdw.is_logged_in], async (req, res) => {
    let u = req.body;
    let uid =req.params.id;
    if (!u.fname || !u.lname || !u.username || !u.email) {
        return res.json({
            ok: false,
            msg: "All data is mandatory",
        });
    }

    let data = await db.executeProcedure("sp_user_update", [
        uid,
        u.fname,
        u.lname,
        u.username,
        u.email,
        u.phone,
        u.alter_phone,
        u.dob,
    ]);
    res.json(data[0]);
});

// Remove User
router.post("/remove/:id", [mdw.is_logged_in], async (req, res) => {
    let id = req.params.id;
    let data = await db.executeProcedure("sp_user_remove", [id]);
    res.json({
        ok: true,
        msg: "Removed successfully",
    });
});

// Search Users
router.post("/search", [mdw.is_logged_in], async (req, res) => {
    let u = req.body;
    let data = await db.executeProcedure("sp_user_search", [
        u.fname || "",
        u.lname || "",
        u.email || "",
        u.username ||"",
        u.phone || "",
        u.rc || 10,
        u.page || 1,
    ]);
    res.json(data);
});

module.exports = router;
