import jwt from 'jsonwebtoken';
import { apiError } from '../utils/apiError.js';

const verifyJwt = (req, res, next) => {
   const token = req.cookies.accessToken;
   if (!token) {
      throw new apiError(401, 'Unauthorized');
   }
   try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decodedToken;
      next();
   } catch (err) {
      throw new apiError(401, 'Invalid access token');
   }
};

export { verifyJwt };
