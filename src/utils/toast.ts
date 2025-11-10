import { toast } from "@/components/ui/use-toast"

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info"

interface ToastOptions {
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

/**
 * Hiển thị thông báo thành công
 */
export const showSuccess = (message: string, description?: string) => {
  toast({
    title: message,
    description,
    variant: "success",
  })
}

/**
 * Hiển thị thông báo lỗi
 */
export const showError = (message: string, description?: string) => {
  toast({
    title: message,
    description,
    variant: "destructive",
  })
}

/**
 * Hiển thị thông báo cảnh báo
 */
export const showWarning = (message: string, description?: string) => {
  toast({
    title: message,
    description,
    variant: "warning",
  })
}

/**
 * Hiển thị thông báo thông tin
 */
export const showInfo = (message: string, description?: string) => {
  toast({
    title: message,
    description,
    variant: "info",
  })
}

/**
 * Hiển thị thông báo tùy chỉnh
 */
export const showToast = (options: ToastOptions) => {
  toast({
    title: options.title,
    description: options.description,
    variant: options.variant || "default",
  })
}

/**
 * Export toast function để có thể sử dụng trực tiếp nếu cần
 */
export { toast }

