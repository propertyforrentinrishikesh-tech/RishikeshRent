import HotelPartnerUpdates from "@/components/Admin/HotelPartnerUpdates"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const HotelPartnerUpdatesPage = () => {
    return (
        <SidebarInset className="flex-1 overflow-auto">
            <header className="flex h-10 shrink-0 items-center gap-2 border-b bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
                <HotelPartnerUpdates />
            </div>
        </SidebarInset>
    )
}

export default HotelPartnerUpdatesPage