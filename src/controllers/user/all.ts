import { RequestHandler } from 'express';
import { relogRequestHandler } from '../../middleware/request-middleware';
import { User } from '../../models/User';

const allWrapper: RequestHandler = async (req, res) => {
  const { query, options = { password: 0, __v: 0 }, projections = {} } = req.body;
  const users = await User.find(query, options, projections);
  res.send({ users });
};

export const all = relogRequestHandler(allWrapper);
