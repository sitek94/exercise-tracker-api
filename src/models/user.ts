import { Schema, model, Document } from 'mongoose';

export type UserDocument = Document & {
  username: string;
};

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
  },
  {
    versionKey: false,
  },
);

const User = model<UserDocument>('User', userSchema);

export default User;
