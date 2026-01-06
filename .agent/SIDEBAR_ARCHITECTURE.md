# Sidebar Architecture - Complete Guide

## 📋 Overview

The sidebar system uses **Next.js nested layouts** to show different sidebars for different sections of the admin panel. Each section can have its own custom sidebar with different menu items.

---

## 🏗️ Architecture Breakdown

### **1. Layout Hierarchy**

```
/admin
├── layout.js (Main Admin Sidebar)
├── page.js (Dashboard with 4 cards)
│
├── /properties_extranet
│   ├── layout.js (Properties Sidebar - OVERRIDES parent)
│   └── page.js (Properties content)
│
├── /hotel_extranet
│   ├── layout.js (Hotel Sidebar - OVERRIDES parent)
│   └── page.js (Hotel content)
│
└── /pilgrimage_extranet
    ├── layout.js (Pilgrimage Sidebar - OVERRIDES parent)
    └── page.js (Pilgrimage content)
```

---

## 🔑 Key Concept: Layout Overriding

**In Next.js, child layouts OVERRIDE parent layouts!**

- `/admin/layout.js` wraps ALL admin pages
- `/admin/hotel_extranet/layout.js` REPLACES the parent layout for hotel pages
- This is why you can have different sidebars for different sections

---

## 📁 File Structure

### **Component Files:**

```
components/
├── app-sidebar.jsx          → Main admin sidebar (default)
├── sidebar/
│   ├── hotel-sidebar.jsx    → Hotel extranet sidebar
│   ├── properties-sidebar.jsx (you can create this)
│   └── pilgrimage-sidebar.jsx (you can create this)
│
├── nav-projects.jsx         → Renders menu items
└── nav-user.jsx            → User profile section
```

### **Layout Files:**

```
app/admin/
├── layout.js                     → Uses app-sidebar.jsx
├── properties_extranet/
│   └── layout.js                 → Uses app-sidebar.jsx (same as main)
├── hotel_extranet/
│   └── layout.js                 → Uses hotel-sidebar.jsx (different!)
└── pilgrimage_extranet/
    └── layout.js                 → Can use pilgrimage-sidebar.jsx
```

---

## 🔧 How It Works

### **Step 1: Create a Sidebar Component**

Example: `components/sidebar/hotel-sidebar.jsx`

```javascript
"use client"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { Plus, User, Image } from "lucide-react"

const data = {
  user: {
    name: "Welcome, Admin",
    email: "info@rishikeshrent.com",
  },
  projects: [
    {
      name: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    { divider: true },
    {
      name: "Hotel Extranet",
      url: "/admin/hotel_extranet",
      icon: Plus,
    },
    {
      name: "Create Hotel Partner's",
      url: "/admin/create_hotel_partner",
      icon: User,
    },
    // ... more menu items
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar variant="inset" {...props}>
      <NavUser user={session} />
      <SidebarContent {...props}>
        <NavProjects projects={data.projects} />
      </SidebarContent>
    </Sidebar>
  )
}
```

**Key Points:**
- Export as `AppSidebar` (same name for all sidebars)
- Define `data.projects` array with menu items
- Each item has: `name`, `url`, `icon`
- Use `{ divider: true }` for separators

---

### **Step 2: Create a Layout File**

Example: `app/admin/hotel_extranet/layout.js`

```javascript
import '@/app/globals.css'
import { AppSidebar } from '@/components/sidebar/hotel-sidebar'  // ← Import YOUR sidebar
import { SidebarProvider } from '@/components/ui/sidebar'

export const metadata = {
  title: "Hotel Extranet",
}

export default function RootLayout({ children }) {
  return (
    <>
      <SidebarProvider className="!font-barlow">
        <AppSidebar className="py-10 bg-blue-100" />
        {children}
      </SidebarProvider>
    </>
  )
}
```

**Key Points:**
- Import YOUR custom sidebar component
- Wrap with `SidebarProvider`
- `{children}` renders the page content

---

### **Step 3: Create a Page File**

Example: `app/admin/hotel_extranet/page.js`

```javascript
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const HotelExtranetPage = () => {
  return (
    <SidebarInset className="flex-1 overflow-auto">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
        <h1 className="text-4xl font-semibold">Hotel Extranet</h1>
        {/* Your content here */}
      </div>
    </SidebarInset>
  )
}

export default HotelExtranetPage
```

**Key Points:**
- Use `SidebarInset` to create the content area
- Add `className="flex-1 overflow-auto"` for proper layout
- Include `SidebarTrigger` for mobile toggle
- Sticky header with `sticky top-0 z-10`

---

## 🎯 Current Setup

### **Main Admin (`/admin`)**

**Layout:** `app/admin/layout.js`
**Sidebar:** `components/app-sidebar.jsx`
**Menu Items:**
- Dashboard
- Properties Extranet
- Hotel Extranet
- Pilgrimage Extranet
- Restaurant Extranet

---

### **Properties Extranet (`/admin/properties_extranet`)**

**Layout:** `app/admin/properties_extranet/layout.js`
**Sidebar:** `components/app-sidebar.jsx` (SAME as main admin)
**Menu Items:** Same as main admin

---

### **Hotel Extranet (`/admin/hotel_extranet`)**

**Layout:** `app/admin/hotel_extranet/layout.js`
**Sidebar:** `components/sidebar/hotel-sidebar.jsx` (DIFFERENT!)
**Menu Items:**
- Dashboard
- Hotel Extranet
- Create Hotel Partner's
- Hotel Partner's Log Details
- Partner's Details
- Hotel Property Updates
- Promotional Discount
- ... (hotel-specific items)

---

## 🚀 How to Add a New Section

### **Example: Create Pilgrimage Extranet**

**Step 1:** Create sidebar component
```
components/sidebar/pilgrimage-sidebar.jsx
```

**Step 2:** Define menu items in the sidebar
```javascript
const data = {
  projects: [
    { name: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { divider: true },
    { name: "Pilgrimage Extranet", url: "/admin/pilgrimage_extranet", icon: Plus },
    { name: "Manage Temples", url: "/admin/manage_temples", icon: Building },
    { name: "Booking Management", url: "/admin/pilgrimage_bookings", icon: Calendar },
    // ... more items
  ]
}
```

**Step 3:** Create layout file
```
app/admin/pilgrimage_extranet/layout.js
```

**Step 4:** Import your sidebar in the layout
```javascript
import { AppSidebar } from '@/components/sidebar/pilgrimage-sidebar'
```

**Step 5:** Create page file
```
app/admin/pilgrimage_extranet/page.js
```

**Done!** ✅

---

## 📊 Visual Flow

```
User visits: /admin/hotel_extranet
                    ↓
Next.js checks: app/admin/hotel_extranet/layout.js
                    ↓
Layout imports: components/sidebar/hotel-sidebar.jsx
                    ↓
Sidebar renders: Hotel-specific menu items
                    ↓
Page renders: app/admin/hotel_extranet/page.js
                    ↓
User sees: Hotel sidebar + Hotel content
```

---

## 🎨 Customization Options

### **1. Different Menu Items**
Edit the `data.projects` array in your sidebar component

### **2. Different Colors**
Change `bg-blue-100` in layout.js or add custom classes

### **3. Different Icons**
Import from `lucide-react` and use in menu items

### **4. Conditional Menu Items**
Use session data to show/hide items based on user role

```javascript
{session?.user?.isAdmin && (
  <NavProjects projects={adminProjects} />
)}
{session?.user?.isManager && (
  <NavProjects projects={managerProjects} />
)}
```

---

## ✅ Best Practices

1. **One sidebar component per section** (hotel, properties, pilgrimage)
2. **Always export as `AppSidebar`** for consistency
3. **Use `SidebarInset`** in page files for proper layout
4. **Add `divider: true`** to separate menu sections
5. **Keep menu items organized** by functionality

---

## 🐛 Common Issues & Fixes

### **Issue: Sidebar not showing**
✅ **Fix:** Make sure layout.js imports the correct sidebar

### **Issue: Content overlapping sidebar**
✅ **Fix:** Add `className="flex-1 overflow-auto"` to `SidebarInset`

### **Issue: Menu items not highlighting**
✅ **Fix:** Check that `url` matches the actual page path

### **Issue: Sidebar showing wrong items**
✅ **Fix:** Verify the layout.js is importing the correct sidebar component

---

## 📝 Summary

**The magic is in the import statement!**

```javascript
// Main admin sidebar
import { AppSidebar } from '@/components/app-sidebar'

// Hotel sidebar
import { AppSidebar } from '@/components/sidebar/hotel-sidebar'

// Properties sidebar
import { AppSidebar } from '@/components/sidebar/properties-sidebar'
```

Each layout file imports a DIFFERENT sidebar component, but they all have the same export name (`AppSidebar`). This is how you get different menus for different sections! 🎉
