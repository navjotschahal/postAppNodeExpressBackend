const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(
            token,
            'screte-key-this-should-be-a-very-long-string-apa-dan-ne-karam-se-ka-ke-ki-sa-re-ga-ma-pa-dha-ni-sa-sampradan'
            );
        req.userData = { userName: decodedToken.userName, userId: decodedToken.userId };
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth Failed!'
        });
    }
};