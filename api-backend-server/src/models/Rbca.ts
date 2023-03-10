import {
  Document, Model, Schema, model
} from 'mongoose';
import { Role } from '../enum/user';

export interface IRbca extends Document {
  /** role */
  role: string;
  /** resource */
  resource: string;
   /** action */
  action: string;
  /** attributes */
  attributes: string;
   /** Status */
  isActive: string;
  /** Created On */
  createdOn: Date;
}

interface IRbcaModel extends Model<IRbca> { }

const schema = new Schema({
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.user
  },
  resource: { type: String, required: true },
  action: { type: String, required: true },
  attributes: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
  createdOn: {
    required: true,
    type: Date,
    default: Date.now
  }
});

export const Rbca: IRbcaModel = model<IRbca, IRbcaModel>('Rbca', schema);
