const errorHandler = (err, req, res, next) => {
   const statusCode = err.statusCode || 500;

   // console.log(err);
   res.status(statusCode).json({
      message: err.message || 'Internal server error',
      statusCode,
      success: false,
      // only show the stack trace in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
   });
};

export { errorHandler };
