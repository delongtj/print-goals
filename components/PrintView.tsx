'use client'

import { useEffect, useRef } from 'react'
import type { Goal } from '@/lib/types'

interface Props {
  title: string
  goals: Goal[]
}

export default function PrintView({ title, goals }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Clear any existing progress trackers
    const existingTrackers = containerRef.current.querySelectorAll('.progress-tracker')
    existingTrackers.forEach(tracker => tracker.remove())

    // Add progress trackers for step goals
    containerRef.current.querySelectorAll("[data-steps]").forEach(goalElement => {
      const count = parseInt(goalElement.dataset.steps || '0')
      if (count <= 0) return

      const pct = (1.0 / count) * 100
      const labelStyle = goalElement.dataset.labelstyle

      const progressTracker = document.createElement("p")
      progressTracker.className = "progress-tracker"

      for (let i = 1; i <= count; i++) {
        const div = document.createElement("div")

        if (labelStyle === "monthly") {
          div.textContent = months[i - 1]
        } else if (labelStyle === "numeric") {
          div.textContent = i.toString()
        }

        div.style.width = pct + "%"
        progressTracker.appendChild(div)
      }

      goalElement.appendChild(progressTracker)
    })
  }, [goals])

  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) acc[goal.category] = []
    acc[goal.category].push(goal)
    return acc
  }, {} as Record<string, Goal[]>)

  return (
    <div ref={containerRef} className="print:block hidden">
      <div className="print-container">
        <h1>{title}</h1>

        {Object.entries(groupedGoals).map(([category, categoryGoals]) => (
          <div key={category}>
            <h2>{category}</h2>
            
            {categoryGoals.map((goal) => (
              <p 
                key={goal.id} 
                className="goal" 
                data-steps={goal.goal_type === 'steps' ? goal.step_count : undefined}
                data-labelstyle={goal.goal_type === 'steps' ? goal.label_style : undefined}
              >
                {goal.goal_type === 'checkbox' && (
                  <span className="checkbox"></span>
                )}
                <span className="text">{goal.title}</span>
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}