'use client'

import { useEffect, useRef } from 'react'
import type { Goal } from '@/lib/types'

interface Props {
  goal: Goal
}

export default function GoalDisplay({ goal }: Props) {
  const goalRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!goalRef.current) return

    // Clear any existing progress trackers
    const existingTracker = goalRef.current.querySelector('.progress-tracker')
    if (existingTracker) {
      existingTracker.remove()
    }

    // Only add progress tracker for step goals with valid data
    if (goal.goal_type !== 'steps' || !goal.step_count || goal.step_count <= 0) return

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Add progress tracker for step goals - matching original HTML exactly
    const count = Math.min(goal.step_count, goal.label_style === 'monthly' ? 12 : 1000)
    
    // Calculate percentage width exactly like the original
    const pct = (1.0 / count) * 100

    const progressTracker = document.createElement("p")
    progressTracker.className = "progress-tracker"
    progressTracker.style.display = "flex"
    progressTracker.style.flexWrap = "wrap"
    progressTracker.style.margin = "8px 0 0 0"
    progressTracker.style.padding = "0"

    for (let i = 1; i <= count; i++) {
      const div = document.createElement("div")

      // Smart labeling based on count and type
      if (goal.label_style === "monthly" && i <= 12) {
        div.textContent = months[i - 1]
      } else if (goal.label_style === "numeric") {
        // Show milestone numbers aligned with 40-box rows
        if (count <= 52) {
          // Weekly or small counts: show all numbers
          div.textContent = i.toString()
        } else {
          // Large counts: show every 10th for better milestone tracking
          if (i % 10 === 0) {
            div.textContent = i.toString()
          }
        }
      }

      // Smart width: fill one row if count < 40, otherwise use 40-per-row grid
      if (count < 40) {
        // Fill one row: 1/N width for N boxes
        div.style.width = (100 / count) + "%"
        div.style.minWidth = "20px"
        div.style.maxWidth = "140px"  // Keep original max-width constraint
      } else {
        // Use 40-per-row grid: 1/40th = 2.5%
        div.style.width = "2.5%"
        div.style.minWidth = "20px"
        div.style.maxWidth = "140px"
      }
      div.style.boxSizing = "border-box"  // Include border in width calculation
      div.style.border = "1px solid black"
      div.style.height = "20px"
      div.style.lineHeight = "18px"
      div.style.textAlign = "center"
      div.style.background = "white"
      div.style.fontSize = "9px"  // Even smaller font
      div.style.flexShrink = "0"  // Prevent shrinking
      
      progressTracker.appendChild(div)
    }

    goalRef.current.appendChild(progressTracker)
  }, [goal])

  return (
    <p 
      ref={goalRef}
      className="goal mb-4"
      style={{
        fontFamily: 'Lato, sans-serif',
        margin: '0 0 16px 0',
        padding: 0,
        lineHeight: '20px'
      }}
    >
      {goal.goal_type === 'checkbox' && (
        <span 
          className="checkbox"
          style={{
            border: '2px solid black',
            boxSizing: 'border-box',
            display: 'inline-block',
            height: '20px',
            marginRight: '20px',
            width: '20px',
            background: 'white'
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

      <style jsx>{`
        .progress-tracker {
          display: flex !important;
          flex-wrap: wrap !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .progress-tracker div {
          border: 1px solid black !important;
          box-sizing: border-box !important;
          height: 20px !important;
          line-height: 18px !important;
          min-width: 20px !important;
          max-width: 140px !important;
          text-align: center !important;
          background: white !important;
          font-size: 12px !important;
        }
      `}</style>
    </p>
  )
}