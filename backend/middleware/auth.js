import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userName = decoded.name;

    if (!req.userRole || !req.userName) {
      const user = await User.findById(req.userId).select('role name');
      if (user) {
        req.userRole = req.userRole || user.role;
        req.userName = req.userName || user.name;
      }
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;
