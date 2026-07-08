"use client"

import * as React from "react"
import {
    Boxes,
    Plus,
    Send,
    Image,
    Rss,
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
        email: "care.kagpremiumhomes@gmail.com",
    },
    projects: [
        // {
        //     name: "Dashboard",
        //     url: "/admin",
        //     icon: LayoutDashboard,
        // },
        {
            name: "Hotel Extranet Dashboard",
            url: "/admin/hotel_extranet",
            icon: LayoutDashboard,
        },
        { divider: true },
        {
            name: "Promotional Discount",
            url: "/admin/hotel_extranet/",
            icon: Plus,
        },
        {
            name: "Hotel Banners",
            icon: Plus,
            items: [
                {
                    name: "Top Advertisment Banner",
                    url: "/admin/hotel_extranet/top_advertisment_banner",
                    icon: Image
                },
                {
                    name: "PopUp Banner",
                    url: "/admin/hotel_extranet/popup_banner",
                    icon: Image
                },
                {
                    name: "Hotel Banner",
                    url: "/admin/hotel_extranet/hotel_banner",
                    icon: Image
                },
                {
                    name: "Hotel Category Banner",
                    url: "/admin/hotel_extranet/hotel_category_banner",
                    icon: Image
                },
                {
                    name: "Banner Section 1st",
                    url: "/admin/hotel_extranet/banner_section_1st",
                    icon: Image
                },
                {
                    name: "Banner Section 2nd",
                    url: "/admin/hotel_extranet/banner_section_2nd",
                    icon: Image
                },
                {
                    name: "Banner Section 3rd",
                    url: "/admin/hotel_extranet/banner_section_3rd",
                    icon: Image
                },
            ]
        },
        { divider: true },
        {
            name: "Manage Menu Section",
            icon: Plus,
            items: [
                {
                    name: "Manage Menu",
                    url: "/admin/hotel_extranet/manage_menu",
                    icon: Plus,
                },
                {
                    name: "Manage Sub Menu Section",
                    url: "/admin/hotel_extranet/manage_sub_menu",
                    icon: Plus,
                },
                {
                    name: "Manage Products & Category",
                    url: "/admin/hotel_extranet/manage_packages_category",
                    icon: Boxes,
                },
            ]
        },
        { divider: true, },

        {
            name: "Create Destination (City Name)",
            url: "/admin/hotel_extranet/create_destination",
            icon: Image
        },
        { divider: true },
        {
            name: "Insta or Facebook Post",
            url: "/admin/hotel_extranet/insta_fb_post",
            icon: Image
        },
        {
            name: "Manage Blogs",
            url: "/admin/hotel_extranet/manage_blogs",
            icon: Rss,
        },
        { divider: true },
        {
            name: "Create Hotel Partner",
            url: "/admin/hotel_extranet/create_hotel_partner",
            icon: Plus,
        },
        {
            name: "Hotel Details",
            icon: Plus,
            items: [
                {
                    name: "Hotel Partner's Log && Login Details",
                    url: "/admin/hotel_extranet/hotel_partner_log_and_login_details",
                    icon: Plus,
                },
                {
                    name: "Hotel Property Updates & Status",
                    icon: Plus,
                    items: [
                        {
                            name: "Suspended Hotel Overview",
                            url: "/admin/hotel_extranet/",
                            icon: Plus,
                        }, {
                            name: "Rejected Hotel Partner Account",
                            url: "#",
                            icon: Plus,
                        },
                        {
                            name: "Terminated Hotel Reinstatement",
                            url: "#",
                            icon: Plus,
                        },
                    ],
                },
                {
                    name: "Review And Chat Management",
                    url: "#",
                    icon: Plus,
                },
            ]
        },

        { divider: true },
        {
            name: "Hotel Property Updates",
            url: "/admin/hotel_extranet/hotel_property_updates",
            icon: Plus,
        },
        { divider: true },
        {
            name: "Hotel Enquiry Section",
            icon: Plus,
            items: [{
                name: "Hotel Enquiry",
                url: "/admin/hotel_extranet//hotel_enquiry",
                icon: Plus,
            },
            {
                name: "Hotel Details Enquiry",
                url: "/admin/hotel_extranet//hotel_details_enquiry",
                icon: Plus,
            },
            {
                name: "Booking Enquiry",
                url: "/admin/hotel_extranet//hotel_booking_enquiry",
                icon: Plus,
            },]
        },
        {
            name: "Hotel Financial Overview",
            icon: Plus,
            items: [
                {
                    name: "Hotel Call Details Enquiry",
                    url: "#",
                },
                {
                    name: "Booking Enquiry",
                    icon: Plus,
                    items: [
                        {
                            name: "Confirm Booking Full Paid",
                            icon: Plus,
                            items: [
                                {
                                    name: "Previous",
                                    url: "#",
                                },
                                {
                                    name: "Upcoming",
                                    url: "#",
                                },
                            ],
                        },
                        {
                            name: "Advance Paid Booking",
                            url: "#",
                        },
                        {
                            name: "Paid Hotel Booking",
                            url: "#",
                        },
                    ],
                },
                {
                    name: "Cancelled Enquiry",
                    url: "#",
                },
                {
                    name: "No Show Enquiry",
                    url: "#",
                },
                {
                    name: "Cancel Booking",
                    url: "#",
                },
            ],
        },
        {
            name: "Hotel Booking Invoices",
            url: "#",
            icon: Plus,
        },
        {
            name: "Hotel Finance Payout Overview",
            icon: Plus,
            items: [
                {
                    name: "Total Payout Transfer Or Settlement Invoice",
                    url: "#",
                },
                {
                    name: "Total Outstanding Invoice",
                    icon: Plus,
                    items: [
                        {
                            name: "Paid",
                            url: "#",
                        },
                        {
                            name: "Outstanding",
                            url: "#",
                        },
                    ],
                },
                {
                    name: "Total Commission Or Tax",
                    icon: Plus,
                    items: [
                        {
                            name: "By Company",
                            icon: Plus,
                            items: [
                                {
                                    name: "Paid",
                                    url: "#",
                                },
                                {
                                    name: "Outstanding",
                                    url: "#",
                                },
                            ],
                        },
                        {
                            name: "By Hotel Partner's",
                            icon: Plus,
                            items: [
                                {
                                    name: "Paid",
                                    url: "#",
                                },
                                {
                                    name: "Outstanding",
                                    url: "#",
                                },
                            ],
                        },
                    ],
                },
            ],
        },


        { divider: true },


        {
            name: "Create BDM For City",
            url: "#",
            icon: Plus,
        },


        {
            name: "Create Hotel Advertisment",
            icon: Plus,
            items: [
                {
                    name: "Create Hotel Advertisement",
                    url: "#",
                },
                {
                    name: "Hotel Apply Advertisement Benefit",
                    url: "#",
                },
            ],
        },


        {
            name: "Create Hotel Visibility",
            icon: Plus,
            items: [
                {
                    name: "Need Selection Of Hotel Category",
                    url: "#",
                },
                {
                    name: "Apply For Landing Page",
                    icon: Plus,
                    items: [
                        {
                            name: "Selection Of",
                            icon: Plus,
                            items: [
                                {
                                    name: "Home Guest Love",
                                    url: "#",
                                },
                                {
                                    name: "Deals For The Weekends",
                                    url: "#",
                                },
                                {
                                    name: "Deals For The Weekends",
                                    url: "#",
                                },
                                {
                                    name: "Go To Home Page (A Quiet Escape Section)",
                                    url: "#",
                                },
                            ],
                        },
                    ],
                },
            ],
        },


        {
            name: "Sale Package",
            icon: Plus,
            items: [
                {
                    name: "Create Sale Package",
                    icon: Plus,
                    items: [
                        {
                            name: "Name Package & Amount + Duration",
                            url: "#",
                        },
                    ],
                },
                {
                    name: "Apply Package To The Hotel",
                    url: "#",
                },
            ],
        },


        {
            name: "Request Sale Package Enquiry",
            icon: Plus,
            items: [
                {
                    name: "Approve",
                    url: "#",
                },
                {
                    name: "Rejected",
                    url: "#",
                },
                {
                    name: "Upcoming Renewal",
                    url: "#",
                },
                {
                    name: "Terminated / Suspended",
                    url: "#",
                },
            ],
        },


        { divider: true },
        {
            name: "Send Promotional Emails",
            url: "#",
            icon: Send,
        },
        // {
        //     name: "User Login Logs/Report",
        //     url: "#",
        //     icon: Send,
        // },
    ]
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
