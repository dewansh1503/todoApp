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

userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();

   //    hashing password
   const hashedPassword = await bcrypt.hash(this.password, 10);
   this.password = hashedPassword;
   next();
});
