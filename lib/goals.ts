import { supabase } from './supabase'
import type { GoalList, Goal } from './types'

// Goal Lists
export async function getGoalLists(userId: string): Promise<GoalList[]> {
  const { data, error } = await supabase
    .from('goal_lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createGoalList(userId: string, title: string): Promise<GoalList> {
  const { data, error } = await supabase
    .from('goal_lists')
    .insert({ user_id: userId, title })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGoalList(id: string, title: string): Promise<GoalList> {
  const { data, error } = await supabase
    .from('goal_lists')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGoalList(id: string): Promise<void> {
  const { error } = await supabase
    .from('goal_lists')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Goals
export async function getGoals(goalListId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('goal_list_id', goalListId)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .insert(goal)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)

  if (error) throw error
}