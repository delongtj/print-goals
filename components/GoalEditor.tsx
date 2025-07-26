'use client'

import { useState, useEffect } from 'react'
import { getGoals } from '@/lib/goals'
import PrintView from './PrintView'
import CategorySection from './CategorySection'
import { DEFAULT_CATEGORIES } from '@/lib/categories'
import type { Goal, GoalList } from '@/lib/types'

interface Props {
  goalList: GoalList
  onBack: () => void
}

export default function GoalEditor({ goalList, onBack }: Props) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGoals()
  }, [goalList.id])

  const loadGoals = async () => {
    try {
      const goalsData = await getGoals(goalList.id)
      setGoals(goalsData)
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals([...goals, newGoal])
  }

  const handleGoalUpdate = (updatedGoal: Goal) => {
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal))
  }

  const handleGoalDelete = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId))
  }

  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) acc[goal.category] = []
    acc[goal.category].push(goal)
    return acc
  }, {} as Record<string, Goal[]>)

  if (loading) {
    return <div className="text-center py-8">Loading goals...</div>
  }

  return (
    <>
      <PrintView title={goalList.title} goals={goals} />
      
      <div className="space-y-8 print:hidden max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-gray-300 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 border border-gray-400 px-3 py-1 bg-white hover:bg-gray-100"
            >
              ← Back to Lists
            </button>
            <h1 className="text-3xl font-light text-center">{goalList.title}</h1>
          </div>
          
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border-2 border-gray-800 bg-white hover:bg-gray-100 text-gray-800 font-medium"
          >
            Print Goals
          </button>
        </div>

        {/* Category sections matching the HTML structure */}
        {DEFAULT_CATEGORIES.map(category => (
          <CategorySection
            key={category}
            category={category}
            goals={groupedGoals[category] || []}
            goalListId={goalList.id}
            onGoalCreated={handleGoalCreated}
            onGoalUpdate={handleGoalUpdate}
            onGoalDelete={handleGoalDelete}
          />
        ))}
      </div>
    </>
  )
}