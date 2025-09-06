const asynchandler = (requesthandler) => (req, res, next) => {
   return Promise.resolve(requesthandler(req, res, next)).catch(next);
};
export { asynchandler };
