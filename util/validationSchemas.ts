
import { z } from 'zod'

export const signUpStep1 = z.object({
    firstName: z.string().min(3, {message: 'Nome deve ter pelo ao menos 3 caracteres' }).max(20, {message: 'Nome deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Z]*$'), {message: 'Nome deve conter apenas letras'}),
    secondName: z.string().min(3, {message: 'Nome deve ter pelo ao menos 3 caracteres' }).max(20, {message: 'Nome deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Z]*$'), {message: 'Nome deve conter apenas letras'}),
    nomeUsuario: z.string().min(4, {message: 'Nome de usuario deve ter pelo ao menos 4 caracteres' }).max(20, {message: 'Nome de usuario deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Z0-9]*$'), {message: 'Nome de usuario deve conter apenas letras e numeros'}),
    nivelHabilidade: z.object({
        id: z.number({message: 'Nivel de habilidade deve selecionar um nivel de habilidade'}),
        nome: z.string().min(1,{message: 'Nivel de habilidade deve selecionar um nivel de habilidade'}),
        descricao: z.string({message: 'Nivel de habilidade deve selecionar um nivel de habilidade'})
    }),
})
export const signUpStep2 = z.object({
    cep: z.string().min(8, {message: 'Cep deve ter pelo ao menos 8 caracteres' }).max(8, {message: 'Cep deve ter no maximo 8 caracteres' }).regex(new RegExp('^[0-9]*$'), {message: 'Cep deve conter apenas numeros'}),
    estado: z.string({message: 'Estado deve conter estado'}).min(2, {message: 'Estado deve conter no mínimo 2 digitos'}).max(20, {message: 'Nome deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Zãõçéóáà ]*$'),{message: 'Estado deve conter apenas letras'}),
    cidade: z.string({message: 'Cidade deve conter cidade'}).min(2 , {message: 'Cidade deve conter no mínimo 2 digitos'}).max(20, {message: 'Nome deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Zãõçéóáà ]*$'),{message: 'Cidade deve conter apenas letras'}),
    bairro: z.string({message: 'Bairro deve conter bairro'}).min(2, {message: 'Bairro deve conter no mínimo 2 digitos'}).max(20, {message: 'Nome deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Zãõçéóáà ]*$'),{message: 'Bairro deve conter apenas letras'}),
    rua: z.string({message: 'Rua deve conter rua'}).min(2, {message: 'Rua deve conter no mínimo 2 digitos'}).regex(new RegExp('^[a-zA-Zãõçéóáà ]*$')),
    numero: z.string({message: 'Numero deve conter numero de endereço'}).min(1, {message: 'Numero deve conter numero de endereço'}).max(10, {message: 'Numero deve conter numero de endereço'}).regex(new RegExp('^[0-9]*$'), {message: 'Numero deve conter apenas numeros'}),
})
export const signUpStep3 = z.object({
    cnpj: z.string().min(14, {message: 'Cnpj deve ter pelo ao menos 14 caracteres' }).max(14, {message: 'Cnpj deve ter no maximo 14 caracteres' }).regex(new RegExp('^[0-9]*$'), {message: 'Cnpj deve conter apenas numeros'}).nullish(),
    cpf: z.string().min(11, {message: 'Cpf deve ter pelo ao menos 11 caracteres' }).max(11, {message: 'Cpf deve ter no maximo 11 caracteres' }).regex(new RegExp('^[0-9]*$'), {message: 'Cpf deve conter apenas numeros'}).nullish(),
    senha: z.string().regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-@#\$%\^&\*])(?=.{6,20})'), {message: 'Senha deve conter pelo menos uma letra maiuscula, uma letra minuscula, um numero e um caracter especial'}).min(6, {message: 'Senha deve ter pelo ao menos 6 caracteres' }).max(20, {message: 'Senha deve ter no maximo 20 caracteres' }),
    confirmaSenha: z.string().regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-@#\$%\^&\*])(?=.{6,20})'), {message: 'Senha deve conter pelo menos uma letra maiuscula, uma letra minuscula, um numero e um caracter especial'}).min(6, {message: 'Senha deve ter pelo ao menos 6 caracteres' }).max(20, {message: 'Senha deve ter no maximo 20 caracteres' }),
})
export const signUpStep4 = z.object({
    email: z.string().email({message: 'Exemplo de email valido: email@email.com'})
})

export const loginSchema = z.object({
    cnpj: z.string().min(14, {message: 'Cnpj deve ter pelo ao menos 14 caracteres' }).max(14, {message: 'Cnpj deve ter no maximo 14 caracteres' }).regex(new RegExp('^[0-9]*$'), {message: 'Cnpj deve conter apenas numeros'}).nullish(),
    cpf: z.string().min(11, {message: 'Cpf deve ter pelo ao menos 11 caracteres' }).max(11, {message: 'Cpf deve ter no maximo 11 caracteres' }).regex(new RegExp('^[0-9]*$'), {message: 'Cpf deve conter apenas numeros'}).nullish(),
    nomeUsuario: z.string().min(4, {message: 'Nome de usuario deve ter pelo ao menos 4 caracteres' }).max(20, {message: 'Nome de usuario deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Z0-9]*$'), {message: 'Nome de usuario deve conter apenas letras e numeros'}).nullish(),
    email: z.string().email({message: 'Exemplo de email valido: email@email.com'}).nullish(),
    senha: z.string().regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-@#\$%\^&\*])(?=.{6,20})'), {message: 'Senha deve conter pelo menos uma letra maiuscula, uma letra minuscula, um numero e um caracter especial'}).min(6, {message: 'Senha deve ter pelo ao menos 6 caracteres' }).max(20, {message: 'Senha deve ter no maximo 20 caracteres' }),
})

export const updateUsuario = z.object({
    nome: z.string().min(3, {message: 'Nome deve ter pelo ao menos 3 caracteres' }).max(20, {message: 'Nome deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Z ]*$'), {message: 'Nome deve conter apenas letras'}),
    nomeUsuario: z.string().min(4, {message: 'Nome de usuario deve ter pelo ao menos 4 caracteres' }).max(20, {message: 'Nome de usuario deve ter no maximo 20 caracteres' }).regex(new RegExp('^[a-zA-Z0-9]*$'), {message: 'Nome de usuario deve conter apenas letras e numeros'}),
    endereco: z.object({
        cep: z.string().min(8, {message: 'Cep: deve digitar um cep com 8 digitos '}).max(8, {message: 'Cep: deve digitar um cep com 8 digitos '}),
        estado: z.string({message: 'Estado: deve conter estado'}).min(2, {message: 'Estado: deve conter no mínimo 2 digitos'}),
        cidade: z.string({message: 'Cidade: deve conter cidade'}).min(4 , {message: 'Cidade: deve conter no mínimo 4 digitos'}),
        bairro: z.string({message: 'Bairro: deve conter bairro'}).min(2, {message: 'Bairro: deve conter no mínimo 2 digitos'}),
        rua: z.string({message: 'Rua: deve conter rua'}).min(4, {message: 'Rua: deve conter no mínimo 4 digitos'}),
        numero: z.number(  { message: 'Numero: deve conter numero de endereço' } ).min(1)
    }),
    email: z.string().email({message: 'Exemplo de email valido: email@email.com'}),
    nivelHabilidade: z.object({
        id: z.number({message: 'Nivel de habilidade deve selecionar um nivel de habilidade'}),
        nome: z.string().min(1,{message: 'Nivel de habilidade deve selecionar um nivel de habilidade'}),
        descricao: z.string({message: 'Nivel de habilidade deve selecionar um nivel de habilidade'})
    }),
})    

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

export const createEventSchema = z.object(
    {
        nome: z.string().min(5, { message: 'Nome: deve ter pelo ao menos 5 caracteres' }),
        descricao: z.string().min(10, { message: 'Descrição: deve ter pelo ao menos 10 caracteres' }),
        data: z.object({
            data: z.string({message: 'Data: deve selecionar uma data'}).min(10, {message: 'Data: deve conter no minimo 10 caracteres 0000-00-00 '}),
            horario: z.string({message: 'Horario: deve selecionar um horario'}).min(8, {message: 'Horario: deve conter no minimo 5 caracteres 00:00:00'})
        }),
        endereco: z.object({
            cep: z.string().min(8, {message: 'Cep: deve digitar um cep com 8 digitos '}).max(8, {message: 'Cep: deve digitar um cep com 8 digitos '}),
            estado: z.string({message: 'Estado: deve conter estado'}).min(2, {message: 'Estado: deve conter no mínimo 2 digitos'}),
            cidade: z.string({message: 'Cidade: deve conter cidade'}).min(4 , {message: 'Cidade: deve conter no mínimo 4 digitos'}),
            bairro: z.string({message: 'Bairro: deve conter bairro'}).min(2, {message: 'Bairro: deve conter no mínimo 2 digitos'}),
            rua: z.string({message: 'Rua: deve conter rua'}).min(4, {message: 'Rua: deve conter no mínimo 4 digitos'}),
            numero: z.number(  { message: 'Numero: deve conter numero de endereço' } ).min(1)
        }),
        faixaKm: z.number().max(200, {message: 'faixa em KM de no máximo até 200km'}).min(1, {message: 'faixa em KM de no mínimo 1km'}),
        gratuito: z.boolean({message: 'Gratuito: deve selecionar se é gratuito ou não'}),
        urlSite: z.string().url({message: 'Url do site: deve ser uma url valida'}),
        tipoEvento: z.object({
            id: z.number().min(1,{message: ' Tipo de evento: deve selecionar um tipo de evento'}),
            nome: z.string( { message: '' } ),
            nivelHabilidade: z.object({
                id: z.number( { message: '' } ),
                nome: z.string( { message: '' } ),
                descricao: z.string( { message: '' } )
            })
        })
    }
)

export const createAvaliacaoSchema = z.object(
    {
        nota: z.number().min(1, {message: 'Nota: deve selecionar uma nota de 1 a 5'}).max(5, {message: 'Nota: deve selecionar uma nota de 1 a 5'}),
        comentario: z.string().max(200, {message: 'Comentario: deve ter no maximo 200 caracteres'}).nullish()
    }
)

export const createProblemaSchema = z.object(
    {
        descricao: z.string().min(10, {message: 'Descrição: deve ter pelo ao menos 10 caracteres'}),
        idTipoProblema: z.number().min(1, "{Tipo: deve selecionar um tipo de problema'}),"),
    }
)