import express from 'express';
import {addUser, add_review, forgetPassword, get_post, login, post_tution, restPassword, save_post} from "../controller/user.js"
import { verifyToken } from '../helper.js';
const router = express.Router();   

router.post("/api/addUser", addUser)
router.post('/api/login', login)
router.post('/api/post',verifyToken, post_tution)
router.post('/api/addReviews',verifyToken, add_review)
router.post('/api/allpost',verifyToken, get_post)
router.post('/api/savepost',verifyToken, save_post)
// router.post('/api/forget', forgetPassword);
// router.post('/api/reset', restPassword);

export default router;