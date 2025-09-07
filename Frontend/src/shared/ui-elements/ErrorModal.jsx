import React from 'react';
import { motion } from 'motion/react';

import './ErrorModal.css';
import Card from './Card';
import Button from '../form-elements/Button';

const modalVariants = {
  visible: { opacity: 1, transition: { duration: 0.3 } },
  hidden: { opacity: 0, transition: { duration: 0.3 } },
};

function ErrorModal(props) {
  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="errorModal"
    >
      <Card className="card--errorModal">
        <div className="message-wrapper">
          <p className="errorMessage">{props.errorMessage}</p>
        </div>
        <Button size="small" ok onClick={props.onClick}>
          OK
        </Button>
      </Card>
    </motion.div>
  );
}

export default ErrorModal;
