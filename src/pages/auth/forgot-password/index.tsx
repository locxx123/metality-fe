import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Logo from "@/components/share/logo"
import { ROUTE_URL } from "@/constants/routes"
import { sendResetOtp } from "@/services/authServices"
import { showSuccess, showError } from "@/utils/toast"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      const response = await sendResetOtp(email)

      if (response.success) {
        localStorage.setItem("reset_email", email)
        showSuccess("Thành công", response.msg || "Mã OTP đã được gửi tới email của bạn")
        setTimeout(() => {
          navigate(`${ROUTE_URL.VERIFY_RESET_OTP}?email=${encodeURIComponent(email)}`)
        }, 500)
      } else {
        showError("Lỗi", response.msg || "Không thể gửi mã OTP. Vui lòng thử lại.")
      }
    } catch (err: any) {
      showError("Lỗi", err.response?.data?.msg || "Không thể gửi mã OTP. Vui lòng thử lại.")
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
          <p className="text-muted-foreground">Lấy lại quyền truy cập tài khoản của bạn.</p>
        </div>

        <Card className="p-6 shadow-lg border-0 bg-white dark:bg-card">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-foreground">Quên mật khẩu</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Nhập email để nhận mã xác minh đặt lại mật khẩu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
            >
              {isLoading ? "Đang gửi..." : "Gửi mã"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Nhớ mật khẩu rồi?{" "}
              <Link to={ROUTE_URL.LOGIN} className="text-primary hover:underline font-medium">
                Đăng nhập
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}


