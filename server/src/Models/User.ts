import mongoose, { Document, Schema } from 'mongoose';

export type UserStatus = 'active' | 'inactive' | 'trial_expired';
export type UserRole = 'admin' | 'staff' | 'superadmin';

export interface IUser extends Document {
  email: string;
  role: UserRole;
  plan: string;
  expiry: Date;
  status: UserStatus;
  dashboardDataId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    role: {
      type: String,
      enum: ['admin', 'staff', 'superadmin'],
      required: true,
    },
    plan: {
      type: String,
      required: true,
      trim: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'trial_expired'],
      default: 'active',
    },
    dashboardDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dashboard',
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
