import express from 'express';
import { creatTask } from '../controller/createTask.js';
import { updateTask } from '../controller/updateTask.js';
import { getTask, getTaskById, getTaskByPage } from '../controller/getTask.js';
import { deleteTask } from '../controller/deleteTask.js';

const router = express.Router();

router.post('/createTask',creatTask)
router.put('/updateTask/:id',updateTask)
router.get("/getTaskByFilter",getTask)
router.get("/getTaksById/:id",getTaskById)
router.get('/getAllTask',getTaskByPage)
router.delete("/deleteTask/:id",deleteTask)
export default router;
