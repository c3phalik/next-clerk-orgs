"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  PhoneCall,
  Settings2,
  SquareTerminal,
  Mail,
  Mails,
  Sparkles,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { OrgSwitcher } from "@/components/org-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavSecondary } from "./nav-secondary"

// This is data populates the sidebar menu
const data = {
  navMain: [
    {
      title: "Content Engine",
      url: "#",
      icon: Sparkles,
      isActive: true,
      items: [
        {
          title: "Generate ideas",
          url: "#",
        },
        {
          title: "Content library",
          url: "#",
        },
        {
          title: "Scheduled posts",
          url: "#",
        },
      ],
    },
    {
      title: "Email Agents",
      url: "#",
      icon: Mails,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Voice Agent",
      url: "#",
      icon: PhoneCall,
      items: [
        {
          title: "Voice Chat",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    
  ],
 
 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        
      </SidebarContent>
      <NavSecondary />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
