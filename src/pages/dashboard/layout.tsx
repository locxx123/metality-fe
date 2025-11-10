import type React from "react"
import { useState } from "react"
import { Link, useLocation, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ROUTE_URL } from "@/constants/routes"

const menuItems = [
  { href: ROUTE_URL.DASHBOARD, label: "Trang chủ", icon: "🏠" },
  { href: ROUTE_URL.SHARE_EMOTION, label: "Chia sẻ cảm xúc", icon: "💭" },
  { href: ROUTE_URL.CHAT, label: "Chatbot tư vấn", icon: "💬" },
  { href: ROUTE_URL.JOURNAL, label: "Nhật ký cảm xúc", icon: "📔" },
  { href: ROUTE_URL.ANALYTICS, label: "Phân tích xu hướng", icon: "📊" },
  { href: ROUTE_URL.RESOURCES, label: "Tài nguyên hỗ trợ", icon: "📚" },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              MH
            </div>
            {sidebarOpen && <span className="font-bold text-foreground">Mindwell</span>}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            <span className="text-lg">{sidebarOpen ? "◀" : "▶"}</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10"
            onClick={() => {
              // In a real app, this would call a logout function
              window.location.href = ROUTE_URL.HOME
            }}
          >
            <span className="text-lg flex-shrink-0">🚪</span>
            {sidebarOpen && <span className="text-sm">Đăng xuất</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              U
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

