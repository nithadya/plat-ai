import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ReservationsList from '../../components/ReservationsList';
import ReservationForm from '../../components/ReservationForm';
import './ReservationPage.css';

const ReservationPage = () => {
  const [view, setView] = useState('loading'); // Start with loading state
  const [hasReservations, setHasReservations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user has any reservations on component mount
  useEffect(() => {
    checkUserReservations();
  }, []);

  const checkUserReservations = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get('http://localhost:4000/api/reservation', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reservations = response.data.reservations || [];
      setHasReservations(reservations.length > 0);
      
      // Set the view based on whether user has reservations
      setView(reservations.length > 0 ? 'list' : 'create');
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setLoading(false);
      // If there's an error, default to showing the form
      setView('create');
    }
  };

  const handleReservationSuccess = () => {
    // After successful creation, set that user has reservations
    setHasReservations(true);
    setView('list');
    toast.success('Reservation created successfully!');
  };

  const switchToCreateView = () => {
    setView('create');
  };

  const switchToListView = () => {
    setView('list');
  };

  // Loading state
  if (loading) {
    return (
      <div className="reservation-page">
        <div className="card loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your reservations...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && view !== 'create') {
    return (
      <div className="reservation-page">
        <div className="card error-container">
          <div className="error-icon">!</div>
          <p>{error}</p>
          <button className="retry-button" onClick={checkUserReservations}>Retry</button>
          <button className="create-button" onClick={() => setView('create')}>Make a Reservation</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-page">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <AnimatePresence mode="wait">
        {view === 'create' ? (
          <motion.div
            key="create-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card">
              {/* Only show back button if user has existing reservations */}
              {hasReservations && (
                <button className="back-button" onClick={switchToListView}>
                  <i className="fas fa-arrow-left"></i> Back to My Reservations
                </button>
              )}
              <ReservationForm onSuccess={handleReservationSuccess} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReservationsList
              onCreateNew={switchToCreateView}
              onReservationCancelled={() => {
                toast.info('Reservation cancelled');
                // Check if this was the last reservation
                checkUserReservations();
              }}
              onReservationUpdated={() => toast.success('Reservation updated successfully')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationPage;