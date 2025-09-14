
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