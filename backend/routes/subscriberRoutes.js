import express from 'express';
import { getAllSubs, newSubs } from '../controllers/subscriberController.js';

const router = express.Router();

router.get('/allSubscribers',getAllSubs);

router.post('/newSub', newSubs);



export default router;