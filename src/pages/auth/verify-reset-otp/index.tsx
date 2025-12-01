import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ROUTE_URL } from "@/constants/routes"
import { verifyResetOtp, sendResetOtp } from "@/services/authServices"
import { showError, showInfo, showSuccess } from "@/utils/toast"

export default function VerifyResetOTPPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const emailParam = searchParams.get("email") || ""
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const storedEmail = localStorage.getItem("reset_email") || emailParam
    if (!storedEmail) {
      showError("Lỗi", "Không tìm thấy email. Vui lòng thử lại.")
      navigate(ROUTE_URL.FORGOT_PASSWORD)
      return
    }
    setEmail(storedEmail)
  }, [emailParam, navigate])

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true)
      return
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-reset-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-reset-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join("")

    if (!email) {
      showError("Lỗi", "Không tìm thấy email. Vui lòng thử lại.")
      navigate(ROUTE_URL.FORGOT_PASSWORD)
      return
    }

    if (otpCode.length !== 6) {
      showError("Lỗi xác thực", "Vui lòng nhập đầy đủ 6 chữ số")
      return
    }

    setIsLoading(true)
    try {
      const response = await verifyResetOtp(email, otpCode)
      if (response.success) {
        const resetToken = response.data?.resetToken
        if (resetToken) {
          localStorage.setItem("reset_token", resetToken)
        }
        showSuccess("Thành công", "OTP hợp lệ. Vui lòng đặt lại mật khẩu.")
        setTimeout(() => {
          navigate(ROUTE_URL.RESET_PASSWORD)
        }, 500)
      } else {
        showError("Lỗi xác minh", response.msg || "OTP không hợp lệ.")
      }
    } catch (err: any) {
      showError("Lỗi", err.response?.data?.msg || "Không thể xác minh OTP. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend || !email) return

    setTimer(60)
    setCanResend(false)
    setOtp(["", "", "", "", "", ""])

    try {
      await sendResetOtp(email)
      showInfo("Thành công", "Mã OTP mới đã được gửi.")
    } catch (err: any) {
      showError("Lỗi", err.response?.data?.msg || "Không thể gửi lại mã OTP.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              MH
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Xác minh OTP</h1>
          <p className="text-muted-foreground">Nhập mã xác minh được gửi đến</p>
          <p className="text-sm font-medium text-foreground mt-1">{email}</p>
        </div>

        <Card className="p-8 shadow-lg border-0 bg-white dark:bg-card">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">Mã OTP (6 chữ số)</label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-reset-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold border-2 border-input rounded-lg focus:border-primary focus:outline-none transition-colors bg-background"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
            >
              {isLoading ? "Đang xác minh..." : "Xác minh OTP"}
            </Button>

            <div className="text-center pt-4 border-t border-border">
              {!canResend ? (
                <p className="text-sm text-muted-foreground">
                  Gửi lại OTP trong <span className="text-primary font-medium">{timer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Gửi lại mã OTP
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 Mã xác minh có hiệu lực trong 10 phút. Nếu không nhận được mã, vui lòng kiểm tra thư spam.
            </p>
          </div>

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


