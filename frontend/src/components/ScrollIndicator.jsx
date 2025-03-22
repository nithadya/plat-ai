import React from 'react';
import { motion } from 'framer-motion';
import './ScrollIndicator.css';

const ScrollIndicator = () => {
    // Enhanced animation variants
    const indicatorVariants = {
        initial: { opacity: 0, y: -20 },
        animate: {
            opacity: 0.7,
            y: 0,
            transition: {
                delay: 2,
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };
    
    // Animation for the wheel to create more dynamic scrolling effect
    const wheelVariants = {
        animate: {
            y: [0, 15, 0],
            opacity: [1, 0.2, 1],
            transition: {
                y: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                },
                opacity: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                }
            }
        }
    };
    
    // Text fade animation
    const textVariants = {
        animate: {
            opacity: [0.5, 1, 0.5],
            transition: {
                opacity: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                }
            }
        }
    };
    
    return (
        <motion.div 
            className="scroll-indicator"
            initial="initial"
            animate="animate"
            variants={indicatorVariants}
            whileHover={{ opacity: 1, scale: 1.05 }}
        >
            <motion.div 
                className="mouse"
                whileHover={{ borderColor: "#FFD700" }}
            >
                <motion.div 
                    className="wheel"
                    variants={wheelVariants}
                    animate="animate"
                />
            </motion.div>
            <motion.p 
                className="scroll-text"
                variants={textVariants}
                animate="animate"
            >
                Scroll
            </motion.p>
        </motion.div>
    );
};

export default ScrollIndicator;