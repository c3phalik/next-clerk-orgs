"use client"

import { useOrganization, useUser, useOrganizationList } from "@clerk/nextjs"
import { Building, Users, Calendar, Mail, LinkIcon, MapPin, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function OrganizationDetails() {
  const { organization, isLoaded, membership } = useOrganization()
  const { user } = useUser()

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-24 rounded-md" />
            <Skeleton className="h-24 rounded-md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!organization) {
    // Handle personal workspace
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5" /> Personal Workspace
          </CardTitle>
          <CardDescription>
            This is your personal workspace. You are logged in as {user?.primaryEmailAddress?.emailAddress || user?.username}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4 mb-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Personal Information
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Name:</span>
                <span>{user?.fullName || user?.username}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Email:</span>
                <span>{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">User ID:</span>
                <Badge variant="outline" className="text-xs">{user?.id}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="ml-auto">
            <LinkIcon className="mr-2 h-4 w-4" /> View Profile
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Organization workspace
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            {organization.imageUrl ? (
              <img src={organization.imageUrl} alt={organization.name} className="h-8 w-8 rounded-md" />
            ) : (
              <Building className="h-5 w-5" />
            )}
            {organization.name}
          </CardTitle>
          <Badge>
            {organization.membersCount} {organization.membersCount === 1 ? "Member" : "Members"}
          </Badge>
        </div>
        <CardDescription>
          Workspace for {organization.name} organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Building className="h-4 w-4" /> Organization Information
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Created:</span>
                <span>{new Date(organization.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">ID:</span>
                <Badge variant="outline" className="text-xs">{organization.id}</Badge>
              </div>
              {organization.slug && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Slug:</span>
                  <Badge variant="secondary" className="text-xs">{organization.slug}</Badge>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" /> Membership
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Your role:</span>
                <Badge>{membership?.roleName}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Joined:</span>
                <span>{membership?.createdAt.toDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="ml-auto">
          <LinkIcon className="mr-2 h-4 w-4" /> View Organization Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
