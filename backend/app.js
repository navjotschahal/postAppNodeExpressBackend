const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts-routes');
const userRoutes = require('./routes/user-routes');
const staticData = require('./static-data/static-data.json');

/**
 * My local Mongoose to MongoDB connnection.
 */
// mongoose.connect(staticData.mongoDbConnection.uris, staticData.mongoDbConnection.options.ConnectionOptions)
// .then(() => {
// console.log(staticData.mongoDbConnection.messages.sucess + staticData.strFormater.newLine + staticData.mongoDbConnection.messages.sucessSarcasm);
// }).catch(() => {
//     console.log(staticData.mongoDbConnection.messages.failed + staticData.strFormater.newLine + staticData.mongoDbConnection.messages.failedSarcasm);
// });

/**
 * MOngoDB atlas cluster connection
 */
mongoose.connect('mongodb+srv://nsc:' + staticData.mongoDbAtlasCluster.password + '@cluster0.8f5xp.mongodb.net/meanPostAppDb?retryWrites=true&w=majority',
staticData.mongoDbConnection.options.ConnectionOptions)
.then(() => {
console.log(staticData.mongoDbConnection.messages.sucess + staticData.strFormater.newLine + staticData.mongoDbConnection.messages.sucessSarcasm);
}).catch(() => {
    console.log(staticData.mongoDbConnection.messages.failed + staticData.strFormater.newLine + staticData.mongoDbConnection.messages.failedSarcasm);
});

const Post = require('./model-schemas/post');


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images/photos', express.static(path.join('backend/images/photos')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

app.use("/api/posts/", postsRoutes);

app.use("/api/user/", userRoutes);

module.exports = app;
