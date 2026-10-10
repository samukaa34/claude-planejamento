// Tela de acesso — login ou criação de conta com e-mail e senha
import { useState } from 'react'
import { supabase } from '../data/supabaseClient.js'
import { Button } from '../components/ui/Button.jsx'

// Traduz as mensagens de erro mais comuns do Supabase Auth
function translateError(error) {
  if (error.code === 'invalid_credentials') return 'E-mail ou senha incorretos.'
  if (error.code === 'email_not_confirmed') return 'Confirme seu e-mail antes de entrar.'
  if (error.code === 'user_already_exists') return 'Já existe uma conta com este e-mail.'
  if (error.code === 'weak_password') return 'A senha deve ter pelo menos 6 caracteres.'
  if (error.code === 'over_email_send_rate_limit') return 'Muitas tentativas. Aguarde alguns minutos.'
  return error.message
}

export function LoginPage() {
  // Alterna entre entrar em uma conta existente e criar uma nova
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const isSignUp = mode === 'signup'

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')

    const credentials = { email: email.trim(), password }
    const { data, error: authError } = isSignUp
      ? await supabase.auth.signUp({ ...credentials, options: { emailRedirectTo: window.location.origin } })
      : await supabase.auth.signInWithPassword(credentials)

    setLoading(false)
    if (authError) {
      setError(translateError(authError))
    } else if (isSignUp && !data.session) {
      // Sem sessão imediata: o projeto exige confirmação por e-mail
      setInfo('Conta criada. Abra o link de confirmação enviado para o seu e-mail e depois entre.')
      setMode('signin')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Planejamento Financeiro</h1>
            <p className="text-sm text-gray-500">{isSignUp ? 'Criar conta' : 'Entrar'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-green-700">{info}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
          </Button>
        </form>

        {/* Alterna entre login e criação de conta */}
        <button
          type="button"
          onClick={() => { setMode(isSignUp ? 'signin' : 'signup'); setError('') }}
          className="mt-4 w-full text-center text-xs text-blue-600 hover:underline"
        >
          {isSignUp ? 'Já tenho uma conta' : 'Criar uma conta'}
        </button>
      </div>
    </div>
  )
}
