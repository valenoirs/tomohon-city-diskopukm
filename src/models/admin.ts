import { model, Schema } from 'mongoose'
import { IAdmin } from '../interface/admin'

const AdminSchema: Schema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export const Admin = model<IAdmin>('Admin', AdminSchema)
