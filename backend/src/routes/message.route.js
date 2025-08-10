import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsers, sendMessage, getMessages } from '../controllers/message.controller.js';
const router = express.Router();

router.get('/users',protectRoute ,getUsers);
router.get('/:userId',protectRoute ,getMessages);
router.post('/send/:userId',protectRoute ,sendMessage);
export default router;