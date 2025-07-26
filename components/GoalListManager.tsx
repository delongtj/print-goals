'use client'

import { useState, useEffect } from 'react'
import { getGoalLists, createGoalList, updateGoalList, deleteGoalList } from '@/lib/goals'
import type { GoalList } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

interface Props {
  user: User
  onSelectGoalList: (goalList: GoalList) => void
}

export default function GoalListManager({ user, onSelectGoalList }: Props) {
  const [goalLists, setGoalLists] = useState<GoalList[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadGoalLists()
  }, [user.id])

  const loadGoalLists = async () => {
    try {
      const lists = await getGoalLists(user.id)
      setGoalLists(lists)
    } catch (error) {
      console.error('Error loading goal lists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      const newList = await createGoalList(user.id, newTitle.trim())
      setGoalLists([newList, ...goalLists])
      setNewTitle('')
    } catch (error) {
      console.error('Error creating goal list:', error)
    }
  }

  const handleUpdate = async (id: string, title: string) => {
    if (!title.trim()) return

    try {
      const updated = await updateGoalList(id, title.trim())
      setGoalLists(goalLists.map(list => list.id === id ? updated : list))
      setEditingId(null)
    } catch (error) {
      console.error('Error updating goal list:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal list and all its goals?')) return

    try {
      await deleteGoalList(id)
      setGoalLists(goalLists.filter(list => list.id !== id))
    } catch (error) {
      console.error('Error deleting goal list:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading your goal lists...</div>
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New goal list title..."
          className="flex-1 px-3 py-2 border border-gray-400 focus:outline-none focus:border-gray-600"
        />
        <button
          type="submit"
          className="px-4 py-2 border-2 border-gray-800 bg-white hover:bg-gray-100 text-gray-800 font-medium"
        >
          Create List
        </button>
      </form>

      {goalLists.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No goal lists yet. Create your first one above!
        </div>
      ) : (
        <div className="space-y-2">
          {goalLists.map((list) => (
            <div key={list.id} className="flex items-center gap-2 p-3 border border-gray-300 hover:bg-gray-50">
              {editingId === list.id ? (
                <input
                  type="text"
                  defaultValue={list.title}
                  onBlur={(e) => handleUpdate(list.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdate(list.id, e.currentTarget.value)
                    } else if (e.key === 'Escape') {
                      setEditingId(null)
                    }
                  }}
                  className="flex-1 px-2 py-1 border border-gray-400 focus:outline-none focus:border-gray-600"
                  autoFocus
                />
              ) : (
                <h3
                  className="flex-1 text-lg font-normal cursor-pointer hover:text-gray-800"
                  onClick={() => onSelectGoalList(list)}
                >
                  {list.title}
                </h3>
              )}
              
              <button
                onClick={() => setEditingId(editingId === list.id ? null : list.id)}
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-400 bg-white hover:bg-gray-100"
              >
                {editingId === list.id ? 'Cancel' : 'Edit'}
              </button>
              
              <button
                onClick={() => handleDelete(list.id)}
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-400 bg-white hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}