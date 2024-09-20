import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// i havent use this auth to any where just mention here 

const sign = async (payload) => {
    if (!payload) {
        throw new Error("Payload is empty");
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
    return token;
}

const verify = async (req, res, next) => {
    const authcode = req.headers['authcode']; // Extracting the JWT token from the headers

    try {
        if (!authcode) {
            return res.status(400).json({ message: "JWT token is missing" });
        }

        const verified = jwt.verify(authcode, process.env.jwtsecretkey);
        if (verified) {
            next(); // Call next middleware or route handler
        } else {
            res.status(400).json({ message: "Unauthorized access" });
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(400).json({ message: "Invalid JWT token" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

export {verify, sign}