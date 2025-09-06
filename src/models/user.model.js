import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
   {
      username: String,
      password: String,
      email: { type: String, unique: true },
      refreshToken: String,
   },
   { timestamps: true }
);
