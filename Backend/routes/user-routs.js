const express = require('express');

const userController = require('../controllers/users-controller');
const authController = require('../controllers/auth-controllers');

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/createUser', userController.createUser);
router.post('/confirmUser/:confirmToken', userController.confirmUser);
router.post('/sendCustomerRequest', userController.sendCustomerRequest);

module.exports = router;
