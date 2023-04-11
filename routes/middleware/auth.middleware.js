module.exports.protected = (req, res, next) =>{
    if(req.headers.authorization !== undefined){
        try {
            const jwt = require("jsonwebtoken");
            const verified = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET_KEY);
            if(verified){
                req.user = verified
                next();
            }else{
                return res.status(400).send({error:"Invalid Authorization Token"});
            }
        } catch (error) {
            return res.status(500).send({error: error.message});
        }
    }
    else{
        res.status(401).send({error: "Authentication Token is mandatory"});
    }
}