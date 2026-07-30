import '../index.css'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner = ({ size = 'md' }: SpinnerProps) => {
  const sizes = { sm: 'sh-w-4 sh-h-4', md: 'sh-w-6 sh-h-6', lg: 'sh-w-8 sh-h-8' }
  return (
    <svg
      className={`sh-animate-spin ${sizes[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="sh-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="sh-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
