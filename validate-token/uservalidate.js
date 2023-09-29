// auth.js

const jwt = require('jsonwebtoken');

const verifyToken = (token, secretKey) => {
  try {
    // Verify the JWT token using the provided secretKey
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    // If the token verification fails, return null or throw an error
    return "Unauthorized: Invalid token";
  }
};

const extractUserFromToken = (req, secretKey) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return "Unauthorized: Invalid token"; // No token provided
  }

  // Extract and verify the JWT token
  const token = authHeader.split(' ')[1];
  const user = verifyToken(token, secretKey);

  return user;
};

module.exports = {
  verifyToken,
  extractUserFromToken,
};
