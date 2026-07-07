import NavbarSection from "@/components/Admin/NavbarSection";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const NavbarSectionPage = () => {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <NavbarSection />
      </div>
    </SidebarInset>
  );
};

export default NavbarSectionPage;