import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left slide-up">
          <p>At Plate Planner, we believe in crafting exceptional dining experiences that tantalize your taste buds and create cherished memories.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" className="scale-in delay-1" />
            <img src={assets.twitter_icon} alt="Twitter" className="scale-in delay-2" />
            <img src={assets.linkedin_icon} alt="LinkedIn" className="scale-in delay-3" />
          </div>
        </div>
        
        <div className="footer-content-center slide-up delay-1">
          <h3>COMPANY</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About us</a></li>
            <li><a href="/delivery">Delivery</a></li>
            <li><a href="/privacy">Privacy policy</a></li>
          </ul>
        </div>
        
        <div className="footer-content-right slide-up delay-2">
          <h3>GET IN TOUCH</h3>
          <ul>
            <li><a href="tel:0113326740">0113326740 / 0771129900</a></li>
            <li><a href="mailto:contact@plateplanner.com">contact@plateplanner.com</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom fade-in delay-3">
        <p className="footer-copyright">Copyright 2025 © PlatePlanner.com - All Right Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;