"use client"

import { useOrganization } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Settings, AlertCircle, Building, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function OrganizationSettingsPage() {
  const { organization, membership, isLoaded } = useOrganization()
  
  // Check if user is admin
  const isAdmin = membership?.roleName === "admin" || (membership?.role && membership.role.includes("admin"))
  
  // If loaded and not admin, redirect to workspace page
  if (isLoaded && organization && !isAdmin) {
    redirect(`/workspace/${organization.slug}`)
  }
  
  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }
  
  if (!organization) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" /> Not Available
          </CardTitle>
          <CardDescription>
            Organization settings are not available for personal workspaces.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/workspace/${organization.slug}`}>Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Organization Settings</h1>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Building className="h-5 w-5" /> Organization Profile
              </CardTitle>
              <CardDescription>
                Manage settings for the {organization.name} organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input id="name" defaultValue={organization.name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Organization Slug</Label>
                  <Input id="slug" defaultValue={organization.slug} />
                  <p className="text-sm text-muted-foreground">
                    Used in URLs. Only lowercase letters, numbers, and hyphens.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Organization Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter a description of your organization"
                    defaultValue={(organization.id || "").toString()}
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Organization Logo</Label>
                  <div className="flex items-center gap-4">
                    {organization.imageUrl ? (
                      <img 
                        src={organization.imageUrl} 
                        alt={organization.name} 
                        className="h-16 w-16 rounded-md border object-cover" 
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-md border bg-muted">
                        <Building className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Button type="button" variant="outline">Upload Logo</Button>
                  </div>
                </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" type="submit">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
