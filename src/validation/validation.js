import { z } from 'zod';

const baseSchema = z.object({
   password: z.string().min(8).max(50),
   email: z.string().trim().email(),
});

const signinValidation = function (body) {
   const result = baseSchema.safeParse(body);
   return result;
};
