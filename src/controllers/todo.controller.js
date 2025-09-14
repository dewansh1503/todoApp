import { asynchandler } from '../utils/asyncHandler.js';
import {
   objectIdValidation,
   todoValidation,
} from '../validation/validation.js';
import { apiError } from '../utils/apiError.js';
import { z } from 'zod';
import { apiResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';
import { Todo } from '../models/todo.model.js';

const createTodo = asynchandler(async (req, res) => {
   const result = todoValidation(req.body);
   if (result.error) {
      const err = z.treeifyError(result.error);
      const errMessageObject = JSON.stringify(err.properties);
      throw new apiError(400, errMessageObject);
   }
   const { task } = result.data;
   const todo = await Todo.create({
      task,
      userId: new mongoose.Types.ObjectId(req.user._id),
      done: false,
   });
   res.status(200).json(new apiResponse(200, 'Task added', todo));
});

const deleteTodo = asynchandler(async (req, res) => {
   const result = objectIdValidation(req.query);
   if (result.error) {
      const err = z.treeifyError(result.error);
      const errMessageObject = JSON.stringify(err.properties);
      throw new apiError(400, errMessageObject);
   }

   const { todoId } = result.data;
   const todo = await Todo.findById(todoId);
   if (!todo) throw new apiError(404, 'Todo did not exist');

   // user didn't own todo (even if the todo exits)
   if (todo.userId != req.user._id) throw new apiError(404, 'Todo not found');

   const delObj = await Todo.findByIdAndDelete(todo._id);

   res.status(200).json(new apiResponse(200, 'Todo deleted'));
});

const doneTodo = asynchandler(async (req, res) => {
   const result = objectIdValidation(req.query);
   if (result.error) {
      const err = z.treeifyError(result.error);
      const errMessageObject = JSON.stringify(err.properties);
      throw new apiError(400, errMessageObject);
   }

   const { todoId } = result.data;
   const todo = await Todo.findById(todoId);
   if (!todo) throw new apiError(404, 'Todo did not exit');

   // user didnt own the todo (even if the todo exits)
   if (todo.userId != req.user._id) throw new apiError(400, 'Todo not found');

   todo.done = true;
   await todo.save();

   res.status(200).json(new apiResponse(200, 'Done todo'));
});
