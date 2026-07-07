import ManageMenu from "@/components/Admin/ManageMenu"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"


const ManageMenuPage = () => {
    return (    
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <ManageMenu section="frontend" />
            </div>
        </SidebarInset>
    )
}

export default ManageMenuPage