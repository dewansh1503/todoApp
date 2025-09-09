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
