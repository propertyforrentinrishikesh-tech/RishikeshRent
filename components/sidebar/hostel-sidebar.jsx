"use client"

import * as React from "react"
import {
    Boxes,
    LayoutDashboard,
    Plus
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
        email: "care.kagpremiumhomes@gmail.com",
    },
    projects: [
        {
            name: "Dashboard",
            url: "/admin",
            icon: LayoutDashboard,
        },
        { divider: true },
        {
            name: "Hostel Extranet",
            url: "/admin/hostel_extranet",
            icon: Boxes,
        },
        // { divider: true },  
        // {
        //     name: "Manage Menu Section",
        //     url: "/admin/Hostel_extranet/manage_menu",
        //     icon: Plus,
        // },
        // {
        //     name: "Manage Sub Menu Section",
        //     url: "/admin/hostel_extranet/manage_sub_menu",
        //     icon: Plus,
        // },
        { divider: true },
        // {
        //     name: "Hostel Dashboard",
        //     url: "/admin/hostel_dashboard",
        //     icon: Boxes,
        // },
        // { divider: true },

        // {
        //     name: "Hostel Banner",
        //     url: "/admin/hostel_banner",
        //     icon: Plus,
        // },
        // { divider: true },

        {
            name: "Hostel Booking",
            url: "/admin/hostel_booking",
            icon: Plus,
        },
    ],
}


export function AppSidebar({
    ...props
}) {
    const { data: session } = useSession();

    const pathName = usePathname()
    const canViewSidebar = session?.user?.isSubAdmin || session?.user?.isAdmin

    return (
        (
            pathName !== "/admin/login" && (
                <Sidebar variant="inset"  {...props}>
                    <NavUser user={session} />
                    <SidebarContent {...props}>
                        {canViewSidebar && <NavProjects projects={data.projects} />}
                    </SidebarContent>
                </Sidebar>
            ))
    );
}
