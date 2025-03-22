import React, { useEffect, useState } from 'react';
import './Header.css';

const Header = () => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Set visible after component mount to trigger animations
        setIsVisible(true);
    }, []);
    
    return (
        <div className="header">
            <div className={`header-contents ${isVisible ? 'visible' : ''}`}>
                <h2 className="animate-title">Order your favourite food here</h2>
                <p className="animate-text">Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
                <button className="animate-button">View Menu</button>
            </div>
        </div>
    );
};

export default Header;