import * as React from "react"
import { cn } from "@/utils/cn"

interface DropdownMenuProps {
  children: React.ReactNode
  trigger: React.ReactNode
  align?: "left" | "right"
  className?: string
}

export function DropdownMenu({ children, trigger, align = "right", className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[200px] rounded-md border bg-popover p-1 shadow-md",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "default" | "destructive"
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
  variant = "default",
}: DropdownMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        variant === "destructive" && "text-destructive hover:bg-destructive/10 hover:text-destructive",
        className
      )}
    >
      {children}
    </div>
  )
}

