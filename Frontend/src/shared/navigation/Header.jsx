import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';

import './Header.css';
import Navlinks from './Navlinks';
import SideBar from './SideBar';

function Header() {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const handleClick = () => {
    setSideBarOpen(!sideBarOpen);
  };
  return (
    <header className="header">
      <img className="logo-liebevoll" src="/images/logo.png" alt="logo" />

      <Navlinks className="header-links" />
      <AnimatePresence>
        {sideBarOpen && <SideBar onClick={handleClick} isOpen={sideBarOpen} />}
      </AnimatePresence>
      <div className="burgerIcon" onClick={handleClick}>
        ☰
      </div>
    </header>
  );
}

export default Header;
