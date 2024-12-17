
import { z } from 'zod';


// -------- Input Schemas
export const valid = {
    cepSchema : z.string().min(8).max(8),

    emailSchema: z.string().email({message: 'Examplo de email valido: nome@domain.com'}),

    cepSchemaRegex: z.string().min(8 ,{message: 'Cep deve conter no minimo 8 numeros, por exemplo: 00000-000'}).max(8, {message: 'Cep deve conter no maximo 8 numeros, por exemplo: 00000-000'}).regex(new RegExp('^[0-9]*$')),

    usernameSchema: z.string().min(4, {message: 'Nome de usuario deve ter pelo ao menos 4 caracteres' }).max(20, {message: 'Nome de usuario deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Z0-9]*$'), {message: 'Nome de usuario deve conter apenas letras e numeros'}),

    nameSchema: z.string().min(3, {message: 'Nome deve ter pelo ao menos 3 caracteres' }).max(20, {message: 'Nome deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Z]*$'), {message: 'Nome deve conter apenas letras'}),

    houseNumberSchema: z.string().min(1, {message: 'Numero da casa deve ter pelo ao menos 1 caracter' }).max(10, {message: 'Numero da casa deve ter no maximo 10 caracteres' }).regex(new RegExp('^[0-9]*$'), {message: 'Numero da casa deve conter apenas numeros'}),

    cpfSchema: z.string().min(11, {message: 'Cpf deve ter pelo ao menos 11 caracteres' }).max(11, {message: 'Cpf deve ter no maximo 11 caracteres' }).regex(new RegExp('^[0-9]*$'), {message: 'Cpf deve conter apenas numeros'}),

    cnpjSchema: z.string().min(14, {message: 'Cnpj deve ter pelo ao menos 14 caracteres' }).max(14, {message: 'Cnpj deve ter no maximo 14 caracteres' }).regex(new RegExp('^[0-9]*$'), {message: 'Cnpj deve conter apenas numeros'}),
   
    passwordSchema: z.string().regex(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-@#\$%\^&\*])(?=.{6,20})'), 
        {message: 'Senha deve conter pelo menos uma letra maiuscula, uma letra minuscula, um numero e um caracter especial'}
    ).min(6, {message: 'Senha deve ter pelo ao menos 6 caracteres' }).max(20, {message: 'Senha deve ter no maximo 20 caracteres' }),


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
