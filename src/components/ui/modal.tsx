import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className={cn("relative z-10 w-full max-w-5xl mx-4 bg-background rounded-lg shadow-2xl", className)}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 sm:-right-10 sm:top-0 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all shadow-lg z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="overflow-hidden rounded-lg">{children}</div>
      </div>
    </div>
  )
}

