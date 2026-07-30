import '../index.css'

interface SkeletonProps {
  width?: string
  height?: string
  variant?: 'text' | 'circle' | 'rect'
  className?: string
}

export const Skeleton = ({ width, height, variant = 'text', className = '' }: SkeletonProps) => {
  const base = 'sh-animate-pulse sh-bg-gray-200 dark:sh-bg-gray-700'
  const variants = {
    text: 'sh-h-4 sh-rounded',
    circle: 'sh-rounded-full',
    rect: 'sh-rounded-lg',
  }
  const style: React.CSSProperties = {}
  if (width) style.width = width
  if (height) style.height = height

  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      style={style}
    />
  )
}
