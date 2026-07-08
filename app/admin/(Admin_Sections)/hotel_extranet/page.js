import HotelExtranet from "@/components/Admin/HotelPartnerSidebar/HotelExtranet"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const HotelBusinessDashboardPage = () => {
    return (
        <SidebarInset className="flex-1 overflow-auto bg-slate-50">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/90 backdrop-blur">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
                <HotelExtranet />
            </div>
        </SidebarInset>
    )
}

export default HotelBusinessDashboardPage