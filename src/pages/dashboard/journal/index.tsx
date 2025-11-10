import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface JournalEntry {
  id: string
  date: Date
  emotion: string
  emoji: string
  intensity: number
  tags: string[]
  description: string
  note?: string
}

const sampleEntries: JournalEntry[] = [
  {
    id: "1",
    date: new Date(2025, 10, 8),
    emotion: "Vui vẻ",
    emoji: "😊",
    intensity: 4,
    tags: ["Công việc", "Gia đình"],
    description: "Ngày hôm nay rất tuyệt vời. Tôi hoàn thành dự án và cả gia đình đi ăn cơm với nhau.",
    note: "Cảm thấy có ý nghĩa",
  },
  {
    id: "2",
    date: new Date(2025, 10, 7),
    emotion: "Lo lắng",
    emoji: "😰",
    intensity: 3,
    tags: ["Công việc"],
    description: "Có một bài trình bày quan trọng sắp tới.",
    note: "Nhưng tôi đã chuẩn bị tốt",
  },
  {
    id: "3",
    date: new Date(2025, 10, 6),
    emotion: "Bình tĩnh",
    emoji: "😌",
    intensity: 2,
    tags: ["Sức khỏe"],
    description: "Một ngày yên tĩnh. Tôi đã thiền 20 phút và cảm thấy thả lỏng.",
    note: "Thiền rất giúp ích",
  },
  {
    id: "4",
    date: new Date(2025, 10, 5),
    emotion: "Mệt mỏi",
    emoji: "😴",
    intensity: 4,
    tags: ["Công việc"],
    description: "Tuần này khá mệt mỏi vì quá nhiều công việc.",
    note: "Cần nghỉ ngơi nhiều hơn",
  },
  {
    id: "5",
    date: new Date(2025, 10, 4),
    emotion: "Buồn",
    emoji: "😔",
    intensity: 3,
    tags: ["Quan hệ", "Gia đình"],
    description: "Có một cuộc tranh cãi nhỏ với bạn bè.",
    note: "Nhưng chúng tôi đã nói chuyện sau đó",
  },
]

type ViewMode = "timeline" | "calendar" | "list"

export default function JournalPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("timeline")
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEntries = sampleEntries.filter((entry) => {
    if (filterTag && !entry.tags.includes(filterTag)) return false
    if (searchQuery && !entry.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const allTags = Array.from(new Set(sampleEntries.flatMap((e) => e.tags)))

  const emotionColors: Record<string, string> = {
    "Vui vẻ": "bg-yellow-100 dark:bg-yellow-900",
    Buồn: "bg-blue-100 dark:bg-blue-900",
    "Lo lắng": "bg-orange-100 dark:bg-orange-900",
    "Tức giận": "bg-red-100 dark:bg-red-900",
    "Mệt mỏi": "bg-purple-100 dark:bg-purple-900",
    "Bình tĩnh": "bg-green-100 dark:bg-green-900",
    "Yêu thích": "bg-pink-100 dark:bg-pink-900",
    "Bối rối": "bg-indigo-100 dark:bg-indigo-900",
  }

  const getEmojis = (intensity: number) => {
    return "●".repeat(intensity) + "○".repeat(5 - intensity)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Nhật ký cảm xúc</h1>
        <p className="text-muted-foreground">Xem lại lịch sử cảm xúc của bạn và phát hiện các mô hình</p>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 border-0 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tìm kiếm</label>
            <Input
              type="text"
              placeholder="Tìm kiếm trong nhật ký..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Lọc theo thẻ</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTag(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterTag === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Tất cả
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* View Mode Switcher */}
      <div className="flex gap-2">
        {(["timeline", "list"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === mode
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {mode === "timeline" ? "📅 Timeline" : "📋 Danh sách"}
          </button>
        ))}
      </div>

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <div className="space-y-0">
          {filteredEntries.map((entry, index) => (
            <div key={entry.id} className="relative">
              {/* Timeline Line */}
              {index < filteredEntries.length - 1 && <div className="absolute left-6 top-20 w-1 h-8 bg-border" />}

              {/* Entry */}
              <div className="flex gap-4 mb-6">
                {/* Timeline Dot */}
                <div className="flex flex-col items-center pt-2 flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 border-background ${emotionColors[entry.emotion] || "bg-gray-100"}`}
                  >
                    {entry.emoji}
                  </div>
                </div>

                {/* Entry Card */}
                <Card
                  onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                  className="flex-1 p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{entry.emotion}</h3>
                      <p className="text-xs text-muted-foreground">
                        {entry.date.toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-primary">{getEmojis(entry.intensity)}</div>
                  </div>

                  <p className="text-sm text-foreground mb-3 line-clamp-2">{entry.description}</p>

                  {selectedEntry?.id === entry.id && (
                    <div className="space-y-3 pt-3 border-t border-border">
                      {entry.note && (
                        <div className="bg-accent/10 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Ghi chú:</p>
                          <p className="text-sm text-foreground">{entry.note}</p>
                        </div>
                      )}

                      {entry.tags.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Liên quan đến:</p>
                          <div className="flex flex-wrap gap-2">
                            {entry.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Chỉnh sửa
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-destructive bg-transparent">
                          Xóa
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
              className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{entry.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-foreground">{entry.emotion}</h3>
                      <p className="text-xs text-muted-foreground">{entry.date.toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className="text-xs font-medium text-primary whitespace-nowrap">
                      {getEmojis(entry.intensity)}
                    </div>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{entry.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedEntry?.id === entry.id && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  {entry.note && (
                    <div className="bg-accent/10 p-2 rounded text-sm text-foreground">
                      <strong>Ghi chú:</strong> {entry.note}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Chỉnh sửa
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-destructive bg-transparent">
                      Xóa
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {filteredEntries.length === 0 && (
        <Card className="p-8 text-center border-0 shadow-sm">
          <p className="text-lg text-muted-foreground">Không tìm thấy bản ghi nào</p>
        </Card>
      )}

      {/* Stats Summary */}
      <Card className="p-6 border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5">
        <h3 className="font-semibold text-foreground mb-4">Tóm tắt</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold text-primary">{filteredEntries.length}</p>
            <p className="text-xs text-muted-foreground">Bản ghi tổng cộng</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">
              {Math.round(filteredEntries.reduce((sum, e) => sum + e.intensity, 0) / filteredEntries.length)}
            </p>
            <p className="text-xs text-muted-foreground">Cường độ trung bình</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {filteredEntries.filter((e) => e.intensity <= 2).length}
            </p>
            <p className="text-xs text-muted-foreground">Ngày tốt</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {filteredEntries.filter((e) => e.intensity >= 4).length}
            </p>
            <p className="text-xs text-muted-foreground">Ngày khó khăn</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

