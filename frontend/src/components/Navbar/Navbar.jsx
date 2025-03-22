import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next';
import { 
  FaHome, 
  FaUtensils, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaShoppingCart, 
  FaSignInAlt, 
  FaUserCircle, 
  FaShoppingBag, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { MdChat, MdLanguage } from 'react-icons/md';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import './Navbar.css';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Languages available
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'si', name: 'සිංහල' }, // Sinhala
    { code: 'ta', name: 'தமிழ்' }   // Tamil
  ];

  // Change language function
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  // Detect scroll for navbar appearance change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-logo">
        <img className="logo" src={assets.logo1} alt="Restaurant Logo" />
      </Link>

      {/* Hamburger menu for mobile */}
      <div className="hamburger-menu" onClick={toggleMobileMenu}>
        <div className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></div>
      </div>

      {/* Desktop and Mobile Navigation with Icons */}
      <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-active' : ''}`}>
        <li>
          <Link
            to="/"
            onClick={() => {setMenu('home'); setMobileMenuOpen(false);}}
            className={`${menu === 'home' ? 'active' : ''}`}
          >
            <span className="nav-icon"><FaHome /></span>
            <span className="nav-text">{t('nav.home')}</span>
          </Link>
        </li>
        <li>
          <a
            href="#explore-menu"
            onClick={() => {setMenu('menu'); setMobileMenuOpen(false);}}
            className={`${menu === 'menu' ? 'active' : ''}`}
          >
            <span className="nav-icon"><FaUtensils /></span>
            <span className="nav-text">{t('nav.menu')}</span>
          </a>
        </li>
        <li>
          <Link
            to="/reservation"
            onClick={() => {setMenu('res-table'); setMobileMenuOpen(false);}}
            className={`${menu === 'res-table' ? 'active' : ''}`}
          >
            <span className="nav-icon"><FaCalendarAlt /></span>
            <span className="nav-text">{t('nav.reserve')}</span>
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            onClick={() => {setMenu('contact'); setMobileMenuOpen(false);}}
            className={`${menu === 'contact' ? 'active' : ''}`}
          >
            <span className="nav-icon"><FaEnvelope /></span>
            <span className="nav-text">{t('nav.contact')}</span>
          </Link>
        </li>
      </ul>

      <div className="navbar-right">
        {/* Language Dropdown */}
        <Menu as="div" className="language-dropdown">
          <Menu.Button className="icon-btn lang-icon">
            <MdLanguage />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="language-dropdown-menu">
              {languages.map((lang) => (
                <Menu.Item key={lang.code}>
                  {({ active }) => (
                    <button
                      className={`lang-item ${active ? 'active' : ''} ${i18n.language === lang.code ? 'selected' : ''}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      {lang.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Chat Button */}
        <button
          className="icon-btn chat-icon pulse-animation"
          onClick={() => navigate('/chatbot')}
          aria-label="Open chatbot"
        >
          <MdChat className="icon" />
        </button>
        
        {/* Cart Icon */}
        <Link to="/cart" className="icon-btn cart-icon">
          <FaShoppingCart className="icon" />
          {getTotalCartAmount() > 0 && <div className="floating-dot"></div>}
        </Link>
        
        {/* Authentication Area */}
        {!token ? (
          <button className="sign-in-btn" onClick={() => setShowLogin(true)}>
            <FaSignInAlt className="btn-icon" />
            <span>{t('nav.signIn')}</span>
          </button>
        ) : (
          <Menu as="div" className="profile-dropdown-wrapper">
            <Menu.Button className="profile-toggle">
              <FaUserCircle className="icon" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="user-avatar">
                    <FaUserCircle />
                  </div>
                  <div className="user-info">
                    <h4>{t('nav.myAccount')}</h4>
                  </div>
                </div>
                <div className="dropdown-menu">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`dropdown-item ${active ? 'active' : ''}`}
                        onClick={() => navigate('/myorders')}
                      >
                        <FaShoppingBag className="menu-icon" />
                        <span>{t('nav.myOrders')}</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`dropdown-item ${active ? 'active' : ''}`}
                        onClick={logout}
                      >
                        <FaSignOutAlt className="menu-icon" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  );
};

export default Navbar;