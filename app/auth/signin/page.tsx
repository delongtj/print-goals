'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AuthForm from '@/components/AuthForm'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function SignInPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
      
      // Redirect if already logged in
      if (currentUser) {
        router.push('/app')
      }
    }
    getUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80">
            <img src="/logo.svg" alt="Print Goals" className="w-8 h-8" />
            <span className="text-2xl print-goals-title">Print Goals</span>
          </Link>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h1 className="text-xl font-normal mb-6 text-center">Sign in to your account</h1>
          <AuthForm />
        </div>
        
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-neutral-800">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}