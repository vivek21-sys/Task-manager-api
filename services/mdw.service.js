const jwt = require("jsonwebtoken");

function is_logged_in(req, res, next) 
{
    try 
    {
        let token = req.headers.authorization;
        if (!token)
        {
            res.json({
                ok: false,
                type : "LOGIN",
                msg: "No token provided"
            })
        }
        else
        {
            let user = jwt.verify(token, process.env.TOKEN_SECRET)
            req.user = user;
            next();
        }
    }
    catch (e)
    {
        res.json({
            ok: false,
            type : "LOGIN",
            msg: "Invalid token"
        })
    }
}

module.exports = {
    is_logged_in
}