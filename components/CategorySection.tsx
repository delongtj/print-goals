'use client'

import { useState } from 'react'
import { createGoal } from '@/lib/goals'
import GoalDisplay from './GoalDisplay'
import type { Goal } from '@/lib/types'

interface Props {
  category: string
  goals: Goal[]
  goalListId: string
  onGoalCreated: (goal: Goal) => void
  onGoalUpdate: (goal: Goal) => void
  onGoalDelete: (goalId: string) => void
}

export default function CategorySection({ 
  category, 
  goals, 
  goalListId, 
  onGoalCreated,
  onGoalUpdate,
  onGoalDelete 
}: Props) {
  const [isAdding, setIsAdding] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    goal_type: 'checkbox' as 'checkbox' | 'steps',
    progress_style: 'monthly' as 'monthly' | 'weekly' | 'daily' | 'count',
    step_count: undefined as number | undefined
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingGoal, setEditingGoal] = useState<{
    title: string
    goal_type: 'checkbox' | 'steps'
    progress_style: 'monthly' | 'weekly' | 'daily' | 'count'
    step_count?: number
  } | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title.trim()) return

    try {
      // Calculate step count based on progress style
      let stepCount: number | undefined
      let labelStyle: 'numeric' | 'monthly' | undefined

      if (newGoal.goal_type === 'steps') {
        if (newGoal.progress_style === 'monthly') {
          stepCount = 12
          labelStyle = 'monthly'
        } else if (newGoal.progress_style === 'weekly') {
          stepCount = 52
          labelStyle = 'numeric'
        } else if (newGoal.progress_style === 'daily') {
          stepCount = 365
          labelStyle = 'numeric'
        } else if (newGoal.progress_style === 'count') {
          stepCount = newGoal.step_count
          labelStyle = 'numeric'
        }
      }

      const goalData = {
        goal_list_id: goalListId,
        title: newGoal.title.trim(),
        category,
        goal_type: newGoal.goal_type,
        step_count: stepCount,
        label_style: labelStyle,
        order_index: goals.length
      }

      const created = await createGoal(goalData)
      onGoalCreated(created)
      setNewGoal({
        title: '',
        goal_type: 'checkbox',
        progress_style: 'monthly',
        step_count: undefined
      })
      setIsAdding(false)
    } catch (error) {
      console.error('Error creating goal:', error)
    }
  }

  const startEditing = (goal: Goal) => {
    // Determine progress style from existing goal data
    let progressStyle: 'monthly' | 'weekly' | 'daily' | 'count' = 'monthly'
    if (goal.goal_type === 'steps' && goal.step_count) {
      if (goal.step_count === 12 && goal.label_style === 'monthly') {
        progressStyle = 'monthly'
      } else if (goal.step_count === 52 && goal.label_style === 'numeric') {
        progressStyle = 'weekly'
      } else if (goal.step_count === 365 && goal.label_style === 'numeric') {
        progressStyle = 'daily'
      } else {
        progressStyle = 'count'
      }
    }

    setEditingId(goal.id)
    setEditingGoal({
      title: goal.title,
      goal_type: goal.goal_type,
      progress_style: progressStyle,
      step_count: goal.step_count
    })
  }

  const handleUpdate = async () => {
    if (!editingGoal || !editingId) return

    try {
      // Calculate step count and label style from editing state
      let stepCount: number | undefined
      let labelStyle: 'numeric' | 'monthly' | undefined

      if (editingGoal.goal_type === 'steps') {
        if (editingGoal.progress_style === 'monthly') {
          stepCount = 12
          labelStyle = 'monthly'
        } else if (editingGoal.progress_style === 'weekly') {
          stepCount = 52
          labelStyle = 'numeric'
        } else if (editingGoal.progress_style === 'daily') {
          stepCount = 365
          labelStyle = 'numeric'
        } else if (editingGoal.progress_style === 'count') {
          stepCount = editingGoal.step_count
          labelStyle = 'numeric'
        }
      }

      const { updateGoal } = await import('@/lib/goals')
      const updated = await updateGoal(editingId, {
        title: editingGoal.title.trim(),
        goal_type: editingGoal.goal_type,
        step_count: stepCount,
        label_style: labelStyle
      })
      onGoalUpdate(updated)
      setEditingId(null)
      setEditingGoal(null)
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const handleDelete = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      const { deleteGoal } = await import('@/lib/goals')
      await deleteGoal(goalId)
      onGoalDelete(goalId)
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  return (
    <div className="mb-8">
      <h2 
        className="text-2xl font-normal mb-4"
        style={{
          fontSize: '24px',
          margin: '30px 0 10px',
          fontFamily: 'Lato, sans-serif'
        }}
      >
        {category}
      </h2>

      {/* Existing goals */}
      <div className="space-y-4 mb-6">
        {goals.map((goal) => (
          <div key={goal.id} className="group">
            {editingId === goal.id && editingGoal ? (
              <div className="space-y-3 p-3 border border-gray-300 bg-gray-50">
                <input
                  type="text"
                  value={editingGoal.title}
                  onChange={(e) => setEditingGoal({...editingGoal, title: e.target.value})}
                  className="w-full px-2 py-1 text-lg border border-gray-400 focus:outline-none focus:border-gray-600"
                  autoFocus
                />
                
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`edit_goal_type_${goal.id}`}
                        value="checkbox"
                        checked={editingGoal.goal_type === 'checkbox'}
                        onChange={(e) => setEditingGoal({...editingGoal, goal_type: e.target.value as 'checkbox'})}
                      />
                      <span className="text-sm">Pass/Fail</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`edit_goal_type_${goal.id}`}
                        value="steps"
                        checked={editingGoal.goal_type === 'steps'}
                        onChange={(e) => setEditingGoal({...editingGoal, goal_type: e.target.value as 'steps'})}
                      />
                      <span className="text-sm">Progress</span>
                    </label>
                  </div>

                  {editingGoal.goal_type === 'steps' && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <select
                        value={editingGoal.progress_style}
                        onChange={(e) => setEditingGoal({...editingGoal, progress_style: e.target.value as 'monthly' | 'weekly' | 'daily' | 'count'})}
                        className="px-2 py-1 text-sm border border-gray-400 focus:outline-none focus:border-gray-600"
                      >
                        <option value="monthly">Monthly (12)</option>
                        <option value="weekly">Weekly (52)</option>
                        <option value="daily">Daily (365)</option>
                        <option value="count">Custom Count</option>
                      </select>

                      {editingGoal.progress_style === 'count' && (
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={editingGoal.step_count || ''}
                          onChange={(e) => setEditingGoal({...editingGoal, step_count: parseInt(e.target.value) || undefined})}
                          placeholder="Count"
                          className="w-20 px-2 py-1 text-sm border border-gray-400 focus:outline-none focus:border-gray-600"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 sm:flex-none text-xs text-gray-600 hover:text-gray-800 border border-gray-400 px-2 py-1 bg-white whitespace-nowrap"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setEditingGoal(null)
                    }}
                    className="flex-1 sm:flex-none text-xs text-gray-600 hover:text-gray-800 border border-gray-400 px-2 py-1 bg-white whitespace-nowrap"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <GoalDisplay goal={goal} />
                
                {/* Desktop buttons - always visible */}
                <div className="hidden sm:block absolute top-0 right-0">
                  <div className="flex gap-1 bg-white border border-gray-300 rounded shadow-sm">
                    <button
                      onClick={() => startEditing(goal)}
                      className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Mobile buttons below goal */}
                <div className="sm:hidden mt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(goal)}
                      className="flex-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-400 px-2 py-1 bg-white hover:bg-gray-100 whitespace-nowrap"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="flex-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-400 px-2 py-1 bg-white hover:bg-gray-100 whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new goal */}
      {isAdding ? (
        <form onSubmit={handleCreate} className="space-y-3 p-3 border border-gray-300 bg-gray-50">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
            placeholder="Goal title..."
            className="w-full px-2 py-1 text-lg border border-gray-400 focus:outline-none focus:border-gray-600"
            autoFocus
            required
          />
          
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="goal_type"
                  value="checkbox"
                  checked={newGoal.goal_type === 'checkbox'}
                  onChange={(e) => setNewGoal({...newGoal, goal_type: e.target.value as 'checkbox'})}
                />
                <span className="text-sm">Pass/Fail</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="goal_type"
                  value="steps"
                  checked={newGoal.goal_type === 'steps'}
                  onChange={(e) => setNewGoal({...newGoal, goal_type: e.target.value as 'steps'})}
                />
                <span className="text-sm">Progress</span>
              </label>
            </div>

            {newGoal.goal_type === 'steps' && (
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <select
                  value={newGoal.progress_style}
                  onChange={(e) => setNewGoal({...newGoal, progress_style: e.target.value as 'monthly' | 'weekly' | 'daily' | 'count'})}
                  className="px-2 py-1 text-sm border border-gray-400 focus:outline-none focus:border-gray-600"
                >
                  <option value="monthly">Monthly (12)</option>
                  <option value="weekly">Weekly (52)</option>
                  <option value="daily">Daily (365)</option>
                  <option value="count">Custom Count</option>
                </select>

                {newGoal.progress_style === 'count' && (
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={newGoal.step_count || ''}
                    onChange={(e) => setNewGoal({...newGoal, step_count: parseInt(e.target.value) || undefined})}
                    placeholder="Count"
                    className="w-20 px-2 py-1 text-sm border border-gray-400 focus:outline-none focus:border-gray-600"
                    required
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-3 py-1 text-sm border border-gray-600 bg-white hover:bg-gray-100 whitespace-nowrap"
            >
              Add Goal
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setNewGoal({
                  title: '',
                  goal_type: 'checkbox',
                  progress_style: 'monthly',
                  step_count: undefined
                })
              }}
              className="flex-1 sm:flex-none px-3 py-1 text-sm border border-gray-400 bg-white hover:bg-gray-100 whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="text-sm text-gray-600 hover:text-gray-800 border border-gray-400 px-3 py-1 bg-white hover:bg-gray-100"
        >
          + Add {category} Goal
        </button>
      )}
    </div>
  )
}