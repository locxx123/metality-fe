import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { getRelaxVideos, RelaxVideo } from "@/services/relaxServices"
import { showError } from "@/utils/toast"
import { Play } from "lucide-react"

const VideoSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <Card key={i} className="p-4 border-0 shadow-sm">
        <div className="flex gap-4 animate-pulse">
          <div className="w-48 h-28 bg-muted rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </Card>
    ))}
  </div>
)

export default function RelaxPage() {
  const [videos, setVideos] = useState<RelaxVideo[]>([])
  const [message, setMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<RelaxVideo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true)
      try {
        const response = await getRelaxVideos()
        if (response.success && response.data) {
          setMessage(response.data.message)
          setVideos(response.data.videos)
        } else {
          showError("Lỗi", response.msg || "Không thể tải video thư giãn.")
        }
      } catch (error: any) {
        console.error("Failed to fetch relax videos:", error)
        showError("Lỗi", error?.response?.data?.msg || "Không thể tải video thư giãn.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const extractVideoId = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.searchParams.get("v") || ""
    } catch {
      return ""
    }
  }

  const handleVideoClick = (video: RelaxVideo) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedVideo(null), 300) // Clear after animation
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-3 sm:px-0">
      {/* AI Message Section */}
      <Card className="p-6 border-0 shadow-sm bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🧘</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground mb-2">Lời nhận xét từ MindScape</h2>
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-4/5" />
              </div>
            ) : (
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {message || "Hãy dành thời gian để thư giãn và chăm sóc bản thân."}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Video được gợi ý cho bạn</h3>
          {!isLoading && videos.length > 0 && (
            <span className="text-sm text-muted-foreground">{videos.length} video</span>
          )}
        </div>

        {isLoading ? (
          <VideoSkeleton />
        ) : videos.length === 0 ? (
          <Card className="p-12 border-0 shadow-sm text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl">🎥</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Chưa có video nào</h3>
                <p className="text-sm text-muted-foreground">
                  Hãy chia sẻ cảm xúc để nhận được gợi ý video phù hợp với bạn
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => {
              const videoId = extractVideoId(video.url)
              return (
                <Card
                  key={video.id}
                  className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-48 h-48 sm:h-28 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {videoId ? (
                        <>
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="w-6 h-6 text-primary ml-1" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">🎥</span>
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 space-y-2">
                      <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          YouTube
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Info Card */}
      {!isLoading && videos.length > 0 && (
        <Card className="p-4 border-0 shadow-sm bg-primary/5">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p className="text-sm text-muted-foreground">
              Các video này được chọn dựa trên cảm xúc gần đây của bạn. Hãy dành thời gian thư giãn và chăm sóc bản
              thân mỗi ngày.
            </p>
          </div>
        </Card>
      )}

      {/* Video Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        {selectedVideo && (
          <div className="bg-black">
            <div className="relative" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${extractVideoId(selectedVideo.url)}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-6 bg-background">
              <h3 className="text-xl font-semibold text-foreground mb-2">{selectedVideo.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedVideo.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

