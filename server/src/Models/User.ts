import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  dashboardDataId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    dashboardDataId: {
      type: Schema.Types.ObjectId,
      ref: 'Dashboard',
      required: false
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
