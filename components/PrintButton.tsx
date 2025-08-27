'use client'

interface Props {
  className?: string
  children: React.ReactNode
}

export default function PrintButton({ className, children }: Props) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button 
      onClick={handlePrint}
      className={className}
    >
      {children}
    </button>
  )
}