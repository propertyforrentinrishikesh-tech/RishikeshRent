"use client"

import * as React from "react"
import {
    BarChart,
    Boxes,
    ClipboardList,
    ClockArrowUp,
    Flame,
    Image,
    MapPin,
    MenuIcon,
    MessageCircleMore,
    Plus,
    Rss,
    Send,
    ShoppingBag,
    Star,
    StickyNote,
    User,
    Users,
    ShoppingCart,
    LayoutDashboard,
} from "lucide-react"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

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
        { divider: true },
        {
            name: "Create Hotel Partner's",
            url: "/admin/hotel_extranet",
            icon: Plus,
        },
        {
            name: "Hotel Partner's Log && Login Details",
            url: "/admin/hotel_partner_log_and_login_details",
            icon: Plus,
        },
        { divider: true },
        {
            name: "Hotel Property Updates",
            url: "/admin/hotel_property_updates",
            icon: Plus,
        },
        {
            name: "Promotional Discount",
            url: "/admin/promotional_discount",
            icon: Plus,
        },
        {
            name: "Hotel Operational or Admisitrative",
            url: "/admin/hotel_operational_admisitrative",
            icon: Plus,
        },
        {
            name: "Hotel Finanace Payout Overview",
            url: "/admin/hotel_finanace_payout_overview",
            icon: Plus,
        },
        {
            name: "Hotel Status (Block, Suspend, Availble)",
            url: "/admin/hotel_status",
            icon: Plus,
        },
        {
            name: "Suspended & Terminate Contract",
            url: "/admin/suspended_terminate_contract",
            icon: Plus,
        },
        {
            name: "Hotel Payout Overview",
            url: "/admin/hotel_payout_overview",
            icon: Plus,
        },
        {
            name: "Review And Chat Management",
            url: "/admin/review_and_chat_management",
            icon: Plus,
        },
        {
            name: "Booking Enquiry",
            url: "/admin/booking_enquiry",
            icon: Plus,
        },
        {
            name: "Cancelled Enquiry",
            url: "/admin/cancelled_enquiry",
            icon: Plus,
        },
        {
            name: "No Show Enquiry",
            url: "/admin/no_show_enquiry",
            icon: Plus,
        },
        {
            name: "BDM Contact",
            url: "/admin/bdm_contact",
            icon: Plus,
        },
        {
            name: "Use Full Link",
            url: "/admin/use_full_link",
            icon: Plus,
        },
        {
            name: "Send Promotional Emails",
            url: "/admin/send_promotional_emails",
            icon: Send,
        },
        {
            name: "Hotel Advertisment",
            url: "/admin/hotel_advertisment",
            icon: Send,
        },
        { divider: true },
        {
            name: "Banner Section 1st",
            url: "/admin/banner_section_1st",
            icon: Image
        },
        {
            name: "Banner Section 2nd",
            url: "/admin/banner_section_2nd",
            icon: Image
        },
        {
            name: "Banner Section 3rd",
            url: "/admin/banner_section_3rd",
            icon: Image
        },
        { divider: true },
        {
            name: "PopUp Banner",
            url: "/admin/popup_banner",
            icon: Image
        },
        {
            name: "Top Advertisment Banner",
            url: "/admin/top_advertisment_banner",
            icon: Image
        },
        {
            name: "Add Direct Package",
            url: "/admin/add_direct_package",
            icon: Image
        },
        {
            name: "Consultancy Banner",
            url: "/admin/consultancy_banner",
            icon: Image
        },
        // {
        //   name: "Featured Offered Banner",
        //   url: "/admin/featured_offered_banner",
        //   icon: Image
        // },
        // {
        //   name: "Category Advertisment",
        //   url: "/admin/category_advertisment",
        //   icon: Image
        // },
   



        // { divider: true },
        // {
        //   name: "Insta or Facebook Post",
        //   url: "/admin/insta_fb_post",
        //   icon: Image
        // },
        // {
        //   name: "Manage Blogs",
        //   url: "/admin/manage_blogs",
        //   icon: Rss,
        // },
        // {
        //   name: "News",
        //   url: "/admin/news",
        //   icon: Rss,
        // },

        // { divider: true },


        // {
        //   name: "Manage Featured Product",
        //   url: "/admin/manage_featured_packages",
        //   icon: Image,
        // },
        // {
        //   name: "Manage Menu Section",
        //   url: "/admin/manage_menu",
        //   icon: MenuIcon,
        // },
        // {
        //   name: "Manage Sub Menu Section",
        //   url: "/admin/manage_sub_menu",
        //   icon: MenuIcon,
        // },
        // {
        //   name: "Manage Products & Category",
        //   url: "/admin/manage_products_category",
        //   icon: Boxes,
        // },
        // {
        //   name: "View All Products",
        //   url: "/admin/all_products",
        //   icon: Boxes,
        // },
        // {
        //   name: "Approve/Reject Reviews",
        //   url: "/admin/manage_reviews",
        //   icon: Star,
        // },
        // {
        //   name: "FAQ",
        //   url: "/admin/faq",
        //   icon: Star,
        // },
        // { divider: true },
        // {
        //   name: "Enquiry Order",
        //   url: "/admin/enquiry_order",
        //   icon: ShoppingCart,
        // },
        // {
        //   name: "Booking Enquiry Log",
        //   url: "/admin/booking_enquiry_log",
        //   icon: ShoppingCart,
        // },
        // {
        //   name: "Online Order Log",
        //   url: "/admin/online_order_log",
        //   icon: ShoppingCart,
        // },
        // {
        //   name: "Cancel Order",
        //   url: "/admin/cancel_orders",
        //   icon: ClipboardList,
        // },
        // { divider: true },
        // {
        //   name: "Stock Management",
        //   url: "/admin/stock_management",
        //   icon: ClipboardList,
        // },
        // { divider: true },

        // {
        //   name: "Manage Webpages",
        //   url: "/admin/manage_webpage",
        //   icon: StickyNote,
        // },

        // { divider: true },

        // {
        //   name: "Contact Page Enquiry",
        //   url: "/admin/contact_page_enquiry",
        //   icon: MessageCircleMore,
        // },
        // {
        //   name: "Enquiry Chat Page",
        //   url: "/admin/chat",
        //   icon: MessageCircleMore,
        // },


        // { divider: true },




        // {
        //   name: "User Login Logs/Report",
        //   url: "/admin/user_login_logs",
        //   icon: Users,
        // },
    ],
}

const dataManager = {
    user: {
        name: "Welcome, Manager",
        email: "info@adventureaxis1.in",
    },
    projects: [
        {
            name: "Sales Section",
            url: "/admin/sales_section",
            icon: BarChart,
        },
        {
            name: "Enquiry Chat Page",
            url: "/admin/manager_enquiry_chat",
            icon: MessageCircleMore,
        },
        {
            name: "Send Promotional Emails",
            url: "/admin/send_promotional_emails",
            icon: Send,
        },
    ],
}

export function AppSidebar({
    ...props
}) {
    const { data: session } = useSession();

    const pathName = usePathname()

    return (
        (
            pathName !== "/admin/login" && (
                <Sidebar variant="inset"  {...props}>
                    <NavUser user={session} />
                    <SidebarContent {...props}>
                        {session?.user?.isSubAdmin && <NavProjects projects={dataManager.projects} />}
                        {(!session?.user?.isSubAdmin && session?.user?.isAdmin) && <NavProjects projects={data.projects} />}
                    </SidebarContent>
                </Sidebar>
            ))
    );
}
