import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendMessage, getConversation, getSessions, createSession, type ChatSession } from "@/services/chatServices"
import { showError } from "@/utils/toast"
import { Plus, MessageSquare } from "lucide-react"
import { ROUTE_URL } from "@/constants/routes"
import { capitalizeFirstLetter } from "@/utils/general"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  emotion?: string
}

// Component để format text với markdown đơn giản
const FormattedMessage = ({ content }: { content: string }) => {
  // Split by double newlines để tạo paragraphs, nhưng giữ lại single newlines trong paragraph
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim())
  
  const parseBold = (text: string, keyPrefix: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = []
    const boldRegex = /\*\*(.+?)\*\*/g
    let lastIndex = 0
    let match
    let keyIndex = 0
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index)
        if (beforeText) {
          parts.push(beforeText)
        }
      }
      // Add bold text
      parts.push(
        <strong key={`${keyPrefix}-bold-${keyIndex++}`} className="font-semibold">
          {match[1]}
        </strong>
      )
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex)
      if (remainingText) {
        parts.push(remainingText)
      }
    }
    
    // If no bold found, return the original text
    return parts.length > 0 ? parts : [text]
  }
  
  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph, idx) => {
        // Replace single newlines with <br /> và parse bold
        const lines = paragraph.split('\n')
        
        return (
          <div key={idx} className="space-y-1">
            {lines.map((line, lineIdx) => {
              const parsed = parseBold(line.trim(), `para-${idx}-line-${lineIdx}`)
              return (
                <p key={lineIdx} className="text-sm leading-relaxed">
                  {parsed}
                  {lineIdx < lines.length - 1 && <br />}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default function ChatPage() {
  const { sessionId: sessionIdFromUrl } = useParams<{ sessionId?: string }>()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadMessages = async (sessionId: string) => {
    try {
      setIsLoadingHistory(true)
      const response = await getConversation(sessionId)
      if (response.success) {
                const convertedMessages: Message[] = response.data.messages.map((msg) => ({
          id: msg.id,
          type: msg.isFromUser ? "user" : "assistant",
          content: msg.message,
          timestamp: new Date(msg.createdAt),
          emotion: msg.sentiment,
        }))
        setMessages(convertedMessages)
      }
    } catch (error: any) {
      console.error("Failed to load messages:", error)
      showError("Lỗi", "Không thể tải tin nhắn")
      setMessages([])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleNewChat = async () => {
    try {
      const response = await createSession()
      if (response.success) {
        const newSession = response.data
        setSessions((prev) => [newSession, ...prev])
        setMessages([])
        // Navigate đến URL mới với sessionId
        navigate(`${ROUTE_URL.CHAT}/${newSession.id}`, { replace: true })
      }
    } catch (error: any) {
      console.error("Failed to create session:", error)
      showError("Lỗi", "Không thể tạo cuộc trò chuyện mới")
    }
  }

  const handleSelectSession = (sessionId: string) => {
    // Navigate đến URL với sessionId
    navigate(`${ROUTE_URL.CHAT}/${sessionId}`, { replace: true })
  }

  // Load sessions khi component mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoadingSessions(true)
        const response = await getSessions()
        if (response.success && response.data.sessions.length > 0) {
          setSessions(response.data.sessions)
          
          // Nếu có sessionId trong URL, kiểm tra xem session đó có tồn tại không
          if (sessionIdFromUrl) {
            const sessionExists = response.data.sessions.some(s => s.id === sessionIdFromUrl)
            if (!sessionExists) {
              // Session không tồn tại, redirect đến session đầu tiên
              navigate(`${ROUTE_URL.CHAT}/${response.data.sessions[0].id}`, { replace: true })
            }
          } else {
            // Không có sessionId trong URL, redirect đến session đầu tiên
            navigate(`${ROUTE_URL.CHAT}/${response.data.sessions[0].id}`, { replace: true })
          }
        } else {
          // Nếu chưa có session, tạo session mới
          await handleNewChat()
        }
      } catch (error: any) {
        console.error("Failed to load sessions:", error)
        showError("Lỗi", "Không thể tải danh sách cuộc trò chuyện")
      } finally {
        setIsLoadingSessions(false)
      }
    }

    loadSessions()

  }, [])

  useEffect(() => {
    if (sessionIdFromUrl) {
      loadMessages(sessionIdFromUrl)
    }
  }, [sessionIdFromUrl]) //sybau

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !sessionIdFromUrl) return

    const userInput = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message optimistically
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      type: "user",
      content: userInput,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, tempUserMessage])

    try {
      const response = await sendMessage(userInput, sessionIdFromUrl)

      if (response.success && response.data) {
        // Replace temp message with real user message
        const userMessage: Message = {
          id: response.data.userMessage.id,
          type: "user",
          content: response.data.userMessage.message,
          timestamp: new Date(response.data.userMessage.createdAt),
          emotion: response.data.userMessage.sentiment,
        }

        // Add AI message
        const aiMessage: Message = {
          id: response.data.aiMessage.id,
          type: "assistant",
          content: response.data.aiMessage.message,
          timestamp: new Date(response.data.aiMessage.createdAt),
        }

        // Replace temp message and add AI message
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== tempUserMessage.id)
          return [...filtered, userMessage, aiMessage]
        })

        // Reload sessions để cập nhật title và lastMessageAt
        const sessionsResponse = await getSessions()
        if (sessionsResponse.success) {
          setSessions(sessionsResponse.data.sessions)
        }
      }
    } catch (error: any) {
      console.error("Failed to send message:", error)
      showError("Lỗi gửi tin nhắn", error.response?.data?.msg || "Không thể gửi tin nhắn. Vui lòng thử lại.")
      
      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedPrompts = [
    "Tôi cảm thấy lo lắng về công việc",
    "Làm thế nào để cải thiện tâm trạng?",
    "Tôi cảm thấy mệt mỏi",
    "Bạn có thể giúp tôi thư giãn không?",
  ]

  return (
    <div className="flex flex-col gap-4 pb-4 lg:flex-row lg:h-[calc(100vh-140px)]">
      {/* Sidebar - Sessions List */}
      <div className="w-full lg:w-72 flex-shrink-0 order-2 lg:order-1">
        <Card className="h-full max-h-[420px] lg:max-h-none flex flex-col border-0 shadow-sm">
          {/* Header với nút New Chat */}
          <div className="p-4 border-b border-border">
            <Button
              onClick={handleNewChat}
              className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cuộc trò chuyện mới
            </Button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-2">
            {isLoadingSessions ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Đang tải...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Chưa có cuộc trò chuyện nào
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg transition-colors ${
                      sessionIdFromUrl === session.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{capitalizeFirstLetter(session.title)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 order-1 lg:order-2">
      {/* Chat Area */}
      <Card className="flex-1 overflow-hidden flex flex-col border-0 shadow-sm mb-4">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background to-muted/20">
          {isLoadingHistory ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-muted-foreground">Đang tải lịch sử trò chuyện...</p>
              </div>
            </div>
          ) : messages.length === 0 || (messages.length === 1 && messages[0].type === "assistant") ? (
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
                      className="block cursor-pointer w-full text-left px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {!isLoadingHistory && messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                {message.type === "assistant" ? (
                  <FormattedMessage content={message.content} />
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                )}
                <span className="text-xs opacity-70 mt-2 block">
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
        <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Hãy chia sẻ cảm xúc của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 w-full"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
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
    </div>
  )
}

