'use client'

import { useState } from 'react'
import { signInWithEmail } from '@/lib/auth'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await signInWithEmail(email)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Check your email for the login link!')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300">
      <h2 className="text-2xl font-normal mb-6 text-center">Sign In</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-gray-600"
            placeholder="your@email.com"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border-2 border-gray-800 bg-white hover:bg-gray-100 text-gray-800 font-medium disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>
      
      {message && (
        <p className={`mt-4 text-sm text-center ${message.startsWith('Error') ? 'text-gray-800' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}