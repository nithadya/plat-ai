import React, { useContext, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import './FoodItem.css';

const FoodItem = ({ image, name, price, desc, id }) => {
  const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(id);
  };
  
  const handleRemoveFromCart = () => {
    removeFromCart(id);
  };
  
  return (
    <div 
      className={`food-item ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="food-item-img-container">
        <div className="image-overlay"></div>
        <img className="food-item-image" src={`${url}/images/${image}`} alt={name} />
        
        {!cartItems[id] ? (
          <button 
            className="add-button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <img src={assets.add_icon_white} alt="Add" />
            <span className="button-text">Add</span>
          </button>
        ) : (
          <div className="food-item-counter">
            <button 
              className="counter-button decrease" 
              onClick={handleRemoveFromCart}
              aria-label="Remove one"
            >
              <img src={assets.remove_icon_red} alt="Remove" />
            </button>
            <p className="item-count">{cartItems[id]}</p>
            <button 
              className="counter-button increase" 
              onClick={handleAddToCart}
              aria-label="Add one"
            >
              <img src={assets.add_icon_green} alt="Add" />
            </button>
          </div>
        )}
      </div>
      
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <h3 className="food-name">{name}</h3>
          <div className="rating">
            <img src={assets.rating_starts} alt="Rating" />
          </div>
        </div>
        <p className="food-item-desc">{desc}</p>
        <div className="food-item-price-container">
          <p className="food-item-price">{currency}{price}</p>
          {cartItems[id] > 0 && (
            <p className="total-price">Total: {currency}{(price * cartItems[id]).toFixed(2)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;