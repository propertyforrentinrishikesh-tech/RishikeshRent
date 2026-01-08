import '@/app/globals.css'
import { AppSidebar } from '@/components/sidebar/hotel-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export const metadata = {
    title: "Add Direct Package",
}

export default function RootLayout({
    children,
}) {
    return (
        <>
            <SidebarProvider className="!font-barlow">
                <AppSidebar className="py-10 bg-white" />
                {children}
            </SidebarProvider>
        </>
    )
}
