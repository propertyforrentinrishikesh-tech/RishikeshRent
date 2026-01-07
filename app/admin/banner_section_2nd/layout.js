import '@/app/globals.css'
import { AppSidebar } from '@/components/sidebar/hotel-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export const metadata = {
    title: "Banner Section 2nd",
}

export default function RootLayout({
    children,
}) {
    return (
        <>
            <SidebarProvider className="!font-barlow">
                <AppSidebar className="py-10 bg-blue-100" />
                {children}
            </SidebarProvider>
        </>
    )
}
