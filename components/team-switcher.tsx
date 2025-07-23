"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronsUpDown, Plus, Building, User } from "lucide-react"
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { organization } = useOrganization()
  const organizationList = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })
  const { userMemberships } = organizationList
  const { user } = useUser()
  
  // Track loading state
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Check if organization data is ready
    if (userMemberships.count !== undefined) {
      setIsLoading(false)
    }
  }, [userMemberships])

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Building className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {organization ? (
                  organization.imageUrl ? (
                    <img 
                      src={organization.imageUrl} 
                      alt={organization.name} 
                      className="size-4 rounded-sm" 
                    />
                  ) : (
                    <Building className="size-4" />
                  )
                ) : (
                  <User className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {organization ? organization.name : user?.username || user?.firstName || "Personal"}
                </span>
                <span className="truncate text-xs">
                  {organization ? "Organization" : "Personal Account"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Switch Account
            </DropdownMenuLabel>
            
            {/* Personal Account */}
            <DropdownMenuItem
              key="personal-account"
              onClick={async () => {
                if (organization && organizationList.setActive) {
                  await organizationList.setActive({ organization: null })
                  // Navigate to the personal workspace
                  router.push("/workspace/personal")
                }
              }}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border">
                <User className="size-3.5 shrink-0" />
              </div>
              {user?.username || user?.firstName || "Personal"}
              {!organization && (
                <DropdownMenuShortcut>✓</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>

            {/* Organizations */}
            {userMemberships.data?.map((membership) => (
              <DropdownMenuItem
                key={membership.organization.id}
                onClick={async () => {
                  if (organizationList.setActive) {
                    await organizationList.setActive({ organization: membership.organization })
                    // Navigate to the organization's workspace using its slug
                    router.push(`/workspace/${membership.organization.slug || membership.organization.id}`)
                  }
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {membership.organization.imageUrl ? (
                    <img 
                      src={membership.organization.imageUrl} 
                      alt={membership.organization.name} 
                      className="size-3.5 rounded-sm" 
                    />
                  ) : (
                    <Building className="size-3.5 shrink-0" />
                  )}
                </div>
                {membership.organization.name}
                {organization?.id === membership.organization.id && (
                  <DropdownMenuShortcut>✓</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="gap-2 p-2"
              onClick={async () => {
                if (organizationList.createOrganization) {
                  const org = await organizationList.createOrganization({ name: "New Organization" })
                  // After creating, redirect to the new organization's workspace
                  if (org) {
                    router.push(`/workspace/${org.slug || org.id}`)
                  }
                }
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Create organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
