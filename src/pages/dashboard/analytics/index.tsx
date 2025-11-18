import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { getTrends } from "@/services/emotionServices"
import { useToast } from "@/components/ui/use-toast"
import { ChartNoAxesColumn } from "lucide-react"
import { useSearchParams } from "react-router-dom"

type TimeRange = "week" | "month" | "year"

interface EmotionData {
    emotion: string
    emoji: string
    count: number
    percentage: number
    trend: number
}

interface DailyMoodData {
    date: string
    positive: number
    neutral: number
    negative: number
}

interface TrendsResponse {
    success: boolean
    data: {
        period: string
        statistics: {
            totalEmotions: number
            averageMood: number
            positiveCount: number
            negativeCount: number
            neutralCount: number
            positivePercentage: number
            negativePercentage: number
        }
        emotionStats: EmotionData[]
        dailyMoodData: DailyMoodData[]
        insights: string[]
    }
}

const TIME_RANGE_OPTIONS: TimeRange[] = ["week", "month", "year"]

const SkeletonBlock = ({ className }: { className?: string }) => (
    <div className={`bg-muted rounded-md animate-pulse ${className ?? ""}`} />
)

export default function AnalyticsPage() {
    const [searchParams, setSearchParams] = useSearchParams()

    const queryRange = searchParams.get("range")
    const timeRange: TimeRange = TIME_RANGE_OPTIONS.includes(queryRange as TimeRange)
        ? (queryRange as TimeRange)
        : "week"

    const [loading, setLoading] = useState(true)
    const [emotionStats, setEmotionStats] = useState<EmotionData[]>([])
    const [dailyMoodData, setDailyMoodData] = useState<DailyMoodData[]>([])
    const [statistics, setStatistics] = useState({
        totalEmotions: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
    })
    const [insights, setInsights] = useState<string[]>([])
    const { toast } = useToast()

    useEffect(() => {
        if (!queryRange || !TIME_RANGE_OPTIONS.includes(queryRange as TimeRange)) {
            const params = new URLSearchParams(searchParams)
            params.set("range", timeRange)
            setSearchParams(params, { replace: true })
        }
    }, [queryRange, searchParams, setSearchParams, timeRange])

    useEffect(() => {
        const fetchTrends = async () => {
            setLoading(true)
            try {
                const response = await getTrends({ period: timeRange }) as TrendsResponse
                if (response.success && response.data) {
                    setEmotionStats(response.data.emotionStats || [])
                    setDailyMoodData(response.data.dailyMoodData || [])
                    setStatistics({
                        totalEmotions: response.data.statistics.totalEmotions,
                        positiveCount: response.data.statistics.positiveCount,
                        negativeCount: response.data.statistics.negativeCount,
                        neutralCount: response.data.statistics.neutralCount,
                    })
                    setInsights(response.data.insights || [])
                }
            } catch (error) {
                console.error("Error fetching trends:", error)
                toast({
                    variant: "destructive",
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu phân tích. Vui lòng thử lại.",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchTrends()
    }, [timeRange, toast])

    const maxMoodValue = Math.max(
        ...dailyMoodData.map((d) => d.positive + d.neutral + d.negative),
        1
    )

    const { positiveCount, negativeCount, totalEmotions } = statistics

    return (
        <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 px-3 sm:px-0">
            {/* Time Range Selector */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                {TIME_RANGE_OPTIONS.map((range) => (
                    <button
                        key={range}
                        onClick={() => {
                            if (timeRange === range) return
                            const params = new URLSearchParams(searchParams)
                            params.set("range", range)
                            setSearchParams(params, { replace: true })
                        }}
                        className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors ${timeRange === range
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        {range === "week" ? "7 ngày" : range === "month" ? "30 ngày" : "365 ngày"}
                    </button>
                ))}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    [...Array(3)].map((_, index) => (
                        <Card key={index} className="p-6 border-0 shadow-sm">
                            <div className="space-y-3">
                                <SkeletonBlock className="h-3 w-24" />
                                <SkeletonBlock className="h-8 w-16" />
                                <SkeletonBlock className="h-3 w-32" />
                            </div>
                        </Card>
                    ))
                ) : (
                    <>
                        <Card className="p-6 border-0 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Cảm xúc tích cực</p>
                                    <p className="text-3xl font-bold text-green-600">{positiveCount}</p>
                                </div>
                                <span className="text-3xl">😊</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {totalEmotions > 0 ? Math.round((positiveCount / totalEmotions) * 100) : 0}% tổng số
                            </p>
                        </Card>

                        <Card className="p-6 border-0 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Cảm xúc tiêu cực</p>
                                    <p className="text-3xl font-bold text-orange-600">{negativeCount}</p>
                                </div>
                                <span className="text-3xl">😔</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {totalEmotions > 0 ? Math.round((negativeCount / totalEmotions) * 100) : 0}% tổng số
                            </p>
                        </Card>

                        <Card className="p-6 border-0 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Bản ghi tổng cộng</p>
                                    <p className="text-3xl font-bold text-primary">{totalEmotions}</p>
                                </div>
                                <span className="text-3xl"><ChartNoAxesColumn /></span>
                            </div>
                        </Card>
                    </>
                )}
            </div>

            {/* Emotion Distribution Chart */}
            <Card className="p-6 border-0 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Phân bố cảm xúc</h2>
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <SkeletonBlock className="w-10 h-10 rounded-full" />
                                        <div className="space-y-2">
                                            <SkeletonBlock className="h-3 w-32" />
                                            <SkeletonBlock className="h-2 w-20" />
                                        </div>
                                    </div>
                                    <SkeletonBlock className="h-4 w-12" />
                                </div>
                                <SkeletonBlock className="h-2 w-full" />
                            </div>
                        ))}
                    </div>
                ) : emotionStats.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Chưa có dữ liệu cảm xúc</div>
                ) : (
                    <div className="space-y-4">
                        {emotionStats.map((stat) => (
                            <div key={stat.emotion}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{stat.emoji}</span>
                                        <div>
                                            <p className="font-medium text-foreground">{stat.emotion}</p>
                                            <p className="text-xs text-muted-foreground">{stat.count} lần</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-foreground">{stat.percentage}%</p>
                                        <p
                                            className={`text-xs ${stat.trend > 0 ? "text-green-600" : stat.trend < 0 ? "text-orange-600" : "text-muted-foreground"}`}
                                        >
                                            {stat.trend > 0 ? "↑" : stat.trend < 0 ? "↓" : "→"} {Math.abs(stat.trend)}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: `${stat.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Weekly Mood Chart */}
            <Card className="p-6 border-0 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Biểu đồ cảm xúc hàng ngày</h2>
                {loading ? (
                    <div className="space-y-6">
                        <div className="overflow-x-auto pb-2">
                            <div className="flex items-end justify-between gap-4 h-64 p-4 bg-gradient-to-t from-primary/5 to-transparent rounded-lg min-w-[600px]">
                                {[...Array(7)].map((_, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="flex items-end justify-center gap-2 h-60">
                                        <SkeletonBlock className="w-4 h-16" />
                                        <SkeletonBlock className="w-4 h-12" />
                                        <SkeletonBlock className="w-4 h-8" />
                                    </div>
                                    <SkeletonBlock className="h-3 w-10" />
                                </div>
                            ))}
                            </div>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            {[...Array(3)].map((_, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <SkeletonBlock className="w-4 h-4 rounded" />
                                    <SkeletonBlock className="h-3 w-20" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="overflow-x-auto pb-2">
                            <div className="flex items-end justify-between gap-4 h-64 p-4 bg-gradient-to-t from-primary/5 to-transparent rounded-lg min-w-[600px]">
                                {dailyMoodData.map((day, i) => {
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="flex items-end justify-center gap-2 h-60">
                                            <div
                                                className="w-4 rounded-t-md bg-green-500 transition-all"
                                                style={{
                                                    height: `${maxMoodValue > 0 ? (day.positive / maxMoodValue) * 100 : 0}%`,
                                                    minHeight: day.positive > 0 ? "8px" : "0",
                                                }}
                                                title={`Tích cực: ${day.positive}`}
                                            />
                                            <div
                                                className="w-4 rounded-t-md bg-yellow-500 transition-all"
                                                style={{
                                                    height: `${maxMoodValue > 0 ? (day.neutral / maxMoodValue) * 100 : 0}%`,
                                                    minHeight: day.neutral > 0 ? "8px" : "0",
                                                }}
                                                title={`Trung bình: ${day.neutral}`}
                                            />
                                            <div
                                                className="w-4 rounded-t-md bg-orange-500 transition-all"
                                                style={{
                                                    height: `${maxMoodValue > 0 ? (day.negative / maxMoodValue) * 100 : 0}%`,
                                                    minHeight: day.negative > 0 ? "8px" : "0",
                                                }}
                                                title={`Tiêu cực: ${day.negative}`}
                                            />
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground">{day.date}</p>
                                    </div>
                                )
                            })}
                            </div>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded" />
                                <span className="text-sm text-muted-foreground">Tích cực</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-500 rounded" />
                                <span className="text-sm text-muted-foreground">Trung bình</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-500 rounded" />
                                <span className="text-sm text-muted-foreground">Tiêu cực</span>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Insights */}
            <Card className="p-6 border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
                <h2 className="text-lg font-semibold text-foreground mb-4">Nhận xét từ AI</h2>
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, idx) => (
                            <SkeletonBlock key={idx} className="h-4 w-full" />
                        ))}
                    </div>
                ) : insights.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">Chưa có nhận xét</div>
                ) : (
                    <div className="space-y-3 text-sm">
                        {insights.map((insight, index) => (
                            <p key={index} className="text-foreground">
                                {insight}
                            </p>
                        ))}
                    </div>
                )}
            </Card>

            {/* Recommendations */}
            <Card className="p-6 border-0 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Hoạt động được gợi ý</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { title: "Tập thiền", description: "Giúp giảm bớt lo lắng và tăng bình tĩnh", icon: "🧘" },
                        { title: "Hoạt động thể chất", description: "Tăng endorphin và cảm xúc tích cực", icon: "🏃" },
                        { title: "Ghi nhật ký", description: "Giúp bạn xử lý cảm xúc và suy ngẫm", icon: "✍️" },
                        { title: "Kết nối xã hội", description: "Gặp gỡ bạn bè và người thân", icon: "👥" },
                    ].map((activity, i) => (
                        <div key={i} className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                            <div className="flex gap-3 mb-2">
                                <span className="text-2xl">{activity.icon}</span>
                                <div>
                                    <h3 className="font-semibold text-foreground">{activity.title}</h3>
                                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

