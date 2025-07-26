export interface GoalList {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  goal_list_id: string
  title: string
  goal_type: 'checkbox' | 'steps'
  step_count?: number
  label_style?: 'numeric' | 'monthly'
  category: string
  order_index: number
  created_at: string
  updated_at: string
}