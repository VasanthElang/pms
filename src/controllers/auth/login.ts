import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { relogRequestHandler } from '../../middleware/request-middleware';
import { User } from '../../models/User';
import envConfig from '../../config/config';
import { encrypt } from '../../providers/crypto';

const loginWrapper: RequestHandler = async (req, res) => {
  const { email = undefined, password = undefined } = req.body;

  const user = await User.findOne({ email });

  if (user && user.validPassword(password)) {
    const token = jwt.sign(
      {
        _e: user.email,
        _i: user._id,
        _r: user.role
      },
      envConfig.JWT_SECRET,
      {
        expiresIn: '12h'
      }
    );
    return res.status(200).json({
      token,
      uid: user._id
    });
  }

  return res.status(403).json({
    message: 'Auth failed'
  });
};

export const login = relogRequestHandler(loginWrapper, { skipJwtAuth: true });
