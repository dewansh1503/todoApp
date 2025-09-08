import { Router } from 'express';
import {
   createTodo,
   deleteTodo,
   doneTodo,
   listTodos,
   updateTodo,
} from '../controllers/todo.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJwt);

router.route('/list-todos').get(listTodos);

router.route('/create-todo').post(createTodo);

router.route('/delete-todo').delete(deleteTodo);

router.route('/done-todo').patch(doneTodo);

router.route('/update-todo').patch(updateTodo);

export default router;
