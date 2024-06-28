import express from 'express';
import {addUser, add_review, check,  check_payment,  get_all_post,  get_post, login, post_tution, save_post } from "../controller/user.js"
import { verifyToken } from '../helper.js';
const router = express.Router();   

router.post("/api/addUser", addUser)
router.post('/api/login', login)
router.post('/api/post',verifyToken, post_tution)
router.post('/api/addReviews',verifyToken, add_review)
router.post('/api/allpost', get_post)
router.post('/api/savepost',verifyToken, save_post)
router.post('/api/check', check)
router.post('/api/check_payment', check_payment)
router.post('/api/get_all_post', get_all_post)
// router.post('/api/forget', forgetPassword);
// router.post('/api/reset', restPassword);

export default router;
