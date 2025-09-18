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
