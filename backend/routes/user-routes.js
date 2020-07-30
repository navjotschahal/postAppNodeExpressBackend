const express = require('express');

const UserController = require('../controllers/user-controller');

const app = require('../app');

const router = express.Router();

const userUrls = require('../static-data/static-data.json').routes.userRoutes.routes;


router.post(userUrls.signUp, UserController.userSignUp);

router.post(userUrls.login, UserController.userLogin);

module.exports = router;
