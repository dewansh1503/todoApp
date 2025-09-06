import mongoose, { Schema } from 'mongoose';

const todoSchema = new Schema(
   {
      userId: mongoose.Types.ObjectId,
      task: { type: String, required: true, trim: true },
      done: Boolean,
   },
   { timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema);
export { Todo };
