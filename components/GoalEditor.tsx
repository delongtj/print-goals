'use client'

import { useState, useEffect } from 'react'
import { getGoals, createGoal, updateGoal, deleteGoal } from '@/lib/goals'
import PrintView from './PrintView'
import type { Goal, GoalList } from '@/lib/types'

interface Props {
  goalList: GoalList
  onBack: () => void
}

export default function GoalEditor({ goalList, onBack }: Props) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: '',
    goal_type: 'checkbox' as 'checkbox' | 'steps',
    step_count: undefined as number | undefined,
    label_style: undefined as 'numeric' | 'monthly' | undefined
  })

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title.trim() || !newGoal.category.trim()) return

    try {
      const goalData = {
        goal_list_id: goalList.id,
        title: newGoal.title.trim(),
        category: newGoal.category.trim(),
        goal_type: newGoal.goal_type,
        step_count: newGoal.goal_type === 'steps' ? newGoal.step_count : undefined,
        label_style: newGoal.goal_type === 'steps' ? newGoal.label_style : undefined,
        order_index: goals.length
      }

      const created = await createGoal(goalData)
      setGoals([...goals, created])
      setNewGoal({
        title: '',
        category: '',
        goal_type: 'checkbox',
        step_count: undefined,
        label_style: undefined
      })
    } catch (error) {
      console.error('Error creating goal:', error)
    }
  }

  const handleUpdate = async (id: string, updates: Partial<Goal>) => {
    try {
      const updated = await updateGoal(id, updates)
      setGoals(goals.map(goal => goal.id === id ? updated : goal))
      setEditingId(null)
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      await deleteGoal(id)
      setGoals(goals.filter(goal => goal.id !== id))
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
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
      
      <div className="space-y-6 print:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Lists
          </button>
          <h2 className="text-2xl font-bold">{goalList.title}</h2>
        </div>
        
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Print Goals
        </button>
      </div>

      {/* Add new goal form */}
      <form onSubmit={handleCreate} className="bg-gray-50 p-4 rounded-md space-y-4">
        <h3 className="font-semibold">Add New Goal</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
            placeholder="Goal title..."
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <input
            type="text"
            value={newGoal.category}
            onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
            placeholder="Category (e.g., Physical, Spiritual)..."
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
            <select
              value={newGoal.goal_type}
              onChange={(e) => setNewGoal({...newGoal, goal_type: e.target.value as 'checkbox' | 'steps'})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="checkbox">Checkbox</option>
              <option value="steps">Steps</option>
            </select>
          </div>

          {newGoal.goal_type === 'steps' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Step Count</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newGoal.step_count || ''}
                  onChange={(e) => setNewGoal({...newGoal, step_count: parseInt(e.target.value) || undefined})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label Style</label>
                <select
                  value={newGoal.label_style || ''}
                  onChange={(e) => setNewGoal({...newGoal, label_style: e.target.value as 'numeric' | 'monthly' || undefined})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select style</option>
                  <option value="numeric">Numeric (1, 2, 3...)</option>
                  <option value="monthly">Monthly (Jan, Feb, Mar...)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Goal
          </button>
        </div>
      </form>

      {/* Goals by category */}
      {Object.keys(groupedGoals).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No goals yet. Add your first one above!
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedGoals).map(([category, categoryGoals]) => (
            <div key={category} className="bg-white border rounded-md p-4">
              <h3 className="text-xl font-semibold mb-4">{category}</h3>
              
              <div className="space-y-3">
                {categoryGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    {editingId === goal.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          defaultValue={goal.title}
                          onBlur={(e) => handleUpdate(goal.id, { title: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdate(goal.id, { title: e.currentTarget.value })
                            } else if (e.key === 'Escape') {
                              setEditingId(null)
                            }
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <span className="text-gray-900">{goal.title}</span>
                          {goal.goal_type === 'steps' && (
                            <span className="ml-2 text-sm text-gray-500">
                              ({goal.step_count} steps, {goal.label_style})
                            </span>
                          )}
                        </div>
                      </>
                    )}
                    
                    <button
                      onClick={() => setEditingId(editingId === goal.id ? null : goal.id)}
                      className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      {editingId === goal.id ? 'Cancel' : 'Edit'}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  )
}