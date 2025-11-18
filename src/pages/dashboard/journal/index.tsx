import { useCallback, useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { emotions } from "@/config"
import { getEmotions } from "@/services/emotionServices"
import { useToast } from "@/components/ui/use-toast"

interface JournalEntry {
  id: string
  date: Date
  emotion: string
  emotionValue: string
  emoji: string
  intensity: number
  tags: string[]
  description: string
}

type ViewMode = "timeline" | "list"

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`bg-muted rounded-md animate-pulse ${className ?? ""}`} />
)

const JournalSkeleton = ({ viewMode }: { viewMode: ViewMode }) => (
  <div className={viewMode === "timeline" ? "space-y-4" : "space-y-3"}>
    {[...Array(viewMode === "timeline" ? 3 : 5)].map((_, idx) => (
      <Card key={idx} className="p-4 border-0 shadow-sm">
        <div className="flex items-start gap-4">
          <SkeletonBlock className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-3/4" />
          </div>
        </div>
      </Card>
    ))}
  </div>
)

export default function JournalPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("timeline")
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getEmotions()
      const apiEntries = response?.data?.emotions ?? []

      const mappedEntries: JournalEntry[] = apiEntries.map((item: any) => {
        const meta = emotions.find((emotion) => emotion.value === item.emotionType) || null

        return {
          id: item.id || item._id,
          date: new Date(item.date || item.createdAt),
          emotion: meta?.label ?? item.emotionType ?? "Không xác định",
          emotionValue: item.emotionType ?? "",
          emoji: meta?.emoji ?? item.emoji ?? "📝",
          intensity: item.intensity ?? item.moodRating ?? 0,
          tags: Array.isArray(item.tags) ? item.tags : [],
          description: item.description ?? item.journalEntry ?? "",
        }
      })

      setEntries(mappedEntries)
    } catch (error) {
      const message =
        (typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as any).response?.data?.msg === "string" &&
          (error as any).response.data.msg) ||
        "Không thể tải nhật ký cảm xúc. Vui lòng thử lại."

      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const filteredEntries = entries.filter((entry) => {
    if (filterTag && !entry.tags.includes(filterTag)) return false
    if (searchQuery && !entry.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const allTags = useMemo(() => Array.from(new Set(entries.flatMap((entry) => entry.tags))), [entries])

  const emotionColors = useMemo(() => {
    const colorMap: Record<string, string> = {}
    emotions.forEach((emotion) => {
      colorMap[emotion.label] = emotion.color
    })
    return colorMap
  }, [])

  const getEmojis = (intensity: number) => {
    const safeIntensity = Math.min(Math.max(intensity, 0), 5)
    return "●".repeat(safeIntensity) + "○".repeat(5 - safeIntensity)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 px-3 sm:px-0">

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
                className={`px-3 py-1 cursor-pointer rounded-full text-sm font-medium transition-colors ${
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
                  className={`px-3 cursor-pointer py-1 rounded-full text-sm font-medium transition-colors ${
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
      <div className="flex flex-wrap gap-2">
        {(["timeline", "list"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors ${
              viewMode === mode
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {mode === "timeline" ? "📅 Timeline" : "📋 Danh sách"}
          </button>
        ))}
      </div>

      {/* Entries */}
      {loading ? (
        <JournalSkeleton viewMode={viewMode} />
      ) : (
        <>
          {viewMode === "timeline" && (
            <div className="space-y-0">
              {filteredEntries.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {index < filteredEntries.length - 1 && <div className="absolute left-6 top-20 w-1 h-8 bg-border" />}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex flex-col items-center pt-2 flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 border-background ${emotionColors[entry.emotion] || "bg-gray-100"}`}
                      >
                        {entry.emoji}
                      </div>
                    </div>
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
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <Card
                  key={entry.id}
                  onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                  className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
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
        </>
      )}

      {!loading && filteredEntries.length === 0 && (
        <Card className="p-8 text-center border-0 shadow-sm">
          <p className="text-lg text-muted-foreground">Không tìm thấy bản ghi nào</p>
        </Card>
      )}

      {/* Stats Summary */}
      <Card className="p-6 border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5">
        <h3 className="font-semibold text-foreground mb-4">Tóm tắt</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <SkeletonBlock className="h-8 w-12" />
                <SkeletonBlock className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-primary">{filteredEntries.length}</p>
              <p className="text-xs text-muted-foreground">Bản ghi tổng cộng</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-accent">
                {filteredEntries.length > 0
                  ? Math.round(filteredEntries.reduce((sum, e) => sum + e.intensity, 0) / filteredEntries.length)
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">Cường độ trung bình</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredEntries.filter((e) => e.intensity <= 2).length}
              </p>
              <p className="text-xs text-muted-foreground">Ngày tốt</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold text-orange-600">
                {filteredEntries.filter((e) => e.intensity >= 4).length}
              </p>
              <p className="text-xs text-muted-foreground">Ngày khó khăn</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
