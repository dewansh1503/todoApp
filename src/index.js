import dotenv from 'dotenv';
dotenv.config();
import { app } from './app.js';
import { connectDb } from './db/index.js';

const PORT = process.env.PORT || 3000;

connectDb()
   .then(() => {
      app.listen(PORT, () => {
         console.log('app is running on port', PORT);
      });
   })
   .catch((err) => {
      console.log('error connecting database', err);
      process.exit(1);
   });
