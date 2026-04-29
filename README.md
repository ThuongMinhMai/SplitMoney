# Split Money Pro

> VI: Ứng dụng chia tiền nhóm thông minh cho du lịch, ăn uống, sinh hoạt chung.  
> EN: A smart group expense splitter for trips, meals, and shared costs.

Split Money Pro helps groups track bills, calculate balances, and generate optimized settlement transactions.  
Ứng dụng giúp nhóm quản lý hóa đơn, theo dõi công nợ và gợi ý cách thanh toán tối ưu.

## Mục lục | Table of Contents

- [Giới thiệu | Overview](#overview)
- [Tính năng chính | Features](#features)
- [Công nghệ | Tech Stack](#tech-stack)
- [Bắt đầu nhanh | Quick Start](#quick-start)
- [Scripts](#scripts)
- [Cấu trúc dự án | Project Structure](#project-structure)
- [Thuật toán chia tiền | Settlement Algorithm](#settlement-algorithm)
- [Lộ trình phát triển | Roadmap](#roadmap)
- [Đóng góp | Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)

<a id="overview"></a>

## Giới thiệu | Overview

**VI**
- Phù hợp cho nhóm bạn, gia đình, team đi du lịch hoặc chi tiêu chung.
- Hỗ trợ chia đều và chia tùy chỉnh theo từng người.
- Cung cấp sao kê thành viên và gợi ý giao dịch thanh toán.

**EN**
- Built for friends, families, and teams managing shared expenses.
- Supports equal split and custom split per participant.
- Provides member statements and optimized settlement suggestions.

<a id="features"></a>

## Tính năng chính | Features

- **Quản lý thành viên | Member management**: thêm/xóa thành viên nhanh chóng.
- **Quản lý hóa đơn | Bill management**: tạo, sửa, xóa hóa đơn với người trả và người tham gia.
- **Hai kiểu chia tiền | Two split modes**:
  - `equal`: chia đều cho tất cả người tham gia
  - `custom`: nhập số tiền riêng cho từng người
- **Tổng kết theo người | Per-member summary**: tổng đã trả, tổng đã dùng, số dư.
- **Giao dịch tối ưu | Optimized settlements**: đề xuất ai trả ai, số tiền bao nhiêu.
- **Sao kê & chia sẻ | Statement sharing**: xem chi tiết theo thành viên và chia sẻ qua link.
- **Đa ngôn ngữ | i18n**: Tiếng Việt / English.
- **UI/UX**: Dark mode, responsive layout, onboarding tour.

<a id="tech-stack"></a>

## Công nghệ | Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **UI**: React 19, Radix UI, shadcn/ui
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Forms & Validation**: react-hook-form, zod
- **Internationalization**: i18next, react-i18next
- **Utilities**: lz-string, sonner, driver.js

<a id="quick-start"></a>

## Bắt đầu nhanh | Quick Start

### 1) Clone repository

```bash
git clone <your-repo-url>
cd split-money-app
```

### 2) Install dependencies

```bash
npm install
```

### 3) Run development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.  
Mở `http://localhost:3000` trên trình duyệt để sử dụng ứng dụng.

<a id="scripts"></a>

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

<a id="project-structure"></a>

## Cấu trúc dự án | Project Structure

```text
app/                         # Next.js app routes
components/
  features/split-money/      # Domain features for expense splitting
  ui/                        # Shared UI components
context/                     # App contexts (i18n, etc.)
hooks/                       # Custom hooks and business logic
lib/                         # Helpers, validations, share-link utilities
locales/                     # Translation files (vi/en)
```

<a id="settlement-algorithm"></a>

## Thuật toán chia tiền | Settlement Algorithm

**VI**
1. Tổng hợp dữ liệu theo từng thành viên: `paid`, `used`, `balance`.
2. Tách người nợ (`balance < 0`) và người được nhận (`balance > 0`).
3. Ghép cặp theo số tiền tối thiểu để giảm số lượng giao dịch.
4. Xuất danh sách giao dịch cần thực hiện.

**EN**
1. Build per-member totals: `paid`, `used`, and `balance`.
2. Split members into debtors (`balance < 0`) and creditors (`balance > 0`).
3. Match pairs greedily with minimal transfer amounts.
4. Return a concise settlement transaction list.

<a id="roadmap"></a>

## Lộ trình phát triển | Roadmap

- Cloud sync for persistent data
- Export statement to PDF
- Multi-currency support
- Session history and reporting
- Real-time invite and collaboration

<a id="contributing"></a>

## Đóng góp | Contributing

Contributions are welcome.

1. Fork this repository
2. Create a feature branch (`feature/your-feature`)
3. Commit your changes
4. Open a Pull Request

Bạn có thể tạo issue để báo lỗi hoặc đề xuất tính năng mới.

## FAQ

### VI: Ứng dụng này dùng để làm gì?
Dùng để chia chi phí nhóm, theo dõi số dư từng thành viên và tối ưu giao dịch thanh toán.

### EN: What is this app for?
It helps groups split expenses, track balances, and settle payments efficiently.

### VI: App có hỗ trợ chia tiền không đều không?
Có, bạn có thể dùng chế độ `custom` để nhập mức chia riêng cho từng người.

### EN: Does it support custom split amounts?
Yes, use the `custom` split mode to assign specific amounts per participant.

### VI/EN: Có thể deploy ở đâu | Where can I deploy?
Bạn có thể deploy trên [Vercel](https://vercel.com/) hoặc bất kỳ nền tảng hỗ trợ Next.js.

## License

This project is licensed under the MIT License.  
Dự án được phát hành theo giấy phép MIT.  
See [`LICENSE`](./LICENSE) for details.
