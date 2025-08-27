'use client'

import { useEffect, useRef } from 'react'

interface ExampleGoal {
  id: string
  title: string
  goal_type: 'checkbox' | 'steps'
  step_count?: number
  label_style?: 'numeric' | 'monthly'
}

interface ExampleGoalsByCategory {
  [category: string]: ExampleGoal[]
}

export default function ExampleGoalList() {
  const containerRef = useRef<HTMLDivElement>(null)

  const exampleGoals: ExampleGoalsByCategory = {
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
      const labelStyle = htmlElement.dataset.labelstyle
      if (count <= 0) return

      const progressTracker = document.createElement("div")
      progressTracker.className = "progress-tracker"
      progressTracker.style.cssText = "display: flex; flex-wrap: wrap; margin: 8px 0 0 0; padding: 0;"

      for (let i = 1; i <= Math.min(count, 40); i++) {
        const div = document.createElement("div")
        
        // Smart labeling based on count and type
        if (labelStyle === "monthly" && i <= 12) {
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

        // Smart width: fill one row if count < 40, otherwise use 40-per-row grid
        if (count < 40) {
          div.style.width = (100 / count) + "%"
          div.style.minWidth = "20px"
          div.style.maxWidth = "140px"
        } else {
          div.style.width = "2.5%"
          div.style.minWidth = "20px"
          div.style.maxWidth = "140px"
        }
        
        div.style.cssText += `
          box-sizing: border-box;
          border: 1px solid #262626;
          height: 20px;
          line-height: 18px;
          text-align: center;
          background: white;
          font-size: 9px;
          flex-shrink: 0;
        `
        
        progressTracker.appendChild(div)
      }

      goalElement.appendChild(progressTracker)
    })
  }, [])

  return (
    <div ref={containerRef} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-2xl text-left">
      <h3 className="text-xl font-semibold mb-6 text-center print-goals-title" style={{ fontSize: '20px' }}>2025 Goals!</h3>
      
      {Object.entries(exampleGoals).map(([category, goals]) => (
        <div key={category} className="mb-6">
          <h4 
            className="text-lg font-normal mb-3"
            style={{
              fontSize: '24px',
              margin: '30px 0 10px',
              fontFamily: 'Lato, sans-serif',
              textAlign: 'left',
              padding: 0
            }}
          >
            {category}
          </h4>
          
          {goals.map((goal) => (
            <div 
              key={goal.id} 
              className="goal mb-3"
              style={{
                fontFamily: 'Lato, sans-serif',
                margin: '0 0 12px 0',
                padding: 0,
                lineHeight: '20px',
                textAlign: 'left'
              }}
              data-steps={goal.goal_type === 'steps' ? goal.step_count : undefined}
              data-labelstyle={goal.goal_type === 'steps' ? goal.label_style : undefined}
            >
              {goal.goal_type === 'checkbox' && (
                <span 
                  className="checkbox"
                  style={{
                    border: '2px solid #262626',
                    boxSizing: 'border-box',
                    display: 'inline-block',
                    height: '20px',
                    marginRight: '20px',
                    width: '20px',
                    background: 'white',
                    verticalAlign: 'top'
                  }}
                ></span>
              )}
              <span 
                className="text"
                style={{
                  fontSize: '20px',
                  lineHeight: '20px',
                  verticalAlign: 'top'
                }}
              >
                {goal.title}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}