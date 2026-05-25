import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './AtmosphericBackground.css';

const conditionPalettes = {
  clear: [
    { color: '#FF8C00', size: 350, x: '10%', y: '20%' },
    { color: '#FFD700', size: 280, x: '60%', y: '60%' },
    { color: '#FFA500', size: 220, x: '40%', y: '10%' },
  ],
  rain: [
    { color: '#4A90D9', size: 320, x: '15%', y: '25%' },
    { color: '#6C5CE7', size: 260, x: '65%', y: '55%' },
    { color: '#0984E3', size: 200, x: '50%', y: '70%' },
  ],
  clouds: [
    { color: '#636E72', size: 340, x: '20%', y: '15%' },
    { color: '#B2BEC3', size: 250, x: '70%', y: '50%' },
    { color: '#74B9FF', size: 210, x: '35%', y: '65%' },
  ],
  snow: [
    { color: '#DFE6E9', size: 300, x: '12%', y: '30%' },
    { color: '#74B9FF', size: 240, x: '55%', y: '60%' },
    { color: '#A29BFE', size: 200, x: '75%', y: '20%' },
  ],
  thunderstorm: [
    { color: '#2D1B69', size: 360, x: '8%', y: '18%' },
    { color: '#6C5CE7', size: 280, x: '62%', y: '52%' },
    { color: '#E17055', size: 220, x: '45%', y: '75%' },
  ],
};

const defaultPalette = conditionPalettes.clear;

const orbVariants = {
  animate: (custom) => ({
    x: [0, custom.xDrift, 0],
    y: [0, custom.yDrift, 0],
    scale: [1, custom.scaleUp, 1],
    opacity: [0.3, 0.6, 0.3],
  }),
};

const particleVariants = {
  animate: (custom) => ({
    y: [0, custom.yDrift],
    opacity: [0, custom.maxOpacity, 0],
    scale: [0.5, 1, 0.5],
  }),
};

function AtmosphericBackground({ condition }) {
  const palette = useMemo(() => conditionPalettes[condition] || defaultPalette, [condition]);

  const particles = useMemo(() => {
    const count = window.innerWidth < 768 ? 15 : 30;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
      yDrift: -(Math.random() * 60 + 20),
      maxOpacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  return (
    <div className="atmospheric-bg">
      {/* Orbs */}
      {palette.map((orb, index) => {
        const xDrift = (Math.random() - 0.5) * 120;
        const yDrift = (Math.random() - 0.5) * 80;
        const scaleUp = 1 + Math.random() * 0.15;
        const duration = 15 + index * 5;

        return (
          <motion.div
            key={index}
            className="orb"
            style={{
              width: orb.size,
              height: orb.size,
              backgroundColor: orb.color,
              left: orb.x,
              top: orb.y,
              filter: `blur(${orb.size / 3}px)`,
            }}
            variants={orbVariants}
            animate="animate"
            custom={{ xDrift, yDrift, scaleUp }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 2,
            }}
          />
        );
      })}

      {/* Particles / Stars */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="star"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          variants={particleVariants}
          animate="animate"
          custom={{ yDrift: p.yDrift, maxOpacity: p.maxOpacity }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export default AtmosphericBackground;
