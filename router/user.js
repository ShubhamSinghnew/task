import express from 'express';
import {addUser, login} from "../controller/user.js"
import { verifyToken } from '../helper.js';
const router = express.Router();   

router.post("/api/addUser",addUser)
router.post('/api/login', verifyToken, login);

export default router;
