import { useSelector } from 'react-redux'
import { Spinner } from '../ui/spinner'
import { Textarea } from '../ui/textarea'

const CurrentChat = () => {
  const currentChat = useSelector((state) => state.chat.currentChat)

  return (
    <div className="w-full flex flex-col h-full">
      <div className="h-[60px] w-full flex flex-row justify-between items-center p-4 border-b fixed  bg-white ">
        <span>{currentChat.chatName}</span>
      </div>

      <div className="flex flex-col overflow-y-auto h-full bg-slate-500">
        <Spinner />
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
        <span className="bg-green-200 h-[50px]">content</span>
      </div>

      <div className="h-[60px] w-[70%] flex items-center fixed bottom-0 bg-white z-10 p-4">
        <Textarea
          placeholder="Type your message here."
          className="h-[40px] focus:outline-none"
        />
      </div>
    </div>
  )
}

export default CurrentChat
