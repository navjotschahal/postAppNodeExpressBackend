const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model-schemas/user');

const { query } = require('express');

exports.userSignUp = (req, res, next) => {
    bCrypt.hash(req.body.password, 10).then( hash => {
        const user = new User({
            userName: req.body.userName,
            password: hash
        });
        user.save().then( result => {
            res.status(201).json({
                data: result,
                message: 'User created!'
            });
        }).catch( err => {
            res.status(500).json({
                data: err,
                message: 'User not created!'
            });
        });
    });
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ userName: req.body.userName })
    .then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'Auth Failed!',
                data: req.body.userName
            });
        }
        fetchedUser = user;
        return bCrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if (!result) {
            return res.status(401).json({
                message: 'Auth Failed!, incorrect userName or password.',
                data: req.body.userName
            });
        }
        const token = jwt.sign(
            { userName: fetchedUser.userName, userId: fetchedUser._id },
            'screte-key-this-should-be-a-very-long-string-apa-dan-ne-karam-se-ka-ke-ki-sa-re-ga-ma-pa-dha-ni-sa-sampradan',
            { expiresIn: '1h' }
        );
        return res.status(200).json({ token: token, expiresIn: 3600, authorisedUserId: fetchedUser._id });
    })
    .catch(err => {
        console.log(err);
        return res.status(401).json({
            message: 'Auth Failed, err occued.',
            data: err
        });
    });
}
