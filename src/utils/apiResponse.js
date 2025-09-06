class apiResponse {
   constructor(statusCode, message, data) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data || undefined;
      this.success = true;
   }
}

export { apiResponse };
