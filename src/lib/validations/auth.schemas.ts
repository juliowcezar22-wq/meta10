import { z } from 'zod'

/** Schema de validação para Login */
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

/** Schema de validação para Cadastro */
export const signupSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

/** Schema de validação para solicitação de redefinição de senha */
export const resetPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

/** Schema de validação para a criação da nova senha */
export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'A nova senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'A confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})
