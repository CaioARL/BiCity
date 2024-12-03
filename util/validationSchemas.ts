
import { z } from 'zod';


// -------- Input Schemas
export const valid = {
    cepSchema : z.string().min(8).max(8)

}




// -------- Object Schemas 

export const userSignUpSchema  = z.object(
    {
        cpfCnpj: z.string().min(11).max(14),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
        firstName: z.string(),
        lastName: z.string(),
    }
) 
