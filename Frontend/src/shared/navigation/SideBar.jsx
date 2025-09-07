import React from 'react';
import { motion } from 'motion/react';

import Navlinks from './Navlinks';
import './SideBar.css';

const SideBar = (props) => {
  return (
    <motion.div
      initial={{ x: 800 }}
      animate={{ x: 0 }}
      exit={{ x: 800 }}
      transition={{ duration: 0.3 }}
      className="sideBar"
    >
      <div className="close-sidebar-button" onClick={props.onClick}>
        +
      </div>
      <Navlinks
        className="sidebar-links"
        onClick={props.onClick}
        isOpen={props.isOpen}
      />
    </motion.div>
  );
};

export default SideBar;
