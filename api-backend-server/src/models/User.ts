import {
  Document, Model, Schema, model
} from 'mongoose';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { Status, Role } from '../enum/user';

export interface IUser extends Document {
  /** Email */
  email: string;
  /** Password */
  password: string;
  /** Password */
  firstName: string;
  /** Password */
  lastName: string;
  /** role */
  role: string
    /** Status */
  status: string;
  /** Created On */
  createdOn: Date;
  /** Created On */
  updatedOn: Date;
  encryptPassword: (password: string) => string;
  validPassword: (inputPassword:string, password: string) => boolean;

}

interface IUserModel extends Model<IUser> { }

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.user
  },
  /** Status */
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.unconfirmed
  },
  createdOn: {
    required: true,
    type: Date
  },
  updatedOn: {
    required: true,
    type: Date,
    default: Date.now
  }
});

schema.methods.encryptPassword = (password: string) => hashSync(password, genSaltSync(10));

schema.methods.validPassword = function (inputPassword:string, password: string) {
  return compareSync(inputPassword, password);
};

export const User: IUserModel = model<IUser, IUserModel>('User', schema);
