import express from 'express';
import { 
  createReservation, 
  getUserReservations, 
  getReservation, 
  updateReservation, 
  deleteReservation 
} from '../controllers/reservationController.js';
import authMiddleware from '../middleware/auth.js';

const reservationRouter = express.Router();

// Apply auth middleware to all reservation routes
reservationRouter.use(authMiddleware);

// Define routes for reservations
reservationRouter.post('/', createReservation); // Create a new reservation
reservationRouter.get('/', getUserReservations); // Get all reservations for the user
reservationRouter.get('/:id', getReservation); // Get a specific reservation by ID
reservationRouter.put('/:id', updateReservation); // Update reservation by ID
reservationRouter.delete('/:id', deleteReservation); // Delete reservation by ID

export default reservationRouter;