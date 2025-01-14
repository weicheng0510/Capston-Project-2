const jwt = require('jsonwebtoken');

// Middleware function to verify JWT tokens
async function authToken(req, res, next) {

    // Get token from request headers
    const authHeader = req.headers.authorization;

    // Verify token
    if (!authHeader) {
        return res.status(401).json({
            message: 'Unauthorized: Please login',
            success: false,
        });
    }

    try {
        // Extract the token from the "Bearer <token>" format
        const token = authHeader.split(' ')[1];


        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach the decoded user information to the request object
        req.user = decoded;


        // Proceed to the next middleware or route handler
        next();

    } catch (err) {
        // Handle token verification errors
        console.error('Token verification failed:', err.message);
        return res.status(401).json({
            message: 'Please log in',
            success: false,
        });
    }
}

module.exports = authToken;