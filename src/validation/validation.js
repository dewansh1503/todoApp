import { z } from 'zod';

const baseSchema = z.object({
   password: z.string().min(8).max(50),
   email: z.string().trim().email(),
});

const signinValidation = function (body) {
   const result = baseSchema.safeParse(body);
   return result;
};

const userSchema = baseSchema.extend({
   username: z.string().trim().min(3).max(50),
});

const signupValidation = function (body) {
   const result = userSchema.safeParse(body);
   return result;
};

const todoSchema = z.object({
   task: z.string().trim().min(1, 'Task is required'),
});

const todoValidation = function (body) {
   const result = todoSchema.safeParse(body);
   return result;
};

const objectIdSchema = (key) =>
   z.object({
      [key]: z
         .string()
         .trim()
         .regex(/^[0-9a-fA-F]{24}$/, `Invalid ${key}`),
   });

const objectIdValidation = function (body) {
   const key = Object.keys(body);
   const result = objectIdSchema(key).safeParse(body);
   return result;
};