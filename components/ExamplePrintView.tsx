'use client'

import { useEffect, useRef } from 'react'

export default function ExamplePrintView() {
  const containerRef = useRef<HTMLDivElement>(null)

  const exampleGoals = {
    'Physical': [
      { id: '1', title: 'Drink 8 glasses of water daily', goal_type: 'checkbox' },
      { id: '2', title: 'Exercise 3x per week', goal_type: 'steps', step_count: 52, label_style: 'numeric' }
    ],
    'Career': [
      { id: '3', title: 'Update LinkedIn profile', goal_type: 'checkbox' },
      { id: '4', title: 'Read one professional book monthly', goal_type: 'steps', step_count: 12, label_style: 'monthly' }
    ],
    'Family': [
      { id: '5', title: 'Call family weekly', goal_type: 'steps', step_count: 52, label_style: 'numeric' },
      { id: '6', title: 'Monthly meal prep sessions', goal_type: 'steps', step_count: 12, label_style: 'monthly' }
    ],
    'Educational': [
      { id: '7', title: 'Learn a new language', goal_type: 'checkbox' },
      { id: '8', title: 'Write in journal daily', goal_type: 'steps', step_count: 365, label_style: 'numeric' }
    ]
  }

  useEffect(() => {
    if (!containerRef.current) return

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Clear any existing progress trackers
    const existingTrackers = containerRef.current.querySelectorAll('.progress-tracker')
    existingTrackers.forEach(tracker => tracker.remove())

    // Add progress trackers for step goals
    containerRef.current.querySelectorAll("[data-steps]").forEach(goalElement => {
      const htmlElement = goalElement as HTMLElement
      const count = parseInt(htmlElement.dataset.steps || '0')
      if (count <= 0) return

      const pct = (1.0 / count) * 100
      const labelStyle = htmlElement.dataset.labelstyle

      const progressTracker = document.createElement("p")
      progressTracker.className = "progress-tracker"

      for (let i = 1; i <= count; i++) {
        const div = document.createElement("div")

        if (labelStyle === "monthly") {
          div.textContent = months[i - 1]
        } else if (labelStyle === "numeric") {
          if (count <= 52) {
            div.textContent = i.toString()
          } else {
            if (i % 10 === 0) {
              div.textContent = i.toString()
            }
          }
        }

        if (count < 40) {
          div.style.width = (100 / count) + "%"
        } else {
          div.style.width = "calc(100% / 40)"
        }
        
        progressTracker.appendChild(div)
      }

      goalElement.appendChild(progressTracker)
    })
  }, [])

  return (
    <div ref={containerRef} className="print:block hidden">
      <div className="print-container">
        <h1 className="print-goals-title">2025 Goals!</h1>

        {Object.entries(exampleGoals).map(([category, goals]) => (
          <div key={category}>
            <h2>{category}</h2>
            
            {goals.map((goal) => (
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