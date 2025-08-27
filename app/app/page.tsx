'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import GoalListManager from '@/components/GoalListManager'
import GoalEditor from '@/components/GoalEditor'
import type { User } from '@supabase/supabase-js'
import type { GoalList } from '@/lib/types'

export default function AppPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedGoalList, setSelectedGoalList] = useState<GoalList | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
      
      // Redirect if not logged in
      if (!currentUser) {
        router.push('/auth/signin')
      }
    }
    getUser()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
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
            <div className="mb-8 border-b border-gray-300 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="sm:w-20">
                  {/* Spacer for mobile sign out button alignment */}
                </div>
                
                <div className="flex items-center justify-center gap-3 order-1 sm:order-none">
                  <img src="/logo.svg" alt="Print Goals" className="w-8 h-8" />
                  <h1 className="text-3xl print-goals-title">Print Goals</h1>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-neutral-800 border border-gray-400 bg-white hover:bg-gray-100 whitespace-nowrap order-2 sm:order-none"
                >
                  Sign Out
                </button>
              </div>
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