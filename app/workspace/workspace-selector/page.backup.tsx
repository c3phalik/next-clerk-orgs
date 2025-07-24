"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  useUser, 
  useOrganizationList, 
  OrganizationSwitcher,
  useOrganization
} from "@clerk/nextjs"
import { 
  Building2, 
  Plus, 
  LayoutGrid, 
  ExternalLink, 
  Loader2,
  Check,
  ChevronsUpDown,
  ArrowUpRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function WorkspaceSelectorPage() {
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()
  const { organization: activeOrg, isLoaded: isActiveOrgLoaded } = useOrganization()
  const { 
    userMemberships, 
    isLoaded: isOrgsLoaded, 
    createOrganization 
  } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })
  
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // Check if there's only one organization, redirect automatically
  useEffect(() => {
    if (isOrgsLoaded && userMemberships.data.length === 1 && !activeOrg) {
      const org = userMemberships.data[0].organization
      setIsRedirecting(true)
      router.push(`/workspace/${org.slug}`)
    }
  }, [isOrgsLoaded, userMemberships.data, router, activeOrg])
  
  // Loading states
  if (!isUserLoaded || !isOrgsLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Show redirecting indicator
  if (isRedirecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Redirecting to your workspace...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Workspace Selector</h1>
          <p className="text-sm text-muted-foreground">
            Select your active workspace or create a new one
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LayoutGrid className="h-5 w-5" /> Active Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Active workspace display */}
            <div className="space-y-6">
              {activeOrg ? (
                <div 
                  className="flex items-center justify-between p-4 rounded-md border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm cursor-pointer hover:bg-primary/15 hover:shadow-md transition-all"
                  onClick={() => router.push(`/workspace/${activeOrg.slug}`)}
                >
                  <div className="flex items-center gap-3">
                    {activeOrg.imageUrl ? (
                      <img
                        src={activeOrg.imageUrl}
                        alt={activeOrg.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{activeOrg.name}</span>
                      {/* Membership info comes from membership variable from useOrganization() hook */}
                      <span className="text-xs text-muted-foreground">
                        {isActiveOrgLoaded ? (
                          <span className="inline-flex items-center">
                            <span className="mr-1">Active workspace</span> 
                          </span>
                        ) : ""}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-primary/70" />
                </div>
              ) : (
                <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
                  <p className="text-muted-foreground text-sm">No active workspace selected</p>
                </div>
              )}

              {/* Dropdown for selecting other workspaces - only show when user has more than 1 workspace */}
              {userMemberships.data.length > 1 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Switch workspace</label>
                  <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                      >
                        <span>Select a workspace</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-full min-w-[240px]">
                      {userMemberships.data.map((membership) => (
                        <DropdownMenuItem
                          key={membership.organization.id}
                          className="flex items-center gap-2 p-2"
                          onClick={() => {
                            router.push(`/workspace/${membership.organization.slug}`)
                            setDropdownOpen(false)
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {membership.organization.imageUrl ? (
                              <img
                                src={membership.organization.imageUrl}
                                alt={membership.organization.name}
                                className="h-6 w-6 rounded-md object-cover"
                              />
                            ) : (
                              <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-muted">
                                <Building2 className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                            <span>{membership.organization.name}</span>
                          </div>
                          {activeOrg?.id === membership.organization.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </CardContent>
          
        </Card>
      </div>
    </div>
  )
}
