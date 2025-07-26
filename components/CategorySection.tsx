'use client'

import { useState } from 'react'
import { createGoal } from '@/lib/goals'
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
    step_count: undefined as number | undefined,
    label_style: undefined as 'numeric' | 'monthly' | undefined
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title.trim()) return

    try {
      const goalData = {
        goal_list_id: goalListId,
        title: newGoal.title.trim(),
        category,
        goal_type: newGoal.goal_type,
        step_count: newGoal.goal_type === 'steps' ? newGoal.step_count : undefined,
        label_style: newGoal.goal_type === 'steps' ? newGoal.label_style : undefined,
        order_index: goals.length
      }

      const created = await createGoal(goalData)
      onGoalCreated(created)
      setNewGoal({
        title: '',
        goal_type: 'checkbox',
        step_count: undefined,
        label_style: undefined
      })
      setIsAdding(false)
    } catch (error) {
      console.error('Error creating goal:', error)
    }
  }

  const handleUpdate = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const { updateGoal } = await import('@/lib/goals')
      const updated = await updateGoal(goalId, updates)
      onGoalUpdate(updated)
      setEditingId(null)
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
      <h2 className="text-2xl font-normal mb-4 border-b border-gray-300 pb-2">
        {category}
      </h2>

      {/* Existing goals */}
      <div className="space-y-2 mb-4">
        {goals.map((goal) => (
          <div key={goal.id} className="group flex items-start gap-3 py-1">
            {editingId === goal.id ? (
              <div className="flex-1 space-y-2">
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
                  className="w-full px-2 py-1 text-lg border border-gray-400 focus:outline-none focus:border-gray-600"
                  autoFocus
                />
              </div>
            ) : (
              <>
                <div className="flex-1 flex items-start gap-3">
                  {goal.goal_type === 'checkbox' && (
                    <div className="border-2 border-black w-5 h-5 mt-0.5 flex-shrink-0"></div>
                  )}
                  <span className="text-lg leading-tight">{goal.title}</span>
                  {goal.goal_type === 'steps' && (
                    <span className="text-sm text-gray-600 mt-0.5">
                      ({goal.step_count} steps, {goal.label_style})
                    </span>
                  )}
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => setEditingId(goal.id)}
                    className="text-xs text-gray-600 hover:text-gray-800 border border-gray-400 px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-xs text-gray-600 hover:text-gray-800 border border-gray-400 px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </>
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
          
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="goal_type"
                value="checkbox"
                checked={newGoal.goal_type === 'checkbox'}
                onChange={(e) => setNewGoal({...newGoal, goal_type: e.target.value as 'checkbox'})}
              />
              <span className="text-sm">Checkbox</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="goal_type"
                value="steps"
                checked={newGoal.goal_type === 'steps'}
                onChange={(e) => setNewGoal({...newGoal, goal_type: e.target.value as 'steps'})}
              />
              <span className="text-sm">Steps</span>
            </label>

            {newGoal.goal_type === 'steps' && (
              <>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newGoal.step_count || ''}
                  onChange={(e) => setNewGoal({...newGoal, step_count: parseInt(e.target.value) || undefined})}
                  placeholder="Count"
                  className="w-16 px-2 py-1 text-sm border border-gray-400 focus:outline-none focus:border-gray-600"
                  required
                />
                
                <select
                  value={newGoal.label_style || ''}
                  onChange={(e) => setNewGoal({...newGoal, label_style: e.target.value as 'numeric' | 'monthly' || undefined})}
                  className="px-2 py-1 text-sm border border-gray-400 focus:outline-none focus:border-gray-600"
                  required
                >
                  <option value="">Style</option>
                  <option value="numeric">Numeric</option>
                  <option value="monthly">Monthly</option>
                </select>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-1 text-sm border border-gray-600 bg-white hover:bg-gray-100"
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
                  step_count: undefined,
                  label_style: undefined
                })
              }}
              className="px-3 py-1 text-sm border border-gray-400 bg-white hover:bg-gray-100"
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