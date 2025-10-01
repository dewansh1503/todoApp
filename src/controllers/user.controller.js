import { asynchandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import {
   signupValidation,
   signinValidation,
} from '../validation/validation.js';
import z from 'zod';

async function generateTokens(user) {
   let accessToken = user.generateAccessToken();
   let refreshToken = user.generateRefreshToken();
   user.refreshToken = refreshToken;
   await user.save();
   return { accessToken, refreshToken };
}

const singup = asynchandler(async (req, res) => {
   /* zod response
   error =>
      flat { formErrors: [], fieldErrors: { email: [ 'Invalid email address' ] } }
   
   valid =>
      result {
   success: true,
   data: {
      username: 'shyam',
      password: '123123123',
      email: 'shyam@gmail.com'
      }
      }
   */

   const result = signupValidation(req.body);
   if (result.error) {
      let err = z.treeifyError(result.error);
      const errMessageObject = JSON.stringify(err.properties);
      // errMessageObject contain fields with associated error message
      throw new apiError(400, errMessageObject);
   }
   const { username, email, password } = result.data;

   let founduser = await User.findOne({ email });

   if (founduser) {
      throw new apiError(409, 'User already exists');
   } else {
      await User.create({
         username,
         password, // hashed password before saving in db(todo.model.js)
         email,
      });
      res.status(201).json(
         new apiResponse(201, 'Singed up successfully', { username, email })
      );
   }
});

const login = asynchandler(async (req, res) => {
   const result = signinValidation(req.body);

   if (result.error) {
      let err = z.treeifyError(result.error);
      const errMessageObject = JSON.stringify(err.properties);
      // errMessageObject contain fields with associated error message
      throw new apiError(400, errMessageObject);
   }

   const { email, password } = result.data;
   let founduser = await User.findOne({ email });

   if (!founduser) {
      throw new apiError(404, 'User not found');
   } else if (!founduser.isPasswordCorrect(password)) {
      throw new apiError(401, 'Incorrect credentials');
   } else {
      // check if user already logged in

      let decodedToken;
      if (req.cookies.accessToken) {
         try {
            decodedToken = jwt.verify(
               req.cookies.accessToken,
               process.env.ACCESS_TOKEN_SECRET
            );
         } catch (err) {
            throw new apiError(401, 'Access token expired');
         }
         if (decodedToken) {
            throw new apiError(409, `${founduser.username} already logged in`);
         }
      }

      let { accessToken, refreshToken } = await generateTokens(founduser);
      const options = {
         httpOnly: true,
         secure: true,
         sameSite: 'lax',
         maxAge: parseInt(process.env.COOKIE_EXPIRY),
      };

      res.status(200)
         .cookie('accessToken', accessToken, options)
         .cookie('refreshToken', refreshToken, options)
         .json(
            new apiResponse(
               200,
               `${founduser.username} logged in successfully`,
               {
                  accessToken,
                  refreshToken,
               }
            )
         );
   }
});

const logout = asynchandler(async (req, res) => {
   const user = await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset: { refreshToken: '' },
      },
      { new: true }
   );

   res.clearCookie('accessToken');
   res.clearCookie('refreshToken');
   res.status(200).json(new apiResponse(200, `${user.username} logged out`));
});

const refreshTokens = asynchandler(async (req, res) => {
   const token = req.cookies.refreshToken;
   if (!token) throw new apiError(401, 'Token not found');

   let decodedToken;
   // let user;
   try {
      decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
   } catch (error) {
      throw new apiError(401, 'Invalid refresh token');
   }
   const user = await User.findById(decodedToken._id);

   if (user.refreshToken !== token)
      throw new apiError(401, 'Refresh token mismatch');

   // clearing old cookies
   res.clearCookie('accessToken').clearCookie('refreshToken');
   const { accessToken, refreshToken } = await generateTokens(user);
   res.status(200)
      .cookie('accessToken', accessToken)
      .cookie('refreshToken', refreshToken)
      .json(new apiResponse(200, 'Refreshed tokens'));
});
