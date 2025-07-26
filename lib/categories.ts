export const DEFAULT_CATEGORIES = [
  'Spiritual',
  'Family', 
  'Physical',
  'Financial',
  'Educational',
  'Career',
  'Social'
] as const

export type Category = typeof DEFAULT_CATEGORIES[number]