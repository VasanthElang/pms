import { Request, Response } from 'express';

export interface IUserAuthInfoRequest extends Request {
  user: any // or any other type
}
