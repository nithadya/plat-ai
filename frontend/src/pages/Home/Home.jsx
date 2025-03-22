import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AIFoodRecommendation from '../../components/AIFoodRecommendation/AIFoodRecommendation';
import AppDownload from '../../components/AppDownload/AppDownload';
import './Home.css';

const Home = () => {
  const [category, setCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true); // Preloader state
  
  // Simulate loading delay (e.g., fetching data)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide preloader after 2 seconds
    }, 2000); // Adjust duration as needed
    
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);
  
  return (
    <>
      {isLoading ? (
        <div className="preloader-overlay">
          <div className="preloader-container">
            <div className="preloader-spinner">
              <div className="preloader-fork"></div>
              <div className="preloader-plate"></div>
            </div>
            <p className="preloader-text">Preparing Your Menu...</p>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <AIFoodRecommendation />
          <ExploreMenu setCategory={setCategory} category={category} />
          <FoodDisplay category={category} />
          <AppDownload />
        </>
      )}
    </>
  );
};

export default Home;