import * as React from "react"
import { LifeBuoy, Send, Settings, UserCog, Users, type LucideIcon } from "lucide-react"
import { useOrganization } from "@clerk/nextjs"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navSecondary = [
  {
    title: "Support",
    url: "#",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
]

// Admin links now need the dynamic organization slug
export function NavSecondary() {
  const { organization, membership, isLoaded } = useOrganization()
  
  const isAdmin = membership?.roleName == "admin" || (membership?.role && membership.role.includes("admin"))
  
  // Create admin links with dynamic org slug
  const adminLinks = organization ? [
    {
      title: "Manage Members",
      url: `/workspace/${organization.slug}/manage/members`,
      icon: Users,
    },
    {
      title: "Organization Settings",
      url: `/workspace/${organization.slug}/manage/settings`,
      icon: Settings,
    },
    {
      title: "Roles & Permissions",
      url: `/workspace/${organization.slug}/manage/roles`,
      icon: UserCog,
    },
  ] : []

  return (
        <SidebarGroup>
      <SidebarGroupContent>
        {isLoaded && organization && isAdmin && adminLinks.length > 0 && (
          <>
            <SidebarGroupLabel>Organization Admin</SidebarGroupLabel>
            <SidebarMenu>
              {adminLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}
        {/* <SidebarMenu>
          {navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu> */}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
