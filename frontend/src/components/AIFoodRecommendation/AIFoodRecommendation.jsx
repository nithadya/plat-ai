import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import './AIFoodRecommendation.css';

const AIFoodRecommendation = () => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, threshold: 0.2 });
  const controls = useAnimation();
  
  // Sample food recommendations
const foodRecommendations = [
    { name: "Lamprais", tags: ["Healthy", "Protein-rich", "Gluten-free"], image: "/assets/images/Lamprais.jpg" },
    { name: "Truffle Mushroom Pasta", tags: ["Vegetarian", "Comfort Food"], image: "/assets/images/TruffleMushroomPasta.jpg" },
    { name: "Mediterranean Salad", tags: ["Fresh", "Low-calorie", "Vegan"], image: "/assets/images/MediterraneanSalad.jpg" },
    { name: "Crispy Fried Chicken", tags: ["Popular", "Family favorite"], image: "/assets/images/CrispyFriedChicken.jpg" }
];
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  const handleInteraction = () => {
    setIsInteracting(true);
    setIsTyping(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsTyping(false);
      setRecommendation(foodRecommendations[Math.floor(Math.random() * foodRecommendations.length)]);
    }, 1500);
  };
  
  const resetRecommendation = () => {
    setRecommendation(null);
    setIsInteracting(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delay: 0.2, 
        ease: "easeOut" 
      } 
    }
  };
  
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };
  
  return (
    <motion.section 
      ref={containerRef}
      className="ai-recommendation-section"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <div className="ai-recommendation-container">
        <div className="ai-recommendation-header">
          <h2>Meet Your Personal Taste AI</h2>
          <p>Our AI knows exactly what you'll love today</p>
        </div>
        
        <div className="ai-recommendation-content">
          {!isInteracting ? (
            <motion.div 
              className="ai-recommendation-prompt"
              variants={pulseVariants}
              animate="pulse"
              onClick={handleInteraction}
            >
              <div className="ai-icon-container">
                <div className="ai-icon">
                  <span className="fork-icon"></span>
                </div>
              </div>
              <p>Tap here to get your personal food recommendation</p>
            </motion.div>
          ) : recommendation === null ? (
            <div className="ai-typing">
              <div className="ai-icon-container active">
                <div className="ai-icon">
                  <span className="fork-icon"></span>
                </div>
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Analyzing your taste preferences...</p>
            </div>
          ) : (
            <motion.div 
              className="ai-recommendation-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="recommendation-card">
                <img src={recommendation.image} alt={recommendation.name} className="recommendation-image" />
                <div className="recommendation-details">
                  <h3>{recommendation.name}</h3>
                  <div className="recommendation-tags">
                    {recommendation.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <p className="recommendation-description">
                    Based on your previous orders and preferences, I think you'll love this!
                  </p>
                  <div className="recommendation-actions">
                    <button className="order-now-btn">Order Now</button>
                    <button className="try-again-btn" onClick={resetRecommendation}>Try Again</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default AIFoodRecommendation;