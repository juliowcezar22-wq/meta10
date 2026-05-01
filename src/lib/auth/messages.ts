export function translateAuthError(error: string): string {
  const messages: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'Email not confirmed': 'Por favor, confirme seu e-mail antes de entrar.',
    'User already registered': 'Este e-mail já está cadastrado.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'For security purposes, you can only request this once every 60 seconds': 'Por segurança, aguarde 60 segundos antes de tentar novamente.',
    'To protect your account, your sign in request was delayed. Please try again later.': 'Muitas tentativas. Aguarde um momento e tente novamente.',
    'New password should be different from the old password': 'A nova senha deve ser diferente da atual.',
    'Auth session missing!': 'Sessão expirada. Por favor, tente novamente.',
  }

  return messages[error] || 'Ocorreu um erro inesperado. Tente novamente.'
}
