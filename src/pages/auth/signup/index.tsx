import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Logo from "@/components/share/logo"
import { ROUTE_URL } from "@/constants/routes"
import { sendOtp } from "@/services/authServices"
import { showSuccess, showError } from "@/utils/toast"
import { Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate passwords match
        if (password !== confirmPassword) {
            showError("Lỗi xác thực", "Mật khẩu không khớp. Vui lòng kiểm tra lại.")
            return
        }

        setIsLoading(true)

        try {
            // Call sendOtp API
            const response = await sendOtp(email)

            // Check if response is successful
            if (response.success && response.statusCode === 201) {
                // Save user data to localStorage
                localStorage.setItem("signup_name", name)
                localStorage.setItem("signup_email", email)
                localStorage.setItem("signup_password", password)

                // Show success message
                showSuccess("Thành công!", "Mã OTP đã được gửi đến email của bạn")

                // Redirect to verify-otp page
                setTimeout(() => {
                    navigate(`${ROUTE_URL.VERIFY_OTP}?email=${encodeURIComponent(email)}`)
                }, 500)
            } else {
                showError("Lỗi!", "Không thể gửi mã OTP. Vui lòng thử lại.")
            }
        } catch (err: any) {
            showError("Lỗi!", err.response?.data?.msg || "Đã xảy ra lỗi. Vui lòng thử lại.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Logo />
                    <h1 className="text-3xl font-bold text-foreground mb-2">MindScape</h1>
                    <p className="text-muted-foreground">Lắng nghe mọi cảm xúc, thấu hiểu mọi buồn vui.</p>
                </div>

                {/* Auth Card */}
                <Card className="p-6 shadow-lg border-0 bg-white dark:bg-card">
                    <div className="mb-6">
                        <h2 className="text-2xl text-center font-bold text-foreground">Đăng ký</h2>
                        <p className="text-sm text-center text-muted-foreground mt-1">Tạo tài khoản mới</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Tên của bạn</label>
                            <Input
                                type="text"
                                placeholder="Nhập tên của bạn"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full"
                                required
                            />
                        </div>

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

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Mật khẩu</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Nhập lại mật khẩu</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground font-medium py-2"
                        >
                            {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border">
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 bg-transparent">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </Button>
                            <Button variant="outline" className="flex-1 bg-transparent">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Đã có tài khoản?{" "}
                    <Link to={ROUTE_URL.LOGIN} className="text-primary hover:underline font-medium">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    )
}

