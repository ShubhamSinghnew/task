import express from 'express';
import {addUser, add_review, check, create_ord, forgetPassword, get_post, login, post_tution, save_post, verify_payment} from "../controller/user.js"
import { verifyToken } from '../helper.js';
const router = express.Router();   

router.post("/api/addUser", addUser)
router.post('/api/login', login)
router.post('/api/post',verifyToken, post_tution)
router.post('/api/addReviews',verifyToken, add_review)
router.post('/api/allpost',verifyToken, get_post)
router.post('/api/savepost',verifyToken, save_post)
router.post('/api/create_ord',verifyToken, create_ord)
router.post('/api/payment/verify',verifyToken, verify_payment)
router.post('/api/check', check)
// router.post('/api/forget', forgetPassword);
// router.post('/api/reset', restPassword);

export default router;
