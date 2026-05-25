import React from 'react';
import { motion } from 'framer-motion';

function Clouds() {
  const cloudVariants = {
    animate: {
      x: [0, 600],
      y: [0, -10, 0, 10, 0],
      opacity: [0.3, 0.5, 0.3],
      scale: [1, 1.1, 1]
    }
  };

  return (
    <svg
      width="100%"
      height="150px"
      viewBox="0 0 800 150"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, overflow: 'hidden' }}
    >
      {/* Layer 1 - Large clouds, slow movement */}
      <motion.g
        variants={cloudVariants}
        animate="animate"
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="80" cy="60" r="45" fill="#ffffff22" />
        <circle cx="130" cy="55" r="40" fill="#ffffff22" />
        <circle cx="170" cy="65" r="35" fill="#ffffff22" />
      </motion.g>

      {/* Layer 2 - Medium clouds, medium speed */}
      <motion.g
        variants={cloudVariants}
        animate="animate"
        transition={{ duration: 90, repeat: Infinity, ease: "linear", delay: -30 }}
      >
        <circle cx="300" cy="40" r="30" fill="#ffffff18" />
        <circle cx="340" cy="35" r="28" fill="#ffffff18" />
        <circle cx="375" cy="45" r="25" fill="#ffffff18" />
      </motion.g>

      {/* Layer 3 - Small clouds, faster movement */}
      <motion.g
        variants={cloudVariants}
        animate="animate"
        transition={{ duration: 60, repeat: Infinity, ease: "linear", delay: -15 }}
      >
        <circle cx="500" cy="80" r="25" fill="#ffffff12" />
        <circle cx="530" cy="75" r="22" fill="#ffffff12" />
        <circle cx="555" cy="85" r="20" fill="#ffffff12" />
      </motion.g>

      {/* Layer 4 - Tiny clouds, fastest movement */}
      <motion.g
        variants={cloudVariants}
        animate="animate"
        transition={{ duration: 40, repeat: Infinity, ease: "linear", delay: -10 }}
      >
        <circle cx="650" cy="50" r="20" fill="#ffffff0a" />
        <circle cx="675" cy="45" r="18" fill="#ffffff0a" />
        <circle cx="695" cy="55" r="15" fill="#ffffff0a" />
      </motion.g>

      {/* Additional scattered clouds for depth */}
      <motion.g
        variants={cloudVariants}
        animate="animate"
        transition={{ duration: 100, repeat: Infinity, ease: "linear", delay: -45 }}
      >
        <circle cx="200" cy="100" r="35" fill="#ffffff15" />
        <circle cx="240" cy="95" r="30" fill="#ffffff15" />
        <circle cx="275" cy="105" r="28" fill="#ffffff15" />
      </motion.g>

      <motion.g
        variants={cloudVariants}
        animate="animate"
        transition={{ duration: 75, repeat: Infinity, ease: "linear", delay: -20 }}
      >
        <circle cx="420" cy="70" r="28" fill="#ffffff10" />
        <circle cx="450" cy="65" r="25" fill="#ffffff10" />
        <circle cx="475" cy="75" r="22" fill="#ffffff10" />
      </motion.g>

      {/* Bottom layer - Very subtle clouds */}
      <motion.g
        variants={cloudVariants}
        animate="animate"
        transition={{ duration: 110, repeat: Infinity, ease: "linear", delay: -55 }}
      >
        <circle cx="100" cy="120" r="40" fill="#ffffff08" />
        <circle cx="145" cy="115" r="38" fill="#ffffff08" />
        <circle cx="185" cy="125" r="35" fill="#ffffff08" />
      </motion.g>
    </svg>
  );
}

export default Clouds;
