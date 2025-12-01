import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Link, useSearchParams } from "react-router-dom"
import { ROUTE_URL } from "@/constants/routes"
import { BotMessageSquare, ChartNoAxesColumn, Notebook, Smile } from "lucide-react"
import { getDashboardStats, getDashboardGreeting, getRecentActivities } from "@/services/dashboardServices"
import { showError, showSuccess } from "@/utils/toast"
import { getProfile } from "@/services/authServices"
import useUserStore from "@/store/userStore"

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="p-6 border-0 shadow-sm">
        <div className="space-y-3 animate-pulse">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="flex items-baseline gap-2">
            <div className="h-8 bg-muted rounded w-16" />
            <div className="h-4 bg-muted rounded w-10" />
          </div>
          <div className="h-6 bg-muted rounded w-10" />
        </div>
      </Card>
    ))}
  </div>
)

const ActivitiesSkeleton = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0 animate-pulse">
        <div className="w-3 h-3 bg-muted rounded-full mt-1" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/4" />
        </div>
      </div>
    ))}
  </div>
)

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { setUser } = useUserStore()
  const [stats, setStats] = useState([
    { label: "Cảm xúc hôm nay", value: "😊", icon: <Smile /> },
    { label: "Nhật ký ghi chép", value: "0", icon: <Notebook />, unit: "lần" },
    { label: "Tuần này", value: "0", icon: <ChartNoAxesColumn />, unit: "ngày tốt" },
    { label: "Phiên chatbot", value: "0", icon: <BotMessageSquare />, unit: "lần" },
  ])
  const [activities, setActivities] = useState<Array<{ time: string; action: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [greetingMessage, setGreetingMessage] = useState<string | null>(null)
  const [isGreetingLoading, setIsGreetingLoading] = useState(true)

  // Handle OAuth callbacks (Google and Facebook)
  useEffect(() => {
    const googleAuth = searchParams.get("google_auth")
    const facebookAuth = searchParams.get("facebook_auth")
    
    if (googleAuth === "success" || facebookAuth === "success") {
      // Fetch user profile and update store
      const fetchUserProfile = async () => {
        try {
          const response = await getProfile()
          if (response.success && response.data.user) {
            setUser(response.data.user)
            showSuccess("Đăng nhập thành công!", "Chào mừng bạn trở lại")
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error)
        }
      }
      fetchUserProfile()
      // Remove query parameters from URL
      const newParams = new URLSearchParams(searchParams)
      newParams.delete("google_auth")
      newParams.delete("facebook_auth")
      setSearchParams(newParams, { replace: true })
    }
  }, [searchParams, setSearchParams, setUser])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        const [statsResponse, activitiesResponse] = await Promise.all([
          getDashboardStats(),
          getRecentActivities(10),
        ])

        if (statsResponse.success) {
          const statsData = statsResponse.data.stats
          setStats([
            { label: "Cảm xúc hôm nay", value: statsData.todayEmotion, icon: <Smile /> },
            { label: "Nhật ký ghi chép", value: statsData.journalEntries.toString(), icon: <Notebook />, unit: "lần" },
            { label: "Tuần này", value: statsData.goodDaysThisWeek.toString(), icon: <ChartNoAxesColumn />, unit: "ngày tốt" },
            { label: "Phiên chatbot", value: statsData.chatSessions.toString(), icon: <BotMessageSquare />, unit: "lần" },
          ])
        }

        if (activitiesResponse.success) {
          setActivities(
            activitiesResponse.data.activities.map((activity) => ({
              action: activity.action,
              time: activity.time,
            }))
          )
        }
      } catch (error: any) {
        console.error("Failed to load dashboard data:", error)
        showError("Lỗi", "Không thể tải dữ liệu trang chủ. Vui lòng thử lại.")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  useEffect(() => {
    let isMounted = true
    const fetchGreeting = async () => {
      setIsGreetingLoading(true)
      try {
        const response = await getDashboardGreeting()
        if (isMounted && response.success && response.data?.greetingMessage) {
          setGreetingMessage(response.data.greetingMessage)
        } else if (isMounted) {
          setGreetingMessage("Hãy chia sẻ cảm xúc hôm nay để chúng mình hiểu bạn hơn nhé.")
        }
      } catch (error) {
        console.error("Failed to load greeting message:", error)
        if (isMounted) {
          setGreetingMessage("Hãy chia sẻ cảm xúc hôm nay để chúng mình hiểu bạn hơn nhé.")
        }
      } finally {
        if (isMounted) {
          setIsGreetingLoading(false)
        }
      }
    }

    fetchGreeting()
    return () => {
      isMounted = false
    }
  }, [])

  const quickActions = [
    {
      title: "Chia sẻ cảm xúc",
      description: "Ghi lại trạng thái tinh thần hiện tại",
      href: ROUTE_URL.SHARE_EMOTION,
      icon: <Smile />,
    },
    { title: "Chat với AI", description: "Nhận lời khuyên từ trợ lý ảo", href: ROUTE_URL.CHAT, icon: <BotMessageSquare /> },
    { title: "Xem nhật ký", description: "Kiểm tra lịch sử cảm xúc của bạn", href: ROUTE_URL.JOURNAL, icon: <Notebook /> },
    {
      title: "Phân tích xu hướng",
      description: "Xem biểu đồ phân tích cảm xúc",
      href: ROUTE_URL.ANALYTICS,
      icon: <ChartNoAxesColumn />,
    },
  ]

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl p-6 border border-primary/20 shadow-sm">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Chào mừng trở lại!</h2>
        {isGreetingLoading ? (
          <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        ) : (
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
            {greetingMessage}
          </p>
        )}
      </section>

      {/* Stats Grid */}
      <section>
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className="p-6 border-0 shadow-sm h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                      {stat.unit && <span className="text-sm text-muted-foreground">{stat.unit}</span>}
                    </div>
                  </div>
                  <span className="text-3xl shrink-0">{stat.icon}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions + Activities */}
      <section className="grid gap-6 xl:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-lg font-semibold text-foreground">Hành động nhanh</h3>
            <p className="text-sm text-muted-foreground sm:text-right">
              Ghi lại cảm xúc, trao đổi với AI hoặc xem nhật ký chỉ với một chạm.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} to={action.href} className="h-full">
                <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{action.icon}</span>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Hoạt động gần đây</h3>
          <Card className="p-6 border-0 shadow-sm min-h-[220px] h-full flex flex-col">
            {isLoading ? (
              <ActivitiesSkeleton />
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Chưa có hoạt động nào</div>
            ) : (
              <div className="space-y-4 overflow-auto pr-1">
                {activities.map((activity, i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="text-primary font-bold text-lg">●</div>
                    <div>
                      <p className="text-foreground font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  )
}