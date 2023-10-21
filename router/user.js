import express from 'express';
import {addUser , createTaks, deleteTask, login , readTask, Update , } from "../controller/user.js"
import { verifyToken } from '../helper.js';
const router = express.Router();   

router.post("/api/addUser",addUser)
router.post('/api/login', verifyToken, login);

router.post("/api/createTask",verifyToken,createTaks)

router.get("/api/readTask/:userId",readTask)


//we use patch here also but i use updateOne function here so i use post 
router.post("/api/UpdateTask",verifyToken,Update)

//we use delete here also but i use deleteOne in function here so i use post 
router.post("/api/deleteTask",verifyToken,deleteTask)
export default router;