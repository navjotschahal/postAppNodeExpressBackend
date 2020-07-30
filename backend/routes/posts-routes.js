const express = require('express');

const checkAuth = require('../middleware-intercept/check-auth');
const extractImageFile = require('../middleware-intercept/multer-file');

const PostController = require('../controllers/post-controller');

const router = express.Router();

const routeUrls = require('../static-data/static-data.json').routes.postsRoutes.routes;
 

router.post(routeUrls.postApost, checkAuth, extractImageFile, PostController.createPost);

router.get(routeUrls.getPosts, PostController.getPosts);

router.delete(routeUrls.deletePost, checkAuth, PostController.deletePost);

router.put(routeUrls.updateApost, checkAuth, extractImageFile, PostController.updatePost);

module.exports = router;
