'use client'
import { useState, FormEvent } from 'react'
import { generateChatResponse } from '@/lib/actions'

type Message = {
  author: 'human' | 'ai'
  text: string
}
const exampleMessages = [
  "What are the knowledge, skills, and abilities for the Assistant Sheriff San Diego County position?",
  "The Assistant Sheriff in San Diego County should have knowledge of: local law enforcement agencies in San Diego County, local/state/federal laws, law enforcement rules and regulations, community-based policing...",
  "What is the salary for the Assistant Chief Probation Officer in San Bernardino?",
  "The Assistant Chief Probation Officer in San Bernardino has a salary range from $70.38 to $101.00 per hour (salary grades 1 and 2)."
]


const ChatPage = () => {
  const [userPrompt, setUserPrompt] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!userPrompt.trim() || isLoading) return

    const humanMsg: Message = { author: 'human', text: userPrompt }
    setMessages(prev => [...prev, humanMsg])
    setUserPrompt('')
    setIsLoading(true)

    try {
      const response = await generateChatResponse(userPrompt)
      const aiMsg: Message = { author: 'ai', text: response }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Error:', error)
      const errorMsg: Message = { author: 'ai', text: 'Sorry, something went wrong. Please try again.' }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="p-12 flex flex-col justify-between h-screen">
      <div className="flex flex-col gap-4 py-12 overflow-y-auto">
        {messages.map((msg, idx) => (
          msg.author === 'human' ? (
            <div key={idx} className="flex self-right text-right self-end rounded-md">
              <p className="bg-teal-200 py-3 px-2 rounded-md">{msg.text}</p>
            </div>
          ) : (
            <div key={idx} className="flex self-start">
              <p className="bg-slate-200 py-3 px-2 rounded-md whitespace-pre-wrap">{msg.text}</p>
            </div>
          )
        ))}
        {isLoading && (
          <div className="flex self-start">
            <p className="bg-slate-200 py-3 px-2 rounded-md text-slate-500">Thinking...</p>
          </div>
        )}
      </div>

      <div className="bg-white w-full">

        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            className="border border-slate-500 px-2 flex-1"
            type="text"
            onChange={(e) => setUserPrompt(e.target.value)}
            value={userPrompt}
            placeholder="Chat with your data"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-teal-400 py-3 px-2 rounded-lg hover:bg-teal-300 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Send
          </button>

        </form>
        {<div className="flex gap-4">
          {exampleMessages.map((msg, idx) => (
            <button key={idx} className="bg-slate-200 border border-slate-300 rounded-md py-3 px-2 my-2 hover:bg-slate-100 hover:cursor-pointer text-left" onClick={() => setUserPrompt(msg)}>
              {msg}
            </button>
          ))}
        </div>}
      </div>
    </div>
  )
}

export default ChatPage