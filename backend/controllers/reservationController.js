import Reservation from '../models/reservationModel.js';

// Create a new reservation
export const createReservation = async (req, res) => {
  const { name, email, phone, date, time, numberOfPeople } = req.body;

  try {
    const newReservation = new Reservation({
      user: req.userId,
      name,
      email,
      phone,
      date,
      time,
      numberOfPeople,
      status: 'confirmed',
    });

    await newReservation.save();
    res.status(201).json({ success: true, message: 'Reservation created successfully!', reservation: newReservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reservations for a user
export const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.userId }).sort({ date: 1, time: 1 });

    if (!reservations.length) {
      return res.status(404).json({ success: false, message: 'No reservations found' });
    }

    res.status(200).json({ success: true, reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single reservation by ID
export const getReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this reservation' });
    }

    res.status(200).json({ success: true, reservation });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a reservation by ID
export const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, date, time, numberOfPeople, status } = req.body;

  try {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this reservation' });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { name, email, phone, date, time, numberOfPeople, status },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Reservation updated successfully!', reservation: updatedReservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a reservation by ID
export const deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this reservation' });
    }

    await Reservation.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Reservation cancelled successfully!' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};