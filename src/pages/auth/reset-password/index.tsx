import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Logo from "@/components/share/logo"
import { ROUTE_URL } from "@/constants/routes"
import { resetPasswordWithToken } from "@/services/authServices"
import { showError, showSuccess } from "@/utils/toast"
import useUserStore from "@/store/userStore"

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { setUser } = useUserStore()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem("reset_token")
    const storedEmail = localStorage.getItem("reset_email")
    if (!storedToken || !storedEmail) {
      showError("Lỗi", "Phiên đặt lại mật khẩu không hợp lệ. Vui lòng thử lại.")
      navigate(ROUTE_URL.FORGOT_PASSWORD)
      return
    }
    setToken(storedToken)
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      showError("Lỗi", "Phiên đặt lại mật khẩu không hợp lệ.")
      navigate(ROUTE_URL.FORGOT_PASSWORD)
      return
    }

    if (password.length < 6) {
      showError("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.")
      return
    }

    if (password !== confirmPassword) {
      showError("Lỗi", "Mật khẩu không khớp.")
      return
    }

    setIsLoading(true)
    try {
      const response = await resetPasswordWithToken(password, token)
      if (response.success) {
        setUser(response.data?.user || null)
        localStorage.removeItem("reset_token")
        localStorage.removeItem("reset_email")
        showSuccess("Thành công", response.msg || "Mật khẩu đã được cập nhật.")
        setTimeout(() => {
          navigate(ROUTE_URL.DASHBOARD)
        }, 500)
      } else {
        showError("Lỗi", response.msg || "Không thể đặt lại mật khẩu.")
      }
    } catch (err: any) {
      showError("Lỗi", err.response?.data?.msg || "Không thể đặt lại mật khẩu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-3xl font-bold text-foreground mb-2">MindScape</h1>
          <p className="text-muted-foreground">Đặt lại mật khẩu và tiếp tục hành trình của bạn.</p>
        </div>

        <Card className="p-6 shadow-lg border-0 bg-white dark:bg-card">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-foreground">Đặt lại mật khẩu</h2>
            <p className="text-sm text-muted-foreground mt-1">Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mật khẩu mới</label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Xác nhận mật khẩu</label>
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(ROUTE_URL.LOGIN)}
              className="text-sm text-primary hover:underline font-medium"
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}


