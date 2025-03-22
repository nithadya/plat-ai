// ReservationsList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import UpdateReservation from './UpdateReservation';

const ReservationsList = ({ onCreateNew, onReservationCancelled, onReservationUpdated }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get('http://localhost:4000/api/reservation', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservations(response.data.reservations || []);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      await axios.delete(`http://localhost:4000/api/reservation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservations((prev) => prev.filter((r) => r._id !== id));
      if (onReservationCancelled) onReservationCancelled();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedReservations = () => {
    const filteredReservations = reservations.filter(r => {
      if (filter === 'all') return true;
      return r.status === filter;
    });
    
    return [...filteredReservations].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedReservations = getSortedReservations();

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="card loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card error-container">
        <div className="error-icon">!</div>
        <p>{error}</p>
        <button className="retry-button" onClick={fetchReservations}>Retry</button>
      </div>
    );
  }

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h2>Your Reservations</h2>
        <motion.button 
          className="new-reservation-button"
          onClick={onCreateNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-plus"></i> Make New Reservation
        </motion.button>
      </div>

      {sortedReservations.length === 0 ? (
        <div className="no-reservations card">
          <div className="empty-state-icon">🍽️</div>
          <p>You don't have any reservations yet.</p>
          <motion.button 
            className="create-first-button"
            onClick={onCreateNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Make Your First Reservation
          </motion.button>
        </div>
      ) : (
        <div className="card">
          <div className="filter-sort-controls">
            <div className="filter-controls">
              <span>Filter by status: </span>
              <div className="filter-buttons">
                <button 
                  className={filter === 'all' ? 'filter-button active' : 'filter-button'} 
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={filter === 'confirmed' ? 'filter-button active' : 'filter-button'} 
                  onClick={() => setFilter('confirmed')}
                >
                  Confirmed
                </button>
                <button 
                  className={filter === 'pending' ? 'filter-button active' : 'filter-button'} 
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button 
                  className={filter === 'cancelled' ? 'filter-button active' : 'filter-button'} 
                  onClick={() => setFilter('cancelled')}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>

          <div className="reservations-table-container">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="sortable-header">
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('date')} className="sortable-header">
                    Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('time')} className="sortable-header">
                    Time {sortConfig.key === 'time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('numberOfPeople')} className="sortable-header">
                    Guests {sortConfig.key === 'numberOfPeople' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('status')} className="sortable-header">
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sortedReservations.map((r) => (
                    <motion.tr
                      key={r._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td>{r.name}</td>
                      <td>{formatDate(r.date)}</td>
                      <td>{r.time}</td>
                      <td className="center">{r.numberOfPeople}</td>
                      <td>
                        <span className={`status-badge status-${r.status}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <motion.button 
                            className="edit-button"
                            onClick={() => setEditingId(r._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={r.status === 'cancelled'}
                          >
                            <i className="fas fa-edit"></i>
                          </motion.button>
                          <motion.button 
                            className="cancel-button"
                            onClick={() => handleCancelReservation(r._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={r.status === 'cancelled'}
                          >
                            <i className="fas fa-times"></i>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {editingId && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <button className="modal-close" onClick={() => setEditingId(null)}>×</button>
              <UpdateReservation
                reservationId={editingId}
                onSuccess={(updatedReservation) => {
                  setReservations((prev) =>
                    prev.map((r) => (r._id === updatedReservation._id ? updatedReservation : r))
                  );
                  setEditingId(null);
                  if (onReservationUpdated) onReservationUpdated();
                }}
                onCancel={() => setEditingId(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationsList;