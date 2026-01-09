import { supabase } from './supabase'

export async function sendSignInCode(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      channel: 'email',
    },
  })
  return { error }
}

export async function verifySignInCode(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}