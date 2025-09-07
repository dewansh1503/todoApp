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

userSchema.methods.isPasswordCorrect = function (password) {
   return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
   const token = jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
   });
   return token;
};

userSchema.methods.generateRefreshToken = function () {
   const token = jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
   });
   return token;
};
