import { useState } from "react"
import { Card } from "@/components/ui/card"

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

const emotionStats: EmotionData[] = [
  { emotion: "Vui vẻ", emoji: "😊", count: 8, percentage: 32, trend: 5 },
  { emotion: "Bình tĩnh", emoji: "😌", count: 7, percentage: 28, trend: -2 },
  { emotion: "Lo lắng", emoji: "😰", count: 5, percentage: 20, trend: -3 },
  { emotion: "Mệt mỏi", emoji: "😴", count: 3, percentage: 12, trend: 0 },
  { emotion: "Buồn", emoji: "😔", count: 2, percentage: 8, trend: -1 },
]

const weeklyMoodData: DailyMoodData[] = [
  { date: "T2", positive: 4, neutral: 2, negative: 1 },
  { date: "T3", positive: 3, neutral: 3, negative: 1 },
  { date: "T4", positive: 5, neutral: 1, negative: 0 },
  { date: "T5", positive: 3, neutral: 2, negative: 1 },
  { date: "T6", positive: 4, neutral: 1, negative: 1 },
  { date: "T7", positive: 2, neutral: 2, negative: 2 },
  { date: "CN", positive: 3, neutral: 1, negative: 1 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week")

  const maxMoodValue = Math.max(...weeklyMoodData.map((d) => d.positive + d.neutral + d.negative))

  const positiveCount = emotionStats
    .filter((e) => ["Vui vẻ", "Bình tĩnh", "Yêu thích"].includes(e.emotion))
    .reduce((sum, e) => sum + e.count, 0)

  const negativeCount = emotionStats
    .filter((e) => ["Buồn", "Tức giận", "Lo lắng"].includes(e.emotion))
    .reduce((sum, e) => sum + e.count, 0)

  const neutralCount = emotionStats
    .filter((e) => ["Mệt mỏi", "Bối rối"].includes(e.emotion))
    .reduce((sum, e) => sum + e.count, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Phân tích xu hướng cảm xúc</h1>
        <p className="text-muted-foreground">Xem biểu đồ phân tích và xu hướng cảm xúc của bạn theo thời gian</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(["week", "month", "year"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === range
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {range === "week" ? "Tuần này" : range === "month" ? "Tháng này" : "Năm này"}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cảm xúc tích cực</p>
              <p className="text-3xl font-bold text-green-600">{positiveCount}</p>
            </div>
            <span className="text-3xl">😊</span>
          </div>
          <p className="text-xs text-muted-foreground">{Math.round((positiveCount / 25) * 100)}% tổng số</p>
        </Card>

        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cảm xúc tiêu cực</p>
              <p className="text-3xl font-bold text-orange-600">{negativeCount}</p>
            </div>
            <span className="text-3xl">😔</span>
          </div>
          <p className="text-xs text-muted-foreground">{Math.round((negativeCount / 25) * 100)}% tổng số</p>
        </Card>

        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bản ghi tổng cộng</p>
              <p className="text-3xl font-bold text-primary">25</p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-xs text-muted-foreground">{timeRange === "week" ? "Trong tuần này" : "Trong tháng này"}</p>
        </Card>
      </div>

      {/* Emotion Distribution Chart */}
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Phân bố cảm xúc</h2>
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
      </Card>

      {/* Weekly Mood Chart */}
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Biểu đồ cảm xúc hàng ngày</h2>
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-2 h-64 p-4 bg-gradient-to-t from-primary/5 to-transparent rounded-lg">
            {weeklyMoodData.map((day, i) => {
              const total = day.positive + day.neutral + day.negative
              const maxHeight = (maxMoodValue / maxMoodValue) * 240

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="flex gap-0.5 h-full w-full rounded-lg overflow-hidden bg-border">
                    {/* Positive Bar */}
                    <div
                      className="bg-green-500 flex-1 transition-all hover:opacity-80 hover:scale-105 origin-bottom rounded-t-lg"
                      style={{
                        height: `${(day.positive / maxMoodValue) * 100}%`,
                        minHeight: day.positive > 0 ? "4px" : "0",
                      }}
                      title={`Tích cực: ${day.positive}`}
                    />
                    {/* Neutral Bar */}
                    <div
                      className="bg-yellow-500 flex-1 transition-all hover:opacity-80 hover:scale-105 origin-bottom"
                      style={{
                        height: `${(day.neutral / maxMoodValue) * 100}%`,
                        minHeight: day.neutral > 0 ? "4px" : "0",
                      }}
                      title={`Trung bình: ${day.neutral}`}
                    />
                    {/* Negative Bar */}
                    <div
                      className="bg-orange-500 flex-1 transition-all hover:opacity-80 hover:scale-105 origin-bottom rounded-t-lg"
                      style={{
                        height: `${(day.negative / maxMoodValue) * 100}%`,
                        minHeight: day.negative > 0 ? "4px" : "0",
                      }}
                      title={`Tiêu cực: ${day.negative}`}
                    />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{day.date}</p>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4">
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
      </Card>

      {/* Insights */}
      <Card className="p-6 border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground mb-4">Nhận xét từ AI</h2>
        <div className="space-y-3 text-sm">
          <p className="text-foreground">
            ✓ <strong>Xu hướng tích cực:</strong> Tuần này bạn có {positiveCount} lần cảm xúc tích cực, tăng 20% so với
            tuần trước.
          </p>
          <p className="text-foreground">
            ℹ <strong>Mô hình cảm xúc:</strong> Cảm xúc của bạn thường tích cực vào thứ Tư và Thứ Năm, có thể liên quan
            đến hoạt động hoặc sự kiện nào đó.
          </p>
          <p className="text-foreground">
            💡 <strong>Gợi ý:</strong> Hãy tiếp tục những hoạt động tích cực và cân nhắc tìm các giải pháp cho những
            ngày khó khăn.
          </p>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Hoạt động được gợi ý</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

