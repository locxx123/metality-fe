import { useState, useEffect } from "react"
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ROUTE_URL } from "@/constants/routes"
import logo from "@/resources/images/logo.png";
import { BookCopy, BotMessageSquare, ChartNoAxesColumn, House, Notebook, Smile, LogOut, User } from "lucide-react"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { logout, getProfile } from "@/services/authServices"
import { showSuccess, showError } from "@/utils/toast"
import useUserStore from "@/store/userStore"
const menuItems = [
    { href: ROUTE_URL.DASHBOARD, label: "Trang chủ", icon: <House /> },
    { href: ROUTE_URL.SHARE_EMOTION, label: "Chia sẻ cảm xúc", icon: <Smile /> },
    { href: ROUTE_URL.CHAT, label: "Chatbot tư vấn", icon: <BotMessageSquare /> },
    { href: ROUTE_URL.JOURNAL, label: "Nhật ký cảm xúc", icon: <Notebook /> },
    { href: ROUTE_URL.ANALYTICS, label: "Phân tích xu hướng", icon: <ChartNoAxesColumn /> },
    { href: ROUTE_URL.RESOURCES, label: "Tài nguyên hỗ trợ", icon: <BookCopy /> },
]

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, setUser } = useUserStore();

    useEffect(() => {
        // Lấy thông tin user khi component mount
        const fetchUser = async () => {
            try {
                const response = await getProfile()
                if (response.success && response.data) {
                    setUser(response.data.user || response.data)
                }
            } catch (error) {
                console.error("Failed to fetch user profile:", error)
            }
        }
        if (!user) fetchUser()
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            showSuccess("Đăng xuất thành công!", "Hẹn gặp lại bạn")
            setTimeout(() => {
                navigate(ROUTE_URL.LOGIN)
            }, 500)
        } catch (error) {
            showError("Lỗi đăng xuất", "Không thể đăng xuất. Vui lòng thử lại.")
        }
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-64" : "w-20"
                    } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
            >
                {/* Logo */}
                <div className="px-6 py-2 border-b border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-10 h-10 object-contain scale-200 mt-2.5"
                        />
                        {sidebarOpen && <span className="font-bold text-foreground">MindScape</span>}
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
                                className={`flex  cursor-pointer items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                        : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-accent-foreground"
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
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="bg-card border-b border-border p-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <DropdownMenu
                            trigger={
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold cursor-pointer hover:bg-primary/30 transition-colors">
                                    {user?.fullName?.[0]?.toUpperCase() || user?.fullName?.[0]?.toUpperCase() || "U"}
                                </div>
                            }
                            align="right"
                        >
                            <div className="px-2 py-1.5 border-b border-border">
                                <p className="text-sm font-medium text-foreground">
                                    {user?.fullName || user?.fullName || "User"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {user?.email || ""}
                                </p>
                            </div>
                            <DropdownMenuItem onClick={() => navigate(ROUTE_URL.DASHBOARD)}>
                                <User className="w-4 h-4 mr-2" />
                                <span>Hồ sơ</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} variant="destructive">
                                <LogOut className="w-4 h-4 mr-2" />
                                <span>Đăng xuất</span>
                            </DropdownMenuItem>
                        </DropdownMenu>
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

