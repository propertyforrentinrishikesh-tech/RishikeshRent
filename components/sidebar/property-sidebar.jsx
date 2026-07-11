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
            name: "Property Extranet",
            url: "/admin/property_extranet",
            icon: Boxes,
        },
        // { divider: true },  
        // {
        //     name: "Manage Menu Section",
        //     url: "/admin/property_extranet/manage_menu",
        //     icon: Plus,
        // },
        // {
        //     name: "Manage Sub Menu Section",
        //     url: "/admin/property_extranet/manage_sub_menu",
        //     icon: Plus,
        // },
        { divider: true },
        {
            name: "Property Dashboard",
            url: "/admin/property_dashboard",
            icon: Boxes,
        },
        { divider: true },

        {
            name: "Property Banner",
            url: "/admin/property_banner",
            icon: Plus,
        },
        { divider: true },

        {
            name: "Property Booking",
            url: "/admin/property_booking",
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
