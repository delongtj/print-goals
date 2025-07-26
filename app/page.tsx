'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, signOut } from '@/lib/auth'
import AuthForm from '@/components/AuthForm'
import GoalListManager from '@/components/GoalListManager'
import GoalEditor from '@/components/GoalEditor'
import type { User } from '@supabase/supabase-js'
import type { GoalList } from '@/lib/types'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedGoalList, setSelectedGoalList] = useState<GoalList | null>(null)

  useEffect(() => {
    async function getUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-light text-center mb-8 border-b border-gray-300 pb-4">Print Goals</h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in to create and manage your goal lists
          </p>
          <AuthForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {selectedGoalList ? (
          <GoalEditor 
            goalList={selectedGoalList} 
            onBack={() => setSelectedGoalList(null)} 
          />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8 border-b border-gray-300 pb-4">
              <h1 className="text-3xl font-light">Print Goals</h1>
              <button
                onClick={handleSignOut}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-400 bg-white hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
            
            <div>
              <h2 className="text-2xl font-normal mb-6">Your Goal Lists</h2>
              <GoalListManager user={user} onSelectGoalList={setSelectedGoalList} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}