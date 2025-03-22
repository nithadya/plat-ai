import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './ParticlesOverlay.css';

const ParticlesOverlay = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        // Set canvas dimensions to fill entire viewport
        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);
        
        // Enhanced Particle class with more dynamic properties
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 0.5; // Larger size range
                this.baseSize = this.size;
                this.speedX = Math.random() * 0.8 - 0.4; // Faster movement
                this.speedY = Math.random() * 0.8 - 0.4;
                this.opacity = Math.random() * 0.4 + 0.1; // Higher opacity range
                this.pulseFactor = Math.random() * 0.04 + 0.01; // For size pulsing
                this.pulseDirection = Math.random() > 0.5 ? 1 : -1; // Random pulse direction
            }
            
            update() {
                // Update position
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around edges for seamless experience
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
                
                // Subtle size pulsing for more organic feel
                this.size += this.pulseFactor * this.pulseDirection;
                if (this.size > this.baseSize * 1.5 || this.size < this.baseSize * 0.7) {
                    this.pulseDirection *= -1;
                }
            }
            
            draw() {
                // Draw with gradient for better visual effect
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create more particles for denser effect
        const createParticles = () => {
            const particleCount = Math.floor(canvas.width * canvas.height / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        
        createParticles();
        
        // Add connections between nearby particles
        const connectParticles = () => {
            const maxDistance = 150;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        const opacity = 1 - (distance / maxDistance);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };
        
        // Animation loop with improved performance
        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });
            
            connectParticles();
            
            animationId = requestAnimationFrame(animate);
        };
        
        animate();
        
        // Proper cleanup
        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
            cancelAnimationFrame(animationId);
        };
    }, []);
    
    return (
        <canvas 
            ref={canvasRef} 
            className="particles-overlay"
        />
    );
};

export default ParticlesOverlay;