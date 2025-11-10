import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  emotion?: string
}

const sampleResponses = [
  {
    keywords: ["buồn", "sad"],
    responses: [
      "Tôi hiểu bạn đang cảm thấy buồn. Đó là một cảm xúc bình thường và hợp lệ. Hãy thử ghi lại những điều bạn đang cảm thấy. Đôi khi viết ra giúp chúng ta hiểu rõ hơn về cảm xúc của mình.",
      "Buồn là một phần của cuộc sống. Hãy tự cho phép mình cảm thấy điều này. Bạn có muốn nói về điều gì làm bạn buồn không? Hoặc bạn muốn thử một số hoạt động thư giãn?",
    ],
  },
  {
    keywords: ["lo lắng", "anxiety", "sợ"],
    responses: [
      "Lo lắng có thể rất khó chịu. Hãy thử bài tập hít thở 4-7-8: hít vào trong 4 giây, giữ 7 giây, thở ra trong 8 giây. Lặp lại 4-5 lần. Điều này có thể giúp giảm bớt cảm giác lo lắng.",
      "Khi bạn cảm thấy lo lắng, hãy tập trung vào hiện tại. Tìm 5 thứ bạn có thể thấy, 4 thứ bạn có thể chạm, 3 thứ bạn có thể nghe, 2 thứ bạn có thể ngửi, 1 thứ bạn có thể nếm. Đây gọi là phương pháp 5-4-3-2-1.",
    ],
  },
  {
    keywords: ["tức giận", "angry", "tức"],
    responses: [
      "Tức giận là một cảm xúc mạnh mẽ. Hãy tránh xa tình huống đó một chút, đi bộ hoặc tìm một chỗ yên tĩnh. Sau đó, hãy cố gắng hiểu lý do tại sao bạn lại tức giận.",
      "Khi bạn cảm thấy tức giận, hãy thử viết ra những điều bạn muốn nói mà không cần nói chúng với ai. Sau đó xé tờ giấy đó. Điều này giúp bạn giải tỏa cảm xúc mà không làm hại ai.",
    ],
  },
  {
    keywords: ["mệt mỏi", "tired", "mệt"],
    responses: [
      "Nếu bạn cảm thấy mệt mỏi, điều quan trọng nhất là nghỉ ngơi. Hãy chủ động tìm thời gian để thư giãn. Ngủ đủ giấc cũng rất quan trọng cho sức khỏe tâm lý.",
      "Mệt mỏi có thể là dấu hiệu của sự kiệt sức. Hãy lập danh sách những thứ gây áp lực cho bạn và cố gắng giảm bớt chúng. Hãy yêu thương chính mình hơn.",
    ],
  },
  {
    keywords: ["vui", "happy", "hạnh phúc"],
    responses: [
      "Tuyệt vời! Tôi rất vui khi bạn đang cảm thấy vui vẻ. Hãy cố gắng ghi nhớ cảm giác này và những gì gây ra nó. Đó có thể là một nguồn sức mạnh khi bạn cảm thấy khó khăn.",
      "Điều tuyệt vời là bạn đang có một ngày tốt. Hãy chia sẻ sự vui vẻ của bạn với những người xung quanh. Đôi khi, giúp người khác cũng giúp chúng ta cảm thấy tốt hơn.",
    ],
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Xin chào! Tôi là trợ lý tâm lý của bạn. Hôm nay bạn có cảm thấy như thế nào? Tôi ở đây để lắng nghe và hỗ trợ bạn.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (userMessage: string): string => {
    const messageLower = userMessage.toLowerCase()

    for (const response of sampleResponses) {
      if (response.keywords.some((keyword) => messageLower.includes(keyword))) {
        return response.responses[Math.floor(Math.random() * response.responses.length)]
      }
    }

    return "Tôi hiểu bạn đang nói điều đó. Bạn có muốn kể cho tôi nghe thêm chi tiết không? Hoặc bạn muốn thử một số kỹ năng thư giãn?"
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 800)
  }

  const suggestedPrompts = [
    "Tôi cảm thấy lo lắng về công việc",
    "Làm thế nào để cải thiện tâm trạng?",
    "Tôi cảm thấy mệt mỏi",
    "Bạn có thể giúp tôi thư giãn không?",
  ]

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Trợ lý tư vấn AI</h1>
        <p className="text-muted-foreground">Trò chuyện với trợ lý ảo thông minh để nhận lời khuyên và hỗ trợ tâm lý</p>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 overflow-hidden flex flex-col border-0 shadow-sm mb-4">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background to-muted/20">
          {messages.length === 1 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Bắt đầu cuộc trò chuyện</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Hãy chia sẻ cảm xúc của bạn hoặc hỏi tôi bất kỳ điều gì về sức khỏe tâm lý
                </p>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(prompt)
                      }}
                      className="block w-full text-left px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input Area */}
      <Card className="p-4 border-0 shadow-sm">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            type="text"
            placeholder="Hãy chia sẻ cảm xúc của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Gửi
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Trợ lý AI này được thiết kế để hỗ trợ và lắng nghe. Đối với vấn đề sức khỏe tâm lý nghiêm trọng, vui lòng
          liên hệ với chuyên gia.
        </p>
      </Card>
    </div>
  )
}

