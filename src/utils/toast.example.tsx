/**
 * Ví dụ sử dụng Toast Notification
 * 
 * Import các hàm từ @/utils/toast
 */

import { showSuccess, showError, showWarning, showInfo, showToast } from "@/utils/toast"
import { Button } from "@/components/ui/button"

// Cách 1: Sử dụng các hàm helper có sẵn (Khuyến nghị)
export const ToastExamples = () => {
  return (
    <div className="space-y-4 p-4">
      <Button
        onClick={() => {
          showSuccess("Thành công!", "Đăng ký tài khoản thành công")
        }}
      >
        Hiển thị Success Toast
      </Button>

      <Button
        onClick={() => {
          showError("Lỗi!", "Không thể kết nối đến server")
        }}
      >
        Hiển thị Error Toast
      </Button>

      <Button
        onClick={() => {
          showWarning("Cảnh báo!", "Mật khẩu của bạn sắp hết hạn")
        }}
      >
        Hiển thị Warning Toast
      </Button>

      <Button
        onClick={() => {
          showInfo("Thông tin", "Email đã được gửi đến hộp thư của bạn")
        }}
      >
        Hiển thị Info Toast
      </Button>

      <Button
        onClick={() => {
          showToast({
            title: "Tùy chỉnh",
            description: "Toast với variant mặc định",
            variant: "default",
          })
        }}
      >
        Hiển thị Custom Toast
      </Button>
    </div>
  )
}

// Cách 2: Sử dụng trực tiếp hook useToast (Nếu cần tùy chỉnh nhiều hơn)
import { useToast } from "@/components/ui/use-toast"

export const ToastWithHook = () => {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
          variant: "default",
        })
      }}
    >
      Show Toast với Hook
    </Button>
  )
}

/**
 * Ví dụ sử dụng trong các trang:
 * 
 * // Trong signup/index.tsx
 * import { showSuccess, showError } from "@/utils/toast"
 * 
 * try {
 *   const response = await sendOtp(email)
 *   if (response.success) {
 *     showSuccess("Thành công!", "Mã OTP đã được gửi đến email của bạn")
 *     // ... redirect
 *   }
 * } catch (err) {
 *   showError("Lỗi!", err.response?.data?.msg || "Đã xảy ra lỗi")
 * }
 */

