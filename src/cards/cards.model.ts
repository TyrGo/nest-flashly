import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const CardSchema = new mongoose.Schema({
  word: { type: String, unique: true, required: true },
  defn: { type: String, required: true },
  bin: { type: Number, default: 0 },
  wrongs: { type: Number, default: 0 },
  due: { type: Date, default: Date.now, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
});

export interface Card extends mongoose.Document {
  id: string;
  word: string;
  defn: string;
  bin: number;
  wrongs: number;
  due: Date;
  userId: string;
}
