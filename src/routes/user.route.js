import { Router } from 'express';
import {
   login,
   logout,
   refreshTokens,
   singup,
} from '../controllers/user.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/signup').post(singup);

router.route('/login').post(login);

router.route('/logout').post(verifyJwt, logout);

router.route('/refresh-tokens').post(refreshTokens);

export default router;
