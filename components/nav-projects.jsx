"use client"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavProjects({
  projects
}) {
  const pathName = usePathname()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {projects.map((item, index) => {
          // If it's a divider
          if (item.divider) {
            return (
              <div key={`divider-${index}`} className="border-t border-orange-200 my-2 rounded-full" />
            )
          }

          if (item.items) {
            return (
              <Collapsible
                key={item.name}
                asChild
                defaultOpen={item.items.some(subItem => subItem.url === pathName)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.name} className="font-semibold !my-1">
                      {item.icon && <item.icon className="!size-4" />}
                      <span>{item.name}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        if (subItem.items) {
                          return (
                            <Collapsible
                              key={subItem.name}
                              asChild
                              defaultOpen={subItem.items.some(subSubItem => subSubItem.url === pathName)}
                              className="group/sub-collapsible"
                            >
                              <SidebarMenuSubItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton className="flex items-center justify-between w-full cursor-pointer hover:!bg-orange-500 hover:!text-white !my-1">
                                    <div className="flex items-center gap-2 text-nowrap">
                                      {subItem.icon && <subItem.icon className="!size-4" />}
                                      <span>{subItem.name}</span>
                                    </div>
                                    <ChevronRight className="transition-transform duration-200 group-data-[state=open]/sub-collapsible:rotate-90 !size-4" />
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub className="border-l-orange-200">
                                    {subItem.items.map((subSubItem) => (
                                      <SidebarMenuSubItem key={subSubItem.name}>
                                        <SidebarMenuSubButton asChild>
                                          <Link
                                            href={subSubItem.url || "#"}
                                            className={`${pathName === subSubItem.url ? 'bg-orange-500 text-white font-semibold' : ''} hover:!bg-orange-500 hover:!text-white !my-1`}
                                          >
                                            <div className="flex items-center my-2 text-nowrap  gap-2">
                                              {subSubItem.icon && <subSubItem.icon className="!size-4" />}
                                              <span>{subSubItem.name}</span>
                                            </div>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ))}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuSubItem>
                            </Collapsible>
                          )
                        }

                        return (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={subItem.url || "#"}
                                className={`${pathName === subItem.url ? 'bg-orange-500 text-white font-semibold' : ''} hover:!bg-orange-500 hover:!text-white !my-1 flex items-center gap-2`}
                              >
                                {subItem.icon && <subItem.icon className="!size-4" />}
                                <span>{subItem.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={`${(pathName === item.url) ? 'bg-orange-500 text-white' : ''} font-semibold hover:!bg-orange-500 hover:!text-white !my-1`}
                >
                  {item.icon !== null && <item.icon className={`${pathName === item.url ? '!size-5' : '!size-4'}`} />}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}