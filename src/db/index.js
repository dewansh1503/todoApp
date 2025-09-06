import mongoose from 'mongoose';
import { db_name } from '../constants/constants.js';

async function connectDb() {
   await mongoose.connect(`${process.env.CONNECTION_STRING}/${db_name}`);
}

export { connectDb };
