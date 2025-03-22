import express from 'express';
import { createContactMessage, getAllContactMessages } from '../controllers/contactController.js';

const contactRouter = express.Router();

// POST route for creating a message
contactRouter.post('/contact', createContactMessage);

// GET route for admin to fetch all messages
contactRouter.get('/contact', getAllContactMessages);

export default contactRouter;