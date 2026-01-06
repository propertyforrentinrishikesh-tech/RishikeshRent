import PropertyRegistration from "@/components/Admin/PropertyRegistration"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const HotelBusinessDashboardPage = () => {
    return (
        <SidebarInset className="flex-1 overflow-auto">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
                <PropertyRegistration />
            </div>
        </SidebarInset>
    )
}

export default HotelBusinessDashboardPage