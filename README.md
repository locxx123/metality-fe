# MindScape - Mental Health App (ReactJS)

Hệ thống trợ lý tư vấn tâm lý thông minh giúp bạn cân bằng cảm xúc và cải thiện sức khỏe tinh thần.

## Cấu trúc dự án

Dự án được tổ chức theo cấu trúc ReactJS với Vite, tương tự như youmed-interface:

```
src/
├── components/        # Reusable components
│   ├── ui/            # shadcn UI components
│   └── share/         # Shared components (Logo, etc.)
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   └── layout/        # Layout components
├── routes/            # Routing configuration
├── services/          # API services
├── styles/            # Global styles
├── utils/             # Utility functions
└── constants/         # Constants

public/                # Static assets
```

## Công nghệ sử dụng

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn UI** - UI components
- **Axios** - HTTP client

## Cài đặt

```bash
npm install
```

## Chạy development server

```bash
npm run dev
```

## Build cho production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Cấu trúc routing

- `/` - Redirect to login
- `/authen/login` - Đăng nhập
- `/authen/signup` - Đăng ký
- `/authen/verify-otp` - Xác minh OTP
- `/dashboard` - Trang chủ dashboard
- `/dashboard/share-emotion` - Chia sẻ cảm xúc
- `/dashboard/chat` - Chatbot tư vấn
- `/dashboard/journal` - Nhật ký cảm xúc
- `/dashboard/analytics` - Phân tích xu hướng
- `/dashboard/resources` - Tài nguyên hỗ trợ

## Environment Variables

Tạo file `.env` với các biến sau:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Notes

- Dự án sử dụng shadcn UI và Tailwind CSS (không dùng Ant Design và SCSS như youmed-interface)
- Cấu trúc code được tổ chức tương tự youmed-interface để dễ bảo trì
- Tất cả components đã được convert từ Next.js sang ReactJS

