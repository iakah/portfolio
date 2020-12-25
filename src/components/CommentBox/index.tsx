import dynamic from 'next/dynamic'
import Icons from '~/components/Icons'
const NexmentDiv = dynamic(() => import('~/components/Nexment'), {
  ssr: false,
})

export default function CommentBox() {
  return (
    <div className="mt-5 bg-white p-10 lg:py-12 lg:px-20 shadow-sm border rounded-md">
      <div className="mb-8">
        <h1 className="flex text-3xl font-medium text-gray-700 tracking-wide items-center">
          <span className="w-9 h-9 mr-2">{Icons.comments}</span>Comment
        </h1>
        <p className="text-xl tracking-wide text-gray-500 mt-2 mb-5">
          Leave a comment to join the discussion
        </p>
      </div>
      <NexmentDiv></NexmentDiv>
    </div>
  )
}