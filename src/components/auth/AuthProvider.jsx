// Controla a sessão do usuário: exibe a tela de login quando não há sessão e,
// após o login, carrega os dados do Supabase antes de liberar as páginas da aplicação.
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../data/supabaseClient.js'
import { loadAll, clearCache } from '../../data/store.js'
import { LoginPage } from '../../pages/LoginPage.jsx'
import { Button } from '../ui/Button.jsx'

const AuthContext = createContext(null)

// Dá acesso ao usuário autenticado e à função de sair
export function useAuth() {
  return useContext(AuthContext)
}

// Mensagem centralizada usada nos estados de carregamento e erro
function FullScreenMessage({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6 text-center text-sm text-gray-600">
      {children}
    </div>
  )
}

export function AuthProvider({ children }) {
  // undefined = ainda verificando a sessão; null = sem sessão
  const [session, setSession] = useState(undefined)

  // Indica se os dados do usuário já foram carregados para a memória
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // Incrementado para repetir a carga após um erro
  const [attempt, setAttempt] = useState(0)

  // Acompanha login, logout e renovação de token
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession))
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user?.id

  // Carrega os dados sempre que o usuário muda; limpa a memória ao sair
  useEffect(() => {
    setReady(false)
    setLoadError(false)
    if (!userId) {
      clearCache()
      return
    }
    let cancelled = false
    loadAll()
      .then(() => { if (!cancelled) setReady(true) })
      .catch((err) => {
        console.error(err)
        if (!cancelled) setLoadError(true)
      })
    return () => { cancelled = true }
  }, [userId, attempt])

  if (session === undefined) return <FullScreenMessage>Carregando...</FullScreenMessage>
  if (!session) return <LoginPage />

  if (loadError) {
    return (
      <FullScreenMessage>
        <p>Não foi possível carregar os dados. Verifique sua conexão.</p>
        <div className="flex gap-2">
          <Button onClick={() => setAttempt((n) => n + 1)}>Tentar novamente</Button>
          <Button variant="secondary" onClick={() => supabase.auth.signOut()}>Sair</Button>
        </div>
      </FullScreenMessage>
    )
  }

  if (!ready) return <FullScreenMessage>Carregando dados...</FullScreenMessage>

  return (
    <AuthContext.Provider value={{ user: session.user, signOut: () => supabase.auth.signOut() }}>
      {children}
    </AuthContext.Provider>
  )
}
