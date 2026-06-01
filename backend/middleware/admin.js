import User from '../models/User.js';

const admin = async (req, res, next) => {
  try {
    const role = req.userRole;

    if (role === 'admin') {
      return next();
    }

    const user = await User.findById(req.userId).select('role');
    if (user && user.role === 'admin') {
      req.userRole = 'admin';
      return next();
    }

    return res.status(403).json({ message: 'Admin access required' });
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default admin;
