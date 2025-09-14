
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
