require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {

    // const authHeader = req.headers.authorization;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(403).json({
            message: "Token is missing"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
     
