// UpdateReservation.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const UpdateReservation = ({ reservationId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    numberOfPeople: 1,
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const response = await axios.get(`http://localhost:4000/api/reservation/${reservationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData(response.data.reservation);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await axios.put(
        `http://localhost:4000/api/reservation/${reservationId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitting(false);
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(response.data.reservation);
      }
    } catch (error) {
      setSubmitting(false);
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading reservation data...</p>
    </div>
  );

  return (
    <div className="update-reservation-form">
      <h3>Update Reservation</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="update-name">Guest Name</label>
          <input 
            type="text" 
            id="update-name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="update-email">Email</label>
            <input 
              type="email" 
              id="update-email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="update-phone">Phone</label>
            <input 
              type="tel" 
              id="update-phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="update-date">Date</label>
            <input 
              type="date" 
              id="update-date" 
              name="date" 
              value={formData.date && formData.date.split('T')[0]} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="update-time">Time</label>
            <input 
              type="time" 
              id="update-time" 
              name="time" 
              value={formData.time} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="update-guests">Number of People</label>
            <div className="number-input">
              <button 
                type="button" 
                onClick={() => setFormData({...formData, numberOfPeople: Math.max(1, formData.numberOfPeople - 1)})}
                className="decrease-btn"
              >-</button>
              <input
                type="number"
                id="update-guests"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleChange}
                min="1"
                max="20"
                required
              />
              <button 
                type="button" 
                onClick={() => setFormData({...formData, numberOfPeople: Math.min(20, formData.numberOfPeople + 1)})}
                className="increase-btn"
              >+</button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="update-status">Status</label>
            <select 
              id="update-status" 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
              className="status-select"
            >
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="form-buttons">
          <motion.button 
            type="submit" 
            disabled={submitting}
            className="update-button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {submitting ? (
              <>
                <span className="spinner"></span>
                Updating...
              </>
            ) : 'Update Reservation'}
          </motion.button>
          <motion.button 
            type="button" 
            onClick={onCancel}
            className="cancel-button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default UpdateReservation;