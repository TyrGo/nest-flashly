import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

export interface User extends mongoose.Document {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  created: Date;
  updated: Date;
}
