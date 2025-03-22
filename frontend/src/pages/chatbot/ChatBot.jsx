import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Send, MessageSquare, ChevronDown, ChevronUp, CheckCircle, Info, PieChart, BarChart3, LineChart, Users, Clock, ArrowLeft, Star, Trash2, ThumbsUp } from 'lucide-react';
import './ChatBot.css';
import '../../components/UserFeedback/UserFeedback.css';

const foodCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
};

const messageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const TypingIndicator = () => (
  <div className="typing-indicator">
    <motion.div 
      className="typing-dot" 
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", times: [0, 0.5, 1] }}
    />
    <motion.div 
      className="typing-dot" 
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.6, delay: 0.2, repeat: Infinity, repeatType: "loop", times: [0, 0.5, 1] }}
    />
    <motion.div 
      className="typing-dot" 
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.6, delay: 0.4, repeat: Infinity, repeatType: "loop", times: [0, 0.5, 1] }}
    />
  </div>
);

const Alert = ({ children, variant, className, ...props }) => (
  <div className={`alert ${variant} ${className || ''}`} {...props}>
    {children}
  </div>
);

const AlertTitle = ({ children, className, ...props }) => (
  <h5 className={`alert-title ${className || ''}`} {...props}>
    {children}
  </h5>
);

const AlertDescription = ({ children, className, ...props }) => (
  <div className={`alert-description ${className || ''}`} {...props}>
    {children}
  </div>
);

const NutritionBadge = ({ icon, value, unit, label, color }) => (
  <div className={`nutrition-badge badge-${color}`}>
    <span className="nutrition-badge-icon">{icon}</span>
    <span>{value}{unit} {label}</span>
  </div>
);

const FoodCard = ({ food, index }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      className="food-card"
      variants={foodCardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="food-card-content">
        <h3 className="food-name">{food.name}</h3>
        <p className="food-description">{food.description || "No description available"}</p>
        <p className="food-price">Price: ${parseFloat(food.price || 0).toFixed(2)}</p>
        
        <div className="food-card-footer">
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="more-info-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {expanded ? (
              <>
                <span>Less info</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>More info</span>
                <ChevronDown size={16} />
              </>
            )}
          </motion.button>
          
          <motion.div
            className="match-score"
            whileHover={{ scale: 1.05 }}
          >
            <CheckCircle size={12} />
            <span>Match Score: {food.match_score || 0}</span>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {expanded && food.nutrition && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="nutrition-section"
            >
              <h4 className="nutrition-title">Nutrition Information</h4>
              <div className="nutrition-badges">
                <NutritionBadge icon="🍽️" value={food.nutrition.calories || 0} unit="" label="cal" color="red" />
                <NutritionBadge icon="🥩" value={food.nutrition.protein || 0} unit="g" label="protein" color="purple" />
                <NutritionBadge icon="🍞" value={food.nutrition.carbs || 0} unit="g" label="carbs" color="yellow" />
                <NutritionBadge icon="🥑" value={food.nutrition.fats || 0} unit="g" label="fats" color="green" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const StatsCard = ({ title, value, icon, color }) => (
  <motion.div 
    className={`stats-card bg-${color}`}
    variants={chartVariants}
    initial="hidden"
    animate="visible"
    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)" }}
  >
    <div className="stats-icon">{icon}</div>
    <div className="stats-content">
      <h3 className="stats-title">{title}</h3>
      <div className="stats-value">{value}</div>
    </div>
  </motion.div>
);

const ChartPanel = ({ title, chartType, data }) => (
  <motion.div 
    className="chart-panel"
    variants={chartVariants}
    initial="hidden"
    animate="visible"
  >
    <h3 className="chart-title">{title}</h3>
    <div className="chart-container">
      {chartType === 'bar' && (
        <div className="bar-chart">
          {data.map((item, index) => (
            <div key={index} className="bar-chart-item">
              <div className="bar-label">{item.label}</div>
              <div className="bar-container">
                <motion.div 
                  className={`bar-fill bar-color-${index % 5}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
                <span className="bar-value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {chartType === 'pie' && (
        <div className="pie-chart">
          <div className="pie-legend">
            {data.map((item, index) => (
              <div key={index} className="pie-legend-item">
                <span className={`pie-color-box pie-color-${index % 5}`}></span>
                <span className="pie-label">{item.label}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {chartType === 'line' && (
        <div className="line-chart">
          <div className="line-chart-container">
            {data.map((point, index) => (
              <motion.div 
                key={index} 
                className="line-point"
                initial={{ y: 50, opacity: 0 }}
                animate={{ 
                  y: 50 - (point.value / Math.max(...data.map(d => d.value)) * 50), 
                  opacity: 1 
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ left: `${(index / (data.length - 1)) * 100}%` }}
              />
            ))}
          </div>
          <div className="line-labels">
            {data.map((point, index) => (
              <div 
                key={index} 
                className="line-label"
                style={{ left: `${(index / (data.length - 1)) * 100}%` }}
              >
                {point.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

const MISDashboard = () => {
  const userStats = { total: 1254, active: 876, new: 124 };
  const popularDiets = [
    { label: "Keto", value: 35 },
    { label: "Vegetarian", value: 28 },
    { label: "Gluten Free", value: 18 },
    { label: "Paleo", value: 12 },
    { label: "Other", value: 7 }
  ];
  const userActivity = [
    { label: "Mon", value: 85 },
    { label: "Tue", value: 120 },
    { label: "Wed", value: 95 },
    { label: "Thu", value: 145 },
    { label: "Fri", value: 170 },
    { label: "Sat", value: 190 },
    { label: "Sun", value: 130 }
  ];
  const responseMetrics = [
    { label: "Query Accuracy", value: 92 },
    { label: "Response Time", value: 85 },
    { label: "User Satisfaction", value: 88 },
    { label: "Menu Coverage", value: 76 }
  ];

  return (
    <div className="mis-dashboard">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mis-header"
      >
        <h2>Management Information System</h2>
        <p>Real-time analytics and system performance metrics</p>
      </motion.div>
      <div className="stats-cards-container">
        <StatsCard title="Total Users" value={userStats.total} icon={<Users size={24} />} color="blue" />
        <StatsCard title="Active Users" value={userStats.active} icon={<Users size={24} />} color="green" />
        <StatsCard title="New Users (24h)" value={userStats.new} icon={<Users size={24} />} color="purple" />
        <StatsCard title="Avg. Response Time" value="1.2s" icon={<Clock size={24} />} color="orange" />
      </div>
      <div className="charts-container">
        <ChartPanel title="Popular Dietary Plans" chartType="pie" data={popularDiets} />
        <ChartPanel title="User Activity (Last Week)" chartType="line" data={userActivity} />
        <ChartPanel title="System Performance Metrics" chartType="bar" data={responseMetrics} />
      </div>
    </div>
  );
};

const UserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState(() => {
    const savedFeedbacks = localStorage.getItem('userFeedbacks');
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : [
      { id: 1, name: 'John Doe', rating: 5, comment: 'The dietary recommendations were spot on! I found exactly what I needed for my keto diet.', date: '2025-03-15', likes: 12 },
      { id: 2, name: 'Sarah Smith', rating: 4, comment: 'Great suggestions for my vegetarian preferences. Would love to see more gluten-free options.', date: '2025-03-18', likes: 8 }
    ];
  });
  
  const [newFeedback, setNewFeedback] = useState({ name: '', rating: 5, comment: '' });
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
    const feedback = { id: Date.now(), ...newFeedback, date: currentDate, likes: 0 };
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
                    <StarRating rating={newFeedback.rating} onRatingChange={handleRatingChange} />
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

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your dietary assistant. Tell me your dietary preferences, and I'll suggest appropriate food options from our menu. For example, you can say 'I prefer vegetarian food' or 'I need high protein low carb options'.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isError, setIsError] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:5050');
  const [isMISMode, setIsMISMode] = useState(false);
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [showHelpTip, setShowHelpTip] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, recommendations]);

  useEffect(() => {
    inputRef.current?.focus();
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      setApiBaseUrl('');
    }
    checkApiConnection();
    const timer = setTimeout(() => setShowHelpTip(false), 10000);
    const resizeObserver = new ResizeObserver(() => {
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) chatContainer.style.height = `${window.innerHeight}px`;
    });
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      resizeObserver.observe(chatContainer);
      chatContainer.style.height = `${window.innerHeight}px`;
    }
    window.addEventListener('resize', scrollToBottom);
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', scrollToBottom);
    };
  }, []);

  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/health`);
      if (!response.ok) console.warn('API health check failed:', response.status);
      else console.log('API connection successful');
    } catch (error) {
      console.warn('API connection error:', error);
    }
  };

  const detectDietaryPreferences = (text) => {
    const textLower = text.toLowerCase();
    const dietaryKeywords = [
      'vegetarian', 'vegan', 'gluten-free', 'gluten free', 'dairy-free', 'dairy free',
      'low carb', 'high protein', 'keto', 'paleo', 'mediterranean', 'pescatarian',
      'low fat', 'low sodium', 'low sugar', 'sugar free', 'nut free', 'nut-free',
      'organic', 'non-gmo', 'halal', 'kosher', 'diabetic', 'allergy', 'allergies',
      'lactose', 'soy free', 'egg free', 'shellfish', 'calorie', 'calories',
      'plant based', 'plant-based', 'healthy', 'whole foods', 'whole-foods',
      'fiber', 'vitamin', 'minerals', 'nutrition', 'diet', 'protein', 'carbs',
      'carbohydrates', 'fats', 'oils', 'meals', 'food', 'eat', 'avoid'
    ];
    return dietaryKeywords.some(keyword => textLower.includes(keyword));
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;
    const userMessage = { id: messages.length + 1, text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsError(false);
    setShowHelpTip(false);

    try {
      const messageText = input.trim();
      const hasDietaryPreferences = detectDietaryPreferences(messageText);
      const chatResponse = await fetch(`${apiBaseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });
      if (!chatResponse.ok) throw new Error(`Server responded with status: ${chatResponse.status}`);
      const chatData = await chatResponse.json();
      setMessages(prevMessages => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: chatData.response, sender: 'bot' }
      ]);
      if (chatData.recommendations && chatData.recommendations.length > 0) {
        setRecommendations(chatData.recommendations);
      } else if (hasDietaryPreferences) {
        const recommendResponse = await fetch(`${apiBaseUrl}/recommend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dietary_plan: messageText }),
        });
        if (!recommendResponse.ok) throw new Error(`Server responded with status: ${recommendResponse.status}`);
        const recommendData = await recommendResponse.json();
        if (recommendData.dietary_tips) {
          setMessages(prevMessages => [
            ...prevMessages,
            { id: prevMessages.length + 1, text: `Dietary Tip: ${recommendData.dietary_tips}`, sender: 'bot' }
          ]);
        }
        if (recommendData.recommendations && recommendData.recommendations.length > 0) {
          setRecommendations(recommendData.recommendations);
        } else {
          setMessages(prevMessages => [
            ...prevMessages,
            { id: prevMessages.length + 1, text: "I don't have exact matches for your dietary preferences in our menu. Could you try being more specific or adjusting your criteria?", sender: 'bot' }
          ]);
          setRecommendations([]);
        }
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsError(true);
      setMessages(prevMessages => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: "Sorry, I'm having trouble connecting to the server. Please try again later.", sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const toggleMode = () => {
    if (isMISMode) {
      setIsMISMode(false);
      setShowFeedbackSection(false);
    } else {
      setIsMISMode(true);
      setShowFeedbackSection(false);
    }
  };

  const toggleFeedbackSection = () => {
    setShowFeedbackSection(!showFeedbackSection);
    setIsMISMode(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
            className="header-icon"
          >
            {isMISMode ? <PieChart size={28} /> : (showFeedbackSection ? <Star size={28} /> : <MessageSquare size={28} />)}
          </motion.div>
          <div>
            <h1 className="header-title">
              {isMISMode ? "MI5 Dashboard" : (showFeedbackSection ? "Customer Feedback" : "Dietary Assistant")}
            </h1>
            <p className="header-subtitle">
              {isMISMode ? "Management Information System" : 
               (showFeedbackSection ? "Share your experience with our service" : "Your personalized food recommendation companion")}
            </p>
          </div>
        </div>
        <div className="header-buttons">
          <motion.button
            className="mode-toggle-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFeedbackSection}
          >
            {showFeedbackSection ? (
              <>
                <ArrowLeft size={16} />
                <span>Back to Chat</span>
              </>
            ) : (
              <>
                <Star size={16} />
                <span>Feedback</span>
              </>
            )}
          </motion.button>
          <motion.button
            className="mode-toggle-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMode}
          >
            {isMISMode ? (
              <>
                <ArrowLeft size={16} />
                <span>Back to Chat</span>
              </>
            ) : (
              <>
                <PieChart size={16} />
                <span>View MI5</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {!isMISMode && !showFeedbackSection && (
        <>
          <AnimatePresence>
            {isError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive">
                  <AlertTriangle className="alert-icon" size={16} />
                  <div>
                    <AlertTitle>Connection Error</AlertTitle>
                    <AlertDescription>
                      There was a problem connecting to the server. Please try again later.
                    </AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showHelpTip && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="info">
                  <Info className="alert-icon" size={16} />
                  <div>
                    <AlertTitle>Dietary Assistant Tip</AlertTitle>
                    <AlertDescription>
                      Just tell me your dietary preferences directly in the chat, and I'll suggest suitable menu items for you.
                    </AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="messages-container">
            <div className="message-list">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div 
                    key={message.id} 
                    className={`message-wrapper ${message.sender}`}
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                  >
                    <motion.div 
                      className={`message ${message.sender}`}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      {message.text}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    className="message-wrapper bot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="message bot" style={{ padding: '8px' }}>
                      <TypingIndicator />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {recommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="recommendations"
                  >
                    <h2 className="recommendations-title">Menu Items For You</h2>
                    <div className="food-cards-grid">
                      {recommendations.map((food, index) => (
                        <FoodCard key={`${food.name}-${index}`} food={food} index={index} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div ref={messagesEndRef} />
          </div>
          <motion.div 
            className="input-container"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your dietary preferences or ask me anything..."
                className="message-input"
                aria-label="Message input"
              />
              <motion.button
                onClick={sendMessage}
                disabled={isLoading || input.trim() === ''}
                className="send-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                aria-label="Send message"
              >
                <Send size={20} />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}

      {isMISMode && <MISDashboard />}
      {showFeedbackSection && <UserFeedback />}
    </div>
  );
};

export default ChatBot;