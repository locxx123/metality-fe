import { useState, useEffect, useRef, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPersonalizedResources, type SupportResource } from "@/services/resourceServices"
import { showError } from "@/utils/toast"

type ResourceCategory = "articles" | "techniques" | "resources"

const DEFAULT_RESOURCES: Record<ResourceCategory, SupportResource[]> = {
  articles: [
  {
    id: "article-1",
    title: "Hiểu biết về sức khỏe tâm lý",
    description: "Tìm hiểu các khái niệm cơ bản về sức khỏe tâm lý và tại sao nó quan trọng",
    icon: "📖",
    category: "Tâm lý",
  },
  {
    id: "article-2",
    title: "Quản lý stress hàng ngày",
    description: "Các chiến lược hiệu quả để quản lý và giảm bớt stress trong cuộc sống hàng ngày",
    icon: "📚",
    category: "Stress",
  },
  {
    id: "article-3",
    title: "Mất ngủ: Nguyên nhân và giải pháp",
    description: "Tìm hiểu về mất ngủ và các cách tự nhiên để cải thiện chất lượng giấc ngủ",
    icon: "🌙",
    category: "Giấc ngủ",
  },
  {
    id: "article-4",
    title: "Xây dựng lòng tự trọng",
    description: "Cách phát triển và duy trì lòng tự trọng tích cực",
    icon: "💪",
    category: "Tự trọng",
  },
],
  techniques: [
  {
    id: "technique-1",
    title: "Hít thở sâu 4-7-8",
    description: "Kỹ thuật hít thở giúp giảm bớt căng thẳng và lo lắng trong vòng vài phút",
    icon: "🫁",
    duration: "5 phút",
    difficulty: "easy",
  },
  {
    id: "technique-2",
    title: "Thiền tâm",
    description: "Hướng dẫn thiền cơ bản để tập trung và xây dựng bình tĩnh nội tâm",
    icon: "🧘",
    duration: "10-20 phút",
    difficulty: "medium",
  },
  {
    id: "technique-3",
    title: "Viết cảm xúc",
    description: "Viết ra những cảm xúc của bạn để xử lý và giải tỏa stress",
    icon: "✍️",
    duration: "15 phút",
    difficulty: "easy",
  },
  {
    id: "technique-4",
    title: "Quét cơ thể (Body Scan)",
    description: "Kỹ thuật thư giãn toàn thân bằng cách tập trung vào từng bộ phận cơ thể",
    icon: "💆",
    duration: "20 phút",
    difficulty: "medium",
  },
  {
    id: "technique-5",
    title: "Luyện tập thư giãn cơ",
    description: "Thay phiên căng và thư giãn các nhóm cơ để giảm bớt căng thẳng",
    icon: "🏋️",
    duration: "15 phút",
    difficulty: "easy",
  },
  {
    id: "technique-6",
    title: "Hình ảnh hóa tích cực",
    description: "Sử dụng tưởng tượng để tạo trạng thái tâm lý tích cực",
    icon: "🌈",
    duration: "10 phút",
    difficulty: "medium",
  },
],
  resources: [
  {
    id: "resource-1",
    title: "Playlist âm nhạc thư giãn",
    description: "Các bài nhạc được chọn lọc giúp thư giãn và cải thiện tâm trạng",
    icon: "🎵",
    category: "Âm nhạc",
  },
  {
    id: "resource-2",
    title: "Video yoga cơ bản",
    description: "Hướng dẫn video yoga dễ theo dõi cho người mới bắt đầu",
    icon: "🧘‍♀️",
    category: "Video",
  },
  {
    id: "resource-3",
    title: "Ứng dụng thiền Mindfulness",
    description: "Ứng dụng di động giúp luyện tập thiền hằng ngày",
    icon: "📱",
    category: "Ứng dụng",
  },
  {
    id: "resource-4",
    title: "Cộng đồng hỗ trợ tâm lý",
    description: "Kết nối với những người khác đang trên con đường tương tự",
    icon: "👥",
    category: "Cộng đồng",
  },
  {
    id: "resource-5",
    title: "Liên hệ chuyên gia tâm lý",
    description: "Danh sách các chuyên gia tâm lý được xác thực nếu bạn cần tư vấn chuyên sâu",
    icon: "👨‍⚕️",
    category: "Chuyên gia",
  },
  {
    id: "resource-6",
    title: "Sách hay về sức khỏe tâm lý",
    description: "Các cuốn sách được khuyến nghị về sức khỏe tâm lý và phát triển bản thân",
    icon: "📕",
    category: "Sách",
  },
],
}

const STORAGE_KEY = "mindscape_bookmarked_resources"

// Helper function to load bookmarks from localStorage
const loadBookmarksFromStorage = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error("Failed to load bookmarks from localStorage:", error)
  }
  return []
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("articles")
  const [selectedResource, setSelectedResource] = useState<SupportResource | null>(null)
  const [resourcesData, setResourcesData] = useState<Record<ResourceCategory, SupportResource[]>>(DEFAULT_RESOURCES)
  const [isLoading, setIsLoading] = useState(true)
  // Initialize state from localStorage immediately
  const [bookmarked, setBookmarked] = useState<string[]>(() => loadBookmarksFromStorage())
  const isInitialMount = useRef(true)

  // Save bookmarks to localStorage whenever they change (but not on initial mount)
  useEffect(() => {
    // Skip saving on initial mount since we just loaded from storage
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarked))
    } catch (error) {
      console.error("Failed to save bookmarks to localStorage:", error)
    }
  }, [bookmarked])

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true)
      try {
        const response = await getPersonalizedResources()
        if (response.success && response.data) {
          setResourcesData({
            articles: response.data.articles ?? [],
            techniques: response.data.techniques ?? [],
            resources: response.data.resources ?? [],
          })
        } else {
          showError("Lỗi", response.msg || "Không thể tải tài nguyên gợi ý.")
          setResourcesData(DEFAULT_RESOURCES)
        }
      } catch (error: any) {
        console.error("Failed to fetch resources:", error)
        showError("Lỗi", error?.response?.data?.msg || "Không thể tải tài nguyên gợi ý.")
        setResourcesData(DEFAULT_RESOURCES)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [])

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => (prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]))
  }

  const currentResources = resourcesData[activeCategory]
  const allResources = useMemo(
    () => [...resourcesData.articles, ...resourcesData.techniques, ...resourcesData.resources],
    [resourcesData],
  )

  useEffect(() => {
    if (!selectedResource) return
    const updatedResource = allResources.find((item) => item.id === selectedResource.id)
    if (updatedResource && updatedResource !== selectedResource) {
      setSelectedResource(updatedResource)
    }
  }, [allResources, selectedResource])

  const bookmarkedItems = useMemo(() => allResources.filter((r) => bookmarked.includes(r.id)), [allResources, bookmarked])

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 px-3 sm:px-0">

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-1">
        {(["articles", "techniques", "resources"] as const).map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category)
              setSelectedResource(null)
            }}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeCategory === category
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {category === "articles" ? "📖 Bài viết" : category === "techniques" ? "🎯 Kỹ thuật" : "💡 Tài nguyên"}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, idx) => (
            <Card key={idx} className="p-5 border-0 shadow-sm">
              <div className="flex items-start gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : currentResources.length === 0 ? (
        <Card className="p-6 border-0 shadow-sm text-center text-muted-foreground">
          Chưa có gợi ý nào. Hãy tiếp tục ghi lại cảm xúc để nhận được các đề xuất phù hợp hơn.
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentResources.map((resource) => (
            <Card
              key={resource.id}
              className="p-5 border-0 shadow-sm cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedResource(resource)}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">{resource.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {resource.duration && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        ⏱️ {resource.duration}
                      </span>
                    )}
                    {resource.category && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        {resource.category}
                      </span>
                    )}
                    {resource.difficulty && (
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(resource.difficulty)}`}
                      >
                        {resource.difficulty === "easy" ? "Dễ" : resource.difficulty === "medium" ? "Trung bình" : "Khó"}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark(resource.id)
                  }}
                  className="flex-shrink-0 text-lg transition-transform hover:scale-110"
                  title="Bookmark"
                >
                  {bookmarked.includes(resource.id) ? "⭐" : "☆"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedResource && (
        <div
          className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setSelectedResource(null)}
        >
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto border-0" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-6xl">{selectedResource.icon}</span>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedResource.title}</h2>
                  <p className="text-muted-foreground">{selectedResource.description}</p>
                </div>
              </div>

              {selectedResource.duration && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    ⏱️ <strong>Thời gian:</strong> {selectedResource.duration}
                  </p>
                </div>
              )}

              <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-foreground mb-2">Chi tiết</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedResource.description} Hãy dành vài phút để trải nghiệm gợi ý này và ghi lại cảm nhận sau khi thực hiện.
                  Nếu bạn cần thêm hướng dẫn hoặc hỗ trợ, hãy liên hệ với chuyên gia hoặc chia sẻ cùng cộng đồng MindScape.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Lợi ích chính</h3>
                <ul className="space-y-1 text-sm text-foreground">
                  <li>✓ Giúp giảm bớt stress và lo lắng</li>
                  <li>✓ Cải thiện tâm trạng và tinh thần</li>
                  <li>✓ Có thể thực hiện bất cứ lúc nào, bất cứ nơi đâu</li>
                  <li>✓ Không có tác dụng phụ</li>
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => {
                    toggleBookmark(selectedResource.id)
                  }}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {bookmarked.includes(selectedResource.id) ? "⭐ Đã lưu" : "☆ Lưu tài nguyên"}
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedResource(null)}>
                  Đóng
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Bookmarked Resources */}
      {bookmarkedItems.length > 0 && (
        <Card className="p-6 border-0 shadow-sm bg-primary/5 border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tài nguyên đã lưu ({bookmarkedItems.length})</h3>
          <div className="flex flex-wrap gap-2">
            {bookmarkedItems.map((resource) => (
              <span
                key={resource.id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
              >
                {resource.icon} {resource.title}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="p-6 border-0 shadow-sm bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Cần tư vấn chuyên gia?</h3>
          <p className="text-muted-foreground mb-4">
            Nếu bạn đang gặp khó khăn hoặc cần tư vấn chuyên sâu, hãy liên hệ với một chuyên gia tâm lý.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Tìm chuyên gia tâm lý</Button>
        </div>
      </Card>
    </div>
  )
}

