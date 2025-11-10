import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { ROUTE_URL } from "@/constants/routes"

export default function DashboardPage() {
  const stats = [
    { label: "Cảm xúc hôm nay", value: "😊", icon: "💭" },
    { label: "Nhật ký ghi chép", value: "5", icon: "📔", unit: "lần" },
    { label: "Tuần này", value: "18", icon: "📊", unit: "ngày tốt" },
    { label: "Phiên chatbot", value: "3", icon: "💬", unit: "lần" },
  ]

  const quickActions = [
    {
      title: "Chia sẻ cảm xúc",
      description: "Ghi lại trạng thái tinh thần hiện tại",
      href: ROUTE_URL.SHARE_EMOTION,
      icon: "💭",
    },
    { title: "Chat với AI", description: "Nhận lời khuyên từ trợ lý ảo", href: ROUTE_URL.CHAT, icon: "💬" },
    { title: "Xem nhật ký", description: "Kiểm tra lịch sử cảm xúc của bạn", href: ROUTE_URL.JOURNAL, icon: "📔" },
    {
      title: "Phân tích xu hướng",
      description: "Xem biểu đồ phân tích cảm xúc",
      href: ROUTE_URL.ANALYTICS,
      icon: "📊",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
        <h2 className="text-2xl font-bold text-foreground mb-2">Chào mừng trở lại!</h2>
        <p className="text-muted-foreground">Hôm nay là một ngày tốt để chăm sóc sức khỏe tâm lý của bạn.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-0 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  {stat.unit && <span className="text-sm text-muted-foreground">{stat.unit}</span>}
                </div>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Hành động nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.href}>
              <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{action.icon}</span>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Hoạt động gần đây</h3>
        <Card className="p-6 border-0 shadow-sm">
          <div className="space-y-4">
            {[
              { time: "Hôm nay lúc 10:30", action: "Bạn chia sẻ cảm xúc: Cảm thấy vui và tự tin" },
              { time: "Hôm qua lúc 14:15", action: "Bạn hoàn thành bài tập thở sâu" },
              { time: "2 ngày trước", action: "Bạn ghi lại nhật ký cảm xúc" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="text-primary font-bold text-lg">●</div>
                <div>
                  <p className="text-foreground font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

