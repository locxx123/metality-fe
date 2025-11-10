# Hướng dẫn sử dụng Toast Notification

## Cài đặt

Toast notification đã được cài đặt và cấu hình sẵn trong dự án. Component `Toaster` đã được thêm vào `App.tsx`.

## Cách sử dụng

### 1. Sử dụng các hàm helper (Khuyến nghị)

Import các hàm từ `@/utils/toast`:

```tsx
import { showSuccess, showError, showWarning, showInfo, showToast } from "@/utils/toast"
```

#### Các hàm có sẵn:

- **`showSuccess(message, description?)`** - Hiển thị thông báo thành công (màu xanh lá)
- **`showError(message, description?)`** - Hiển thị thông báo lỗi (màu đỏ)
- **`showWarning(message, description?)`** - Hiển thị thông báo cảnh báo (màu vàng)
- **`showInfo(message, description?)`** - Hiển thị thông báo thông tin (màu xanh dương)
- **`showToast(options)`** - Hiển thị toast tùy chỉnh

#### Ví dụ:

```tsx
// Thành công
showSuccess("Đăng ký thành công!", "Mã OTP đã được gửi đến email của bạn")

// Lỗi
showError("Lỗi đăng nhập", "Email hoặc mật khẩu không đúng")

// Cảnh báo
showWarning("Cảnh báo", "Mật khẩu của bạn sắp hết hạn")

// Thông tin
showInfo("Thông báo", "Email đã được gửi đến hộp thư của bạn")

// Tùy chỉnh
showToast({
  title: "Tiêu đề",
  description: "Mô tả",
  variant: "default" // hoặc "destructive", "success", "warning", "info"
})
```

### 2. Sử dụng hook useToast (Cho trường hợp cần tùy chỉnh nhiều hơn)

```tsx
import { useToast } from "@/components/ui/use-toast"

function MyComponent() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Tiêu đề",
          description: "Mô tả",
          variant: "default",
        })
      }}
    >
      Hiển thị Toast
    </Button>
  )
}
```

## Ví dụ sử dụng trong code

### Trong trang Signup:

```tsx
import { showSuccess, showError } from "@/utils/toast"

try {
  const response = await sendOtp(email)
  if (response.success && response.statusCode === 201) {
    showSuccess("Thành công!", "Mã OTP đã được gửi đến email của bạn")
    // Lưu vào localStorage và redirect
    localStorage.setItem("signup_email", email)
    navigate(`${ROUTE_URL.VERIFY_OTP}?email=${encodeURIComponent(email)}`)
  }
} catch (err: any) {
  showError("Lỗi!", err.response?.data?.msg || "Không thể gửi mã OTP. Vui lòng thử lại.")
}
```

### Trong trang Verify OTP:

```tsx
import { showSuccess, showError } from "@/utils/toast"

try {
  const response = await verifyOtp(email, otp, name, password)
  if (response.success) {
    showSuccess("Xác minh thành công!", "Đang chuyển hướng...")
    // Clear localStorage và redirect
    localStorage.removeItem("signup_email")
    navigate(ROUTE_URL.DASHBOARD)
  }
} catch (err: any) {
  showError("Lỗi xác minh", err.response?.data?.msg || "Mã OTP không hợp lệ")
}
```

## Các variant có sẵn

- `default` - Màu mặc định
- `destructive` - Màu đỏ (cho lỗi)
- `success` - Màu xanh lá (cho thành công)
- `warning` - Màu vàng (cho cảnh báo)
- `info` - Màu xanh dương (cho thông tin)

## Lưu ý

- Toast sẽ tự động ẩn sau 5 giây
- Chỉ hiển thị 1 toast tại một thời điểm
- Toast được hiển thị ở góc trên bên phải màn hình (trên mobile) hoặc góc dưới bên phải (trên desktop)

