import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET || 'your_jwt_secret',
    {
      expiresIn: '30d',
    }
  );
};

export default generateToken;
