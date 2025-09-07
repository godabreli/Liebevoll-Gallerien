import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';

import { AuthContext } from '../../../context/auth-context';
import Button from '../form-elements/Button';

import './Navlinks.css';

function Navlinks(props) {
  const auth = useContext(AuthContext);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.ul
      className={props.className}
      variants={props.isOpen ? container : undefined}
      initial={props.isOpen ? 'hidden' : false}
      animate={props.isOpen ? 'show' : false}
    >
      <motion.li
        variants={item}
        whileTap={{ scale: 0.95 }}
        onClick={props.onClick}
      >
        <NavLink to="/">HOME</NavLink>
      </motion.li>
      <motion.li
        variants={item}
        whileTap={{ scale: 0.95 }}
        onClick={props.onClick}
      >
        <NavLink to="/my-galleries/Wedding-Gallery">GALERIE</NavLink>
      </motion.li>
      <motion.li
        variants={item}
        whileTap={{ scale: 0.95 }}
        onClick={props.onClick}
      >
        <NavLink to="/about-me">ÜBER MICH</NavLink>
      </motion.li>
      <motion.li
        variants={item}
        whileTap={{ scale: 0.95 }}
        onClick={props.onClick}
      >
        <NavLink to="/contact">KONTAKT</NavLink>
      </motion.li>
      {auth.userIsLoggedIn && (
        <motion.li
          variants={item}
          whileTap={{ scale: 0.95 }}
          onClick={props.onClick}
        >
          <NavLink to="/galleries">GALLERIES</NavLink>
        </motion.li>
      )}
      {auth.userIsLoggedIn && (
        <motion.li
          variants={item}
          whileTap={{ scale: 0.95 }}
          onClick={props.onClick}
        >
          <NavLink to="/create-gallery">CREATE GALLERIE</NavLink>
        </motion.li>
      )}
      {auth.userIsLoggedIn && (
        <motion.li variants={item}>
          <Button
            size="small"
            onClick={() => {
              auth.userLogout();
              if (props.onClick) props.onClick();
            }}
          >
            LOGOUT USER
          </Button>
        </motion.li>
      )}
      {auth.galleryIsLoggedIn && (
        <motion.li variants={item}>
          <Button
            size="small"
            onClick={() => {
              auth.galleryLogout();
              if (props.onClick) props.onClick();
            }}
          >
            LOGOUT
          </Button>
        </motion.li>
      )}
    </motion.ul>
  );
}

export default Navlinks;
