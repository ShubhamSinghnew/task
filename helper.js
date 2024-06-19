import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

function jwtsign(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, process.env.jwtsecretkey, { expiresIn: '2h' },(err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  }


const verifyToken = async (req, res, next) => {
    const token =  req.headers["authcode"];
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, process.env.jwtsecretkey);
      // console.log(decoded)
      req.email = decoded.email; 
      req.password = decoded.password; 
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };

export {jwtsign , verifyToken}