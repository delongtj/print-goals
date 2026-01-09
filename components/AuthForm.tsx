'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendSignInCode, verifySignInCode } from '@/lib/auth'

export default function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await sendSignInCode(email)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Code sent to your email!')
      setStep('code')
    }

    setLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await verifySignInCode(email, code)

    if (error) {
      setMessage('Error: ' + error.message)
      setLoading(false)
    } else if (data) {
      setMessage('Signed in successfully!')
      // Small delay for UX, then redirect
      setTimeout(() => router.push('/app'), 500)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300">
      <h2 className="text-2xl font-normal mb-6 text-center">Sign In</h2>
      
      <p className="text-sm text-gray-600 mb-6 text-center">
        Enter your email and we'll send you a code. No password needed. If this is your first time, we'll create an account for you.
      </p>
      
      {step === 'email' ? (
        <form onSubmit={handleSendCode} className="space-y-4">
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
            className="w-full py-2 px-4 border-2 border-neutral-800 bg-white hover:bg-gray-100 text-neutral-800 font-medium disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-400 focus:outline-none focus:border-gray-600"
              placeholder="000000"
              maxLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border-2 border-neutral-800 bg-white hover:bg-gray-100 text-neutral-800 font-medium disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('email')
              setCode('')
              setMessage('')
            }}
            className="w-full py-2 px-4 text-sm text-neutral-600 hover:text-neutral-800"
          >
            Back
          </button>
        </form>
      )}
      
      {message && (
        <p className={`mt-4 text-sm text-center ${message.startsWith('Error') ? 'text-neutral-800' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}