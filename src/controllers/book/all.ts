import { RequestHandler } from 'express';
import { relogRequestHandler } from '../../middleware/request-middleware';
import { Book } from '../../models/Book';
import { canRead } from '../../providers/access-control';

const allWragger: RequestHandler = async (req:any, res:any) => {
  const permission = canRead(req?.user?._r, 'book');
  if (permission.granted) {
    const books = await Book.find();
    res.status(200).json(books);
  } else {
    // resource is forbidden for this user/role
    res.status(403).end();
  }
};

export const all = relogRequestHandler(allWragger);
