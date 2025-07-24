"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { OrganizationSync } from "@/components/organization-sync"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      {/* This component synchronizes the Clerk organization with the URL slug */}
      <OrganizationSync />
      <AppSidebar className="border-r" />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
