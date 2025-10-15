# TicketManager UI/UX Design Documentation

## 🎯 Design Goals
**Main Objective**: Help users easily discover, manage, and purchase event tickets with an intuitive and modern interface

## 📊 Current Application Analysis

### Existing Structure
- **Pages**: Home, Login/Register, Event Detail, Event Management, Profile
- **Components**: Navigation, Cards, Forms, Buttons, Toast notifications
- **Layout**: Grid-based responsive design with container max-width 1100px

### Current Design System
```css
Colors:
- Background: #ffffff
- Card: #ffffff  
- Text: #0f172a (slate-900)
- Muted: #64748b (slate-500)
- Accent: #2563eb (blue-600)
- Accent-2: #60a5fa (blue-400)
- Border: #e5e7eb (gray-200)

Typography:
- Font: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial
- Sizes: Base text, h1 (text-2xl), h3 (text-lg)

Components:
- Cards: 12px border-radius, 1px border, 16px padding
- Buttons: 10px padding, 10px border-radius, accent background
- Grid: auto-fill minmax(280px, 1fr)
- Toast: Fixed bottom-right, 260-360px width
```

## 🎨 Thai Ticket Major Design Inspiration Analysis

Based on the reference site (thaiticketmajor.com), key design patterns include:
- **Professional corporate identity** with clean layouts
- **Event-focused visual hierarchy** with prominent imagery
- **Clear navigation structure** with search functionality
- **Trust indicators** like contact information and company details
- **Consistent branding** throughout the experience

## 📱 Low-Fidelity Wireframes

### 1. Home Page Layout
```
┌─────────────────────────────────────────────────────┐
│ [LOGO] Navigation    [Search Bar]    [Login/Profile] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ รายการอีเวนต์                                        │
│                                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│ │ [IMAGE] │ │ [IMAGE] │ │ [IMAGE] │ │ [IMAGE] │     │
│ │ Title   │ │ Title   │ │ Title   │ │ Title   │     │
│ │ Date    │ │ Date    │ │ Date    │ │ Date    │     │
│ │ Price   │ │ Price   │ │ Price   │ │ Price   │     │
│ │ [BTN]   │ │ [BTN]   │ │ [BTN]   │ │ [BTN]   │     │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│                                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│ │ [IMAGE] │ │ [IMAGE] │ │ [IMAGE] │ │ [IMAGE] │     │
│ │ Title   │ │ Title   │ │ Title   │ │ Title   │     │
│ │ Date    │ │ Date    │ │ Date    │ │ Date    │     │
│ │ Price   │ │ Price   │ │ Price   │ │ Price   │     │
│ │ [BTN]   │ │ [BTN]   │ │ [BTN]   │ │ [BTN]   │     │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
└─────────────────────────────────────────────────────┘
```

### 2. Event Detail Page Layout
```
┌─────────────────────────────────────────────────────┐
│ [LOGO] Navigation    [Search Bar]    [Login/Profile] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │                                                 │ │
│ │              [HERO IMAGE]                       │ │
│ │                                                 │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Event Title                                         │
│ Date: XX/XX/XXXX  Location: XXXXXXXX               │
│ Price: XXX ฿                                        │
│                                                     │
│ Description:                                        │
│ Lorem ipsum dolor sit amet...                       │
│                                                     │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│ │ [Buy Ticket]│ │ [Google Map]│ │ [Share]     │     │
│ └─────────────┘ └─────────────┘ └─────────────┘     │
└─────────────────────────────────────────────────────┘
```

### 3. Login Page Layout
```
┌─────────────────────────────────────────────────────┐
│ [LOGO] Navigation    [Search Bar]    [Login/Profile] │
├─────────────────────────────────────────────────────┤
│                                                     │
│                เข้าสู่ระบบ                           │
│                                                     │
│                ┌─────────────────┐                  │
│                │ อีเมล           │                  │
│                │ [____________]  │                  │
│                │                 │                  │
│                │ รหัสผ่าน        │                  │
│                │ [____________]  │                  │
│                │                 │                  │
│                │ [เข้าสู่ระบบ]   │                  │
│                │                 │                  │
│                │ ยังไม่มีบัญชี?  │                  │
│                │ สมัครสมาชิก     │                  │
│                └─────────────────┘                  │
└─────────────────────────────────────────────────────┘
```

### 4. Event Management Page Layout
```
┌─────────────────────────────────────────────────────┐
│ [LOGO] Navigation    [Search Bar]    [Login/Profile] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ อีเวนต์ของฉัน                [สร้างอีเวนต์ใหม่]     │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [IMAGE] Event Title                             │ │
│ │         Date: XX/XX  Location: XXXXX           │ │
│ │         Price: XXX ฿  Sold: XX                 │ │
│ │                                                 │ │
│ │ [ดูรายละเอียด] [แผนที่] [แก้ไข] [ลบ]            │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [IMAGE] Event Title                             │ │
│ │         Date: XX/XX  Location: XXXXX           │ │
│ │         Price: XXX ฿  Sold: XX                 │ │
│ │                                                 │ │
│ │ [ดูรายละเอียด] [แผนที่] [แก้ไข] [ลบ]            │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```