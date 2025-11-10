# Font Setup Instructions

Font Inter đã được cấu hình trong `src/styles/globals.css`. 

## Copy Fonts

Để hoàn tất cấu hình font, bạn cần copy các file font từ `youmed-interface`:

```bash
# Tạo thư mục
mkdir -p src/resources/fonts/Inter

# Copy fonts từ youmed-interface
cp "/Users/vutienloc/Workspace/code/reactjs/youmed-interface/src/resources/fonts/Inter/"*.ttf \
   "/Users/vutienloc/Workspace/university/CNNT/Cuối kì/mentality-v3/src/resources/fonts/Inter/"
```

## Font Files Cần Copy

- `Inter_28pt-Regular.ttf` (font-weight: 400)
- `Inter_28pt-Medium.ttf` (font-weight: 500)
- `Inter_28pt-SemiBold.ttf` (font-weight: 600)
- `Inter_28pt-Bold.ttf` (font-weight: 700)

## Cấu hình đã hoàn tất

✅ @font-face declarations đã được thêm vào `globals.css`
✅ Font family đã được cập nhật thành "Inter" trong Tailwind config
✅ Tất cả font weights (400, 500, 600, 700) đã được cấu hình

Sau khi copy fonts, ứng dụng sẽ tự động sử dụng font Inter.

