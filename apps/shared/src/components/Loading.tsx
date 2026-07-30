import { Spinner } from './Spinner'
import '../index.css'

interface LoadingProps {
  text?: string
}

export const Loading = ({ text = 'Loading...' }: LoadingProps) => {
  return (
    <div className="sh-flex sh-flex-col sh-items-center sh-justify-center sh-min-h-[200px] sh-gap-3">
      <Spinner size="lg" />
      <p className="sh-text-gray-500 sh-text-sm">{text}</p>
    </div>
  )
}
