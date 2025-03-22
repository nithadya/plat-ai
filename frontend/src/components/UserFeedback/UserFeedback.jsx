import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Send, Trash2, ThumbsUp } from 'lucide-react';
import './UserFeedback.css';

const UserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState(() => {
    const savedFeedbacks = localStorage.getItem('userFeedbacks');
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : [
      {
        id: 1,
        name: 'John Doe',
        rating: 5,
        comment: 'The dietary recommendations were spot on! I found exactly what I needed for my keto diet.',
        date: '2025-03-15',
        likes: 12
      },
      {
        id: 2,
        name: 'Sarah Smith',
        rating: 4,
        comment: 'Great suggestions for my vegetarian preferences. Would love to see more gluten-free options.',
        date: '2025-03-18',
        likes: 8
      }
    ];
  });
  
  const [newFeedback, setNewFeedback] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('userFeedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRatingChange = (rating) => {
    setNewFeedback(prev => ({ ...prev, rating }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newFeedback.name || !newFeedback.comment) return;
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    const feedback = {
      id: Date.now(),
      ...newFeedback,
      date: currentDate,
      likes: 0
    };
    
    setFeedbacks(prev => [feedback, ...prev]);
    setNewFeedback({ name: '', rating: 5, comment: '' });
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsFormVisible(false);
      setIsSubmitted(false);
    }, 2000);
  };
  
  const handleDelete = (id) => {
    setFeedbacks(prev => prev.filter(feedback => feedback.id !== id));
  };
  
  const handleLike = (id) => {
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === id ? { ...feedback, likes: feedback.likes + 1 } : feedback
    ));
  };
  
  const toggleForm = () => {
    setIsFormVisible(prev => !prev);
    if (isSubmitted) setIsSubmitted(false);
  };
  
  const StarRating = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];
    
    return (
      <div className="star-rating">
        {stars.map(star => (
          <motion.span
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRatingChange && onRatingChange(star)}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
          >
            <Star
              size={20}
              fill={star <= rating ? '#FFD700' : 'none'}
              stroke={star <= rating ? '#FFD700' : '#D1D5DB'}
            />
          </motion.span>
        ))}
      </div>
    );
  };
  
  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <div className="feedback-title-container">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
            className="feedback-icon"
          >
            <MessageSquare size={24} />
          </motion.div>
          <h2 className="feedback-title">Customer Feedback</h2>
        </div>
        <motion.button
          className={`add-feedback-btn ${isFormVisible ? 'active' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleForm}
        >
          {isFormVisible ? 'Close' : 'Add Feedback'}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="feedback-form-container"
          >
            <form onSubmit={handleSubmit} className="feedback-form">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="feedback-success"
                >
                  <h3>Thank you for your feedback!</h3>
                  <p>Your comments help us improve our service.</p>
                </motion.div>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newFeedback.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Your Rating</label>
                    <StarRating
                      rating={newFeedback.rating}
                      onRatingChange={handleRatingChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="comment">Your Feedback</label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={newFeedback.comment}
                      onChange={handleInputChange}
                      placeholder="Share your experience with our dietary recommendations..."
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="submit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={16} />
                    <span>Submit Feedback</span>
                  </motion.button>
                </>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="feedback-list">
        <AnimatePresence>
          {feedbacks.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              className="feedback-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
            >
              <div className="feedback-card-header">
                <div className="feedback-user-info">
                  <h3>{feedback.name}</h3>
                  <StarRating rating={feedback.rating} />
                </div>
                <div className="feedback-date">{feedback.date}</div>
              </div>
              
              <p className="feedback-comment">{feedback.comment}</p>
              
              <div className="feedback-actions">
                <motion.button
                  className="like-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLike(feedback.id)}
                >
                  <ThumbsUp size={14} />
                  <span>{feedback.likes}</span>
                </motion.button>
                
                <motion.button
                  className="delete-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(feedback.id)}
                >
                  <Trash2 size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {feedbacks.length === 0 && (
          <div className="no-feedback">
            <p>No feedback yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFeedback;