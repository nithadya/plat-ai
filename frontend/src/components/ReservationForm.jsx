import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ReservationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    numberOfPeople: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

      const response = await axios.post('http://localhost:4000/api/reservation', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        numberOfPeople: 1,
      });

      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(response.data.reservation);
      }
    } catch (error) {
      setSubmitting(false);
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      console.error('Error creating reservation:', errorMessage);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reservation-form-container">
      <h2>Make a Reservation</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="Your full name"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="your@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              placeholder="Your phone number"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              min={today} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input 
              type="time" 
              id="time" 
              name="time" 
              value={formData.time} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="numberOfPeople">Number of People</label>
          <div className="number-input">
            <button 
              type="button" 
              onClick={() => setFormData({...formData, numberOfPeople: Math.max(1, formData.numberOfPeople - 1)})}
              className="decrease-btn"
            >-</button>
            <input
              type="number"
              id="numberOfPeople"
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
        
        <motion.button 
          type="submit" 
          disabled={submitting}
          className="submit-button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {submitting ? (
            <>
              <span className="spinner"></span>
              Creating...
            </>
          ) : 'Make Reservation'}
        </motion.button>
      </form>
    </div>
  );
};

export default ReservationForm;