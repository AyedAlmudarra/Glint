import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = ({ children, delay = 0, className }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={className}
    >
        {children}
    </motion.div>
);

export default AnimatedSection; 